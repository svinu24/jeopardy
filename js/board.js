/* Builds the category/value grid and keeps tiles in sync with game state. */
(function (J) {
  "use strict";

  const boardEl = document.getElementById("board");
  const tiles = [];

  function render() {
    const categories = J.data.categories;
    const rows = Math.max(...categories.map((cat) => cat.clues.length));

    boardEl.style.setProperty("--cols", categories.length);
    boardEl.style.setProperty("--rows", rows);
    boardEl.textContent = "";
    tiles.length = 0;

    categories.forEach((cat) => {
      const header = document.createElement("div");
      header.className = "category";
      header.textContent = cat.name;
      boardEl.appendChild(header);
    });

    // Fill row by row so each column lines up under its category header.
    for (let row = 0; row < rows; row++) {
      categories.forEach((cat, col) => {
        const clue = cat.clues[row];
        if (!clue) {
          boardEl.appendChild(document.createElement("div"));
          return;
        }

        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "tile" + (clue.pending ? " pending" : "");
        tile.textContent = clue.value;
        tile.dataset.key = J.clueKey(col, row);
        tile.setAttribute("aria-label", cat.name + " for " + clue.value);
        tile.addEventListener("click", (event) => {
          // Played tiles stay locked; shift-click reopens one if the host needs a do-over.
          if (tile.classList.contains("done") && !event.shiftKey) return;
          J.clue.open(col, row, tile);
        });

        tiles.push(tile);
        boardEl.appendChild(tile);
      });
    }
  }

  function sync(state) {
    tiles.forEach((tile) => {
      const done = Boolean(state.done[tile.dataset.key]);
      tile.classList.toggle("done", done);
      tile.setAttribute("aria-disabled", String(done));
    });
  }

  J.board = { render, sync };
})((window.Jeopardy = window.Jeopardy || {}));
