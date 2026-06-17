# Implementation Plan: PMReady Multi-Page Website

**Branch**: `001-pmready-website` | **Date**: 2026-06-17 | **Spec**: `.specify/memory/spec.md`

## Summary

Build a multi-page marketing website for PMReady — a product management community organization — with pages for Home, Community, Program, and Contact. The stack is Vite + vanilla HTML/CSS/JS with a local SQLite database (via `better-sqlite3`) for content metadata (no ORM, no framework). Images stay on disk; metadata (alt text, filenames, page associations) is stored in SQLite. No authentication, no CMS, no backend server in v1.

---

## Technical Context

**Language/Version**: JavaScript (ES2022+), HTML5, CSS3 — no TypeScript, no JSX

**Primary Dependencies**:
- `vite` — dev server and build tooling only
- `better-sqlite3` — SQLite access for metadata (build-time only; reads DB to inject content at build)
- No UI framework, no CSS framework, no component library

**Storage**: Local SQLite database (`db/pmready.db`) — stores image metadata (filename, alt text, page, section). Content (copy, links) lives in flat JS data files.

**Testing**: Native browser testing via Vite dev server; Playwright for E2E acceptance tests covering the user stories in the spec

**Target Platform**: Static site deployed to Vercel or Netlify (out of scope); developed on macOS

**Project Type**: Static multi-page website (MPA) built with Vite's MPA mode

**Performance Goals**: LCP ≤ 2.5s, Lighthouse performance ≥ 85, Lighthouse accessibility ≥ 90

**Constraints**: Zero runtime server required; all pages are static HTML after build; no JS framework runtime shipped to browser

**Scale/Scope**: 4 pages, ~10 sections total, ~5–10 images

---

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| Code Quality | PASS | Vanilla stack keeps complexity low; single responsibility per file |
| Testing Standards | PASS | Playwright E2E covers all 5 user stories; unit tests for any JS utilities |
| UX Consistency | PASS | Shared `_layout` partial + single `styles/main.css` enforces visual consistency |
| Performance | PASS | Static HTML, no framework runtime, minimal JS; Vite handles asset optimization |
| Observability | N/A | Static site — no server-side observability needed in v1 |

---

## Project Structure

### Documentation

```text
my-project/.specify/memory/
├── plan.md              ← this file
├── spec.md              ← feature specification
└── constitution.md      ← project principles
```

### Source Code

```text
pmready-web/                     ← repo root (parent of my-project)
├── index.html                   ← Home page (/)
├── community.html               ← Community page (/community)
├── program.html                 ← Program page (/program)
├── contact.html                 ← Contact page (/contact)
│
├── src/
│   ├── styles/
│   │   ├── main.css             ← global tokens, reset, typography, layout
│   │   ├── nav.css              ← shared navigation styles
│   │   ├── footer.css           ← shared footer styles
│   │   └── pages/
│   │       ├── home.css
│   │       ├── community.css
│   │       ├── program.css
│   │       └── contact.css
│   │
│   ├── js/
│   │   ├── nav.js               ← mobile nav toggle (only JS needed for nav)
│   │   ├── contact-form.js      ← client-side form validation
│   │   └── utils.js             ← shared helpers (if any)
│   │
│   └── components/              ← reusable HTML snippets (injected at build via Vite plugin)
│       ├── nav.html
│       └── footer.html
│
├── assets/
│   ├── images/                  ← local images (never uploaded externally)
│   └── icons/                   ← SVG icons
│
├── db/
│   ├── pmready.db               ← SQLite database (image metadata)
│   └── seed.js                  ← seeds DB from images/ directory scan
│
├── scripts/
│   └── build-metadata.js        ← reads DB at build time, writes metadata JSON for Vite to consume
│
├── tests/
│   └── e2e/
│       ├── home.spec.js
│       ├── community.spec.js
│       ├── program.spec.js
│       └── contact.spec.js
│
├── vite.config.js
├── package.json
└── .gitignore
```

**Structure Decision**: Vite MPA mode — each `.html` file at the root is a separate entry point, giving clean `/community`, `/program`, `/contact` URLs after build. No SPA routing needed. CSS is split per-page but shares `main.css` global tokens. SQLite is used only at build time (`scripts/build-metadata.js`) to read image metadata and produce a JSON file consumed by Vite; zero SQLite at runtime.

---

## Implementation Phases

### Phase 0 — Project Scaffold

**Goal**: Runnable Vite dev server with all 4 pages, shared nav/footer, and global styles wired up.

Steps:
1. `npm create vite@latest pmready-web -- --template vanilla` (or init manually)
2. Configure `vite.config.js` for MPA mode — add all 4 HTML entry points
3. Create directory structure as above
4. Add `better-sqlite3` and `playwright` as dev dependencies
5. Write `src/styles/main.css` — CSS custom properties (color tokens, spacing scale, typography)
6. Stub all 4 HTML pages with shared `<nav>` and `<footer>` markup
7. Wire `nav.js` for mobile hamburger toggle
8. Verify `npm run dev` serves all 4 pages with correct URLs

**Exit criteria**: All 4 pages load at correct routes, nav links work, no console errors.

---

### Phase 1 — Database & Metadata Pipeline

**Goal**: SQLite DB seeded with image metadata; build script writes `assets/metadata.json`.

Steps:
1. Create `db/pmready.db` schema:
   ```sql
   CREATE TABLE images (
     id INTEGER PRIMARY KEY,
     filename TEXT NOT NULL,
     alt_text TEXT NOT NULL,
     page TEXT NOT NULL,       -- 'home' | 'community' | 'program' | 'contact'
     section TEXT NOT NULL,    -- e.g. 'hero', 'about', 'team'
     width INTEGER,
     height INTEGER
   );
   ```
