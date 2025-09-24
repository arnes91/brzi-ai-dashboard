# **DBZ Power Scanner – Full MVP Specification (v1.3)**
A single source of truth for designers, developers, and stakeholders. Each section explains **what** to build and **why** so future iterations stay aligned with the original vision.

---
## A. Power Formula & Tier Mapping

### Final Formula
```txt
powerScore = (Σ top‑5 emotion_confidence) × 1000
```
*The ×1000 multiplier transforms raw Hume confidence scores (0 – 5) into the classic Dragon Ball “thousands” range. Usability tests showed a spike in user excitement once scores crossed 9 000, so we lock in that meme value from day one.*

### Tier Table
| Range (pts) | Tier Label | UI Colour | Emoji | Example Comment EN | Example Comment BS |
|-------------|-----------|-----------|-------|--------------------|---------------------|
| 0 – 5 000 | **Earthling Rookie** | `#5BC236` | 🥬 | “Barely a farmer—grab your scouter!” | “Jedva si seljak – uzmi skouter!” |
| 5 001 – 9 000 | **IT’S UNDER 9000!** | `#C4D600` | 😅 | “Need more training!” | “Još ti treba treninga!” |
| 9 001 – 25 000 | **Saiyan Cadet** | `#D9A300` | 🥊 | “Your Ki is rising nicely.” | “Ki ti raste fino.” |
| 25 001 – 50 000 | **Saiyan in Training** | `#F7B500` | 🥋 | “Catching up to Raditz!” | “Evo ga Raditz level!” |
| 50 001 – 100 000 | **Super Saiyan** | `#FF5733` | ⚡️ | “Your hair just turned gold!” | “Kosa ti je pozlatila!” |
| 100 001 – 500 000 | **Super Saiyan Blue** | `#4287F5` | 🔵 | “Blue aura unlocked.” | “Plava aura – bravo!” |
| 500 001 – 1 000 000 | **SSB Evolved** | `#1E4EF5` | 🔷 | “Power unheard of on Earth.” | “Moć neviđena na Zemlji.” |
| 1 000 001 + | **Ultra Instinct** | `#AA00FF` | 🟣 | “Limit? What limit?” | “Granice su srušene!” |

> **Dev Note:** Tier data lives in `utils/powerMath.ts`. Update that JSON + Tailwind config—no front‑end edits required.

---
## B. Global UI Style Guide
| Token | Spec | Rationale |
|-------|------|-----------|
| **Fonts** | Orbitron (display), Roboto (body) | Orbitron evokes DBZ scouters; Roboto supports multi‑language glyphs. |
| **Palette** | Yellow `#F7B500`, Orange `#FF5733`, Purple `#AA00FF`, Green `#5BC236`, Blue `#4287F5`, Dark BG `#0D0D0D` | Mirrors canonical aura colours, meets WCAG AA. |
| **Border Radius** | 12 px (cards/inputs), 8 px (buttons) | Modern yet sharp enough for anime aesthetic. |
| **Spacing Grid** | 4‑pt (4, 8, 12, 16 …) | Matches Tailwind rem scale for predictable padding. |
| **Animation** | Framer Motion, 0.5 s default, easing `ease‑in‑out` (0.4,0,0.2,1), child stagger 0.08 s | Delivers snappy “scouter blip” feedback. |
| **Icons** | lucide‑react + heroicons (fill) | Combines clean outlines with filled variants. |
| **Card Shadow** | `0 0 15px rgba(255,255,255,0.12)` | Subtle energy‑aura glow. |

Design tokens are synced in **`/design/DBZ‑Scanner.fig`**.

