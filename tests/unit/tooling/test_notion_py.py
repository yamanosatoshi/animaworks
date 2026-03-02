"""Tests for core.tools.notion — Notion API client and tool interface."""
# AnimaWorks - Digital Anima Framework
# Copyright (C) 2026 AnimaWorks Authors
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import json
from unittest.mock import MagicMock, patch

import pytest

from core.tools._retry import retry_on_rate_limit as _real_retry_on_rate_limit
from core.tools.notion import (
    FB_DB_SCHEMA,
    MAX_PAYLOAD_BYTES,
    NotionClient,
    RateLimitError,
    ServerError,
    build_page_url,
    dispatch,
    find_task_page_id,
    get_tool_schemas,
)


def _nosleep_retry_on_rate_limit(fn, *args, **kwargs):
    """Wrapper that replaces sleep_fn with a no-op for fast tests."""
    kwargs["sleep_fn"] = lambda _: None
    return _real_retry_on_rate_limit(fn, *args, **kwargs)


def _tracked_sleep_retry(sleep_tracker):
    """Return a retry wrapper that records sleep durations."""
    def _wrapper(fn, *args, **kwargs):
        kwargs["sleep_fn"] = lambda d: sleep_tracker.append(d)
        return _real_retry_on_rate_limit(fn, *args, **kwargs)
    return _wrapper


# ── build_page_url ────────────────────────────────────────────


class TestBuildPageUrl:
    def test_strips_hyphens(self):
        assert build_page_url("309fbbca-1204-8030-bdf8-daff8c7b5a5b") == (
            "https://www.notion.so/309fbbca12048030bdf8daff8c7b5a5b"
        )

    def test_no_hyphens_passthrough(self):
        assert build_page_url("abc123") == "https://www.notion.so/abc123"

    def test_empty_string(self):
        assert build_page_url("") == "https://www.notion.so/"


# ── NotionClient.create_database ──────────────────────────────


class TestCreateDatabase:
    def test_sends_correct_payload(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={"id": "new-db-id"})

        # Call the real method with mocked _request
        result = NotionClient.create_database(
            client,
            parent_page_id="page-123",
            title="FB一覧",
            properties=FB_DB_SCHEMA,
        )

        client._request.assert_called_once_with(
            "POST",
            "/databases",
            {
                "parent": {"type": "page_id", "page_id": "page-123"},
                "title": [{"type": "text", "text": {"content": "FB一覧"}}],
                "properties": FB_DB_SCHEMA,
            },
        )
        assert result == {"id": "new-db-id"}


# ── NotionClient.find_child_database ──────────────────────────


class TestFindChildDatabase:
    def test_returns_matching_block(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={
            "results": [
                {
                    "type": "paragraph",
                    "paragraph": {},
                },
                {
                    "type": "child_database",
                    "id": "db-456",
                    "child_database": {"title": "FB一覧"},
                },
            ],
        })

        result = NotionClient.find_child_database(client, "page-123", "FB一覧")

        client._request.assert_called_once_with(
            "GET", "/blocks/page-123/children",
        )
        assert result is not None
        assert result["id"] == "db-456"

    def test_returns_none_when_not_found(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={
            "results": [
                {"type": "paragraph", "paragraph": {}},
            ],
        })

        result = NotionClient.find_child_database(client, "page-123", "FB一覧")
        assert result is None

    def test_returns_none_on_empty_results(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={"results": []})

        result = NotionClient.find_child_database(client, "page-123", "FB一覧")
        assert result is None

    def test_does_not_match_different_title(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={
            "results": [
                {
                    "type": "child_database",
                    "id": "db-789",
                    "child_database": {"title": "別のDB"},
                },
            ],
        })

        result = NotionClient.find_child_database(client, "page-123", "FB一覧")
        assert result is None


# ── find_task_page_id ─────────────────────────────────────────