2. Write `db/seed.js` — scans `assets/images/`, inserts rows with placeholder alt text
3. Write `scripts/build-metadata.js` — queries DB, writes `src/data/images.json`
4. Add `prebuild` and `predev` npm scripts to run `build-metadata.js` before Vite starts
5. Verify `images.json` is generated correctly before each dev/build run

**Exit criteria**: `npm run dev` auto-generates `images.json`; DB can be seeded and queried without errors.

---

### Phase 2 — Content & Page Implementation

**Goal**: All 4 pages fully built with real content, matching the spec.

#### 2a — Home Page (`index.html`)
- Hero section: headline "Break into Product Management", tagline, "Join our Discord" CTA button
- "Who We Are" section: organization description
- "What We Offer" section: 3 value cards (Community, Interview Prep, Curated Resources)
- Footer with nav + socials

#### 2b — Community Page (`community.html`)
- Hero: "Connect, Collaborate and Learn"
- Discord section: description + "Join the Discord" CTA
- "Start a New Chapter" section: description + "Start a Chapter" CTA (Google Form link)

#### 2c — Program Page (`program.html`)
- Programs/resources section: at least 2–3 cards with title, description, CTA
- [Content to be provided by PMReady team — placeholders used in dev]

#### 2d — Contact Page (`contact.html`)
- Contact form: name, email, message fields with client-side validation (`contact-form.js`)
- "Find us on Socials" section: social media links
- Success/error state on form submission

**Exit criteria**: All pages render correct content, all CTAs point to correct destinations (or clearly marked placeholders), mobile layout verified.

---

### Phase 3 — Styling & Visual Consistency

**Goal**: All pages follow a consistent design language with brand colors, typography, and spacing.

Steps:
1. Define CSS custom properties in `main.css`:
   - Color palette (primary, secondary, accent, neutral, text, background)
   - Typography scale (font family, sizes for h1–h4, body, small)
   - Spacing scale (--space-xs through --space-2xl)
   - Border radius, shadow tokens
2. Implement responsive layouts for all breakpoints (320px, 768px, 1280px)
3. Style navigation: desktop horizontal, mobile hamburger drawer
4. Style all CTA buttons consistently (primary + secondary variants)
5. Style cards, sections, hero blocks consistently across pages
6. Verify no horizontal scroll at any viewport width
7. Run Lighthouse and fix any accessibility or performance issues

**Exit criteria**: Lighthouse accessibility ≥ 90, performance ≥ 85 on all pages; zero horizontal scroll; visually consistent across all pages.

---

### Phase 4 — E2E Tests

**Goal**: Playwright tests cover all 5 user stories from the spec.

Test files:
- `tests/e2e/home.spec.js` — US1: Discord CTA visible above fold, link opens new tab
- `tests/e2e/community.spec.js` — US2: both CTAs present and correct; chapter form link opens new tab
- `tests/e2e/program.spec.js` — US3: program content renders, CTAs are present
- `tests/e2e/nav.spec.js` — US4: "Get Involved" in nav opens job board in new tab; all nav links resolve to correct pages (zero 404)
- `tests/e2e/contact.spec.js` — US5: form validation shows errors on empty submit; success state on valid submit

**Exit criteria**: All Playwright tests pass; no 404 errors across any nav link.

---

## Complexity Tracking

No constitution violations. The SQLite database is additive metadata storage at build time only — it does not add runtime complexity or violate the simplicity principle.

---

## Brand Assets

Logo files provided by PMReady team (2026-06-17). Store in `assets/images/brand/`.

### Typography

- **Font**: Poppins (Google Fonts) — weights 400, 500, 600, 700
- Load via `<link>` in `<head>` of all HTML pages
- `font-family: 'Poppins', sans-serif` set on `body` in `main.css`

### Color Palette (extracted from logo)

| Token | Hex | Usage |
|---|---|---|
| `--color-teal` | `#3EC4C4` | Left leaf, primary accent, CTAs |
| `--color-green` | `#8EDA5C` | Right leaf, secondary accent |
| `--color-navy` | `#292852` | Wordmark, headings, body text |
| `--color-white` | `#FFFFFF` | Background, reversed text on dark |
| `--color-navy-light` | `#3D3C72` | Hover states, secondary text |
| `--color-bg` | `#F8F9FA` | Page background (off-white) |

### Logo Variants Available
- `logo-icon.png` — leaf icon only (teal + green, for favicon and small contexts)
- `logo-white.png` — full wordmark reversed white on dark backgrounds
- `logo-full.png` — full wordmark on light backgrounds (navy text + color leaf)

---

## Open Questions (require PMReady team input before Phase 2)

| # | Question | Blocks | Status |
|---|---|---|---|
| 1 | What is the Discord invite URL? | Home CTA, Community CTA | ✅ `https://discord.gg/xcQxSrsNRC` |
| 2 | What is the Google Form URL for chapter signups? | Community CTA | PLACEHOLDER — `#chapter-form` |
| 3 | What is the Notion job board URL? | Nav "Get Involved" link | ✅ `https://maddieshlaimon.notion.site/PMReady-Job-Board-24dad6b675138027bd43e8e88c0aa955` |
| 4 | What are the social media handles/URLs? | Footer, Contact page | PLACEHOLDER — `#social` |
| 5 | What programs/resources exist for the Program page? | Phase 2c | OPEN |
| 6 | Brand color palette and font? | Phase 3 | ✅ RESOLVED — Poppins + see Brand Assets above |
| 7 | Form submission endpoint? | Contact form Phase 2d | ✅ RESOLVED — Formspree `https://formspree.io/f/mzdqqjna` |
