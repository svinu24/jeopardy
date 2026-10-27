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

  let current = null; // { key, clue, revealed }
  let returnFocus = null;

  function renderQuestion(clue) {
    if (clue.pending) {
      return '<p class="clue-pending">This clue hasn\'t been written yet.</p>';
    }
    return "<p>" + J.ui.format(clue.question) + "</p>";
  }

  function renderAnswer(clue) {
    if (Array.isArray(clue.answer)) {
      const items = clue.answer.map((item) => {
        // Bold a leading "Label:" so list answers scan quickly.
        const html = J.ui.format(item).replace(/^([^:]{1,40}):/, "<strong>$1:</strong>");
        return "<li>" + html + "</li>";
      });
      return "<ul>" + items.join("") + "</ul>";
    }
    return "<p>" + J.ui.format(clue.answer) + "</p>";
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
    if (current.revealed) {
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