class TestFindTaskPageId:
    @patch("core.tools.notion._resolve_database_id", return_value="default-db")
    def test_returns_page_id_when_found(self, _mock_resolve):
        client = MagicMock(spec=NotionClient)
        client.query_database = MagicMock(return_value={
            "results": [{"id": "page-abc"}],
        })

        result = find_task_page_id(client, "TASK-3296")

        client.query_database.assert_called_once_with(
            database_id="default-db",
            filter={"property": "Name", "title": {"contains": "TASK-3296"}},
            page_size=1,
        )
        assert result == "page-abc"

    @patch("core.tools.notion._resolve_database_id", return_value="default-db")
    def test_returns_none_when_not_found(self, _mock_resolve):
        client = MagicMock(spec=NotionClient)
        client.query_database = MagicMock(return_value={"results": []})

        result = find_task_page_id(client, "TASK-9999")
        assert result is None


# ── dispatch: notion_create_fb_db ─────────────────────────────


class TestDispatchCreateFbDb:
    @patch("core.tools.notion.NotionClient")
    @patch("core.tools.notion._resolve_database_id", return_value="default-db")
    def test_creates_new_fb_db(self, _mock_resolve, mock_client_cls):
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client

        # find_task_page_id → page found
        mock_client.query_database.return_value = {
            "results": [{"id": "page-100"}],
        }
        # find_child_database → not found
        mock_client.find_child_database.return_value = None
        # create_database → success
        mock_client.create_database.return_value = {"id": "new-fb-db-id"}

        result = dispatch("notion_create_fb_db", {"task_number": "TASK-3296"})

        assert result["status"] == "created"
        assert result["database_id"] == "new-fb-db-id"
        assert "notion.so" in result["url"]
        mock_client.create_database.assert_called_once_with(
            "page-100", "FB一覧", FB_DB_SCHEMA,
        )

    @patch("core.tools.notion.NotionClient")
    @patch("core.tools.notion._resolve_database_id", return_value="default-db")
    def test_skips_if_already_exists(self, _mock_resolve, mock_client_cls):
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client

        mock_client.query_database.return_value = {
            "results": [{"id": "page-100"}],
        }
        mock_client.find_child_database.return_value = {
            "id": "existing-db-id",
            "type": "child_database",
        }

        result = dispatch("notion_create_fb_db", {"task_number": "TASK-3296"})

        assert result["status"] == "already_exists"
        assert result["database_id"] == "existing-db-id"
        mock_client.create_database.assert_not_called()

    @patch("core.tools.notion.NotionClient")
    @patch("core.tools.notion._resolve_database_id", return_value="default-db")
    def test_raises_if_task_not_found(self, _mock_resolve, mock_client_cls):
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client

        mock_client.query_database.return_value = {"results": []}

        with pytest.raises(ValueError, match="Task page not found"):
            dispatch("notion_create_fb_db", {"task_number": "TASK-9999"})


# ── dispatch: notion_add_fb ────────────────────────────────────


class TestDispatchAddFb:
    @patch("core.tools.notion.NotionClient")
    @patch("core.tools.notion._resolve_database_id", return_value="default-db")
    def test_adds_fb_record(self, _mock_resolve, mock_client_cls):
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client
        mock_client.create_page.return_value = {"id": "fb-page-id"}

        result = dispatch("notion_add_fb", {
            "db_id": "fb-db-123",
            "fb_id": "FB-001",
            "問題の概要": "ボタンが反応しない",
            "再現方法": "ログイン後にボタンをクリック",
            "期待する動作": "次の画面に遷移する",
            "タグ": ["UI", "バグ"],
            "ステータス": "対応中",
        })

        assert result["page_id"] == "fb-page-id"
        assert "notion.so" in result["url"]

        call_args = mock_client.create_page.call_args
        props = call_args[0][1]
        assert props["FBのID"]["title"][0]["text"]["content"] == "FB-001"
        assert props["問題の概要"]["rich_text"][0]["text"]["content"] == "ボタンが反応しない"
        assert props["ステータス"]["select"]["name"] == "対応中"
        assert len(props["タグ"]["multi_select"]) == 2

    @patch("core.tools.notion.NotionClient")
    @patch("core.tools.notion._resolve_database_id", return_value="default-db")
    def test_defaults_status_to_未対応(self, _mock_resolve, mock_client_cls):
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client
        mock_client.create_page.return_value = {"id": "fb-page-id"}

        dispatch("notion_add_fb", {
            "db_id": "fb-db-123",
            "fb_id": "FB-002",
        })

        call_args = mock_client.create_page.call_args
        props = call_args[0][1]
        assert props["ステータス"]["select"]["name"] == "未対応"

    @patch("core.tools.notion.NotionClient")
    @patch("core.tools.notion._resolve_database_id", return_value="default-db")
    def test_minimal_fields(self, _mock_resolve, mock_client_cls):
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client
        mock_client.create_page.return_value = {"id": "fb-page-id"}

        dispatch("notion_add_fb", {
            "db_id": "fb-db-123",
            "fb_id": "FB-003",
        })

        call_args = mock_client.create_page.call_args
        props = call_args[0][1]
        # Only title and status should be set
        assert "FBのID" in props
        assert "ステータス" in props
        assert "問題の概要" not in props
        assert "タグ" not in props


