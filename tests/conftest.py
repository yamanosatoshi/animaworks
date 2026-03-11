# AnimaWorks - Digital Anima Framework
# Copyright (C) 2026 AnimaWorks Authors
# SPDX-License-Identifier: Apache-2.0
"""Global test fixtures for AnimaWorks E2E tests.

Provides filesystem isolation, config cache management, and
mock/live switching for all test modules.
"""

from __future__ import annotations

import logging
import os
import sys
import signal
import subprocess
import types
from pathlib import Path
from typing import Any

import pytest
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

from tests.helpers.filesystem import (
    create_anima_dir,
    create_test_data_dir,
)

# Load .env at module level so API keys are available before fixtures run.
# main.py calls load_dotenv() for CLI usage; tests need it here.
load_dotenv()

# ── Optional dependency detection ────────────────────────

class _InMemoryChromaCollection:
    """In-memory Chroma collection used for tests when ChromaDB import fails."""

    def __init__(self, name: str, metadata: dict[str, object] | None = None) -> None:
        self.name = name
        self.metadata = metadata or {}
        self._records: dict[str, tuple[str, list[float], dict[str, object]]] = {}

    @staticmethod
    def _dot(a: list[float], b: list[float]) -> float:
        return sum(x * y for x, y in zip(a, b))

    @staticmethod
    def _norm(v: list[float]) -> float:
        return sum(x * x for x in v) ** 0.5

    def upsert(self, ids: list[str], documents: list[str], embeddings: list[list[float]], metadatas: list[dict[str, object]]) -> None:
        for doc_id, doc, embedding, metadata in zip(ids, documents, embeddings, metadatas):
            self._records[str(doc_id)] = (
                str(doc),
                list(embedding),
                dict(metadata),
            )

    def query(
        self,
        query_embeddings: list[list[float]],
        n_results: int,
        where: dict[str, object] | None = None,
    ) -> dict[str, list[list[object]]]:
        if not query_embeddings or not self._records:
            return {
                "ids": [[]],
                "documents": [[]],
                "metadatas": [[]],
                "distances": [[]],
            }

        q = query_embeddings[0]
        q_norm = self._norm(q)
        scored: list[tuple[str, str, dict[str, object], float]] = []

        for doc_id, (doc, embedding, metadata) in self._records.items():
            if where:
                missing = False
                for key, value in where.items():
                    if metadata.get(key) != value:
                        missing = True
                        break
                if missing:
                    continue
            score = 0.0
            if q_norm > 0.0:
                denominator = q_norm * self._norm(embedding)
                if denominator > 0.0:
                    score = self._dot(q, embedding) / denominator
            scored.append((doc_id, doc, metadata, 1.0 - score))

        scored.sort(key=lambda item: item[3], reverse=False)
        top = scored[:n_results]

        ids = [item[0] for item in top]
        documents = [item[1] for item in top]
        metadatas = [item[2] for item in top]
        distances = [item[3] for item in top]

        return {
            "ids": [ids],
            "documents": [documents],
            "metadatas": [metadatas],
            "distances": [distances],
        }

    def delete(self, ids: list[str]) -> None:
        for doc_id in ids:
            self._records.pop(str(doc_id), None)

    def update(self, ids: list[str], metadatas: list[dict[str, object]]) -> None:
        for doc_id, metadata in zip(ids, metadatas):
            key = str(doc_id)
            if key in self._records:
                doc, embedding, _ = self._records[key]
                merged = dict(_)
                merged.update(metadata)
                self._records[key] = (doc, embedding, merged)


class _InMemoryChromaClient:
    """Minimal subset of PersistentClient semantics used by production code/tests."""

    _STATE: dict[str, dict[str, _InMemoryChromaCollection]] = {}

    def __init__(self, path: str | None = None) -> None:
        # EphemeralClient() is often called without arguments.
        if path is None:
            path = f":memory:{id(self)}"
        self.path = path
        self._store = self._STATE.setdefault(path, {})

    def create_collection(self, name: str, metadata: dict[str, object] | None = None) -> _InMemoryChromaCollection:
        collection = self._store.get(name)
        if collection is None:
            collection = _InMemoryChromaCollection(name=name, metadata=metadata)
            self._store[name] = collection
        return collection

    def get_or_create_collection(self, name: str, metadata: dict[str, object] | None = None) -> _InMemoryChromaCollection:
        return self.create_collection(name=name, metadata=metadata)

    def get_collection(self, name: str) -> _InMemoryChromaCollection:
        if name not in self._store:
            raise RuntimeError(f"Collection '{name}' does not exist")
        return self._store[name]

    def list_collections(self) -> list[_InMemoryChromaCollection]:
        return list(self._store.values())

    def delete_collection(self, name: str) -> None:
        self._store.pop(name, None)


