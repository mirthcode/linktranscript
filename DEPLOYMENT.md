# LinkTranscript — Deployment Guide

Exact, step-by-step instructions to ship **linktranscript.com** to production on
Vercel, connect the domain via Squarespace DNS, and prepare for Google Search
Console and AdSense.

Estimated time: ~30–45 minutes (plus DNS/SSL propagation wait).

> Conventions: commands are run from the project root
> (`MirthCode/linktranscript`). Replace `YOUR-…` placeholders with your values.

---

## 0. Prerequisites

- A **GitHub** account (e.g. `mirthcode`).
- A **Vercel** account — sign up at https://vercel.com using "Continue with
  GitHub" so the two are linked.
- The domain **linktranscript.com** in your **Squarespace** account.
- Git installed locally. Check: `git --version`.
- The app builds locally: `npm install && npm run build` completes with no
  errors.

---

## 1. Create the GitHub repository

You have two options. Option A (web) is simplest.

### Option A — via the GitHub website

1. Go to https://github.com/new
2. **Repository name:** `linktranscript`
3. **Visibility:** Private (recommended) or Public.
4. **Do NOT** initialize with a README, .gitignore, or license (the project
   already has them).
5. Click **Create repository**. Leave the page open — you'll need the URL.

### Option B — via GitHub CLI (if you install `gh`)

```bash
gh repo create linktranscript --private --source=. --remote=origin
```

---

## 2. Push the code

The project is already a git repo with a clean initial commit (see the bottom of
this file if you need to recreate it). Connect the remote and push:

```bash
# Use the URL from step 1. SSH:
git remote add origin git@github.com:YOUR-GH-USERNAME/linktranscript.git
# …or HTTPS:
# git remote add origin https://github.com/YOUR-GH-USERNAME/linktranscript.git

git branch -M main
git push -u origin main
```

Confirm the files appear on GitHub. **`.env.local` and `node_modules` must NOT be
there** — they're in `.gitignore`. Never commit secrets.

---

## 3. Create the Vercel project & first deploy

1. Go to https://vercel.com/new
2. Under **Import Git Repository**, find `linktranscript` and click **Import**.
   (If you don't see it, click **Adjust GitHub App Permissions** and grant access
   to the repo.)
3. Vercel auto-detects **Next.js**. Leave the defaults:
   - Framework Preset: **Next.js**
   - Build Command: `next build` (default)
   - Output: (managed by Vercel)
   - Root Directory: `./` (leave as-is)
4. **Before** clicking Deploy, expand **Environment Variables** and add the ones
   in step 4 below (you can also add them after — then redeploy).
5. Click **Deploy**. Wait for the build to finish.
6. You'll get a URL like `https://linktranscript-xxxx.vercel.app`. Open it and
   confirm the site loads and you can fetch a transcript.

---

## 4. Environment variables in Vercel

Project → **Settings** → **Environment Variables**. Add each for the
**Production** (and **Preview**, optional) environment:

| Key                             | Value                          | Notes                                  |
| ------------------------------- | ------------------------------ | -------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | `https://linktranscript.com`   | Canonical URL for SEO/sitemap.         |
| `ENABLE_PERSONAL_DOWNLOADS`     | `false`                        | Keep false.                            |
| `ENABLE_TRANSCRIPT_CACHE`       | `true`                         | Optional.                              |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | *(leave empty for now)*        | Set later, after AdSense approval.     |
| `YOUTUBE_PROXY_URL`             | *(empty)*                      | Only if YouTube blocks Vercel's IPs.   |

Do **not** set `OPENAI_API_KEY` / `ENABLE_AI_TRANSFORMS` — AI is backlog.

After adding/changing variables, trigger a redeploy: **Deployments** → latest →
**⋯** → **Redeploy**.

> ⚠️ If transcripts work locally but fail in production with
> `FETCH_FAILED` / `NO_TRANSCRIPT`, YouTube is likely blocking Vercel's
> datacenter IPs. Set `YOUTUBE_PROXY_URL` to a residential/proxy egress and
> redeploy. (See README → "A note on production / cloud IPs".)

---

## 5. Add the custom domain in Vercel

1. Project → **Settings** → **Domains**.
2. Enter `linktranscript.com` and click **Add**.
3. When prompted, choose to also add `www.linktranscript.com` and set the
   redirect so **`www` → apex** (or apex → www; either is fine, just be
   consistent). Recommended: redirect `www` to `linktranscript.com`.
4. Vercel will now show the exact **DNS records** you must create. **Use the
   values Vercel shows you** — they can change. As of writing they're typically:
   - **A record** for the apex `@` → `76.76.21.21`
   - **CNAME** for `www` → `cname.vercel-dns.com`

   Keep this Vercel screen open for step 6.

---

## 6. Point Squarespace DNS at Vercel

Squarespace is your DNS provider for linktranscript.com.

1. Log in to Squarespace → **Settings** → **Domains** → click
   **linktranscript.com**.
2. Open **DNS** / **DNS Settings** (look for "Advanced" or "Custom Records").
3. **Remove conflicting defaults:** delete any existing **A records on `@`** that
   point to Squarespace's parking IPs, and any existing **CNAME on `www`** that
   points to Squarespace. (Leave MX/email records alone.)
4. **Add the records Vercel gave you in step 5.** Typical setup:

   | Type  | Host / Name | Value / Data            |
   | ----- | ----------- | ----------------------- |
   | A     | `@`         | `76.76.21.21`           |
   | CNAME | `www`       | `cname.vercel-dns.com`  |

   - In Squarespace, "Host" `@` means the root domain. For `www`, enter `www`.
   - Do **not** add a trailing dot unless Squarespace requires it.