# ── get_tool_schemas ──────────────────────────────────────────


class TestGetToolSchemas:
    def test_includes_notion_create_fb_db(self):
        schemas = get_tool_schemas()
        names = [s["name"] for s in schemas]
        assert "notion_create_fb_db" in names

    def test_fb_db_schema_requires_task_number(self):
        schemas = get_tool_schemas()
        fb_schema = next(s for s in schemas if s["name"] == "notion_create_fb_db")
        assert "task_number" in fb_schema["input_schema"]["required"]

    def test_includes_notion_add_fb(self):
        schemas = get_tool_schemas()
        names = [s["name"] for s in schemas]
        assert "notion_add_fb" in names

    def test_add_fb_requires_db_id_and_fb_id(self):
        schemas = get_tool_schemas()
        add_fb = next(s for s in schemas if s["name"] == "notion_add_fb")
        assert "db_id" in add_fb["input_schema"]["required"]
        assert "fb_id" in add_fb["input_schema"]["required"]

    def test_has_five_schemas(self):
        schemas = get_tool_schemas()
        assert len(schemas) == 5


# ── FB_DB_SCHEMA ──────────────────────────────────────────────


class TestFbDbSchema:
    def test_has_required_fields(self):
        expected_fields = {
            "FBのID", "問題の概要", "再現方法", "期待する動作", "タグ", "ステータス",
        }
        assert set(FB_DB_SCHEMA.keys()) == expected_fields

    def test_title_field(self):
        assert "title" in FB_DB_SCHEMA["FBのID"]

    def test_status_select_options(self):
        options = FB_DB_SCHEMA["ステータス"]["select"]["options"]
        option_names = {o["name"] for o in options}
        assert option_names == {"未対応", "対応中", "解消済み"}


# ── P1-①: _request error path tests ─────────────────────────


def _make_mock_response(status_code, headers=None, text="", json_data=None):
    """Helper to create a mock httpx.Response."""
    resp = MagicMock()
    resp.status_code = status_code
    resp.headers = headers or {}
    resp.text = text
    resp.json.return_value = json_data or {}
    resp.raise_for_status = MagicMock()
    if status_code >= 400:
        import httpx
        resp.raise_for_status.side_effect = httpx.HTTPStatusError(
            f"{status_code}", request=MagicMock(), response=resp,
        )
    return resp


