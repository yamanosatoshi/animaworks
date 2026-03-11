from __future__ import annotations

# AnimaWorks - Digital Anima Framework
# Copyright (C) 2026 AnimaWorks Authors
# SPDX-License-Identifier: Apache-2.0

"""Self-AI diagnostic API routes.

Provides endpoints for the behavioral profile diagnostic:
- GET  /self-ai/questions          — diagnostic questions (versioned)
- POST /self-ai/diagnose           — submit answers, get axis scores + profile
- GET  /self-ai/profiles           — list saved profiles
- GET  /self-ai/profiles/{id}      — get a profile
- PUT  /self-ai/profiles/{id}      — manually edit profile parameters
- GET  /self-ai/profiles/{id}/history — axis score change history
"""

import json
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from server.self_ai.diagnostic import (
    AXES,
    QUESTION_SET_VERSION,
    compute_axis_scores,
    generate_behavioral_profile,
    get_questions,
)

logger = logging.getLogger("animaworks.routes.self_ai")


class DiagnoseRequest(BaseModel):
    answers: dict[str, int]  # question_id -> answer (1-5 Likert)
    user_id: str | None = None


class ProfileUpdateRequest(BaseModel):
    parameters: dict[str, Any]  # behavioral parameter overrides


def _profiles_dir(shared_dir: Path) -> Path:
    d = shared_dir / "self_ai_profiles"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _load_profile(path: Path) -> dict | None:
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def _save_profile(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def create_self_ai_router() -> APIRouter:
    router = APIRouter(prefix="/self-ai", tags=["self-ai"])

    @router.get("/questions")
    async def get_diagnostic_questions(request: Request):
        """Return the diagnostic question set."""
        questions = get_questions()
        return {
            "version": QUESTION_SET_VERSION,
            "axes": AXES,
            "questions": questions,
            "total": len(questions),
        }

    @router.post("/diagnose")
    async def diagnose(body: DiagnoseRequest, request: Request):
        """Submit answers and receive axis scores + behavioral profile."""
        questions = get_questions()
        expected_ids = {q["id"] for q in questions}

        # Validate all questions answered
        missing = expected_ids - set(body.answers.keys())
        if missing:
            return JSONResponse(
                {"error": f"Missing answers for questions: {sorted(missing)}"},
                status_code=400,
            )

        # Validate answer values (1-5)
        invalid = {
            qid: v
            for qid, v in body.answers.items()
            if qid in expected_ids and not (1 <= v <= 5)
        }
        if invalid:
            return JSONResponse(
                {"error": f"Answers must be 1-5. Invalid: {invalid}"},
                status_code=400,
            )

        axis_scores = compute_axis_scores(body.answers)
        profile = generate_behavioral_profile(axis_scores)

        # Save profile
        shared_dir: Path = request.app.state.shared_dir
        profiles_dir = _profiles_dir(shared_dir)
        profile_id = str(uuid.uuid4())[:8]
        now = datetime.now(timezone.utc).isoformat()

        profile_data = {
            "id": profile_id,
            "user_id": body.user_id,
            "question_set_version": QUESTION_SET_VERSION,
            "answers": body.answers,
            "axis_scores": axis_scores,
            "behavioral_profile": profile,
            "created_at": now,
            "updated_at": now,
            "history": [
                {
                    "timestamp": now,
                    "axis_scores": axis_scores,
                    "source": "diagnostic",
                }
            ],
        }
        _save_profile(profiles_dir / f"{profile_id}.json", profile_data)

        return {
            "profile_id": profile_id,
            "axis_scores": axis_scores,
            "behavioral_profile": profile,
            "question_set_version": QUESTION_SET_VERSION,
        }

    @router.get("/profiles")
    async def list_profiles(request: Request):
        """List all saved behavioral profiles."""
        shared_dir: Path = request.app.state.shared_dir
        profiles_dir = _profiles_dir(shared_dir)
        profiles = []
        for f in sorted(profiles_dir.glob("*.json")):
            data = _load_profile(f)
            if data:
                profiles.append(
                    {
                        "id": data["id"],
                        "user_id": data.get("user_id"),
                        "created_at": data["created_at"],
                        "updated_at": data["updated_at"],
                        "axis_scores": data["axis_scores"],
                    }
                )
        return {"profiles": profiles}

    @router.get("/profiles/{profile_id}")
    async def get_profile(profile_id: str, request: Request):
        """Get a specific behavioral profile."""
        shared_dir: Path = request.app.state.shared_dir
        path = _profiles_dir(shared_dir) / f"{profile_id}.json"
        data = _load_profile(path)
        if not data:
            return JSONResponse({"error": "Profile not found"}, status_code=404)
        return data

    @router.put("/profiles/{profile_id}")
    async def update_profile(
        profile_id: str, body: ProfileUpdateRequest, request: Request
    ):
        """Manually adjust behavioral profile parameters."""
        shared_dir: Path = request.app.state.shared_dir
        path = _profiles_dir(shared_dir) / f"{profile_id}.json"
        data = _load_profile(path)
        if not data:
            return JSONResponse({"error": "Profile not found"}, status_code=404)

        # Validate parameter keys
        valid_keys = set(data["behavioral_profile"].keys())
        invalid_keys = set(body.parameters.keys()) - valid_keys
        if invalid_keys:
            return JSONResponse(
                {
                    "error": f"Invalid parameters: {sorted(invalid_keys)}. Valid: {sorted(valid_keys)}"
                },
                status_code=400,
            )

        now = datetime.now(timezone.utc).isoformat()

        # Recompute axis scores from new parameters
        old_profile = data["behavioral_profile"].copy()
        data["behavioral_profile"].update(body.parameters)
        data["updated_at"] = now
        data["history"].append(
            {
                "timestamp": now,
                "axis_scores": data["axis_scores"],
                "source": "manual_edit",
                "changes": {
                    k: {"from": old_profile[k], "to": v}
                    for k, v in body.parameters.items()
                    if old_profile.get(k) != v
                },
            }
        )

        _save_profile(path, data)
        return data

    @router.get("/profiles/{profile_id}/history")
    async def get_profile_history(profile_id: str, request: Request):
        """Get axis score change history for a profile."""
        shared_dir: Path = request.app.state.shared_dir
        path = _profiles_dir(shared_dir) / f"{profile_id}.json"
        data = _load_profile(path)
        if not data:
            return JSONResponse({"error": "Profile not found"}, status_code=404)
        return {"profile_id": profile_id, "history": data.get("history", [])}

    return router
