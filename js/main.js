/* Entry point: wires data, state and UI modules together. */
(function (J) {
  "use strict";

  J.data = window.JEOPARDY_DATA;

  const progressEl = document.getElementById("progress");

  function updateProgress(state) {
    const keys = J.playableKeys();
    const played = keys.filter((key) => state.done[key]).length;
    progressEl.textContent = played + " / " + keys.length + " played";
  }

  J.board.render();
  J.store.subscribe(J.board.sync);
  J.store.subscribe(updateProgress);
  J.store.subscribe(J.teams.renderScoreboard);

  if (J.store.state.teams.length === 0) J.teams.openSetup();
})((window.Jeopardy = window.Jeopardy || {}));
