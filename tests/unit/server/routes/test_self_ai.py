"""Unit tests for server/routes/self_ai.py — Self-AI diagnostic API."""
# AnimaWorks - Digital Anima Framework
# Copyright (C) 2026 AnimaWorks Authors
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import MagicMock

import pytest
from httpx import ASGITransport, AsyncClient


def _make_test_app(shared_dir: Path):
    from fastapi import FastAPI
    from server.routes.self_ai import create_self_ai_router

    app = FastAPI()
    app.state.shared_dir = shared_dir
    app.state.ws_manager = MagicMock()
    router = create_self_ai_router()
    app.include_router(router, prefix="/api")
    return app


def _all_answer_3(questions: list[dict]) -> dict[str, int]:
    """Return all-neutral (3) answers for a given question list."""
    return {q["id"]: 3 for q in questions}


def _all_answer_5(questions: list[dict]) -> dict[str, int]:
    """Return all strongly-agree (5) answers."""
    return {q["id"]: 5 for q in questions}


def _all_answer_1(questions: list[dict]) -> dict[str, int]:
    """Return all strongly-disagree (1) answers."""
    return {q["id"]: 1 for q in questions}


@pytest.mark.anyio
async def test_get_questions(tmp_path):
    app = _make_test_app(tmp_path)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        resp = await client.get("/api/self-ai/questions")
        assert resp.status_code == 200
        data = resp.json()
        assert "questions" in data
        assert "version" in data
        assert "axes" in data
        assert data["total"] == len(data["questions"])
        assert data["total"] == 50  # 8+8+8+9+9+8
        # Each question has required fields
        q = data["questions"][0]
        assert "id" in q
        assert "axis" in q
        assert "text_ja" in q
        assert "text_en" in q