---
## C. UX Flow & Layout
```
/dbz-scanner
├─ Header
│   ├─ Logo + Title
│   └─ Language Toggle (EN / BS)
├─ Main
│   ├─ UploadCard
│   │   ├─ DropZone (image/video)
│   │   └─ “Scan” CTA
│   ├─ LoadingOverlay (5‑frame animation + beep SFX)
│   ├─ ResultCard
│   │   ├─ PowerMeter (counter + radial)
│   │   ├─ TierBadge
│   │   ├─ MemeComment
│   │   ├─ ShareRow (Copy, WhatsApp, X, FB)
│   │   └─ "Scan Again" button
│   └─ PromoBanner (optional)
└─ Footer (Privacy / GitHub / Version)
```
*Mobile‑first (≤ 480 px). Desktop: centred 640 px column; animations upscale 1.25×.*

---
## D. i18n Key Map
Single‑source keys per locale; EN falls back if BS missing.
```txt
scan.title
scan.subtitle
scan.cta
scan.upload_hint
scan.loading.1‑5
scan.error.noface
scan.error.upload
scan.error.invalid
scan.result.comment.tier1‑tier8
scan.result.powerlabel
scan.result.tierbadge
scan.share.default
```

---
## E. Privacy & Data‑Retention (Stub)
- **Purpose:** deliver playful power‑level feedback. No biometric auth.
- **Lifecycle:** image → analyse → encrypted S3 (bulk delete @24 h).
- **Stored Data:** `anon_id`, timestamp, `powerScore`, `tier`. No raw emotions.
- **Rights:** access, rectification, erasure via in‑app form or `privacy@yourdomain.com`.
- **Legal Basis:** Legitimate Interest (GDPR Art 6 (1)(f)) + CCPA §1798.120 (no sale).

---
## F. Analytics Metrics
| Event | Trigger | Properties | Store | Dashboard |
|-------|---------|------------|-------|-----------|
| scan_start | upload | anonId, device | client | – |
| scan_success | API done | powerScore, tier, runtime | `scans` | Metabase |
| scan_error | any fail | error_type, message | `errors` | Sentry |
| share_click | share btn | platform, tier | `shares` | Mixpanel |
| lang_toggle | toggle | from, to | `events` | – |

SQL patches (Supabase):
```sql
create table shares (id uuid primary key default gen_random_uuid(), anon_id text, created_at timestamptz default now(), platform text, tier text);
create table errors (id uuid primary key default gen_random_uuid(), anon_id text, created_at timestamptz default now(), error_type text, error_msg text);
```

---
## G. Social‑Share Spec
- **EN:** “I just hit **{{powerScore}}** on the DBZ Power Scanner! Think you can beat Ultra Instinct?”
- **BS:** “Dogurao/la sam do **{{powerScore}}** na DBZ Power Scanneru! Možeš li ti do Ultra Instincta?”
- **Hashtags:** `#DBZPowerScanner #ItsOver9000 #BalkanSaiyan`
- **OG Tags:** title, description, dynamic Cloudinary image `/dbz/{{tier}}/{{score}}.png`.
- **Twitter Card:** summary_large_image.

---
## H. CI/CD Pipeline (GitHub → Vercel)
1. **Branch Protection:** `main` + `develop` (1 review minimum).
2. **Workflow** `.github/workflows/ci.yml` – checkout → install (pnpm 8) → test → lint.
3. **Env Vars:** `HUME_API_KEY`, `NEXT_PUBLIC_BASE_URL`.
4. **Preview Deploys:** auto‑comment PR with unique URL.
5. **Rollback:** uptime >1 min down or error rate > 5 %.

---
## I. Rate‑Limit & Error Matrix
| Case | Threshold | User Message | Fallback |
|------|-----------|--------------|----------|
| API 429 | >60 req/min/IP | “Scouters overheating—wait 30 s!” | Back‑off (3) |
| API 500 | – | “Server in Hyperbolic Time Chamber—try later.” | Retry btn + Sentry |
| File >5 MB | – | “Image too big—compress it, Broly!” | Client reject |
| No face | – | “Align your face inside the box.” | Overlay guide |
| Network fail | – | “Shenron stole your Wi‑Fi.” | Retry btn |
| Spam (pic hash) | >3/min | “Chill, Vegeta—give others a turn.” | 60 s cooldown |

---
### End of Document

