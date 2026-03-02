# AnimaWorks - Digital Anima Framework
# Copyright (C) 2026 AnimaWorks Authors
# SPDX-License-Identifier: Apache-2.0
#
# This file is part of AnimaWorks core/server, licensed under Apache-2.0.
# See LICENSE for the full license text.

"""GWS polling + Notion registration orchestrator.

S3-4 用の最小実装:
- GWS出力JSONを読み込む
- 未処理レコードを抽出する
- gws_transform.transform_gws_to_notion でNotion payload化する
- 登録呼び出し関数（callback）を通してNotion登録を実行する

※ 本モジュールは外部依存（Notion API呼び出し）を直接持たず、
   callback 注入で既存実装へ接続する設計。
"""

from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Callable

from core.tools.gws_transform import TransformConfig, transform_gws_to_notion


@dataclass
class PollState:
    """Persisted state for dedup across polling runs."""

    processed_source_ids: list[str] = field(default_factory=list)


@dataclass
class PollSummary:
    """Summary returned by one polling cycle."""

    source_total: int = 0
    selected: int = 0
    transformed: int = 0
    skipped_validation: int = 0
    transform_errors: int = 0
    created: int = 0
    create_errors: int = 0
    dry_run: bool = True


def _load_records(source_json: Path) -> list[dict[str, Any]]:
    """Load GWS records from JSON file.

    Accepted JSON shapes:
    - [ {...}, {...} ]
    - {"records": [ {...}, {...} ]}
    """
    data = json.loads(source_json.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return data
    if isinstance(data, dict) and isinstance(data.get("records"), list):
        return data["records"]
    raise ValueError("source_json must be an array or an object with 'records' array")


def _load_state(state_path: Path) -> PollState:
    if not state_path.exists():
        return PollState()
    raw = json.loads(state_path.read_text(encoding="utf-8"))
    ids = raw.get("processed_source_ids", []) if isinstance(raw, dict) else []
    ids = [str(x) for x in ids if x]
    return PollState(processed_source_ids=ids)


def _save_state(state_path: Path, state: PollState) -> None:
    state_path.parent.mkdir(parents=True, exist_ok=True)
    state_path.write_text(
        json.dumps(asdict(state), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def _select_unprocessed(
    records: list[dict[str, Any]],
    state: PollState,
    max_records: int,
) -> list[dict[str, Any]]:
    known = set(state.processed_source_ids)
    selected: list[dict[str, Any]] = []
    for row in records:
        sid = str(row.get("source_id", "")).strip()
        if not sid or sid in known:
            continue
        selected.append(row)
        if len(selected) >= max_records:
            break
    return selected


def register_records(
    notion_payloads: list[dict[str, Any]],
    register_fn: Callable[[dict[str, Any]], Any],
) -> tuple[int, int]:
    """Call Notion registration callback for each payload.

    Returns:
        (created_count, error_count)
    """
    created = 0
    errors = 0
    for payload in notion_payloads:
        try:
            register_fn(payload)
            created += 1
        except Exception:
            errors += 1
    return created, errors


def poll_and_register(
    source_json: Path,
    state_path: Path,
    max_records: int = 20,
    dry_run: bool = True,
    register_fn: Callable[[dict[str, Any]], Any] | None = None,
) -> PollSummary:
    """Execute one polling cycle.

    - source_json から新規レコードを抽出
    - transform 実行
    - dry_run=False かつ register_fn がある場合のみ登録呼び出し
    - 成功/スキップ済み source_id を state に保存
    """
    records = _load_records(source_json)
    state = _load_state(state_path)
    selected = _select_unprocessed(records, state, max_records=max_records)

    result = transform_gws_to_notion(selected, TransformConfig())

    summary = PollSummary(
        source_total=len(records),
        selected=len(selected),
        transformed=len(result.success),
        skipped_validation=len(result.skipped),
        transform_errors=len(result.errors),
        dry_run=dry_run,
    )

    if not dry_run:
        if register_fn is None:
            raise ValueError("register_fn is required when dry_run is false")
        created, create_errors = register_records(result.success, register_fn)
        summary.created = created
        summary.create_errors = create_errors

    # mark all transformed records as processed
    processed_now = [
        str(item.get("source_id", "")).strip()
        for item in selected
        if str(item.get("source_id", "")).strip()
    ]
    merged = list(dict.fromkeys(state.processed_source_ids + processed_now))
    _save_state(state_path, PollState(processed_source_ids=merged))

    return summary


def _cli_register_fn(_: dict[str, Any]) -> dict[str, str]:
    """CLI用デフォルト登録関数。

    実環境のNotion登録は呼び出し側で register_fn を注入する。
    CLI単体実行ではスタブ成功を返す。
    """
    return {"status": "ok"}


def get_tool_schemas() -> list[dict[str, Any]]:
    return [
        {
            "name": "gws_poll_and_register",
            "description": "Poll GWS output JSON, transform to Notion payloads, and optionally register them.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "source_json": {
                        "type": "string",
                        "description": "Path to GWS output JSON file (array or {records:[]}).",
                    },
                    "state_path": {
                        "type": "string",
                        "description": "Path to polling state JSON.",
                    },
                    "max_records": {
                        "type": "integer",
                        "default": 20,
                    },
                    "dry_run": {
                        "type": "boolean",
                        "default": True,
                    },
                },
                "required": ["source_json", "state_path"],
            },
        }
    ]


def dispatch(name: str, args: dict[str, Any]) -> Any:
    if name != "gws_poll_and_register":
        raise ValueError(f"Unknown tool: {name}")

    source_json = Path(args["source_json"])
    state_path = Path(args["state_path"])
    max_records = int(args.get("max_records", 20))
    dry_run = bool(args.get("dry_run", True))

    summary = poll_and_register(
        source_json=source_json,
        state_path=state_path,
        max_records=max_records,
        dry_run=dry_run,
        register_fn=None if dry_run else _cli_register_fn,
    )
    return asdict(summary)


def cli_main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(
        description="Poll GWS output JSON and (optionally) register to Notion.",
    )
    parser.add_argument("source_json", help="Path to GWS output JSON file")
    parser.add_argument("--state", required=True, help="Path to polling state JSON")
    parser.add_argument("--max-records", type=int, default=20)
    parser.add_argument("--dry-run", action="store_true", help="Transform only (default)")
    parser.add_argument("--apply", action="store_true", help="Execute registration callback")

    args = parser.parse_args(argv)

    dry_run = not args.apply
    summary = poll_and_register(
        source_json=Path(args.source_json),
        state_path=Path(args.state),
        max_records=args.max_records,
        dry_run=dry_run,
        register_fn=None if dry_run else _cli_register_fn,
    )
    print(json.dumps(asdict(summary), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    cli_main()
