/* ── AI Brainstorm Page ──────────────────────── */

import { api } from "../modules/api.js";
import { renderMarkdown, escapeHtml } from "../modules/state.js";
import { t } from "/shared/i18n.js";

let _abortCtrl = null;
let _sessionData = null; // accumulates brainstorm results for sessionStorage

const STORAGE_KEY = "brainstorm_history";

// Populated dynamically from /api/brainstorm/characters
// { [id]: { color, icon } }
const _charMeta = {};

export async function render(container) {
  container.innerHTML = `
    <div class="brainstorm-page">
      <div class="page-header">
        <h2>${t("brainstorm.page_title")}</h2>
        <p class="page-desc">${t("brainstorm.page_desc")}</p>
      </div>

      <div class="brainstorm-input card">
        <div class="card-header">${t("brainstorm.input_title")}</div>
        <div class="card-body">
          <div class="bs-field">
            <label for="bsTheme">${t("brainstorm.theme_label")}</label>
            <textarea id="bsTheme" class="bs-textarea" rows="3"
              placeholder="${escapeHtml(t("brainstorm.theme_placeholder"))}"></textarea>
          </div>
          <div class="bs-field">
            <label for="bsConstraints">${t("brainstorm.constraints_label")}</label>
            <textarea id="bsConstraints" class="bs-textarea" rows="2"
              placeholder="${escapeHtml(t("brainstorm.constraints_placeholder"))}"></textarea>
          </div>
          <div class="bs-field">
            <label for="bsExpected">${t("brainstorm.expected_label")}</label>
            <textarea id="bsExpected" class="bs-textarea" rows="2"
              placeholder="${escapeHtml(t("brainstorm.expected_placeholder"))}"></textarea>
          </div>
        </div>
      </div>

      <div class="brainstorm-chars card">
        <div class="card-header">${t("brainstorm.chars_title")}</div>
        <div class="card-body">
          <div id="bsCharList" class="bs-char-list"></div>
        </div>
      </div>

      <div class="brainstorm-controls card">
        <div class="card-body bs-controls-inner">
          <div class="bs-control-row">
            <label for="bsModel">${t("brainstorm.model_label")}</label>
            <select id="bsModel" class="bs-model-select">
              <option value="">${t("brainstorm.model_default")}</option>
            </select>
          </div>
          <div class="bs-btn-row">
            <button id="bsGenBtn" class="btn btn-primary">${t("brainstorm.generate_btn")}</button>
          </div>
        </div>
      </div>

      <div id="bsStatus" class="bs-status" style="display:none"></div>

      <div id="bsDiscussion" class="bs-discussion" style="display:none"></div>

      <div id="bsSynthesis" class="bs-synthesis card" style="display:none">
        <div class="card-header" id="bsSynthHeader">${t("brainstorm.synthesis_title")}</div>
        <div class="card-body markdown-body" id="bsSynthContent"></div>
      </div>
    </div>
  `;

  // Load characters first so _charMeta is ready before history restoration
  await _loadCharacters(container);
  _loadModels(container);
  _restoreHistory(container);

  container.querySelector("#bsGenBtn").addEventListener("click", () => _onGenerate(container));
}

export function destroy() {
  if (_abortCtrl) {
    _abortCtrl.abort();
    _abortCtrl = null;
  }
}

// ── Character list ──────────────────────────

async function _loadCharacters(container) {
  try {
    const data = await api("/api/brainstorm/characters");
    const list = container.querySelector("#bsCharList");
    if (!list || !data.characters) return;

    for (const c of data.characters) {
      _charMeta[c.id] = { color: c.color || "#6b7280", icon: c.icon || "message-circle", avatar_url: c.avatar_url || null };
    }

    list.innerHTML = data.characters
      .map(
        (c) => {
          const avatarEl = c.avatar_url
            ? `<img src="${escapeHtml(c.avatar_url)}" alt="${escapeHtml(c.name)}" class="bs-char-avatar" />`
            : `<span class="bs-char-dot" style="background:${escapeHtml(c.color || "#6b7280")}"></span>
               <i data-lucide="${escapeHtml(c.icon || "message-circle")}" class="bs-char-icon"></i>`;
          return `
      <label class="bs-char-item" data-char-id="${escapeHtml(c.id)}">
        <input type="checkbox" value="${escapeHtml(c.id)}" checked />
        ${avatarEl}
        <div class="bs-char-info">
          <span class="bs-char-name">${escapeHtml(c.name)}</span>
          <span class="bs-char-desc">${escapeHtml(c.description)}</span>
        </div>
      </label>
    `;
        }
      )
      .join("");

    if (window.lucide) window.lucide.createIcons();
  } catch (e) {
    console.error("Failed to load characters:", e);
  }
}

// ── Model dropdown ──────────────────────────

async function _loadModels(container) {
  try {
    const data = await api("/api/brainstorm/models");
    const sel = container.querySelector("#bsModel");
    if (!sel || !data.available_models) return;

    for (const m of data.available_models) {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = m.label;
      if (m.id === data.default_model) opt.selected = true;
      sel.appendChild(opt);
    }
  } catch (e) {
    console.error("Failed to load models:", e);
  }
}

