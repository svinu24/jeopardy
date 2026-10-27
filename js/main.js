/* Entry point: wires data, state and UI modules together. */
(function (J) {
  "use strict";

  J.data = window.JEOPARDY_DATA;

  const progressEl = document.getElementById("progress");
  const resetBtn = document.getElementById("reset-btn");
  const confirmOverlay = document.getElementById("confirm-overlay");
  const confirmOk = document.getElementById("confirm-ok");
  const confirmCancel = document.getElementById("confirm-cancel");

  function updateProgress(state) {
    const keys = J.playableKeys();
    const played = keys.filter((key) => state.done[key]).length;
    progressEl.textContent = played + " / " + keys.length + " played";
  }

  function openResetConfirm() {
    J.ui.show(confirmOverlay);
    confirmCancel.focus(); // safe default
  }

  function closeResetConfirm() {
    J.ui.hide(confirmOverlay);
    resetBtn.focus();
  }

  resetBtn.addEventListener("click", openResetConfirm);
  confirmCancel.addEventListener("click", closeResetConfirm);
  confirmOk.addEventListener("click", () => {
    J.store.reset();
    closeResetConfirm();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && J.ui.isOpen(confirmOverlay)) closeResetConfirm();
  });

  J.board.render();
  J.store.subscribe(J.board.sync);
  J.store.subscribe(updateProgress);
  J.store.subscribe(J.teams.renderScoreboard);

  if (J.store.state.teams.length === 0) J.teams.openSetup();
})((window.Jeopardy = window.Jeopardy || {}));
