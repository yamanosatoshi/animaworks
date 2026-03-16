from __future__ import annotations

# AnimaWorks - Digital Anima Framework
# Copyright (C) 2026 AnimaWorks Authors
# SPDX-License-Identifier: Apache-2.0

"""AI Brainstorm API — multi-character perspective brainstorming with LLM."""

import asyncio
import json
import logging
import re
from collections.abc import AsyncGenerator
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field

from core.i18n import t

logger = logging.getLogger("animaworks.routes.brainstorm")

# ── Character color palette (assigned by name hash for consistency) ────────

_CHAR_COLORS = [
    "#f97316",  # orange
    "#3b82f6",  # blue
    "#22c55e",  # green
    "#ec4899",  # pink
    "#a855f7",  # purple
    "#eab308",  # yellow
    "#06b6d4",  # cyan
    "#ef4444",  # red
]

_ROLE_ICONS: dict[str, str] = {
    "engineer": "code-2",
    "manager": "map",
    "researcher": "search",
    "writer": "pen-line",
    "general": "message-circle",
}

_ROLE_INSTRUCTIONS: dict[str, str] = {
    "engineer": "技術的な実現可能性・工数・アーキテクチャリスクを具体的に示す",
    "manager": "戦略的な視点・ロードマップ・優先順位の構造化を担う",
    "researcher": "データ・根拠・市場調査の観点から分析する",
    "writer": "ユーザー体験・コンテンツ・メッセージングの観点から提案する",
    "general": "全体的な視点から幅広く意見を出す",
}


# ── Dynamic character loading ─────────────────────────────────


def _char_color(name: str) -> str:
    idx = sum(ord(c) for c in name) % len(_CHAR_COLORS)
    return _CHAR_COLORS[idx]


def _extract_one_liner(identity_text: str, role: str) -> str:
    """Extract a short description from identity.md."""
    m = re.search(r"\*\*一言で\*\*[：:]\s*「([^」]+)」", identity_text)
    if m:
        return m.group(1)
    for line in identity_text.splitlines():
        line = line.strip()
        if line and not line.startswith("#") and not line.startswith("-") and not line.startswith("*"):
            return line[:60] + ("..." if len(line) > 60 else "")
    role_descs = {
        "engineer": "エンジニア",
        "manager": "マネージャー",
        "researcher": "リサーチャー",
        "writer": "ライター",
        "general": "ゼネラリスト",
    }
    return role_descs.get(role, "メンバー")


def _build_persona_system_prompt(name: str, identity_text: str, role: str) -> str:
    """Build a brainstorm system prompt from identity.md content."""
    role_instr = _ROLE_INSTRUCTIONS.get(role, "あなたの専門性を活かして意見を述べる")
    return (
        f"あなたは{name}です。以下のキャラクタープロフィールに従って行動してください。\n\n"
        f"{identity_text}\n\n"
        "---\n"
        "【ブレスト会議でのあなたの役割】\n"
        f"{role_instr}\n\n"
        "上記のキャラクターとして、自分らしい口調・視点で意見を述べてください。\n"
        "出力はMarkdown形式で、見出し・箇条書きを使って構造化してください。\n\n"
        "【禁止事項】\n"
        "- 「現実派」「挑戦派」「楽観派」など派閥名・立場ラベルを自称しないこと\n"
        "- 自分を派閥にカテゴライズしないこと\n"
        f"- 必ず{name}として話すこと"
    )


def _load_active_characters(animas_dir: Path) -> list[dict[str, Any]]:
    """Load enabled animas as brainstorm characters from the filesystem."""
    if not animas_dir or not animas_dir.exists():
        return []

    characters: list[dict[str, Any]] = []

    for anima_dir in sorted(animas_dir.iterdir()):
        if not anima_dir.is_dir():
            continue
        name = anima_dir.name

        # Check enabled
        status_path = anima_dir / "status.json"
        if not status_path.exists():
            continue
        try:
            status_data = json.loads(status_path.read_text(encoding="utf-8"))
        except Exception:
            continue
        if not status_data.get("enabled", False):
            continue

        # Read identity
        identity_path = anima_dir / "identity.md"
        if not identity_path.exists():
            continue
        try:
            identity_text = identity_path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        if not identity_text.strip():
            continue

        role = status_data.get("role", "general")

        avatar_url = None
        if (anima_dir / "assets" / "avatar_bustup.png").exists():
            avatar_url = f"/api/animas/{name}/assets/avatar_bustup.png"

        characters.append(
            {
                "id": name,
                "name": name.capitalize(),
                "description": _extract_one_liner(identity_text, role),
                "icon": _ROLE_ICONS.get(role, "message-circle"),
                "color": _char_color(name),
                "avatar_url": avatar_url,
                "system_prompt": _build_persona_system_prompt(name, identity_text, role),
                "supervisor": status_data.get("supervisor"),
            }
        )

    return characters


