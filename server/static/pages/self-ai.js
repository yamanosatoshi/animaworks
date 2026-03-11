// ── Self-AI Diagnostic Page ──────────────────
import { t } from "/shared/i18n.js";
import { api } from "../modules/api.js";

let _state = null;

// ── State ──────────────────────────────────
function initState() {
  return {
    screen: "home", // home | quiz | result | edit
    questions: [],
    axes: [],
    questionVersion: "",
    answers: {},
    currentQuestionIndex: 0,
    profiles: [],
    currentProfile: null,
    loading: false,
    error: null,
  };
}

// ── Render Entry ────────────────────────────
export async function render(container) {
  _state = initState();
  _state.container = container;
  await renderHome();
}

export function destroy() {
  _state = null;
}

// ── Home Screen ─────────────────────────────
async function renderHome() {
  const c = _state.container;
  c.innerHTML = `
    <div class="page-header">
      <h2>${t("self_ai.page_title")}</h2>
      <p class="text-muted">${t("self_ai.page_subtitle")}</p>
    </div>
    <div class="self-ai-home">
      <div class="card self-ai-start-card">
        <div class="card-body" style="text-align:center; padding:2rem;">
          <div class="self-ai-icon">&#x1F9E0;</div>
          <h3>${t("self_ai.page_title")}</h3>
          <p>${t("self_ai.page_subtitle")}</p>
          <button class="btn btn-primary btn-lg" id="selfAiStartBtn">
            ${t("self_ai.start_diagnosis")}
          </button>
        </div>
      </div>
      <div class="card" style="margin-top:1.5rem;">
        <div class="card-header">${t("self_ai.past_results")}</div>
        <div class="card-body" id="selfAiProfileList">
          <div class="loading-placeholder">${t("common.loading")}</div>
        </div>
      </div>
    </div>`;

  c.querySelector("#selfAiStartBtn").addEventListener("click", startQuiz);
  await loadProfiles();
}

async function loadProfiles() {
  try {
    const data = await api("/api/self-ai/profiles");
    _state.profiles = data.profiles || [];
    renderProfileList();
  } catch {
    document.getElementById("selfAiProfileList").innerHTML =
      `<p class="text-muted">${t("self_ai.load_failed")}</p>`;
  }
}

function renderProfileList() {
  const el = document.getElementById("selfAiProfileList");
  if (!_state.profiles.length) {
    el.innerHTML = `<p class="text-muted">${t("self_ai.no_profiles")}</p>`;
    return;
  }
  el.innerHTML = _state.profiles
    .map(
      (p) => `
    <div class="self-ai-profile-item" data-id="${p.id}">
      <div class="profile-item-info">
        <span class="profile-item-id">${p.id}</span>
        <span class="profile-item-date">${new Date(p.created_at).toLocaleString()}</span>
      </div>
      <div class="profile-item-scores">
        ${Object.entries(p.axis_scores)
          .map(
            ([axis, score]) =>
              `<span class="axis-badge" title="${t("self_ai.axis." + axis)}">${t("self_ai.axis." + axis)}: ${score}</span>`
          )
          .join("")}
      </div>
      <button class="btn btn-sm btn-outline" data-view="${p.id}">${t("self_ai.view_profile")}</button>
    </div>`
    )
    .join("");

  el.querySelectorAll("[data-view]").forEach((btn) =>
    btn.addEventListener("click", () => viewProfile(btn.dataset.view))
  );
}

async function viewProfile(profileId) {
  try {
    const data = await api(`/api/self-ai/profiles/${profileId}`);
    _state.currentProfile = data;
    renderResult();
  } catch {
    _state.error = t("self_ai.load_failed");
  }
}

