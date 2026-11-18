# NSJ Connect — Birthday Surprise

A responsive, neon sci-fi birthday dashboard built with React, Vite, SCSS, Framer Motion and Lucide React.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Personalize it

- Change `Sathwik` and the birthday message in `src/App.jsx`.
- Update the countdown target in `useCountdown()` in `src/App.jsx` to your real birthday date.
- Replace the CSS memory tiles with real images in `src/styles/main.scss`.
- Connect the AI chat submit handler to your own backend/API. Do not put private API keys in frontend code.

## Included interactions

- Responsive navigation and section selection
- Live demo countdown
- Candle blow / relight toggle
- Rotating birthday wishes
- Gift, memory, game, and movie modal cards
- AI buddy chat panel (front-end demo replies)
- Voice visualizer animation toggle
- Dark/light theme toggle

The countdown is a demo countdown (14 days, 23 hours, 45 minutes from first page load); set the actual target date before publishing.


## JARVIS-style voice assistant

The dashboard includes a voice-first birthday assistant with a rotating holographic core, microphone control, spoken replies and a text fallback.

### Voice commands (Chrome / Edge recommended)
- "Open memories"
- "Open gift"
- "Play a game"
- "Show birthday wishes"
- "Blow the candles"
- "Relight candles"
- "Switch to dark mode"
- "Switch to light mode"
- "What is the countdown?"

Voice recognition uses the browser Web Speech API and normally requires microphone permission and HTTPS (or localhost). Speech output uses the browser Speech Synthesis API. Voice availability and voice quality vary by browser and operating system. This is a front-end assistant demo; connect a secure backend and an AI provider for open-ended JARVIS conversations. Never expose API secrets in browser code.