# ── Request / Response models ─────────────────────────────────


class BrainstormRequest(BaseModel):
    theme: str = Field(..., min_length=1, max_length=2000)
    constraints: str = Field(default="", max_length=2000)
    expected_output: str = Field(default="", max_length=2000)
    character_ids: list[str] = Field(default_factory=list)
    model: str = ""


# ── Helpers ───────────────────────────────────────────────────


def _resolve_model() -> str:
    try:
        from core.config import load_config

        return load_config().consolidation.llm_model
    except Exception:
        return ""


def _agent_sdk_available() -> bool:
    """Return True if claude_agent_sdk or claude_code_sdk is installed."""
    try:
        import claude_agent_sdk  # noqa: F401

        return True
    except ImportError:
        pass
    try:
        import claude_code_sdk  # noqa: F401

        return True
    except ImportError:
        return False


def _available_models() -> list[dict[str, str]]:
    try:
        from core.config import load_config

        cfg = load_config()
    except Exception:
        return []

    models: list[dict[str, str]] = []
    seen: set[str] = set()
    has_api_key = False

    default = cfg.consolidation.llm_model

    for provider, cred in cfg.credentials.items():
        if not cred.api_key:
            continue
        has_api_key = True
        if provider == "anthropic":
            for m in ("anthropic/claude-sonnet-4-6", "anthropic/claude-haiku-4-5"):
                if m not in seen:
                    models.append({"id": m, "label": m.split("/")[-1]})
                    seen.add(m)
        elif provider == "openai":
            for m in ("openai/gpt-4.1-mini", "openai/gpt-4.1-nano"):
                if m not in seen:
                    models.append({"id": m, "label": m.split("/")[-1]})
                    seen.add(m)
        elif provider in ("google", "gemini"):
            for m in ("gemini/gemini-2.5-flash",):
                if m not in seen:
                    models.append({"id": m, "label": m.split("/")[-1]})
                    seen.add(m)

    # No API key but Agent SDK is available → show Anthropic models via subscription
    if not has_api_key and _agent_sdk_available():
        from core.memory._llm_utils import _is_anthropic_model

        sdk_candidates = [default] if default else []
        for m in ("anthropic/claude-sonnet-4-6", "anthropic/claude-haiku-4-5"):
            if m not in sdk_candidates:
                sdk_candidates.append(m)
        for m in sdk_candidates:
            if m and _is_anthropic_model(m) and m not in seen:
                label = m.split("/")[-1] if "/" in m else m
                models.append({"id": m, "label": label})
                seen.add(m)

    # Always surface the config default if not yet listed
    if default and default not in seen:
        label = default.split("/")[-1] if "/" in default else default
        models.append({"id": default, "label": label})
        seen.add(default)

    return models


async def _stream_litellm_completion(
    messages: list[dict[str, str]],
    model: str,
    llm_kwargs: dict[str, Any],
    max_tokens: int = 1024,
) -> AsyncGenerator[str, None]:
    """Stream via LiteLLM; fall back to Agent SDK on auth errors (Max-plan compatible)."""
    import litellm

    kw = {k: v for k, v in llm_kwargs.items() if k != "model"}
    try:
        resp = await litellm.acompletion(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            stream=True,
            **kw,
        )
        async for chunk in resp:
            text = chunk.choices[0].delta.content or ""
            if text:
                yield text
        return
    except litellm.AuthenticationError:
        logger.info("LiteLLM auth failed, falling back to Agent SDK (subscription mode)")

    # Agent SDK fallback — works with Claude Max subscription (no API key needed)
    from core.memory._llm_utils import _is_anthropic_model, _try_agent_sdk

    if not _is_anthropic_model(model):
        raise RuntimeError(f"No API key configured and Agent SDK only supports Anthropic models (got: {model})")

    system_prompt = next((m["content"] for m in messages if m["role"] == "system"), "")
    user_prompt = next((m["content"] for m in messages if m["role"] == "user"), "")
    result = await _try_agent_sdk(
        user_prompt,
        system_prompt=system_prompt,
        model=model,
        max_tokens=max_tokens,
    )
    if result:
        yield result


