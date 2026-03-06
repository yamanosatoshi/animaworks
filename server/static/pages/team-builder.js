/* ── Team Builder — Wizard (Screens 1–4) ──── */

import { t, applyTranslations } from "/shared/i18n.js";
import { navigateTo } from "../modules/router.js";
import {
  TEMPLATES,
  ROLES,
  getRoleById,
  getRoleName,
  getToolLabel,
  getTemplateById,
  createTeam,
} from "../modules/team-data.js";

// ── State ─────────────────────────────────

const state = {
  currentStep: 1, // 1–4
  selectedTemplateId: null,
  // Role selections: { roleId: count }
  roleSelections: {},
  // Pre-filled from template (for screen 3 when coming from screen 2)
  prefilled: false,
  createdTeam: null,
};

let _container = null;

// ── Role Icons ────────────────────────────

const ROLE_ICONS = {
  secretary: "\u{1F4CB}",
  customer_support: "\u{1F3E7}",
  back_office: "\u{1F4C1}",
  sales_assist: "\u{1F4C8}",
  pr_sns: "\u{1F4E3}",
  recruiter: "\u{1F465}",
  accounting: "\u{1F4B0}",
  project_manager: "\u{1F3AF}",
  researcher: "\u{1F50D}",
  content_writer: "\u{270D}\uFE0F",
};

const TEMPLATE_ICONS = {
  secretary: "\u{1F4CB}",
  customer_support: "\u{1F3E7}",
  sales_assist: "\u{1F4C8}",
  back_office: "\u{1F4C1}",
};

// Avatar colors for created members
const AVATAR_COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981",
  "#3b82f6", "#8b5cf6", "#ef4444", "#14b8a6",
  "#f97316", "#06b6d4",
];

// ── Render / Destroy ──────────────────────

export function render(container) {
  _container = container;
  _renderCurrentStep();
}

export function destroy() {
  _container = null;
}

// ── Step Router ───────────────────────────

function _renderCurrentStep() {
  if (!_container) return;
  switch (state.currentStep) {
    case 1: _renderStep1(); break;
    case 2: _renderStep2(); break;
    case 3: _renderStep3(); break;
    case 4: _renderStep4(); break;
  }
  applyTranslations();
}

// ── Step Indicator HTML ───────────────────

function _stepIndicator() {
  const totalSteps = 4;
  const parts = [];
  for (let i = 1; i <= totalSteps; i++) {
    let cls = "tb-step-dot";
    if (i === state.currentStep) cls += " active";
    else if (i < state.currentStep) cls += " done";
    parts.push(`<span class="${cls}"></span>`);
    if (i < totalSteps) {
      const connCls = i < state.currentStep ? "tb-step-connector done" : "tb-step-connector";
      parts.push(`<span class="${connCls}"></span>`);
    }
  }
  return `<div class="tb-step-indicator">${parts.join("")}</div>`;
}

// ══════════════════════════════════════════
// Screen 1: Template Selection
// ══════════════════════════════════════════

function _renderStep1() {
  const templateCards = TEMPLATES.map((tpl) => {
    const members = tpl.members;
    const totalCount = members.reduce((s, m) => s + m.count, 0);
    const countLabel = totalCount === 1
      ? t("tb.count_one")
      : `${totalCount}${t("tb.count_suffix")}`;
    const recBadge = tpl.recommended
      ? `<span class="tb-template-badge">${t("tb.recommended")}</span>`
      : "";
    const cls = tpl.recommended ? "tb-template-card recommended" : "tb-template-card";
    const icon = TEMPLATE_ICONS[tpl.id] || "\u{1F4CB}";

    return `
      <div class="${cls}" data-tpl-id="${tpl.id}">
        <div class="tb-template-icon">${icon}</div>
        <div class="tb-template-info">
          <div class="tb-template-name">${t(tpl.nameKey)} ${recBadge}</div>
          <div class="tb-template-desc">${t(tpl.descKey)}</div>
        </div>
        <div class="tb-template-count">${countLabel}</div>
      </div>
    `;
  }).join("");

  // Custom card
  const customCard = `
    <div class="tb-template-card" data-action="custom">
      <div class="tb-template-icon">\u{2699}\uFE0F</div>
      <div class="tb-template-info">
        <div class="tb-template-name">${t("tb.tpl.custom")}</div>
        <div class="tb-template-desc">${t("tb.tpl.custom.desc")}</div>
      </div>
    </div>
  `;

  _container.innerHTML = `
    <div class="tb-wizard">
      ${_stepIndicator()}
      <div class="tb-screen-title">${t("tb.step1.title")}</div>
      <div class="tb-screen-desc">${t("tb.step1.desc")}</div>
      <div class="tb-template-list">
        ${templateCards}
        ${customCard}
      </div>
      <div style="text-align:center;">
        <button class="tb-skip-link" data-action="skip">${t("tb.skip")}</button>
      </div>
    </div>
  `;

  // Bind events
  _container.querySelectorAll("[data-tpl-id]").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedTemplateId = el.dataset.tplId;
      state.currentStep = 2;
      _renderCurrentStep();
    });
  });

  _container.querySelector("[data-action='custom']")?.addEventListener("click", () => {
    state.selectedTemplateId = null;
    state.roleSelections = {};
    state.prefilled = false;
    state.currentStep = 3;
    _renderCurrentStep();
  });

  _container.querySelector("[data-action='skip']")?.addEventListener("click", () => {
    navigateTo("#/");
  });
}

