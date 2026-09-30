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
- **Play vs Computer (5 levels)** — Rookie, Easy, Smart, Expert and Genius. The higher the level, the fewer careless moves it makes. Level 5 looks at every possible future (minimax), so it never loses — the best you can do is draw.
- **Installable app (PWA)** — works offline and can be added to the home screen (`manifest.json`, `sw.js`, `icons/`).
- **Extras** — sound effects (with mute), vibration on mobile, confetti, animated win line, `prefers-reduced-motion` support.

## Run

Open `index.html` in a browser. To test install/offline mode it must be served over HTTPS or `localhost` (for example GitHub Pages). Fonts (Outfit, Hind Siliguri) load from Google Fonts when online; the game still works offline.

## Files

| File            | Purpose                                                                        |
| --------------- | ------------------------------------------------------------------------------ |
| `index.html`    | Layout: setup screen, game screen, result popup                                |
| `style.css`     | Themes, gradients, animations                                                  |
| `app.js`        | Game rules, scores, series, computer AI, sound, confetti, sharing, PWA install |
| `manifest.json` | App name, colours and icons for installing                                     |
| `sw.js`         | Service worker: offline cache (change `V` after every update)                  |
| `icons/`        | App icons made from the arcade artwork                                         |

## Notes

A draw is detected when all 9 cells are filled and nobody has won. This replaces the old list of draw patterns.

## Install as an app

- **Android / Chrome:** tap the ⬇️ button in the header, or menu → _Install app_.
- **iPhone / Safari:** Share → _Add to Home Screen_.

## Online play (planned)

The mode selector already has an **Online** slot. Every move goes through `play(i, ai)` in `app.js`, so an online opponent can call the same function when a move arrives from the server.

## Ideas for later

Undo move, 4×4 board, match history.

---

Created by **Anubhab Dutta**
