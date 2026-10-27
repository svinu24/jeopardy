/* Central game state with a tiny subscribe/update API, persisted to localStorage. */
(function (J) {
  "use strict";

  const STORAGE_KEY = "jeopardy-state-v1";

  function initialState() {
    return {
      teams: [], // [{ id, name, adjust }]
      done: {}, // clueKey -> true once a clue has been played
      results: {}, // clueKey -> { teamId: 1 (correct) | -1 (wrong) }
    };
  }

  // Storage can be unavailable (private mode, blocked site data), so
  // every access is guarded and the game still works in memory.
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? Object.assign(initialState(), JSON.parse(raw)) : initialState();
    } catch (err) {
      return initialState();
    }
  }

  function persist(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* keep playing without persistence */
    }
  }

  const listeners = [];

  J.store = {
    state: load(),

    // Registers a render function and runs it once with the current state.
    subscribe(fn) {
      listeners.push(fn);
      fn(this.state);
    },

    update(mutate) {
      mutate(this.state);
      persist(this.state);
      listeners.forEach((fn) => fn(this.state));
    },

    // New game with the same teams: clears scores and returns every clue to the board.
    reset() {
      this.update((state) => {
        state.done = {};
        state.results = {};
        state.teams.forEach((team) => {
          team.adjust = 0;
        });
      });
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