// ── Generate (SSE streaming) ─────────────────

async function _onGenerate(container) {
  const theme = container.querySelector("#bsTheme")?.value?.trim();
  if (!theme) {
    _showStatus(container, t("brainstorm.theme_required"), "error");
    return;
  }

  const constraints = container.querySelector("#bsConstraints")?.value?.trim() || "";
  const expected = container.querySelector("#bsExpected")?.value?.trim() || "";
  const model = container.querySelector("#bsModel")?.value || "";

  const checked = container.querySelectorAll("#bsCharList input[type=checkbox]:checked");
  const charIds = Array.from(checked).map((el) => el.value);
  if (charIds.length === 0) {
    _showStatus(container, t("brainstorm.no_chars_error"), "error");
    return;
  }

  const btn = container.querySelector("#bsGenBtn");
  btn.disabled = true;
  btn.textContent = t("brainstorm.generating");

  // Clear previous results
  const discussionEl = container.querySelector("#bsDiscussion");
  const synthEl = container.querySelector("#bsSynthesis");
  const synthContent = container.querySelector("#bsSynthContent");
  discussionEl.innerHTML = "";
  discussionEl.style.display = "none";
  synthEl.style.display = "none";
  synthContent.innerHTML = "";

  _showStatus(container, t("brainstorm.generating_msg"), "loading");

  if (_abortCtrl) _abortCtrl.abort();
  _abortCtrl = new AbortController();

  // Initialize session data accumulator
  _sessionData = { theme, constraints, expected, characters: [], synthesis: "", synthCharId: null, synthCharName: null };

  try {
    const resp = await fetch("/api/brainstorm/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        theme,
        constraints,
        expected_output: expected,
        character_ids: charIds,
        model,
      }),
      signal: _abortCtrl.signal,
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${resp.status}`);
    }

    _showStatus(container, "", "hide");
    discussionEl.style.display = "block";

    await _consumeSSE(resp, {
      onCharStart(charId, charName) {
        _addCharTurn(discussionEl, charId, charName);
        if (_sessionData) {
          const meta = _charMeta[charId] || {};
          _sessionData.characters.push({ id: charId, name: charName, color: meta.color, icon: meta.icon, avatar_url: meta.avatar_url || null, text: "" });
        }
      },
      onCharChunk(charId, text) {
        _appendCharChunk(discussionEl, charId, text);
        if (_sessionData) {
          const entry = _sessionData.characters.find((c) => c.id === charId);
          if (entry) entry.text += text;
        }
      },
      onCharDone(charId) {
        _finalizeCharTurn(discussionEl, charId);
      },
      onCharError(charId, error) {
        _showCharError(discussionEl, charId, error);
      },
      onSynthStart(charId, charName) {
        synthEl.style.display = "block";
        synthContent.innerHTML = '<span class="bs-cursor"></span>';
        if (_sessionData) {
          _sessionData.synthCharId = charId;
          _sessionData.synthCharName = charName;
        }
        // Update card header to show who is summarizing
        const hdr = container.querySelector("#bsSynthHeader");
        if (hdr && charName) hdr.textContent = `${charName} — ${t("brainstorm.synthesis_title")}`;
      },
      onSynthChunk(text) {
        synthContent.dataset.raw = (synthContent.dataset.raw || "") + text;
        const cursor = synthContent.querySelector(".bs-cursor");
        const plain = document.createTextNode(text);
        synthContent.insertBefore(plain, cursor);
        if (_sessionData) _sessionData.synthesis += text;
      },
      onSynthDone() {
        const raw = synthContent.dataset.raw || "";
        synthContent.innerHTML = renderMarkdown(raw);
        delete synthContent.dataset.raw;
        _saveHistory();
      },
      onSynthError(error) {
        synthContent.innerHTML = `<span class="bs-error">${escapeHtml(error)}</span>`;
        _saveHistory();
      },
    });
  } catch (e) {
    if (e.name !== "AbortError") {
      _showStatus(container, t("brainstorm.generate_error") + ": " + e.message, "error");
    }
  } finally {
    btn.disabled = false;
    btn.textContent = t("brainstorm.generate_btn");
    _abortCtrl = null;
  }
}

// ── SSE consumer ────────────────────────────

async function _consumeSSE(resp, callbacks) {
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      let evt;
      try {
        evt = JSON.parse(line.slice(6));
      } catch {
        continue;
      }

      switch (evt.type) {
        case "char_start":
          callbacks.onCharStart?.(evt.character_id, evt.character_name);
          break;
        case "char_chunk":
          callbacks.onCharChunk?.(evt.character_id, evt.text);
          break;
        case "char_done":
          callbacks.onCharDone?.(evt.character_id);
          break;
        case "char_error":
          callbacks.onCharError?.(evt.character_id, evt.error);
          break;
        case "synth_start":
          callbacks.onSynthStart?.(evt.character_id, evt.character_name);
          break;
        case "synth_chunk":
          callbacks.onSynthChunk?.(evt.text);
          break;
        case "synth_done":
          callbacks.onSynthDone?.();
          break;
        case "synth_error":
          callbacks.onSynthError?.(evt.error);
          break;
        case "done":
          return;
        case "error":
          throw new Error(evt.error || "Unknown error");
      }
    }
  }
}

// ── Chat turn rendering ──────────────────────

function _addCharTurn(discussionEl, charId, charName, meta) {
  const m = meta || _charMeta[charId] || {};
  const color = m.color || "#6b7280";
  const icon = m.icon || "message-circle";

  const avatarInner = m.avatar_url
    ? `<img src="${escapeHtml(m.avatar_url)}" alt="${escapeHtml(charName)}" class="bs-turn-avatar-img" />`
    : `<i data-lucide="${escapeHtml(icon)}"></i>`;

  const turn = document.createElement("div");
  turn.className = "bs-turn";
  turn.dataset.charId = charId;
  turn.innerHTML = `
    <div class="bs-turn-avatar${m.avatar_url ? " has-photo" : ""}" style="background:${escapeHtml(color)}">
      ${avatarInner}
    </div>
    <div class="bs-turn-body">
      <div class="bs-turn-name">${escapeHtml(charName)}</div>
      <div class="bs-turn-bubble is-streaming" data-char-id="${escapeHtml(charId)}">
        <span class="bs-cursor"></span>
      </div>
    </div>
  `;
  discussionEl.appendChild(turn);
  if (window.lucide) window.lucide.createIcons();
  turn.scrollIntoView({ behavior: "smooth", block: "end" });
}

function _appendCharChunk(discussionEl, charId, text) {
  const bubble = discussionEl.querySelector(`.bs-turn-bubble[data-char-id="${CSS.escape(charId)}"]`);
  if (!bubble) return;

  bubble.dataset.raw = (bubble.dataset.raw || "") + text;
  const cursor = bubble.querySelector(".bs-cursor");
  bubble.insertBefore(document.createTextNode(text), cursor);
}

function _finalizeCharTurn(discussionEl, charId) {
  const bubble = discussionEl.querySelector(`.bs-turn-bubble[data-char-id="${CSS.escape(charId)}"]`);
  if (!bubble) return;

  const raw = bubble.dataset.raw || "";
  bubble.classList.remove("is-streaming");
  bubble.classList.add("is-done", "markdown-body");
  bubble.innerHTML = renderMarkdown(raw);
  delete bubble.dataset.raw;
}

function _showCharError(discussionEl, charId, error) {
  const bubble = discussionEl.querySelector(`.bs-turn-bubble[data-char-id="${CSS.escape(charId)}"]`);
  if (!bubble) return;
  bubble.classList.remove("is-streaming");
  bubble.classList.add("is-error");
  bubble.innerHTML = `<span class="bs-error">${escapeHtml(error)}</span>`;
}

// ── History persistence (sessionStorage) ────

function _saveHistory() {
  if (!_sessionData) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(_sessionData));
  } catch {
    // quota exceeded or unavailable — silently skip
  }
}

function _restoreHistory(container) {
  let data;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    data = JSON.parse(raw);
  } catch {
    return;
  }

  if (!data || !Array.isArray(data.characters) || data.characters.length === 0) return;

  const discussionEl = container.querySelector("#bsDiscussion");
  const synthEl = container.querySelector("#bsSynthesis");
  const synthContent = container.querySelector("#bsSynthContent");

  discussionEl.style.display = "block";
  for (const c of data.characters) {
    // Use stored meta (color/icon/avatar) falling back to current _charMeta
    const storedMeta = { color: c.color, icon: c.icon, avatar_url: c.avatar_url || (_charMeta[c.id] || {}).avatar_url || null };
    _addCharTurn(discussionEl, c.id, c.name, storedMeta);
    if (c.text) {
      const bubble = discussionEl.querySelector(
        `.bs-turn-bubble[data-char-id="${CSS.escape(c.id)}"]`
      );
      if (bubble) {
        bubble.dataset.raw = c.text;
        _finalizeCharTurn(discussionEl, c.id);
      }
    }
  }

  if (data.synthesis) {
    synthEl.style.display = "block";
    synthContent.innerHTML = renderMarkdown(data.synthesis);
    if (data.synthCharName) {
      const hdr = container.querySelector("#bsSynthHeader");
      if (hdr) hdr.textContent = `${data.synthCharName} — ${t("brainstorm.synthesis_title")}`;
    }
  }
}

// ── Status display ──────────────────────────

function _showStatus(container, msg, type) {
  const el = container.querySelector("#bsStatus");
  if (!el) return;

  if (type === "hide") {
    el.style.display = "none";
    return;
  }

  el.style.display = "block";
  el.className = "bs-status bs-status-" + type;

  if (type === "loading") {
    el.innerHTML = `<span class="bs-spinner"></span> ${escapeHtml(msg)}`;
  } else {
    el.textContent = msg;
  }
}