class TestRequestRetry429:
    """429 Too Many Requests → RateLimitError + retry with Retry-After."""

    @patch("core.tools.notion.retry_on_rate_limit", side_effect=_nosleep_retry_on_rate_limit)
    def test_429_retries_and_succeeds(self, _mock):
        client = MagicMock(spec=NotionClient)
        client._client = MagicMock()

        resp_429 = _make_mock_response(429, headers={"Retry-After": "2"})
        resp_200 = _make_mock_response(200, json_data={"ok": True})
        client._client.request.side_effect = [resp_429, resp_200]

        result = NotionClient._request(client, "GET", "/pages/abc")

        assert result == {"ok": True}
        assert client._client.request.call_count == 2

    def test_429_retry_after_header_applied(self):
        sleeps = []

        with patch(
            "core.tools.notion.retry_on_rate_limit",
            side_effect=_tracked_sleep_retry(sleeps),
        ):
            client = MagicMock(spec=NotionClient)
            client._client = MagicMock()

            resp_429 = _make_mock_response(429, headers={"Retry-After": "5"})
            resp_200 = _make_mock_response(200, json_data={"ok": True})
            client._client.request.side_effect = [resp_429, resp_200]

            NotionClient._request(client, "GET", "/pages/abc")

        assert len(sleeps) == 1
        assert sleeps[0] == 5.0

    def test_429_non_numeric_retry_after_uses_fallback(self):
        """P2-③: Non-numeric Retry-After header falls back to 1.0."""
        sleeps = []

        with patch(
            "core.tools.notion.retry_on_rate_limit",
            side_effect=_tracked_sleep_retry(sleeps),
        ):
            client = MagicMock(spec=NotionClient)
            client._client = MagicMock()

            resp_429 = _make_mock_response(429, headers={"Retry-After": "not-a-number"})
            resp_200 = _make_mock_response(200, json_data={"ok": True})
            client._client.request.side_effect = [resp_429, resp_200]

            result = NotionClient._request(client, "GET", "/pages/abc")

        assert result == {"ok": True}
        assert len(sleeps) == 1
        assert sleeps[0] == 1.0


class TestRequestRetry5xx:
    """5xx server errors → ServerError + retry."""

    @patch("core.tools.notion.retry_on_rate_limit", side_effect=_nosleep_retry_on_rate_limit)
    def test_500_retries_and_succeeds(self, _mock):
        client = MagicMock(spec=NotionClient)
        client._client = MagicMock()

        resp_500 = _make_mock_response(500, text="Internal Server Error")
        resp_200 = _make_mock_response(200, json_data={"ok": True})
        client._client.request.side_effect = [resp_500, resp_200]

        result = NotionClient._request(client, "POST", "/pages", {"data": 1})

        assert result == {"ok": True}
        assert client._client.request.call_count == 2

    @patch("core.tools.notion.retry_on_rate_limit", side_effect=_nosleep_retry_on_rate_limit)
    def test_503_retries_and_succeeds(self, _mock):
        client = MagicMock(spec=NotionClient)
        client._client = MagicMock()

        resp_503 = _make_mock_response(503, text="Service Unavailable")
        resp_200 = _make_mock_response(200, json_data={"ok": True})
        client._client.request.side_effect = [resp_503, resp_200]

        result = NotionClient._request(client, "GET", "/pages/abc")

        assert result == {"ok": True}

    @patch("core.tools.notion.retry_on_rate_limit", side_effect=_nosleep_retry_on_rate_limit)
    def test_5xx_exhausted_raises_server_error(self, _mock):
        client = MagicMock(spec=NotionClient)
        client._client = MagicMock()

        resp_500 = _make_mock_response(500, text="Server down")
        client._client.request.return_value = resp_500

        with pytest.raises(ServerError):
            NotionClient._request(client, "GET", "/pages/abc")


class TestRequestRetryConnectError:
    """httpx.ConnectError → retry."""

    @patch("core.tools.notion.retry_on_rate_limit", side_effect=_nosleep_retry_on_rate_limit)
    def test_connect_error_retries_and_succeeds(self, _mock):
        import httpx

        client = MagicMock(spec=NotionClient)
        client._client = MagicMock()

        resp_200 = _make_mock_response(200, json_data={"ok": True})
        client._client.request.side_effect = [
            httpx.ConnectError("Connection refused"),
            resp_200,
        ]

        result = NotionClient._request(client, "GET", "/pages/abc")

        assert result == {"ok": True}
        assert client._client.request.call_count == 2

    @patch("core.tools.notion.retry_on_rate_limit", side_effect=_nosleep_retry_on_rate_limit)
    def test_connect_error_exhausted_raises(self, _mock):
        import httpx

        client = MagicMock(spec=NotionClient)
        client._client = MagicMock()
        client._client.request.side_effect = httpx.ConnectError("Connection refused")

        with pytest.raises(httpx.ConnectError):
            NotionClient._request(client, "GET", "/pages/abc")


