# Jeopardy!

A seven-category, 49-clue Jeopardy board for game night. Plain HTML, CSS and
JavaScript with no build step and no dependencies.

## Running it

Open `index.html` in a browser. To serve it instead (handy for playing on a
TV or phone on the same network):

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## How to play

1. **Set up teams.** The first launch asks for 2–6 teams. Rename, add or
   remove them any time with the **Teams** button.
2. **Pick a clue.** Click a point value. The clue zooms out of its tile.
3. **Reveal the answer** with the gold button (or press `R`).
4. **Score it.** Under the clue, each team has **✓ +value** and
   **✗ −value** buttons. Click again to undo, or click the other button to
   flip it. Several teams can be marked on one clue (a miss and a steal).
5. **Done** returns to the board and retires the tile.

The scoreboard stays at the bottom of the screen. Each team card has
**− / +** buttons for 100-point manual corrections. The leading team gets a
crown.

| Control             | Action                                           |
| ------------------- | ------------------------------------------------ |
| `R`                 | Reveal the answer                                |
| `Esc`               | Close the clue (or cancel a dialog)              |
| Shift + click tile  | Reopen an already-played clue                    |
| **Reset**           | New game with the same teams (asks to confirm)   |

The game saves to `localStorage` after every change, so a refresh or an
accidentally closed tab doesn't lose the game.

## Editing questions

All clues live in [`js/questions.js`](js/questions.js). Each category has
seven clues:

```js
{ value: 300, question: "What does `gets()` do?", answer: "Reads a line." }
```

- Wrap code in `backticks` to show it as inline code.
- `answer` can be an array to show a bulleted list.
- **Finish the Lyric** clues can use `lyric` (the excerpt to continue) or
  `cue` (a playback instruction for the host). Add `song` and `artist`; they
  stay hidden until the answer is revealed.
- `pending(value)` / `pendingCategory(name)` show a dimmed **TBD** tile for
  clues that aren't written yet.

## Project layout

```
index.html          page shell and dialog markup
css/styles.css      theme, board, dialogs, scoreboard, responsive rules
js/questions.js     question bank
js/store.js         game state, persistence, reset
js/ui.js            overlay show/hide and clue text formatting
js/teams.js         team setup dialog, scoring math, scoreboard
js/clue.js          clue modal, reveal, per-team scoring
js/board.js         board grid rendering
js/main.js          wiring, progress counter, reset confirmation
```