async def _generate_character_proposal(
    char_id: str,
    char_name: str,
    system_prompt: str,
    theme: str,
    constraints: str,
    expected_output: str,
    model: str,
) -> dict[str, Any]:
    """Generate a single character's brainstorm proposal."""
    try:
        from core.memory._llm_utils import one_shot_completion
    except ImportError:
        return {"character_id": char_id, "error": "LLM not available", "proposal": None}

    user_prompt = t(
        "brainstorm.user_prompt",
        theme=theme,
        constraints=constraints or t("brainstorm.no_constraints"),
        expected_output=expected_output or t("brainstorm.no_expected_output"),
    )

    try:
        result = await one_shot_completion(
            user_prompt,
            system_prompt=system_prompt,
            model=model,
            max_tokens=2048,
        )
        return {"character_id": char_id, "character_name": char_name, "proposal": result, "error": None}
    except Exception as e:
        logger.warning("Brainstorm generation failed for %s: %s", char_id, e)
        return {"character_id": char_id, "character_name": char_name, "proposal": None, "error": str(e)}


async def _synthesize_proposals(
    theme: str,
    proposals: list[dict[str, Any]],
    synth_system_prompt: str,
    model: str,
) -> str | None:
    """Synthesize all character proposals into a formatted brainstorm result."""
    try:
        from core.memory._llm_utils import one_shot_completion
    except ImportError:
        return None

    char_sections = [
        f"### {p['character_name']}\n{p['proposal']}"
        for p in proposals
        if p["proposal"]
    ]
    if not char_sections:
        return None

    user_prompt = t(
        "brainstorm.synthesizer_user_prompt",
        theme=theme,
        proposals="\n\n".join(char_sections),
    )

    try:
        return await one_shot_completion(
            user_prompt,
            system_prompt=synth_system_prompt,
            model=model,
            max_tokens=3000,
        )
    except Exception as e:
        logger.warning("Brainstorm synthesis failed: %s", e)
        return None


def _get_synth_character(chars: list[dict[str, Any]]) -> dict[str, Any]:
    """Return the synthesis character — prefer top-level (no supervisor), fall back to first."""
    for c in chars:
        if not c.get("supervisor"):
            return c
    return chars[0] if chars else {"id": "synth", "name": "まとめ", "color": "#6b7280"}


def _build_synth_system_prompt(leader: dict[str, Any]) -> str:
    """Build synthesizer prompt in the leader's voice."""
    name = leader.get("name", "リーダー")
    return t("brainstorm.synthesizer_prompt").format(name=name)


# ── Router ────────────────────────────────────────────────────