5. Save. DNS changes can take from a few minutes up to 48 hours (usually
   < 1 hour).

> If your domain is *registered* at Squarespace but you'd rather not manage DNS
> there, an alternative is to change the domain's **nameservers** to Vercel's and
> let Vercel manage DNS. The records-based approach above is simpler and keeps
> Squarespace email working — prefer it unless you have a reason not to.

---

## 7. Verify HTTPS / SSL

1. Back on Vercel → **Settings → Domains**, the domain status will move from
   "Invalid Configuration" to **Valid** once DNS propagates.
2. Vercel **automatically provisions a free SSL certificate** (Let's Encrypt) —
   no action needed. This can take a few minutes after DNS is valid.
3. Visit **https://linktranscript.com** — you should see the padlock and the
   site. Visit **http://linktranscript.com** — it should redirect to HTTPS.
4. Confirm **https://www.linktranscript.com** redirects to the apex (per step 5).

Troubleshoot with `dig linktranscript.com +short` (should return `76.76.21.21`)
or https://dnschecker.org.

---

## 8. Post-deploy verification checklist

Open the production site and confirm:

- [ ] Homepage loads; hero + "Get Transcript" input visible.
- [ ] Pasting a YouTube URL returns a transcript with timestamps.
- [ ] Toggle timestamps, search, copy (with/without timestamps) work.
- [ ] Export TXT / Markdown / SRT / VTT each download a correct file.
- [ ] A bad URL shows a friendly error (not a stack trace).
- [ ] SEO pages load, e.g. `/youtube-transcript-generator`.
- [ ] `/privacy`, `/terms`, `/contact` load.
- [ ] **https://linktranscript.com/sitemap.xml** lists your pages with the
      correct domain.
- [ ] **https://linktranscript.com/robots.txt** loads and references the sitemap.
- [ ] No "Ad placement" boxes appear in production (they're dev-only).
- [ ] View page source on the homepage: `<title>`, meta description, and
      OpenGraph tags are present and use `linktranscript.com`.

---

## 9. Google Search Console + submit sitemap

1. Go to https://search.google.com/search-console and click **Add property**.
2. Choose the **Domain** property type and enter `linktranscript.com`.
3. Google gives you a **TXT record** to verify ownership. Add it in Squarespace
   DNS (Type `TXT`, Host `@`, Value = the string Google provides). Save, wait a
   few minutes, then click **Verify**.
   - *Alternative:* use the **URL prefix** property
     (`https://linktranscript.com`) and verify with the HTML-tag method — paste
     the tag's content into a `verification` meta tag, or place the provided
     HTML file in `public/`. The DNS TXT method above is cleanest.
4. Once verified: left nav → **Sitemaps** → enter `sitemap.xml` → **Submit**.
5. Optionally use **URL Inspection** on the homepage and a couple of SEO pages →
   **Request Indexing** to speed up initial crawling.

---

## 10. Google AdSense — approval & going live

**Do not add real ad code until you have an approved AdSense publisher ID.** The
app already ships AdSense-ready (no boxes in production while empty), so you can
apply, get approved, then flip it on.

### a) Apply

1. Go to https://www.google.com/adsense and sign up.
2. Add your site: `linktranscript.com`.
3. AdSense gives you a verification snippet / asks you to confirm site
   ownership. The simplest path: set the env var early so the loader script is
   present:
   - In Vercel, set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` to your `ca-pub-…` ID and
     redeploy. This injects the AdSense script in `<head>` (via
     `app/layout.tsx`), which is what AdSense looks for during review.
   - Note: until you also fill in per-placement ad-unit IDs (step c), no ad
     *units* render — that's fine for review.
4. Submit for review. Approval can take days to a couple of weeks. Keep the site
   live with real content (your SEO pages help here).

### b) After approval — create ad units

1. In AdSense → **Ads** → **By ad unit**, create **Display ad** units for each
   placement you want. Recommended to match the code:
   - `home-hero`, `result-sidebar`, `result-below`, `seo-inline`
2. Each unit gives you a **data-ad-slot** number (e.g. `1234567890`).

### c) Wire the unit IDs into the code

1. Open `src/components/AdSlot.tsx`.
2. Fill the `AD_UNIT_IDS` map with the slot numbers from AdSense:
   ```ts
   const AD_UNIT_IDS: Record<string, string> = {
     "home-hero": "1234567890",
     "result-sidebar": "2345678901",
     "result-below": "3456789012",
     "seo-inline": "4567890123",
   };
   ```
3. Make sure `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set in Vercel (your `ca-pub-…`).
4. Commit and push:
   ```bash
   git add src/components/AdSlot.tsx
   git commit -m "Enable AdSense units after approval"
   git push
   ```
   Vercel auto-deploys. Ads now render in production; dev still shows
   placeholders.

> Reminder: `AdSlot` only renders real ads in production when **both** the
> publisher ID **and** the placement's unit ID are set. Empty = nothing rendered.

---

## 11. Ongoing: deploy changes

This project uses Vercel's Git integration:

- **Push to `main`** → automatic **production** deploy to linktranscript.com.
- **Open a PR / push a branch** → automatic **preview** deploy with its own URL.

```bash
git add -A
git commit -m "Describe your change"
git push
```

---

## Appendix — recreate the initial git commit (only if needed)

If the repo isn't initialized yet:

```bash
cd MirthCode/linktranscript
git init
git add -A
git commit -m "Initial commit: LinkTranscript v1 (transcript utility)"
```

`.gitignore` already excludes `node_modules`, `.next`, `.env*`, etc. Verify no
secrets are staged with `git status` before your first push.
