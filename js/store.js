/* Central game state with a tiny subscribe/update API. */
(function (J) {
  "use strict";

  function initialState() {
    return {
      teams: [], // [{ id, name, adjust }]
      done: {}, // clueKey -> true once a clue has been played
      results: {}, // clueKey -> { teamId: 1 (correct) | -1 (wrong) }
    };
  }

  const listeners = [];

  J.store = {
    state: initialState(),

    // Registers a render function and runs it once with the current state.
    subscribe(fn) {
      listeners.push(fn);
      fn(this.state);
    },

    update(mutate) {
      mutate(this.state);
      listeners.forEach((fn) => fn(this.state));
    },
  };

  J.clueKey = (col, row) => col + "-" + row;

  J.getClue = (col, row) => J.data.categories[col].clues[row];

  // Keys of every clue that can actually be played (skips pending ones).
  J.playableKeys = function () {
    const keys = [];
    J.data.categories.forEach((cat, col) => {
      cat.clues.forEach((clue, row) => {
        if (!clue.pending) keys.push(J.clueKey(col, row));
      });
    });
    return keys;
  };
})((window.Jeopardy = window.Jeopardy || {}));