def _build_fake_chromadb() -> None:
    """Install a tiny in-memory chromadb-compatible module into sys.modules."""
    module = types.ModuleType("chromadb")

    class CollectionInfo(types.SimpleNamespace):
        pass

    def _collection_info(name: str, metadata: dict[str, object] | None = None) -> CollectionInfo:
        return CollectionInfo(name=name, metadata=metadata or {})

    # Keep Chroma method shape for compatibility with existing test expectations.
    def list_collections_wrapper(self: _InMemoryChromaClient):
        return [_collection_info(name=coll.name, metadata=coll.metadata) for coll in self._store.values()]

    module.PersistentClient = _InMemoryChromaClient

    def _ephemeral_client() -> _InMemoryChromaClient:
        return _InMemoryChromaClient(path=None)

    module.EphemeralClient = _ephemeral_client
    module._InMemoryChromaClient = _InMemoryChromaClient

    def _patched_list_collections(self: _InMemoryChromaClient):  # type: ignore[override]
        return list_collections_wrapper(self)

    _InMemoryChromaClient.list_collections = _patched_list_collections  # type: ignore[method-assign]

    sys.modules["chromadb"] = module


def _iter_exception_chain(exc: Exception):
    seen: set[int] = set()
    current: Exception | None = exc
    while current is not None and id(current) not in seen:
        yield current
        seen.add(id(current))
        next_exc = current.__cause__ or current.__context__
        current = next_exc if isinstance(next_exc, Exception) else None


def _is_known_chromadb_optional_failure(exc: Exception) -> bool:
    """Return True only for known optional-dependency/import failures.

    We intentionally avoid swallowing unrelated runtime bugs during import.
    """
    for err in _iter_exception_chain(exc):
        if isinstance(err, ImportError):
            return True
        mod = err.__class__.__module__
        msg = str(err)
        if mod.startswith("pydantic") and "chroma_server_nofile" in msg:
            return True
    return False


try:
    import chromadb  # noqa: F401
    CHROMADB_AVAILABLE = True
except Exception as exc:
    if _is_known_chromadb_optional_failure(exc):
        CHROMADB_AVAILABLE = False
        _build_fake_chromadb()
        logger.warning("Using in-memory fake chromadb due to import failure: %s", exc)
    else:
        raise


# ── CLI options ───────────────────────────────────────────


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(
        "--mock",
        action="store_true",
        default=False,
        help="Force mock mode for all API calls",
    )
    parser.addoption(
        "--run-live",
        action="store_true",
        default=False,
        help="Run @pytest.mark.live tests (skipped by default)",
    )


# ── Fixtures ──────────────────────────────────────────────


@pytest.fixture(autouse=True)
def _reset_app_timezone():
    """Reset the application timezone to the fallback after each test.

    Prevents state leakage when tests call ``configure_timezone()``.
    Force-resets ``_app_tz`` to ``None`` so ``get_app_timezone()`` always
    falls back to the hardcoded ``Asia/Tokyo`` default, regardless of
    what a previous test or import side-effect may have configured.
    """
    import core.time_utils as _tu

    _tu._app_tz = None  # ensure clean state at test start
    yield
    _tu._app_tz = None  # force-reset to prevent leakage


@pytest.fixture(autouse=True)
def _restore_load_auth():
    """Restore server.app.load_auth after tests that monkey-patch it.

    Several E2E test helpers persist ``_sa.load_auth = lambda: _auth`` beyond
    their ``with patch(...)`` blocks so that the auth-guard middleware returns
    ``local_trust`` at request time.  Without this teardown the monkey-patch
    leaks into subsequent tests that expect the real ``load_auth``.
    """
    import server.app as sa
    original = sa.load_auth
    yield
    sa.load_auth = original


@pytest.fixture
def use_mock(request: pytest.FixtureRequest) -> bool:
    """Determine whether to use mocks or real API calls.

    Returns True when:
      - ``--mock`` flag is passed, OR
      - ``ANTHROPIC_API_KEY`` is not set in the environment
    """
    if request.config.getoption("--mock"):
        return True
    return not os.environ.get("ANTHROPIC_API_KEY")


