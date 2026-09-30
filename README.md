# 🎮 Tic-Tac-Toe

A two-player Tic-Tac-Toe game with names, live scoreboard, series mode, dark/light theme and lots of animation. Plain HTML, CSS and JavaScript — no build step.

## Features

- **Player names** — saved in the browser, used in turn, win and draw messages.
- **Choose X or O** — Player 1 picks, Player 2 automatically gets the other.
- **Fair first move** — Player 1 starts match 1, Player 2 starts match 2, and so on.
- **Scoreboard** — Won / Lost / Draw for each player, updated with an animation.
- **Series mode** — play 1, 3, 5 or 7 matches. When the series ends, the player with more wins takes the trophy. A tied series offers a tie-breaker match.
- **Share score** — uses the phone's share sheet, or copies the result text.
- **Dark / light mode** — follows your device by default and remembers your choice.
- **Extras** — sound effects (with mute), vibration on mobile, confetti, animated win line, `prefers-reduced-motion` support.

## Run

Open `index.html` in a browser. Fonts (Outfit, Hind Siliguri) load from Google Fonts when online; the game still works offline.

## Files

| File         | Purpose                                              |
| ------------ | ---------------------------------------------------- |
| `index.html` | Layout: setup screen, game screen, result popup      |
| `style.css`  | Themes, gradients, animations                        |
| `app.js`     | Game rules, scores, series, sound, confetti, sharing |

## Notes

A draw is detected when all 9 cells are filled and nobody has won. This replaces the old list of draw patterns.

## Ideas for later

Play against the computer, undo move, 4×4 board, match history.