@pytest.mark.anyio
async def test_diagnose_all_neutral(tmp_path):
    app = _make_test_app(tmp_path)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        # Get questions
        resp = await client.get("/api/self-ai/questions")
        questions = resp.json()["questions"]

        # Submit all-neutral answers
        answers = _all_answer_3(questions)
        resp = await client.post(
            "/api/self-ai/diagnose",
            json={"answers": answers},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "profile_id" in data
        assert "axis_scores" in data
        assert "behavioral_profile" in data
        # All neutral answers should give ~50 scores
        for axis, score in data["axis_scores"].items():
            assert 45 <= score <= 55, f"{axis} score {score} not near 50"


@pytest.mark.anyio
async def test_diagnose_all_agree(tmp_path):
    app = _make_test_app(tmp_path)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        resp = await client.get("/api/self-ai/questions")
        questions = resp.json()["questions"]

        answers = _all_answer_5(questions)
        resp = await client.post(
            "/api/self-ai/diagnose",
            json={"answers": answers},
        )
        assert resp.status_code == 200
        data = resp.json()
        # All-5 on non-reversed = high, on reversed = low → mixed
        # But axis scores should be valid 0-100
        for score in data["axis_scores"].values():
            assert 0 <= score <= 100


@pytest.mark.anyio
async def test_diagnose_reproducibility(tmp_path):
    """Same answers should always produce same axis scores (reproducibility)."""
    app = _make_test_app(tmp_path)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        resp = await client.get("/api/self-ai/questions")
        questions = resp.json()["questions"]
        answers = _all_answer_3(questions)

        resp1 = await client.post(
            "/api/self-ai/diagnose", json={"answers": answers}
        )
        resp2 = await client.post(
            "/api/self-ai/diagnose", json={"answers": answers}
        )
        assert resp1.json()["axis_scores"] == resp2.json()["axis_scores"]
        assert (
            resp1.json()["behavioral_profile"]
            == resp2.json()["behavioral_profile"]
        )


@pytest.mark.anyio
async def test_diagnose_missing_answers(tmp_path):
    app = _make_test_app(tmp_path)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        resp = await client.post(
            "/api/self-ai/diagnose",
            json={"answers": {"ds01": 3}},
        )
        assert resp.status_code == 400
        assert "Missing" in resp.json()["error"]


@pytest.mark.anyio
async def test_diagnose_invalid_answer_value(tmp_path):
    app = _make_test_app(tmp_path)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        resp = await client.get("/api/self-ai/questions")
        questions = resp.json()["questions"]
        answers = _all_answer_3(questions)
        answers["ds01"] = 6  # Invalid

        resp = await client.post(
            "/api/self-ai/diagnose", json={"answers": answers}
        )
        assert resp.status_code == 400
        assert "1-5" in resp.json()["error"]


@pytest.mark.anyio
async def test_list_profiles_empty(tmp_path):
    app = _make_test_app(tmp_path)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        resp = await client.get("/api/self-ai/profiles")
        assert resp.status_code == 200
        assert resp.json()["profiles"] == []


@pytest.mark.anyio
async def test_get_profile_after_diagnose(tmp_path):
    app = _make_test_app(tmp_path)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        # Create a profile
        resp = await client.get("/api/self-ai/questions")
        questions = resp.json()["questions"]
        answers = _all_answer_3(questions)
        resp = await client.post(
            "/api/self-ai/diagnose", json={"answers": answers}
        )
        profile_id = resp.json()["profile_id"]

        # Get profile
        resp = await client.get(f"/api/self-ai/profiles/{profile_id}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == profile_id
        assert "answers" in data
        assert "history" in data

        # List profiles
        resp = await client.get("/api/self-ai/profiles")
        assert len(resp.json()["profiles"]) == 1


@pytest.mark.anyio
async def test_get_profile_not_found(tmp_path):
    app = _make_test_app(tmp_path)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        resp = await client.get("/api/self-ai/profiles/nonexistent")
        assert resp.status_code == 404


@pytest.mark.anyio
async def test_update_profile(tmp_path):
    app = _make_test_app(tmp_path)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        # Create profile
        resp = await client.get("/api/self-ai/questions")
        questions = resp.json()["questions"]
        answers = _all_answer_3(questions)
        resp = await client.post(
            "/api/self-ai/diagnose", json={"answers": answers}
        )
        profile_id = resp.json()["profile_id"]
        original_tone = resp.json()["behavioral_profile"]["tone"]

        # Update
        new_tone = "casual" if original_tone == "formal" else "formal"
        resp = await client.put(
            f"/api/self-ai/profiles/{profile_id}",
            json={"parameters": {"tone": new_tone}},
        )
        assert resp.status_code == 200
        assert resp.json()["behavioral_profile"]["tone"] == new_tone

        # History should have 2 entries
        resp = await client.get(f"/api/self-ai/profiles/{profile_id}/history")
        assert resp.status_code == 200
        assert len(resp.json()["history"]) == 2
        assert resp.json()["history"][1]["source"] == "manual_edit"


@pytest.mark.anyio
async def test_update_profile_invalid_key(tmp_path):
    app = _make_test_app(tmp_path)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        # Create profile
        resp = await client.get("/api/self-ai/questions")
        questions = resp.json()["questions"]
        resp = await client.post(
            "/api/self-ai/diagnose",
            json={"answers": _all_answer_3(questions)},
        )
        profile_id = resp.json()["profile_id"]

        # Update with invalid key
        resp = await client.put(
            f"/api/self-ai/profiles/{profile_id}",
            json={"parameters": {"nonexistent_param": "value"}},
        )
        assert resp.status_code == 400
        assert "Invalid" in resp.json()["error"]


@pytest.mark.anyio
async def test_diagnose_min_roles_tasks_equivalent(tmp_path):
    """Verify the acceptance criterion:
    same answer set + same version → same profile (reproducibility)."""
    from server.self_ai.diagnostic import compute_axis_scores, generate_behavioral_profile, get_questions

    questions = get_questions()
    answers = _all_answer_3(questions)
    scores1 = compute_axis_scores(answers)
    scores2 = compute_axis_scores(answers)
    assert scores1 == scores2

    profile1 = generate_behavioral_profile(scores1)
    profile2 = generate_behavioral_profile(scores2)
    assert profile1 == profile2
