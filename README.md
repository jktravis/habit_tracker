# Habits — a local-first habit tracker

A small, backend-free web app for tracking habits. Everything lives in your
browser via `localStorage` — no account, no server, no network calls. It is
installable as a PWA and works offline.

## Features

- **Multiple habits** — each with a name, emoji, color, and optional daily goal.
- **GitHub-style activity grid** — one contribution heatmap per habit; cell
  intensity reflects how many times you logged that day (scaled toward your goal
  when one is set).
- **One-tap logging** — a big "Log today" button on every habit. You can log a
  habit **more than once a day**, undo today's logs, or tap any past day to
  backfill.
- **Streaks** and today's count shown at a glance.
- **Mobile-friendly & installable** — responsive layout, large tap targets, and
  a PWA manifest + service worker so you can add it to your home screen and use
  it offline.
- **Light & dark themes** that follow your system preference.

## Tech

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for the service worker and
  web app manifest
- Persistence via the browser `localStorage` API

## Getting started

```bash
npm install
npm run dev      # develop at http://localhost:5173
```

```bash
npm run build    # production build into dist/
npm run preview  # preview the built app (service worker only runs in a build)
npm run lint     # oxlint
```

## Deployment

Pushing to the default branch publishes the app to GitHub Pages via the workflow
in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Enable it once
under **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Data & privacy

All data stays on your device in `localStorage` under the key `habit-tracker/v1`.
Clearing your browser data for the site erases your habits.

---

Created with [Claude](https://claude.com/claude-code) (Anthropic's Claude Code).
