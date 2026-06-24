# LinkTranscript

**Paste a video. Get the transcript.**

LinkTranscript is a fast, clean video-transcript utility. Paste a YouTube URL and
instantly get a transcript you can search, copy, and export as TXT, Markdown,
SRT, or VTT — with clickable timestamps.

Production domain: **https://linktranscript.com**

> LinkTranscript is an independent tool for transcripts and notes. It is **not** a
> video downloader and is **not affiliated with YouTube or Google**.

**v1 scope:** a free, no-login, no-AI transcript utility built to get indexed and
monetize with AdSense. AI transforms (summaries, notes, post drafts) are a
**backlog** feature — the code exists but is disabled and not surfaced in the v1
UI. The app runs fully **without any AI API key**.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- Server-side **API routes** for transcript extraction
- A swappable **service layer** for transcript extraction
- (Backlog) OpenAI-compatible API for the "Transform Transcript" panel

---

## Run locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
#    (edit .env.local — see "Environment variables" below)

# 3. Start the dev server
npm run dev
# open http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # run the production build
npm run typecheck  # TypeScript check, no emit
npm run lint       # Next.js lint
```

---

## Environment variables

**None are required for v1.** The app works out of the box. See `.env.example`.

### Core (optional)

| Variable                      | Default                     | Description                                                |
| ----------------------------- | --------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`        | `https://linktranscript.com`| Canonical site URL for SEO / sitemap / OpenGraph.         |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | _(empty)_                 | AdSense publisher ID (e.g. `ca-pub-…`). When empty, no ad code loads and no placeholder boxes ship to production. |
| `TRANSCRIPTAPI_KEY`           | _(empty)_                   | **Required in production.** Key for [TranscriptAPI](https://transcriptapi.com). When set, extraction goes through their residential-proxy infrastructure (YouTube blocks datacenter IPs, so direct extraction fails on Vercel). Empty locally = direct extraction. |
| `TRANSCRIPTAPI_BASE_URL`      | TranscriptAPI default       | Optional base-URL override for the provider. |
| `ENABLE_PERSONAL_DOWNLOADS`   | `false`                     | Personal media-download functionality (see below). Keep false. |
| `ENABLE_TRANSCRIPT_CACHE`     | `true`                      | In-memory transcript cache (30-min TTL).                  |
| `YOUTUBE_PROXY_URL`           | _(empty)_                   | Optional proxy for YouTube requests (see "Production").   |

### Backlog — AI transforms (not used in v1)

| Variable               | Default                     | Description                                          |
| ---------------------- | --------------------------- | ---------------------------------------------------- |
| `ENABLE_AI_TRANSFORMS` | `false`                     | Master switch for the (backlog) AI panel.            |
| `OPENAI_API_KEY`       | _(empty)_                   | API key for AI transforms.                           |
| `OPENAI_BASE_URL`      | `https://api.openai.com/v1` | Any OpenAI-compatible provider.                      |
| `OPENAI_MODEL`         | `gpt-4o-mini`               | Chat model used for transforms.                      |

---

## How transcript extraction works

The extraction logic lives behind a single service function so it can be
swapped later (e.g. for a hosted transcript API) without touching the UI.

- **Entry point:** `src/lib/youtube/transcript.ts` → `getTranscript(url, opts)`
- **Strategy:**
  1. Validate the URL and extract the video ID (`src/lib/youtube/url.ts`).
  2. Load the watch page and parse `ytInitialPlayerResponse` for the caption
     track list and video details.
  3. If the watch page is gated, fall back to the InnerTube `player` endpoint.
  4. Fetch the chosen caption track as `json3` (with XML fallback) and parse it
     into timestamped segments.
- **Cleaning:** repeated whitespace is collapsed, HTML entities decoded, empty
  cues dropped. Line breaks are preserved per caption cue.
- **Errors:** mapped to friendly, user-facing messages in `src/lib/types.ts`
  (`FRIENDLY_ERRORS`). No raw stack traces are sent to the client. Handles
  invalid URLs, missing captions, private/unavailable videos, age-restricted
  videos, and rate limiting.
- **Caching:** a small in-memory cache (`src/lib/cache.ts`), toggled by
  `ENABLE_TRANSCRIPT_CACHE`.
- **Rate limiting:** a per-IP sliding window (`src/lib/rate-limit.ts`) guards the
  API routes.

### A note on production / cloud IPs

YouTube sometimes blocks caption requests from datacenter IPs. If you deploy to
a cloud host and see frequent `FETCH_FAILED`/`NO_TRANSCRIPT` errors, set
`YOUTUBE_PROXY_URL` to route requests through a residential/proxy egress. Local
development typically needs no proxy.

---

## AI transformations (BACKLOG — not in v1)

AI transforms are intentionally **not** part of v1 and are **not** shown in the
UI. The underlying code is kept in the repo, dormant, so the feature can be
switched on later without a rewrite:

- `src/lib/ai/prompts.ts` — prompt config (Summary, Bullet Notes, etc.)
- `src/lib/ai/transform.ts` — chat-completions service
- `src/app/api/transform/route.ts` — API route (returns "disabled" without a key)
- `src/components/result/TransformPanel.tsx` — the panel (currently not rendered)

To enable later: set `ENABLE_AI_TRANSFORMS=true` and `OPENAI_API_KEY`, then render
`<TransformPanel />` again in `src/components/result/ResultView.tsx`.

---

## How to add SEO pages

SEO landing pages are **data-driven**. To add one:

1. Open `src/lib/seo-pages.ts`.
2. Add a new object to the `SEO_PAGES` array with:
   - `slug`, `title` (`<title>`), `metaDescription`, `h1`
   - `intro` (paragraphs above the tool)
   - `sections` (heading + body blocks)
   - `faqs` (rendered with FAQ JSON-LD)
   - `related` (slugs to internal-link)

That's it. The dynamic route at `src/app/[slug]/page.tsx` automatically:

- generates the static page (`generateStaticParams`)
- sets per-page metadata (`generateMetadata`)
- embeds the transcript tool, content, FAQ, internal links, and CTA
- adds the page to `sitemap.xml`

Current pages: `/youtube-transcript-generator`, `/youtube-to-text`,
`/copy-youtube-transcript`, `/youtube-transcript-download`,
`/youtube-video-summary`, `/youtube-transcript-to-notes`,
`/transcript-to-blog-post`, `/transcript-to-linkedin-post`, `/vtt-to-txt`,
`/srt-to-txt`, `/video-to-markdown`, `/playlist-transcript-generator`.

---

## Enabling / disabling personal download functionality

Media-download functionality is **disabled by default** and is not surfaced in
the public UI. It is gated behind:

```
ENABLE_PERSONAL_DOWNLOADS=false
```

The public product intentionally focuses on transcripts and text exports — it is
**not** branded or built as a YouTube downloader. Only enable this flag for
private/personal use where you have the rights to do so. (No download UI ships in
v1; the flag reserves the capability for a future, clearly-scoped feature.)

---

## Analytics

Analytics hooks live in `src/lib/analytics.ts`. The placeholder `track()`
function logs events in development. Wire up a real provider (PostHog, Plausible,
GA, etc.) inside `track()`. Events emitted:

`page_view`, `transcript_generated`, `export_clicked`, `copy_clicked`,
`error_encountered`.

---

## Ads (AdSense-ready, off by default)

Ad placements are handled by `src/components/AdSlot.tsx`:

- **In development:** renders a tasteful "Ad placement" box so you can see the
  layout.
- **In production without `NEXT_PUBLIC_ADSENSE_CLIENT_ID`:** renders **nothing**
  (no empty boxes shipped while waiting for AdSense approval).
- **In production with the publisher ID set:** renders a real AdSense unit, and
  the loader script is injected in `app/layout.tsx` (also gated on the ID).

Placements: below the homepage hero (`home-hero`), result-page sidebar
(`result-sidebar`), below the transcript (`result-below`), and inside SEO pages
after the first section (`seo-inline`).

**After AdSense approval:** set `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, then fill in the
per-placement ad-unit IDs in the `AD_UNIT_IDS` map in `AdSlot.tsx`. Do not
hardcode the publisher ID. See `DEPLOYMENT.md` for the full AdSense flow.

---

## Project structure

```
src/
  app/
    page.tsx                 # Homepage
    result/page.tsx          # Transcript result page
    [slug]/page.tsx          # Data-driven SEO landing pages
    blog/page.tsx            # Guides & tools index
    privacy, terms, contact  # Legal + contact
    api/
      transcript/route.ts    # Transcript extraction endpoint
      transform/route.ts     # AI transform endpoint (BACKLOG; disabled in v1)
    sitemap.ts, robots.ts
  components/                 # Header, Footer, tool input, result UI, marketing
  lib/
    youtube/                 # url + fetcher + transcript service
    ai/                      # prompts + transform service (BACKLOG)
    exporters.ts             # TXT / MD / SRT / VTT
    cache.ts, rate-limit.ts, analytics.ts, config.ts, types.ts
```

---

## Deployment

See **`DEPLOYMENT.md`** for exact, step-by-step instructions: GitHub repo,
Vercel project, environment variables, connecting `linktranscript.com` via
Squarespace DNS, HTTPS verification, Google Search Console + sitemap submission,
and preparing for AdSense approval.

---

## Roadmap (backlog)

- AI transforms: summaries, notes, study guides, blog/LinkedIn/X drafts, custom prompts
- Audio-file transcription (ASR) and TikTok / Reels / Shorts support
- Bulk transcript extraction, playlist & channel transcripts
- Saved transcript history + workspace folders
- Public API access, Chrome extension, team accounts
- Stripe billing (the code is structured so this can be added cleanly)
- Direct SRT/VTT file upload for conversion
- Backed contact form (Resend/Formspree) and real analytics provider

---

## Legal

Users are responsible for ensuring they have the rights to use any transcript
content they export. See `/terms` and `/privacy`. Not affiliated with YouTube.
```
