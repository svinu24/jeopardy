/* Team setup dialog and the always-visible scoreboard. */
(function (J) {
  "use strict";

  const MIN_TEAMS = 2;
  const MAX_TEAMS = 6;
  const ADJUST_STEP = 100;
  const COLORS = ["#f5c542", "#4dd0e1", "#ff7ab6", "#8bd450", "#b49bff", "#ff9f43"];

  const scoreboardEl = document.getElementById("scoreboard");
  const overlay = document.getElementById("setup-overlay");
  const listEl = document.getElementById("team-inputs");
  const addBtn = document.getElementById("team-add");
  const saveBtn = document.getElementById("setup-save");
  const cancelBtn = document.getElementById("setup-cancel");
  const teamsBtn = document.getElementById("teams-btn");

  let draft = []; // [{ id, name }] while the dialog is open
  const lastScores = new Map(); // teamId -> score, used to animate changes

  J.teamColor = (index) => COLORS[index % COLORS.length];

  // A team's score is its manual adjustments plus every correct/wrong mark.
  J.teamScore = function (state, teamId) {
    const team = state.teams.find((t) => t.id === teamId);
    let score = team ? team.adjust : 0;
    Object.keys(state.results).forEach((key) => {
      const mark = state.results[key][teamId];
      if (!mark) return;
      const [col, row] = key.split("-").map(Number);
      score += mark * J.getClue(col, row).value;
    });
    return score;
  };

  function newId() {
    return "t" + Math.random().toString(36).slice(2, 9);
  }

  /* ---------- Setup dialog ---------- */

  function openSetup() {
    const teams = J.store.state.teams;
    const firstRun = teams.length === 0;
    draft = firstRun
      ? [{ id: newId(), name: "Team 1" }, { id: newId(), name: "Team 2" }]
      : teams.map((t) => ({ id: t.id, name: t.name }));

    cancelBtn.hidden = firstRun; // the first setup has to be completed
    saveBtn.textContent = firstRun ? "Start Game" : "Save Teams";
    renderDraft();
    J.ui.show(overlay);
    listEl.querySelector("input").focus();
  }

  function closeSetup() {
    J.ui.hide(overlay);
  }

  function renderDraft() {
    listEl.textContent = "";
    draft.forEach((team, i) => {
      const li = document.createElement("li");
      li.className = "team-input";
      li.style.setProperty("--team-color", J.teamColor(i));

      const swatch = document.createElement("span");
      swatch.className = "team-swatch";

      const input = document.createElement("input");
      input.type = "text";
      input.value = team.name;
      input.maxLength = 24;
      input.placeholder = "Team " + (i + 1);
      input.setAttribute("aria-label", "Team " + (i + 1) + " name");
      input.addEventListener("input", () => {
        team.name = input.value;
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") save();
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "icon-btn";
      remove.textContent = "✕";
      remove.setAttribute("aria-label", "Remove " + (team.name || "team"));
      remove.disabled = draft.length <= MIN_TEAMS;
      remove.addEventListener("click", () => {
        draft.splice(i, 1);
        renderDraft();
      });

      li.append(swatch, input, remove);
      listEl.appendChild(li);
    });
    addBtn.disabled = draft.length >= MAX_TEAMS;
  }

  function addTeam() {
    if (draft.length >= MAX_TEAMS) return;
    draft.push({ id: newId(), name: "Team " + (draft.length + 1) });
    renderDraft();
    const inputs = listEl.querySelectorAll("input");
    inputs[inputs.length - 1].select();
  }

  function save() {
    J.store.update((state) => {
      const previous = new Map(state.teams.map((t) => [t.id, t]));
      state.teams = draft.map((t, i) => ({
        id: t.id,
        name: t.name.trim() || "Team " + (i + 1),
        adjust: previous.has(t.id) ? previous.get(t.id).adjust : 0,
      }));

      // Drop marks for removed teams so scores stay consistent.
      const ids = new Set(state.teams.map((t) => t.id));
      Object.keys(state.results).forEach((key) => {
        const marks = state.results[key];
        Object.keys(marks).forEach((id) => {
          if (!ids.has(id)) delete marks[id];
        });
        if (Object.keys(marks).length === 0) delete state.results[key];
      });
    });
    closeSetup();
  }

  /* ---------- Scoreboard ---------- */

  function adjust(teamId, delta) {
    J.store.update((state) => {
      const team = state.teams.find((t) => t.id === teamId);
      if (team) team.adjust += delta;
    });
  }

  function renderScoreboard(state) {
    const scores = state.teams.map((t) => J.teamScore(state, t.id));
    const best = Math.max(0, ...scores);
    scoreboardEl.textContent = "";

    state.teams.forEach((team, i) => {
      const score = scores[i];
      const card = document.createElement("div");
      card.className = "team-card";
      card.style.setProperty("--team-color", J.teamColor(i));
      card.classList.toggle("leader", best > 0 && score === best);

      const name = document.createElement("div");
      name.className = "team-name";
      name.textContent = team.name;
      name.title = team.name;

      const scoreEl = document.createElement("div");
      scoreEl.className = "team-score";
      scoreEl.textContent = score.toLocaleString();
      scoreEl.classList.toggle("negative", score < 0);
      if (lastScores.has(team.id) && lastScores.get(team.id) !== score) {
        scoreEl.classList.add(score > lastScores.get(team.id) ? "bump-up" : "bump-down");
      }
      lastScores.set(team.id, score);

      const minus = document.createElement("button");
      minus.type = "button";
      minus.className = "icon-btn adj-minus";
      minus.textContent = "−";
      minus.setAttribute("aria-label", "Subtract " + ADJUST_STEP + " from " + team.name);
      minus.addEventListener("click", () => adjust(team.id, -ADJUST_STEP));

      const plus = document.createElement("button");
      plus.type = "button";
      plus.className = "icon-btn adj-plus";
      plus.textContent = "+";
      plus.setAttribute("aria-label", "Add " + ADJUST_STEP + " to " + team.name);
      plus.addEventListener("click", () => adjust(team.id, ADJUST_STEP));

      card.append(name, minus, scoreEl, plus);
      scoreboardEl.appendChild(card);
    });
  }

  addBtn.addEventListener("click", addTeam);
  saveBtn.addEventListener("click", save);
  cancelBtn.addEventListener("click", closeSetup);
  teamsBtn.addEventListener("click", openSetup);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && J.ui.isOpen(overlay) && !cancelBtn.hidden) closeSetup();
  });

  J.teams = { openSetup, renderScoreboard };
})((window.Jeopardy = window.Jeopardy || {}));
