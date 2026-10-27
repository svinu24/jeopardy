/* Shared helpers for showing/hiding overlays and formatting clue text. */
(function (J) {
  "use strict";

  const FADE_MS = 240;

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[ch]);
  }

  J.ui = {
    // Unhides an overlay and fades it in on the next layout pass.
    show(el) {
      el.hidden = false;
      void el.offsetWidth; // force a reflow so the transition runs
      el.classList.add("is-open");
    },

    hide(el) {
      el.classList.remove("is-open");
      setTimeout(() => {
        if (!el.classList.contains("is-open")) el.hidden = true;
      }, FADE_MS);
    },

    isOpen(el) {
      return el.classList.contains("is-open");
    },

    // Escapes clue text and turns `backtick` spans into inline code.
    format(text) {
      return escapeHtml(text).replace(/`([^`]+)`/g, "<code>$1</code>");
    },
  };
})((window.Jeopardy = window.Jeopardy || {}));
