# ⏱️ TimeSlipSearch

> A conversational cultural time machine - search any date from 1958-2020 and instantly see the #1 song, top movies, historical prices, and major events from that day.

[![Live Demo](https://img.shields.io/badge/Live_Demo-000?style=for-the-badge&logo=vercel&logoColor=white)](https://timeslipsearch.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js-000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

## 🔮 What It Does

Type a date, a birthday, or a loose phrase like "summer of 69" and TimeSlipSearch assembles a cultural snapshot of that moment in history: the Billboard #1 song, what was playing in theaters, what gas and minimum wage cost, and what made the news. It's built around a retro, VHS/CRT-styled UI and a natural-language date parser rather than a traditional search form.

## ✨ Features

- **Natural language date parsing** - handles exact dates, birthdays, ranges ("from 1980 to 1985"), eras ("the entire 80s"), and comparisons between two dates (`src/lib/date-parser.ts`, `chrono-node`)
- **Conversational search API** (`/api/chat`) - returns both a formatted text reply and structured results (songs, movies, prices, events) with rate limiting and response caching
- **Billboard Hot 100 lookup** - #1 (and full chart) for any week, 1958-present
- **Movie context** - popular theatrical releases around the searched date (TMDB)
- **Historical price context** - gas prices, CPI, and minimum wage for the era (FRED)
- **Notable events** - "on this day" historical events (Wikimedia)
- **Interactive timeline explorer** with keyboard shortcuts (`Ctrl/Cmd+K` search, `Ctrl/Cmd+T` timeline, `Ctrl/Cmd+/` help, `Esc` clear)
- **Voice input** via the browser's Web Speech API
- **"Wrapped" experience** - a Spotify-Wrapped-style personal year-end recap of a user's searches (top decade, favorite song/movie, exploration "personality")
- **Achievements/gamification system** - unlockable achievements, streaks, and points for exploration
- **Agent memory panel** - localStorage-backed search history and favorited dates
- **Shareable result cards + dynamic OG images**, native Web Share API with clipboard fallback
- **Data visualizations** (Chart.js) and era narratives/insights generated from the search results
- Accessible by design: ARIA labels, focus management, print stylesheet, CSP/HSTS/X-Frame-Options headers

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS
- **Search:** Algolia (all historical data is indexed there and queried via `searchAllIndices`)
- **Caching / rate limiting:** Upstash Redis (falls back to in-memory if not configured)
- **Background jobs:** Trigger.dev
- **Observability:** Sentry, Axiom (`next-axiom`), Langfuse
- **Analytics:** Vercel Analytics + Speed Insights
- **Testing:** Jest, Testing Library, MSW
- **Package manager:** pnpm

## 📦 Data Sources (ingest scripts)

Historical data is fetched and indexed into Algolia via standalone ingest scripts in `scripts/ingest/`:

| Script | Source | Coverage |
|---|---|---|
| `pnpm ingest:billboard` | [Billboard Hot 100 dataset](https://github.com/mhollingshead/billboard-hot-100) | 1958-present |
| `pnpm ingest:tmdb` | [TMDB](https://developer.themoviedb.org) | 1900s-present |
| `pnpm ingest:fred` | [FRED (Federal Reserve Economic Data)](https://fred.stlouisfed.org) - gas prices, CPI, minimum wage | 1938-present (varies by series) |
| `pnpm ingest:wikimedia` | [Wikimedia "On This Day" feed](https://api.wikimedia.org/wiki/Feed_API/Reference/On_this_day) | all historical dates |

## 🚀 Getting Started

```bash
git clone https://github.com/forbiddenlink/time-slip-search
cd time-slip-search
pnpm install
cp .env.local.example .env.local   # fill in the keys below
pnpm dev
```

### Required environment variables

Set these in `.env.local`:

- `NEXT_PUBLIC_ALGOLIA_APP_ID`, `ALGOLIA_SEARCH_API_KEY`, `ALGOLIA_ADMIN_API_KEY` - Algolia project (required for search to work)
- `TMDB_API_KEY` - required to run the movie ingest script
- `FRED_API_KEY` - required to run the price ingest script

Optional:

- `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` - playlist export from discovered songs
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` - production-grade rate limiting/caching (without these it falls back to in-memory)

After setting API keys, populate Algolia with historical data:

```bash
pnpm ingest:billboard
pnpm ingest:tmdb
pnpm ingest:fred
pnpm ingest:wikimedia
```

### Other commands

```bash
pnpm build          # production build
pnpm start          # run production build
pnpm lint           # eslint
pnpm test           # jest
pnpm test:coverage  # jest with coverage
```