def create_brainstorm_router() -> APIRouter:
    router = APIRouter(prefix="/brainstorm", tags=["brainstorm"])

    @router.get("/characters")
    async def get_characters(request: Request) -> JSONResponse:
        animas_dir: Path | None = getattr(request.app.state, "animas_dir", None)
        chars = _load_active_characters(animas_dir) if animas_dir else []
        return JSONResponse(
            {
                "characters": [
                    {
                        "id": c["id"],
                        "name": c["name"],
                        "description": c["description"],
                        "icon": c["icon"],
                        "color": c["color"],
                        "avatar_url": c.get("avatar_url"),
                    }
                    for c in chars
                ]
            }
        )

    @router.get("/models")
    async def get_models() -> JSONResponse:
        return JSONResponse(
            {
                "default_model": _resolve_model(),
                "available_models": _available_models(),
            }
        )

    @router.post("/generate")
    async def generate_brainstorm(req: BrainstormRequest, request: Request) -> JSONResponse:
        animas_dir: Path | None = getattr(request.app.state, "animas_dir", None)
        chars = _load_active_characters(animas_dir) if animas_dir else []
        char_map = {c["id"]: c for c in chars}

        selected_ids = req.character_ids if req.character_ids else [c["id"] for c in chars]
        selected = [char_map[cid] for cid in selected_ids if cid in char_map]
        if not selected:
            return JSONResponse({"error": t("brainstorm.no_characters_selected")}, status_code=400)

        model = req.model or _resolve_model()
        if not model:
            return JSONResponse({"error": t("brainstorm.no_model_configured")}, status_code=400)

        if req.model:
            allowed = {m["id"] for m in _available_models()}
            if req.model not in allowed:
                return JSONResponse({"error": t("brainstorm.invalid_model")}, status_code=400)

        tasks = [
            _generate_character_proposal(
                c["id"], c["name"], c["system_prompt"],
                req.theme, req.constraints, req.expected_output, model,
            )
            for c in selected
        ]
        proposals = list(await asyncio.gather(*tasks))

        leader = _get_synth_character(chars)
        synth_prompt = _build_synth_system_prompt(leader)
        synthesis = await _synthesize_proposals(req.theme, proposals, synth_prompt, model)

        return JSONResponse(
            {
                "theme": req.theme,
                "model": model,
                "proposals": proposals,
                "synthesis": synthesis,
            }
        )

    @router.post("/stream")
    async def stream_brainstorm(req: BrainstormRequest, request: Request) -> StreamingResponse:
        """SSE endpoint: sequential character discussion with context carry-over."""
        animas_dir: Path | None = getattr(request.app.state, "animas_dir", None)
        chars = _load_active_characters(animas_dir) if animas_dir else []
        char_map = {c["id"]: c for c in chars}

        selected_ids = req.character_ids if req.character_ids else [c["id"] for c in chars]
        selected = [char_map[cid] for cid in selected_ids if cid in char_map]
        if not selected:
            return JSONResponse({"error": t("brainstorm.no_characters_selected")}, status_code=400)

        model = req.model or _resolve_model()
        if not model:
            return JSONResponse({"error": t("brainstorm.no_model_configured")}, status_code=400)

        if req.model:
            allowed = {m["id"] for m in _available_models()}
            if req.model not in allowed:
                return JSONResponse({"error": t("brainstorm.invalid_model")}, status_code=400)

        leader = _get_synth_character(chars)
        synth_system_prompt = _build_synth_system_prompt(leader)

        from core.memory._llm_utils import get_consolidation_llm_kwargs

        llm_kwargs = get_consolidation_llm_kwargs()
        if req.model:
            llm_kwargs["model"] = req.model

        async def generate() -> AsyncGenerator[bytes, None]:
            def _sse(data: dict[str, Any]) -> bytes:
                return f"data: {json.dumps(data, ensure_ascii=False)}\n\n".encode()

            previous_discussion: list[dict[str, str]] = []

            for char in selected:
                char_id = char["id"]
                char_name = char["name"]

                yield _sse({"type": "char_start", "character_id": char_id, "character_name": char_name})

                # Build messages — first speaker gets clean prompt, rest get discussion context
                if previous_discussion:
                    discussion_text = "\n\n".join(
                        f"**{d['name']}**: {d['text']}" for d in previous_discussion
                    )
                    user_prompt = t(
                        "brainstorm.user_prompt_with_discussion",
                        theme=req.theme,
                        constraints=req.constraints or t("brainstorm.no_constraints"),
                        expected_output=req.expected_output or t("brainstorm.no_expected_output"),
                        discussion=discussion_text,
                    )
                else:
                    user_prompt = t(
                        "brainstorm.user_prompt",
                        theme=req.theme,
                        constraints=req.constraints or t("brainstorm.no_constraints"),
                        expected_output=req.expected_output or t("brainstorm.no_expected_output"),
                    )

                messages = [
                    {"role": "system", "content": char["system_prompt"]},
                    {"role": "user", "content": user_prompt},
                ]

                full_text: list[str] = []
                try:
                    async for chunk in _stream_litellm_completion(messages, model, llm_kwargs, max_tokens=1024):
                        full_text.append(chunk)
                        yield _sse({"type": "char_chunk", "character_id": char_id, "text": chunk})

                    accumulated = "".join(full_text)
                    previous_discussion.append({"name": char_name, "text": accumulated})
                    yield _sse({"type": "char_done", "character_id": char_id})

                except Exception as e:
                    logger.warning("Brainstorm stream failed for %s: %s", char_id, e)
                    yield _sse({"type": "char_error", "character_id": char_id, "error": str(e)})

            # Synthesis — leader wraps up (naomi by default, or first active member)
            if previous_discussion:
                yield _sse(
                    {
                        "type": "synth_start",
                        "character_id": leader["id"],
                        "character_name": leader["name"],
                    }
                )
                char_sections = [f"### {d['name']}\n{d['text']}" for d in previous_discussion]
                synth_messages = [
                    {"role": "system", "content": synth_system_prompt},
                    {
                        "role": "user",
                        "content": t(
                            "brainstorm.synthesizer_user_prompt",
                            theme=req.theme,
                            proposals="\n\n".join(char_sections),
                        ),
                    },
                ]
                try:
                    async for chunk in _stream_litellm_completion(synth_messages, model, llm_kwargs, max_tokens=3000):
                        yield _sse({"type": "synth_chunk", "text": chunk})
                    yield _sse({"type": "synth_done"})
                except Exception as e:
                    logger.warning("Brainstorm synthesis stream failed: %s", e)
                    yield _sse({"type": "synth_error", "error": str(e)})

            yield _sse({"type": "done"})

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
        )

    return router