// ══════════════════════════════════════════
// Screen 2: Member Confirmation
// ══════════════════════════════════════════

function _renderStep2() {
  const tpl = getTemplateById(state.selectedTemplateId);
  if (!tpl) { state.currentStep = 1; _renderCurrentStep(); return; }

  const memberRows = tpl.members.map((m) => {
    const role = getRoleById(m.roleId);
    if (!role) return "";
    const tools = role.defaultTools.map((tid) => getToolLabel(tid)).join(" / ");
    const icon = ROLE_ICONS[m.roleId] || "\u{1F464}";
    return `
      <div class="tb-member-card">
        <div class="tb-member-avatar" style="background:${AVATAR_COLORS[0]}">${icon}</div>
        <div class="tb-member-info">
          <div class="tb-member-name">${t(role.nameKey)} x ${m.count}</div>
          <div class="tb-member-role">${t("tb.tools")}: ${tools}</div>
        </div>
      </div>
    `;
  }).join("");

  _container.innerHTML = `
    <div class="tb-wizard">
      ${_stepIndicator()}
      <div class="tb-screen-title">${t(tpl.nameKey)}${t("tb.step2.title_suffix")}</div>
      <div class="tb-screen-desc">${t("tb.step2.desc")}</div>
      <div class="tb-member-list">
        ${memberRows}
      </div>
      <div class="tb-wizard-nav">
        <button class="btn-secondary" data-action="back">${t("tb.back")}</button>
        <div class="tb-wizard-nav-right">
          <button class="btn-secondary" data-action="customize">${t("tb.step2.customize")}</button>
          <button class="btn-primary" data-action="create">${t("tb.step2.create")}</button>
        </div>
      </div>
    </div>
  `;

  _container.querySelector("[data-action='back']")?.addEventListener("click", () => {
    state.currentStep = 1;
    _renderCurrentStep();
  });

  _container.querySelector("[data-action='customize']")?.addEventListener("click", () => {
    // Pre-fill roleSelections from template
    state.roleSelections = {};
    for (const m of tpl.members) {
      state.roleSelections[m.roleId] = m.count;
    }
    state.prefilled = true;
    state.currentStep = 3;
    _renderCurrentStep();
  });

  _container.querySelector("[data-action='create']")?.addEventListener("click", () => {
    _createFromTemplate(tpl);
  });
}

function _createFromTemplate(tpl) {
  const selections = tpl.members.map((m) => ({ roleId: m.roleId, count: m.count }));
  state.createdTeam = createTeam(selections);
  state.currentStep = 4;
  _renderCurrentStep();
}

// ══════════════════════════════════════════
// Screen 3: Role Pickup
// ══════════════════════════════════════════