@pytest.fixture(autouse=True)
def _skip_live_without_key(request: pytest.FixtureRequest, use_mock: bool) -> None:
    """Auto-skip ``@pytest.mark.live`` tests unless explicitly enabled.

    Live tests are skipped by default unless:
      - ``--run-live`` flag is passed, AND
      - Required API keys are available

    Additional skip rules:
      - ``@pytest.mark.azure`` requires ``AZURE_API_KEY`` in environment
      - ``@pytest.mark.ollama`` requires ``OLLAMA_API_BASE`` in environment
    """
    run_live = request.config.getoption("--run-live", default=False)
    if request.node.get_closest_marker("live"):
        if not run_live:
            pytest.skip("Skipping live test: use --run-live to enable")
        if use_mock:
            pytest.skip("Skipping live test: no API key or --mock flag set")
    if request.node.get_closest_marker("azure"):
        if not os.environ.get("AZURE_API_KEY"):
            pytest.skip("Skipping Azure test: AZURE_API_KEY not set")
    if request.node.get_closest_marker("ollama"):
        if not os.environ.get("OLLAMA_API_BASE"):
            pytest.skip("Skipping Ollama test: OLLAMA_API_BASE not set")


@pytest.fixture
def data_dir(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    """Create an isolated AnimaWorks runtime data directory.

    - Redirects ``ANIMAWORKS_DATA_DIR`` to a temp directory
    - Invalidates config and prompt caches before and after the test
    """
    from core.config import invalidate_cache
    from core.paths import _prompt_cache
    from core.tooling.prompt_db import reset_prompt_store

    # Create the data directory structure
    d = create_test_data_dir(tmp_path)

    # Redirect all path resolution to the temp directory
    monkeypatch.setenv("ANIMAWORKS_DATA_DIR", str(d))

    # Invalidate caches to pick up the new data dir
    invalidate_cache()
    _prompt_cache.clear()
    reset_prompt_store()

    yield d

    # Teardown: kill any supervisor.runner child processes spawned during
    # this test.  Matches processes whose command line references the
    # test's tmp data directory so we don't affect production processes.
    _kill_orphan_runners(str(d))

    # Cleanup: invalidate caches again to avoid leaking between tests
    invalidate_cache()
    _prompt_cache.clear()
    reset_prompt_store()


def _kill_orphan_runners(data_dir_str: str) -> None:
    """Terminate supervisor.runner processes whose cmdline references *data_dir_str*.

    Scans ``/proc`` on Linux to find child processes; falls back to
    ``pgrep`` if ``/proc`` is unavailable.
    """
    proc_dir = Path("/proc")
    if not proc_dir.exists():
        # Fallback for non-Linux: use pgrep
        _kill_orphan_runners_pgrep(data_dir_str)
        return

    for pid_dir in proc_dir.iterdir():
        if not pid_dir.name.isdigit():
            continue
        cmdline_file = pid_dir / "cmdline"
        try:
            cmdline = cmdline_file.read_text().replace("\x00", " ")
            if "core.supervisor.runner" in cmdline and data_dir_str in cmdline:
                pid = int(pid_dir.name)
                logger.info("Killing orphan runner process PID=%s", pid)
                os.kill(pid, signal.SIGTERM)
        except (OSError, ValueError, PermissionError):
            pass


def _kill_orphan_runners_pgrep(data_dir_str: str) -> None:
    """Fallback: use pgrep + kill for non-Linux platforms."""
    try:
        result = subprocess.run(
            ["pgrep", "-f", "core.supervisor.runner"],
            capture_output=True, text=True, timeout=5,
        )
        for line in result.stdout.strip().splitlines():
            pid = int(line.strip())
            # Verify cmdline contains our data_dir before killing
            try:
                cmdline_path = Path(f"/proc/{pid}/cmdline")
                if cmdline_path.exists():
                    cmdline = cmdline_path.read_text().replace("\x00", " ")
                    if data_dir_str not in cmdline:
                        continue
            except OSError:
                continue
            logger.info("Killing orphan runner process PID=%s", pid)
            os.kill(pid, signal.SIGTERM)
    except (subprocess.TimeoutExpired, FileNotFoundError, ValueError):
        pass


@pytest.fixture
def make_anima(data_dir: Path):
    """Factory fixture to create anima directories within the test data_dir.

    Returns a callable that creates an anima directory and updates config.json.
    """
    from core.config import invalidate_cache

    def _make(
        name: str = "test-anima",
        **kwargs: Any,
    ) -> Path:
        anima_dir = create_anima_dir(data_dir, name, **kwargs)
        # Invalidate config cache after changing config.json
        invalidate_cache()
        return anima_dir

    return _make