// ── Quiz Screen ─────────────────────────────
async function startQuiz() {
  _state.loading = true;
  _state.container.innerHTML = `<div class="loading-placeholder">${t("common.loading")}</div>`;

  try {
    const data = await api("/api/self-ai/questions");
    _state.questions = data.questions;
    _state.axes = data.axes;
    _state.questionVersion = data.version;
    _state.answers = {};
    _state.currentQuestionIndex = 0;
    _state.screen = "quiz";
    renderQuiz();
  } catch {
    _state.container.innerHTML = `<p class="text-muted">${t("self_ai.load_failed")}</p>`;
  }
}

function renderQuiz() {
  const c = _state.container;
  const q = _state.questions[_state.currentQuestionIndex];
  const total = _state.questions.length;
  const current = _state.currentQuestionIndex + 1;
  const progress = Math.round((current / total) * 100);
  const locale = document.documentElement.lang === "en" ? "en" : "ja";
  const questionText = locale === "en" ? q.text_en : q.text_ja;
  const selectedAnswer = _state.answers[q.id];
  const isFirst = _state.currentQuestionIndex === 0;
  const isLast = _state.currentQuestionIndex === total - 1;
  const allAnswered = _state.questions.every((q) => _state.answers[q.id] != null);

  const likertLabels = [
    t("self_ai.strongly_disagree"),
    t("self_ai.disagree"),
    t("self_ai.neutral"),
    t("self_ai.agree"),
    t("self_ai.strongly_agree"),
  ];

  c.innerHTML = `
    <div class="page-header">
      <h2>${t("self_ai.page_title")}</h2>
    </div>
    <div class="self-ai-quiz">
      <div class="quiz-progress">
        <div class="quiz-progress-text">${t("self_ai.question_progress").replace("{current}", current).replace("{total}", total)}</div>
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width:${progress}%"></div>
        </div>
      </div>
      <div class="quiz-axis-label">${t("self_ai.axis." + q.axis)}</div>
      <div class="quiz-question-card card">
        <div class="card-body">
          <p class="quiz-question-text">${questionText}</p>
          <div class="likert-scale">
            ${likertLabels
              .map(
                (label, i) => `
              <label class="likert-option ${selectedAnswer === i + 1 ? "selected" : ""}">
                <input type="radio" name="answer" value="${i + 1}" ${selectedAnswer === i + 1 ? "checked" : ""}>
                <span class="likert-circle">${i + 1}</span>
                <span class="likert-label">${label}</span>
              </label>`
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="quiz-nav">
        <button class="btn btn-outline" id="quizPrev" ${isFirst ? "disabled" : ""}>${t("self_ai.prev")}</button>
        <div class="quiz-dots">
          ${_state.questions.map((qq, i) => `<span class="quiz-dot ${i === _state.currentQuestionIndex ? "current" : ""} ${_state.answers[qq.id] != null ? "answered" : ""}"></span>`).join("")}
        </div>
        ${
          isLast
            ? `<button class="btn btn-primary" id="quizSubmit" ${!allAnswered ? "disabled" : ""}>${t("self_ai.submit")}</button>`
            : `<button class="btn btn-primary" id="quizNext">${t("self_ai.next")}</button>`
        }
      </div>
    </div>`;

  // Event listeners
  c.querySelectorAll('input[name="answer"]').forEach((radio) =>
    radio.addEventListener("change", (e) => {
      _state.answers[q.id] = parseInt(e.target.value);
      // Auto-advance after short delay
      setTimeout(() => {
        if (!isLast) {
          _state.currentQuestionIndex++;
          renderQuiz();
        } else {
          renderQuiz(); // Re-render to enable submit
        }
      }, 300);
    })
  );

  const prevBtn = c.querySelector("#quizPrev");
  if (prevBtn) prevBtn.addEventListener("click", () => { _state.currentQuestionIndex--; renderQuiz(); });

  const nextBtn = c.querySelector("#quizNext");
  if (nextBtn) nextBtn.addEventListener("click", () => { _state.currentQuestionIndex++; renderQuiz(); });

  const submitBtn = c.querySelector("#quizSubmit");
  if (submitBtn) submitBtn.addEventListener("click", submitQuiz);
}

