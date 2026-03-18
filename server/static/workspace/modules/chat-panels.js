// ── Chat Panels: Avatar Row + Right Panel ──────────────────────
// Renders team member avatars and the right info panel in the conversation overlay.

import { getState, subscribe } from "./state.js";
import { fetchAnimas } from "./api.js";
import { bustupCandidates, resolveCachedAvatar } from "../../modules/avatar-resolver.js";
import { openConversation } from "./chat-controller.js";

let _avatarRow = null;
let _rightPanel = null;
let _rpSuggestions = null;
let _rpActions = null;
let _rpSummary = null;

// ── Avatar Row ──────────────────────

/**
 * Render avatar row with team member thumbnails.
 */
async function renderAvatarRow() {
  if (!_avatarRow) return;

  const { animas, conversationAnima } = getState();
  if (!animas || animas.length === 0) {
    _avatarRow.innerHTML = "";
    return;
  }

  const html = animas.map(a => {
    const name = a.name;
    const isActive = name === conversationAnima;
    const statusLower = (a.status || "").toLowerCase();
    const isOnline = statusLower === "idle" || statusLower === "running";
    const isThinking = statusLower === "thinking" || statusLower === "processing" || statusLower === "busy";

    const classes = [
      "ws-avatar-item",
      isActive ? "active" : "",
      isOnline ? "is-online" : "",
      isThinking ? "is-thinking" : "",
    ].filter(Boolean).join(" ");

    const initial = name.charAt(0).toUpperCase();

    return `
      <div class="${classes}" data-anima="${name}" title="${name}">
        <div class="ws-avatar-item-wrap">
          <div class="ws-avatar-item-initial ws-avatar-placeholder" data-name="${name}">${initial}</div>
          <div class="ws-avatar-status-dot"></div>
        </div>
        <span class="ws-avatar-item-name">${name}</span>
      </div>
    `;
  }).join("");

  _avatarRow.innerHTML = html;

  // Resolve avatars asynchronously
  for (const a of animas) {
    resolveAvatarForRow(a.name);
  }
}

async function resolveAvatarForRow(animaName) {
  try {
    const url = await resolveCachedAvatar(animaName, bustupCandidates(), "S");
    if (!url) return;

    const placeholder = _avatarRow?.querySelector(`.ws-avatar-placeholder[data-name="${animaName}"]`);
    if (!placeholder) return;

    const img = document.createElement("img");
    img.className = "ws-avatar-item-img";
    img.src = url;
    img.alt = animaName;
    img.loading = "lazy";
    placeholder.replaceWith(img);
  } catch {
    // Keep initial placeholder
  }
}

function onAvatarClick(e) {
  const item = e.target.closest(".ws-avatar-item");
  if (!item) return;
  const name = item.dataset.anima;
  if (name) openConversation(name);
}

// ── Right Panel ──────────────────────

/**
 * Update the team summary section with live data.
 */
function updateTeamSummary() {
  const { animas, conversationAnima } = getState();
  if (!animas) return;

  const activeCount = animas.filter(a => {
    const s = (a.status || "").toLowerCase();
    return s === "idle" || s === "running" || s === "thinking" || s === "processing" || s === "busy";
  }).length;

  const activeEl = document.getElementById("wsRpActiveCount");
  if (activeEl) activeEl.textContent = `${activeCount} / ${animas.length}`;

  // Update summary avatar with current conversation anima's image
  if (conversationAnima) {
    updateSummaryAvatar(conversationAnima);
  }
}

async function updateSummaryAvatar(animaName) {
  const wrap = document.getElementById("wsRpSummaryAvatar");
  if (!wrap) return;

  try {
    const url = await resolveCachedAvatar(animaName, bustupCandidates(), "S");
    if (url) {
      wrap.innerHTML = `<img src="${url}" alt="${animaName}">`;
    } else {
      wrap.textContent = animaName.charAt(0).toUpperCase();
    }
  } catch {
    wrap.textContent = animaName.charAt(0).toUpperCase();
  }
}

/**
 * Handle quick action button clicks — insert prompt text into chat input.
 */
function onActionClick(e) {
  const btn = e.target.closest(".ws-rp-action-btn");
  if (!btn) return;

  const action = btn.dataset.action;
  const { conversationAnima } = getState();
  if (!conversationAnima) return;

  const prompts = {
    status: "What's your current status?",
    tasks: "Show me your current task list.",
    report: "Give me a brief progress report for today.",
    schedule: "What's on the schedule for today?",
  };

  const input = document.getElementById("wsConvInput");
  if (input && prompts[action]) {
    input.value = prompts[action];
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
    input.focus();
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

/**
 * Handle suggestion card clicks — insert suggestion into chat input.
 */
function onSuggestionClick(e) {
  const card = e.target.closest(".ws-rp-card");
  if (!card) return;

  const titleEl = card.querySelector(".ws-rp-card-title");
  if (!titleEl) return;

  const input = document.getElementById("wsConvInput");
  if (input) {
    input.value = titleEl.textContent;
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
    input.focus();
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

// ── Initialization ──────────────────────

/**
 * Initialize chat panels (avatar row + right panel).
 * Call after DOM is ready and chat-controller is initialized.
 */
export function initChatPanels() {
  _avatarRow = document.getElementById("wsAvatarRow");
  _rightPanel = document.getElementById("wsRightPanel");
  _rpSuggestions = document.getElementById("wsRpSuggestions");
  _rpActions = document.getElementById("wsRpActions");
  _rpSummary = document.getElementById("wsRpSummary");

  // Avatar row click handler
  _avatarRow?.addEventListener("click", onAvatarClick);

  // Right panel event handlers
  _rpActions?.addEventListener("click", onActionClick);
  _rpSuggestions?.addEventListener("click", onSuggestionClick);

  // Subscribe to state changes — only update on relevant changes
  let _prevAnimas = null;
  let _prevConvAnima = null;
  subscribe((state) => {
    if (!state.conversationOpen) return;
    const animasChanged = state.animas !== _prevAnimas;
    const convChanged = state.conversationAnima !== _prevConvAnima;
    if (animasChanged || convChanged) {
      _prevAnimas = state.animas;
      _prevConvAnima = state.conversationAnima;
      renderAvatarRow();
      updateTeamSummary();
    }
  });
}

/**
 * Refresh avatar row and summary (call when conversation opens).
 */
export function refreshChatPanels() {
  renderAvatarRow();
  updateTeamSummary();
}
