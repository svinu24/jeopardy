/* Clue modal: shows a question, reveals the answer, and records the clue as played. */
(function (J) {
  "use strict";

  const overlay = document.getElementById("clue-overlay");
  const categoryEl = document.getElementById("clue-category");
  const valueEl = document.getElementById("clue-value");
  const questionEl = document.getElementById("clue-question");
  const answerEl = document.getElementById("clue-answer");
  const revealBtn = document.getElementById("clue-reveal");
  const closeBtn = document.getElementById("clue-close");
  const scoringEl = document.getElementById("clue-scoring");

  let current = null; // { key, clue, revealed }
  let returnFocus = null;

  function renderQuestion(clue) {
    if (clue.pending) {
      return '<p class="clue-pending">This clue hasn\'t been written yet.</p>';
    }

    let html = "";
    // Finish the Lyric: either a written excerpt or a cue for the host to play the song.
    if (clue.cue) {
      html +=
        '<div class="clue-cue"><span class="clue-cue-label">🎵 Playback cue</span>' +
        "<p>" + J.ui.format(clue.cue) + "</p></div>";
    }
    if (clue.lyric) {
      html +=
        '<p class="clue-lyric-label">Finish the lyric</p>' +
        '<blockquote class="clue-lyric">' + J.ui.format(clue.lyric).replace(/\n/g, "<br>") + "…</blockquote>";
    }
    if (clue.question) html += "<p>" + J.ui.format(clue.question) + "</p>";
    return html;
  }

  function renderAnswer(clue) {
    if (Array.isArray(clue.answer)) {
      const items = clue.answer.map((item) => {
        // Bold a leading "Label:" so list answers scan quickly.
        const html = J.ui.format(item).replace(/^([^:]{1,40}):/, "<strong>$1:</strong>");
        return "<li>" + html + "</li>";
      });
      return "<ul>" + items.join("") + "</ul>" + renderCredit(clue);
    }
    return "<p>" + J.ui.format(clue.answer) + "</p>" + renderCredit(clue);
  }

  // Song and artist stay hidden until the answer is revealed.
  function renderCredit(clue) {
    const parts = [];
    if (clue.song) parts.push("“" + J.ui.format(clue.song) + "”");
    if (clue.artist) parts.push(J.ui.format(clue.artist));
    return parts.length ? '<p class="clue-credit">' + parts.join(" — ") + "</p>" : "";
  }

  // One chip per team with toggleable "correct" and "wrong" buttons.
  function renderScoring() {
    scoringEl.textContent = "";
    if (!current || current.clue.pending) return;

    const state = J.store.state;
    const marks = state.results[current.key] || {};
    const value = current.clue.value;

    state.teams.forEach((team, i) => {
      const chip = document.createElement("div");
      chip.className = "score-chip";
      chip.style.setProperty("--team-color", J.teamColor(i));

      const name = document.createElement("span");
      name.className = "score-chip-name";
      name.textContent = team.name;
      name.title = team.name;

      chip.append(
        name,
        markButton(team, 1, "✓ +" + value, "Award " + value + " to " + team.name, marks),
        markButton(team, -1, "✗ −" + value, "Deduct " + value + " from " + team.name, marks)
      );
      scoringEl.appendChild(chip);
    });
  }

  function markButton(team, mark, label, ariaLabel, marks) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mark-btn " + (mark > 0 ? "correct" : "wrong");
    btn.textContent = label;
    btn.setAttribute("aria-label", ariaLabel);
    const active = marks[team.id] === mark;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
    btn.addEventListener("click", () => toggleMark(team.id, mark));
    return btn;
  }

  // Clicking the same mark again undoes it; clicking the other one flips it.
  function toggleMark(teamId, mark) {
    const key = current.key;
    J.store.update((state) => {
      const marks = state.results[key] || (state.results[key] = {});
      if (marks[teamId] === mark) delete marks[teamId];
      else marks[teamId] = mark;
      if (Object.keys(marks).length === 0) delete state.results[key];
    });
    renderScoring();
  }

  function open(col, row, tile) {
    const category = J.data.categories[col];
    const clue = category.clues[row];
    current = { key: J.clueKey(col, row), clue: clue, revealed: false };
    returnFocus = tile;

    categoryEl.textContent = category.name;
    valueEl.textContent = clue.value;
    questionEl.innerHTML = renderQuestion(clue);
    answerEl.innerHTML = clue.pending ? "" : renderAnswer(clue);
    answerEl.hidden = true;
    revealBtn.hidden = Boolean(clue.pending);
    closeBtn.textContent = "Back to Board";
    renderScoring();

    J.ui.show(overlay);
    (clue.pending ? closeBtn : revealBtn).focus();
  }

  function reveal() {
    if (!current || current.revealed || current.clue.pending) return;
    current.revealed = true;
    answerEl.hidden = false;
    revealBtn.hidden = true;
    closeBtn.textContent = "Done";
    closeBtn.focus();
  }

  function close() {
    if (!current) return;
    const key = current.key;
    const scored = Boolean(J.store.state.results[key]);
    if (current.revealed || scored) {
      J.store.update((state) => {
        state.done[key] = true;
      });
    }
    current = null;
    J.ui.hide(overlay);
    if (returnFocus) returnFocus.focus();
  }

  revealBtn.addEventListener("click", reveal);
  closeBtn.addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (!current) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "r" || event.key === "R") {
      reveal();
    }
  });

  J.clue = { open, close };
})((window.Jeopardy = window.Jeopardy || {}));