async function submitQuiz() {
  const submitBtn = _state.container.querySelector("#quizSubmit");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = t("self_ai.submitting");
  }

  try {
    const data = await api("/api/self-ai/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: _state.answers }),
    });
    _state.currentProfile = {
      id: data.profile_id,
      axis_scores: data.axis_scores,
      behavioral_profile: data.behavioral_profile,
    };
    _state.screen = "result";
    renderResult();
  } catch {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = t("self_ai.submit");
    }
    _state.error = t("self_ai.diagnosis_failed");
  }
}

// ── Result Screen ───────────────────────────
function renderResult() {
  const c = _state.container;
  const profile = _state.currentProfile;
  if (!profile) return;

  const scores = profile.axis_scores;
  const bp = profile.behavioral_profile;

  // Axis score bars
  const axisBars = Object.entries(scores)
    .map(
      ([axis, score]) => `
    <div class="axis-row">
      <div class="axis-label">${t("self_ai.axis." + axis)}</div>
      <div class="axis-bar-container">
        <div class="axis-bar" style="width:${score}%"></div>
      </div>
      <div class="axis-value">${score}</div>
    </div>`
    )
    .join("");

  // Profile parameters (exclude axis_scores nested object)
  const profileParams = Object.entries(bp)
    .filter(([k]) => k !== "axis_scores")
    .map(([key, value]) => {
      let displayValue = value;
      if (typeof value === "boolean") {
        displayValue = value ? "ON" : "OFF";
      } else if (typeof value === "string" && ["very_low", "low", "moderate", "high", "very_high"].includes(value)) {
        displayValue = t("self_ai.level." + value);
      }
      const paramKey = "self_ai.param." + key;
      const label = t(paramKey) !== paramKey ? t(paramKey) : key;
      return `
      <div class="profile-param">
        <span class="param-label">${label}</span>
        <span class="param-value ${typeof value === "boolean" ? (value ? "param-on" : "param-off") : ""}">${displayValue}</span>
      </div>`;
    })
    .join("");

  c.innerHTML = `
    <div class="page-header">
      <h2>${t("self_ai.result_title")}</h2>
    </div>
    <div class="self-ai-result">
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">${t("self_ai.axis_scores")}</div>
        <div class="card-body">
          <div class="axis-chart">${axisBars}</div>
        </div>
      </div>
      <div class="card" style="margin-bottom:1.5rem;">
        <div class="card-header">${t("self_ai.behavioral_profile")}</div>
        <div class="card-body">
          <div class="profile-params">${profileParams}</div>
        </div>
      </div>
      <div class="result-actions">
        <button class="btn btn-outline" id="resultBack">${t("self_ai.past_results")}</button>
        <button class="btn btn-primary" id="resultEdit">${t("self_ai.edit_profile")}</button>
        <button class="btn btn-outline" id="resultRestart">${t("self_ai.restart_diagnosis")}</button>
      </div>
    </div>`;

  c.querySelector("#resultBack").addEventListener("click", async () => {
    _state.screen = "home";
    await renderHome();
  });
  c.querySelector("#resultEdit").addEventListener("click", () => renderEdit());
  c.querySelector("#resultRestart").addEventListener("click", () => startQuiz());
}