function _renderStep3() {
  const roleItems = ROLES.map((role) => {
    const selected = state.roleSelections[role.id] != null;
    const count = state.roleSelections[role.id] || 1;
    const icon = ROLE_ICONS[role.id] || "\u{1F464}";
    const cls = selected ? "tb-role-item selected" : "tb-role-item";
    const toolTags = role.defaultTools.map((tid) =>
      `<span class="tb-tool-tag">${getToolLabel(tid)}</span>`
    ).join("");

    const options = [1, 2, 3].map((n) =>
      `<option value="${n}" ${n === count ? "selected" : ""}>${n}</option>`
    ).join("");

    return `
      <div class="${cls}" data-role-id="${role.id}">
        <div class="tb-role-checkbox">\u2713</div>
        <div class="tb-role-info">
          <div class="tb-role-name">${icon} ${t(role.nameKey)}</div>
          <div class="tb-role-desc">${t(role.descKey)}</div>
          <div class="tb-role-tools">${toolTags}</div>
        </div>
        <select class="tb-role-count-select" data-count-for="${role.id}" ${selected ? "" : "style='visibility:hidden'"}>
          ${options}
        </select>
      </div>
    `;
  }).join("");

  const hasSelection = Object.keys(state.roleSelections).length > 0;

  _container.innerHTML = `
    <div class="tb-wizard">
      ${_stepIndicator()}
      <div class="tb-screen-title">${t("tb.step3.title")}</div>
      <div class="tb-screen-desc">${t("tb.step3.desc")}</div>
      <div class="tb-role-grid">
        ${roleItems}
      </div>
      <div class="tb-wizard-nav">
        <button class="btn-secondary" data-action="back">${t("tb.back")}</button>
        <button class="btn-primary" data-action="create" ${hasSelection ? "" : "disabled"}>${t("tb.step3.create")}</button>
      </div>
    </div>
  `;

  // Bind role toggle
  _container.querySelectorAll(".tb-role-item").forEach((el) => {
    el.addEventListener("click", (e) => {
      // Don't toggle when clicking the select dropdown
      if (e.target.tagName === "SELECT" || e.target.tagName === "OPTION") return;
      const roleId = el.dataset.roleId;
      if (state.roleSelections[roleId] != null) {
        delete state.roleSelections[roleId];
      } else {
        state.roleSelections[roleId] = 1;
      }
      _renderCurrentStep();
    });
  });

  // Bind count selects
  _container.querySelectorAll(".tb-role-count-select").forEach((sel) => {
    sel.addEventListener("change", (e) => {
      const roleId = sel.dataset.countFor;
      if (state.roleSelections[roleId] != null) {
        state.roleSelections[roleId] = parseInt(e.target.value, 10);
      }
    });
    // Prevent click propagation
    sel.addEventListener("click", (e) => e.stopPropagation());
  });

  // Back
  _container.querySelector("[data-action='back']")?.addEventListener("click", () => {
    if (state.selectedTemplateId && state.prefilled) {
      state.currentStep = 2;
    } else if (state.selectedTemplateId) {
      state.currentStep = 2;
    } else {
      state.currentStep = 1;
    }
    _renderCurrentStep();
  });

  // Create
  _container.querySelector("[data-action='create']")?.addEventListener("click", () => {
    const selections = Object.entries(state.roleSelections).map(([roleId, count]) => ({
      roleId,
      count,
    }));
    if (selections.length === 0) return;
    state.createdTeam = createTeam(selections);
    state.currentStep = 4;
    _renderCurrentStep();
  });
}

// ══════════════════════════════════════════
// Screen 4: Creation Complete
// ══════════════════════════════════════════

function _renderStep4() {
  const team = state.createdTeam;
  if (!team || !team.members) {
    state.currentStep = 1;
    _renderCurrentStep();
    return;
  }

  const memberCards = team.members.map((m, idx) => {
    const role = getRoleById(m.roleId);
    const roleName = role ? t(role.nameKey) : m.roleId;
    const icon = ROLE_ICONS[m.roleId] || "\u{1F464}";
    const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
    const initial = m.displayName.charAt(0);
    const toolTags = m.tools.map((tid) =>
      `<span class="tb-tool-tag">${getToolLabel(tid)}</span>`
    ).join("");

    return `
      <div class="tb-member-card">
        <div class="tb-member-avatar" style="background:${color}">${initial}</div>
        <div class="tb-member-info">
          <div class="tb-member-name">${m.displayName}</div>
          <div class="tb-member-role">${icon} ${roleName}</div>
          <div class="tb-member-tools-row">${toolTags}</div>
        </div>
      </div>
    `;
  }).join("");

  _container.innerHTML = `
    <div class="tb-wizard">
      ${_stepIndicator()}
      <div class="tb-complete-icon">\u{1F389}</div>
      <div class="tb-complete-title">${t("tb.step4.title")}</div>
      <div class="tb-member-list">
        ${memberCards}
      </div>
      <div class="tb-wizard-nav" style="justify-content:center;">
        <button class="btn-primary" data-action="chat">${t("tb.step4.chat")}</button>
        <button class="btn-secondary" data-action="edit">${t("tb.step4.edit")}</button>
      </div>
    </div>
  `;

  _container.querySelector("[data-action='chat']")?.addEventListener("click", () => {
    navigateTo("#/chat");
  });

  _container.querySelector("[data-action='edit']")?.addEventListener("click", () => {
    navigateTo("#/team-edit");
  });
}