# ── P1-②: CRUD method tests ─────────────────────────────────


class TestCreatePage:
    def test_sends_correct_payload(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={"id": "new-page-id"})
        client._validate_payload = MagicMock()

        props = {"Name": {"title": [{"text": {"content": "Test"}}]}}
        result = NotionClient.create_page(client, "db-123", props)

        client._validate_payload.assert_called_once()
        client._request.assert_called_once_with(
            "POST", "/pages",
            {"parent": {"database_id": "db-123"}, "properties": props},
        )
        assert result == {"id": "new-page-id"}

    def test_calls_validate_payload(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={"id": "new-page-id"})
        client._validate_payload = MagicMock()

        NotionClient.create_page(client, "db-123", {"key": "val"})

        payload = client._validate_payload.call_args[0][0]
        assert "parent" in payload
        assert "properties" in payload


class TestUpdatePage:
    def test_sends_correct_payload(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={"id": "page-abc"})

        props = {"Status": {"select": {"name": "完了"}}}
        result = NotionClient.update_page(client, "page-abc", props)

        client._request.assert_called_once_with(
            "PATCH", "/pages/page-abc", {"properties": props},
        )
        assert result == {"id": "page-abc"}


class TestQueryDatabase:
    def test_basic_query(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={
            "results": [{"id": "p1"}],
            "has_more": False,
            "next_cursor": None,
        })

        result = NotionClient.query_database(client, "db-123")

        client._request.assert_called_once_with(
            "POST", "/databases/db-123/query", {"page_size": 100},
        )
        assert len(result["results"]) == 1

    def test_with_filter_and_sorts(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={"results": []})

        f = {"property": "Name", "title": {"contains": "TASK"}}
        s = [{"property": "Name", "direction": "ascending"}]
        NotionClient.query_database(client, "db-123", filter=f, sorts=s, page_size=10)

        body = client._request.call_args[0][2]
        assert body["filter"] == f
        assert body["sorts"] == s
        assert body["page_size"] == 10

    def test_page_size_clamped_to_100(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={"results": []})

        NotionClient.query_database(client, "db-123", page_size=500)

        body = client._request.call_args[0][2]
        assert body["page_size"] == 100

    def test_page_size_clamped_to_min_1(self):
        """P2-④: page_size=0 or negative is clamped to 1."""
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={"results": []})

        NotionClient.query_database(client, "db-123", page_size=0)

        body = client._request.call_args[0][2]
        assert body["page_size"] == 1

    def test_page_size_negative_clamped(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={"results": []})

        NotionClient.query_database(client, "db-123", page_size=-5)

        body = client._request.call_args[0][2]
        assert body["page_size"] == 1

    def test_with_start_cursor(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={"results": []})

        NotionClient.query_database(client, "db-123", start_cursor="cursor-abc")

        body = client._request.call_args[0][2]
        assert body["start_cursor"] == "cursor-abc"


class TestGetPage:
    def test_sends_correct_request(self):
        client = MagicMock(spec=NotionClient)
        client._request = MagicMock(return_value={"id": "page-xyz", "object": "page"})

        result = NotionClient.get_page(client, "page-xyz")

        client._request.assert_called_once_with("GET", "/pages/page-xyz")
        assert result["id"] == "page-xyz"


class TestValidatePayload:
    def test_passes_under_limit(self):
        client = MagicMock(spec=NotionClient)
        body = {"key": "value"}
        # Should not raise
        NotionClient._validate_payload(client, body)

    def test_raises_over_limit(self):
        client = MagicMock(spec=NotionClient)
        # Create a payload that exceeds 500KB
        body = {"data": "x" * (MAX_PAYLOAD_BYTES + 1)}

        with pytest.raises(ValueError, match="exceeds Notion limit"):
            NotionClient._validate_payload(client, body)