// ── Edit Screen ─────────────────────────────
function renderEdit() {
  const c = _state.container;
  const profile = _state.currentProfile;
  if (!profile) return;

  const bp = profile.behavioral_profile;
  const editableParams = Object.entries(bp).filter(([k]) => k !== "axis_scores");

  const formFields = editableParams
    .map(([key, value]) => {
      const paramKey = "self_ai.param." + key;
      const label = t(paramKey) !== paramKey ? t(paramKey) : key;

      if (typeof value === "boolean") {
        return `
        <div class="edit-field">
          <label>${label}</label>
          <select name="${key}" class="edit-select">
            <option value="true" ${value ? "selected" : ""}>ON</option>
            <option value="false" ${!value ? "selected" : ""}>OFF</option>
          </select>
        </div>`;
      }
      if (["very_low", "low", "moderate", "high", "very_high"].includes(value)) {
        const levels = ["very_low", "low", "moderate", "high", "very_high"];
        return `
        <div class="edit-field">
          <label>${label}</label>
          <select name="${key}" class="edit-select">
            ${levels.map((l) => `<option value="${l}" ${value === l ? "selected" : ""}>${t("self_ai.level." + l)}</option>`).join("")}
          </select>
        </div>`;
      }
      if (["proactive", "conservative"].includes(value)) {
        return `
        <div class="edit-field">
          <label>${label}</label>
          <select name="${key}" class="edit-select">
            <option value="proactive" ${value === "proactive" ? "selected" : ""}>Proactive</option>
            <option value="conservative" ${value === "conservative" ? "selected" : ""}>Conservative</option>
          </select>
        </div>`;
      }
      if (["casual", "formal"].includes(value)) {
        return `
        <div class="edit-field">
          <label>${label}</label>
          <select name="${key}" class="edit-select">
            <option value="casual" ${value === "casual" ? "selected" : ""}>Casual</option>
            <option value="formal" ${value === "formal" ? "selected" : ""}>Formal</option>
          </select>
        </div>`;
      }
      if (["flexible", "structured"].includes(value)) {
        return `
        <div class="edit-field">
          <label>${label}</label>
          <select name="${key}" class="edit-select">
            <option value="flexible" ${value === "flexible" ? "selected" : ""}>Flexible</option>
            <option value="structured" ${value === "structured" ? "selected" : ""}>Structured</option>
          </select>
        </div>`;
      }
      if (["collaborative", "directive"].includes(value)) {
        return `
        <div class="edit-field">
          <label>${label}</label>
          <select name="${key}" class="edit-select">
            <option value="collaborative" ${value === "collaborative" ? "selected" : ""}>Collaborative</option>
            <option value="directive" ${value === "directive" ? "selected" : ""}>Directive</option>
          </select>
        </div>`;
      }
      return "";
    })
    .join("");

  c.innerHTML = `
    <div class="page-header">
      <h2>${t("self_ai.edit_profile")}</h2>
    </div>
    <div class="self-ai-edit">
      <div class="card">
        <div class="card-header">${t("self_ai.behavioral_profile")}</div>
        <div class="card-body">
          <form id="editProfileForm" class="edit-form">
            ${formFields}
          </form>
        </div>
      </div>
      <div class="edit-actions" style="margin-top:1rem;">
        <button class="btn btn-outline" id="editCancel">${t("self_ai.prev")}</button>
        <button class="btn btn-primary" id="editSave">${t("self_ai.save_changes")}</button>
        <span id="editStatus" class="edit-status"></span>
      </div>
    </div>`;

  c.querySelector("#editCancel").addEventListener("click", () => renderResult());
  c.querySelector("#editSave").addEventListener("click", saveProfile);
}

async function saveProfile() {
  const form = _state.container.querySelector("#editProfileForm");
  const saveBtn = _state.container.querySelector("#editSave");
  const statusEl = _state.container.querySelector("#editStatus");

  saveBtn.disabled = true;
  saveBtn.textContent = t("self_ai.saving");

  const parameters = {};
  form.querySelectorAll(".edit-select").forEach((sel) => {
    let val = sel.value;
    if (val === "true") val = true;
    else if (val === "false") val = false;
    parameters[sel.name] = val;
  });

  try {
    const data = await api(`/api/self-ai/profiles/${_state.currentProfile.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parameters }),
    });
    _state.currentProfile = data;
    statusEl.textContent = t("self_ai.saved");
    statusEl.className = "edit-status success";
    saveBtn.textContent = t("self_ai.save_changes");
    saveBtn.disabled = false;
  } catch {
    statusEl.textContent = t("self_ai.save_failed");
    statusEl.className = "edit-status error";
    saveBtn.textContent = t("self_ai.save_changes");
    saveBtn.disabled = false;
  }
}
