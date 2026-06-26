# Cloudflare — Finish-Up Checklist (LinkTranscript)

Status as of 2026-06-25: linktranscript.com is added to **mirthcode's** Cloudflare
account (Free plan, DNS-only — registration stays at Squarespace). DNS records
imported, DNSSEC turned off, and **nameservers already switched** at Squarespace
to `alex.ns.cloudflare.com` + `joselyn.ns.cloudflare.com`.

Do the steps below **after** Cloudflare emails *"linktranscript.com is now active"*
(usually a few hours after the nameserver switch).

---

## 0. Confirm the zone is active
- Cloudflare dashboard → select **linktranscript.com**.
- Top status should say **Active** (not "Pending nameserver update").
- If still pending after ~24h, in the zone's **Overview** click **Check nameservers now**.

---

## 1. Set SSL/TLS to Full (strict)  ← prevents redirect loops with Vercel
- In the zone: **SSL/TLS → Overview** (or **Configuration**).
- Set encryption mode to **Full (strict)**.
  - ⚠️ Do NOT use **Flexible** — it causes infinite redirect loops with Vercel.
- Then **SSL/TLS → Edge Certificates** → turn on **Always Use HTTPS**.
- Wait a few minutes, then load `https://linktranscript.com` to confirm it works (padlock, no error).

---

## 2. Add the "checking your browser" challenge on transcript requests
This is the youtubetotranscript-style interstitial. It fires **once per session**
(Cloudflare sets a `cf_clearance` cookie after the visitor passes, so they aren't
re-challenged while their browser stays open).

- In the zone: **Security → WAF → Custom rules → Create rule**.
- **Rule name:** `Challenge transcript requests`
- **Build the expression** (use the visual builder, "Or" between the two):
  - Field **URI Path** · Operator **contains** · Value `/result`
  - **Or**
  - Field **URI Path** · Operator **contains** · Value `/api/transcript`
- **Then take action… → Managed Challenge**
- Click **Deploy**.

Why these two paths: `/result` is the page a user lands on after clicking
"Get Transcript" (so the interstitial renders as a full page, exactly like
youtubetotranscript), and `/api/transcript` is the backend call (so bots hitting
it directly to burn your TranscriptAPI credits also get challenged). Normal
browsing and Google's crawler hit other paths, so they're never challenged —
good for SEO.

Optional extra protection (free): **Security → Bots → Bot Fight Mode → On**.

---

## 3. Verify everything
- [ ] `https://linktranscript.com` loads with a valid padlock.
- [ ] Click **Get Transcript** on a video → you see the Cloudflare "checking your
      browser" page once → then the transcript loads.
- [ ] Generate a second transcript in the same browser session → **no** challenge
      this time (cf_clearance is working).
- [ ] SEO pages still load fast with no challenge (e.g. `/youtube-transcript-generator`).
- [ ] Search Console still shows the domain **verified**
      (search.google.com/search-console → Settings → Ownership verification).
      The Google TXT record was imported into Cloudflare, so it should stay verified.
- [ ] `https://linktranscript.com/sitemap.xml` still returns the XML.

---

## Notes / gotchas
- If a challenge ever blocks the transcript **XHR** (you generate a transcript and
  it errors instead of showing the interstitial), loosen rule scope to just
  `/result` and rely on the `cf_clearance` cookie to cover the follow-up
  `/api/transcript` call. Re-test.
- To tune how long a pass lasts: **Security → Settings → Challenge Passage**
  (default 30 min).
- The Cloudflare account is **mirthcode@gmail.com** (account id
  `6bccf7bf32382dd2934bc0fd6ce86f33`). VidaRise's Cloudflare is a *different*
  account/login — track that down separately if you want them unified.
- DNSSEC can be re-enabled later from inside Cloudflare (**DNS → Settings → DNSSEC**)
  if you want it back on — but only via Cloudflare now, not Squarespace.
