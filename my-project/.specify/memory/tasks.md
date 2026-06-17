# Tasks: PMReady Multi-Page Website

**Input**: `.specify/memory/spec.md`, `.specify/memory/plan.md`, `.specify/memory/constitution.md`

**Stack**: Vite MPA · Vanilla HTML/CSS/JS · Poppins font · better-sqlite3 (build-time) · Formspree · Playwright (E2E)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Runnable Vite dev server with all routes, shared components, global styles, and DB pipeline wired up. All user story work is blocked until this phase is done.

- [ ] T001 Initialize Vite vanilla project at `pmready-web/` — `npm create vite@latest . -- --template vanilla`, delete boilerplate (`main.js`, `style.css`, `counter.js`, `javascript.svg`)
- [ ] T002 Configure `vite.config.js` for MPA mode — add all 4 HTML entry points (`index.html`, `community.html`, `program.html`, `contact.html`) as rollup inputs
- [ ] T003 [P] Create full directory structure: `src/styles/pages/`, `src/js/`, `assets/images/brand/`, `assets/icons/`, `db/`, `scripts/`, `tests/e2e/`
- [ ] T004 [P] Add dependencies to `package.json` — devDeps: `better-sqlite3`, `playwright`, `@playwright/test`; configure `prebuild` and `predev` npm scripts to run `scripts/build-metadata.js`
- [ ] T005 Create `src/styles/main.css` — CSS custom properties: color tokens (`--color-teal: #3EC4C4`, `--color-green: #8EDA5C`, `--color-navy: #292852`, `--color-navy-light: #3D3C72`, `--color-white: #FFFFFF`, `--color-bg: #F8F9FA`), spacing scale (`--space-xs` through `--space-2xl`), typography scale, border radius and shadow tokens, CSS reset, `body { font-family: 'Poppins', sans-serif; }`
- [ ] T006 Add Poppins Google Fonts `<link>` (weights 400, 500, 600, 700) to a shared `src/components/head.html` snippet — referenced in all 4 HTML pages
- [ ] T007 Create `src/components/nav.html` — shared nav markup: PMReady logo, links (Home, Community, Program, Contact, Get Involved), mobile hamburger button
- [ ] T008 Create `src/components/footer.html` — shared footer markup: logo, nav links (Community, Contact, Get Involved), social placeholders, copyright
- [ ] T009 Create `src/styles/nav.css` and `src/styles/footer.css` — desktop horizontal nav, mobile hamburger drawer (hidden by default), footer grid layout
- [ ] T010 Create `src/js/nav.js` — hamburger toggle: add/remove `is-open` class on nav, trap focus in drawer, close on Escape key, close on outside click
- [ ] T011 Stub all 4 HTML pages (`index.html`, `community.html`, `program.html`, `contact.html`) — each includes: Poppins `<link>`, `main.css`, page-specific CSS, shared nav, `<main>` placeholder, shared footer, `nav.js`
- [ ] T012 Create SQLite schema and seed script — `db/seed.js`: create `db/pmready.db`, run `CREATE TABLE images (id INTEGER PRIMARY KEY, filename TEXT NOT NULL, alt_text TEXT NOT NULL, page TEXT NOT NULL, section TEXT NOT NULL, width INTEGER, height INTEGER)`, scan `assets/images/` and insert rows
- [ ] T013 Create `scripts/build-metadata.js` — query `db/pmready.db`, write `src/data/images.json`; script runs before every `dev` and `build`
- [ ] T014 Copy brand logo files into `assets/images/brand/` (logo-full, logo-white, logo-icon variants)
- [ ] T015 Verify Phase 1: `npm run dev` serves all 4 pages at correct routes, nav links work, no console errors, `images.json` generates cleanly

**Checkpoint**: All 4 routes load, shared nav + footer render, design tokens in place, DB pipeline works. ✅ Phase 2 can begin.

---

## Phase 2: US1 — Home Page · Discover PMReady and Join (Priority: P1) 🎯 MVP

**Goal**: Visitor lands on homepage, understands PMReady's mission, and can click "Join our Discord" CTA.

**Independent Test**: Open `http://localhost:5173/`, scroll through page, click "Join our Discord" — opens new tab to Discord placeholder URL.

### Implementation

- [ ] T016 Create `src/styles/pages/home.css` — hero section, "Who We Are" section, value cards grid, responsive breakpoints (320px / 768px / 1280px)
- [ ] T017 Build hero section in `index.html` — headline "Break into Product Management", tagline "Access curated resources, interview prep, and a community helping members land roles at top tech companies.", primary CTA button "Join our Discord" (`href="#discord"`, `target="_blank"`, `rel="noopener noreferrer"`)
- [ ] T018 Build "Who We Are" section in `index.html` — PMReady organization description, logo icon, brand colors applied
- [ ] T019 Build "What We Offer" value cards section in `index.html` — 3 cards: Community, Interview Prep, Curated Resources — each with icon, title, description
- [ ] T020 Verify "Join our Discord" CTA is visible above the fold at all 3 breakpoints without scrolling
- [ ] T021 Write Playwright E2E test `tests/e2e/home.spec.js` — assert: headline visible, CTA above fold on desktop + mobile viewports, CTA `href` and `target="_blank"` correct

**Checkpoint**: Home page fully functional and independently testable. ✅

---

## Phase 3: US2 — Community Page · Connect and Start a Chapter (Priority: P2)

**Goal**: Visitor sees community value, can join Discord, and university students can start a chapter.

**Independent Test**: Navigate to `http://localhost:5173/community`, both CTAs ("Join the Discord", "Start a Chapter") are present and link to correct placeholder URLs.

### Implementation

- [ ] T022 Create `src/styles/pages/community.css` — hero, Discord section, chapter section, responsive layout
- [ ] T023 Build hero section in `community.html` — headline "Connect, Collaborate and Learn", subheadline
- [ ] T024 Build "Meet us on Discord" section in `community.html` — description, "Join the Discord" CTA button (`href="#discord"`, `target="_blank"`)
- [ ] T025 Build "Start a New Chapter" section in `community.html` — description "Want to start a new chapter at your university? Fill in the form right now, and we will get you on a call with someone on our team!", "Start a Chapter" CTA (`href="#chapter-form"`, `target="_blank"`)
- [ ] T026 Write Playwright E2E test `tests/e2e/community.spec.js` — assert: both CTAs present, correct `href` values, `target="_blank"` on both links

**Checkpoint**: Community page fully functional and independently testable. ✅

---

## Phase 4: US3 — Program Page · Explore Resources (Priority: P3)

**Goal**: Visitor sees what structured programs and prep resources PMReady offers.

**Independent Test**: Navigate to `http://localhost:5173/program`, at least 3 program cards render with titles, descriptions, and CTAs.

### Implementation

- [ ] T027 Create `src/styles/pages/program.css` — hero, program cards grid, resource sections, responsive layout
- [ ] T028 Create `src/data/programs.js` — array of placeholder program objects: `{ title, description, ctaLabel, ctaHref }` — minimum 3 entries (e.g., "Interview Prep Bootcamp", "PM Fundamentals", "Resume Review")
- [ ] T029 Build program page hero in `program.html` — headline, subheadline
- [ ] T030 Build program cards section in `program.html` — render cards from `src/data/programs.js` data, each card: title, description, CTA button
- [ ] T031 Write Playwright E2E test `tests/e2e/program.spec.js` — assert: at least 3 program cards visible, each has a CTA element

**Checkpoint**: Program page fully functional and independently testable. ✅

---

## Phase 5: US4 — Navigation · Get Involved / Job Board (Priority: P3)

**Goal**: "Get Involved" in nav and footer opens Notion job board in new tab; all nav links resolve without 404.

**Independent Test**: Click "Get Involved" in nav and footer on any page — opens `#job-board` placeholder in new tab.

### Implementation

- [ ] T032 Verify "Get Involved" link in `src/components/nav.html` uses `href="#job-board"`, `target="_blank"`, `rel="noopener noreferrer"`
- [ ] T033 Verify "Get Involved" link in `src/components/footer.html` uses same attributes
- [ ] T034 Write Playwright E2E test `tests/e2e/nav.spec.js` — assert: all nav links present on every page, all internal links resolve (no 404), "Get Involved" has `target="_blank"` in both nav and footer

**Checkpoint**: Navigation fully verified across all pages. ✅

---

## Phase 6: US5 — Contact Page · Reach the Team (Priority: P4)

**Goal**: Visitor can submit a contact form via Formspree and see social media links.

**Independent Test**: Navigate to `http://localhost:5173/contact`, submit empty form (see validation errors), submit valid form (see success state).

### Implementation

- [ ] T035 Create `src/styles/pages/contact.css` — form layout, input styles (focus states, error states), social links grid, success/error message styles
- [ ] T036 Build contact form in `contact.html` — fields: Name (required), Email (required, type="email"), Message (required, `<textarea>`); submit button; Formspree `action="https://formspree.io/f/YOUR_FORM_ID"` `method="POST"`
- [ ] T037 Create `src/js/contact-form.js` — intercept submit, client-side validate all 3 fields before sending to Formspree, show inline error messages per field on failure, show success message on Formspree 200 response, show error banner on Formspree failure
- [ ] T038 Build "Find us on Socials" section in `contact.html` — social link cards with placeholder `href="#social"` for each platform (Instagram, LinkedIn, Twitter/X, Discord)
- [ ] T039 Write Playwright E2E test `tests/e2e/contact.spec.js` — assert: empty submit shows 3 validation errors, invalid email shows email error, valid submission shows success message, social links present

**Checkpoint**: Contact page fully functional and independently testable. ✅

---

## Phase 7: Polish, Accessibility & Performance

**Purpose**: Cross-cutting quality pass — ensures constitution compliance before ship.

- [ ] T040 [P] Audit all pages for WCAG 2.1 AA: check color contrast ratios (navy `#292852` on white must pass AA), add `aria-label` to icon-only buttons, verify all images have meaningful `alt` text from DB metadata, verify keyboard nav works through all interactive elements
- [ ] T041 [P] Verify zero horizontal scroll at 320px viewport on all 4 pages — fix any overflow issues
- [ ] T042 [P] Add `<meta name="description">` and `<title>` tags to all 4 pages (unique per page)
- [ ] T043 [P] Add `loading="lazy"` to all below-fold images; ensure hero images are not lazy-loaded
- [ ] T044 [P] Verify all external links have `target="_blank"` and `rel="noopener noreferrer"` — audit all 4 pages
- [ ] T045 Run Lighthouse on all 4 pages — fix issues until: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90 on all pages
- [ ] T046 Run full Playwright test suite — all tests must pass before done
- [ ] T047 Update `README.md` at repo root — setup instructions: `npm install`, `node db/seed.js`, `npm run dev`; document placeholder URLs that need replacing before launch

---

## Dependencies & Execution Order

```
Phase 1 (Setup) ──────────────────────────────── BLOCKS everything
    │
    ├── Phase 2 (US1 Home)        ← Start here after Phase 1
    ├── Phase 3 (US2 Community)   ← Can run parallel with Phase 2
    ├── Phase 4 (US3 Program)     ← Can run parallel with Phases 2–3
    ├── Phase 5 (US4 Nav)         ← Can run parallel with Phases 2–4
    └── Phase 6 (US5 Contact)     ← Can run parallel with Phases 2–5
            │
            └── Phase 7 (Polish)  ← Runs after all pages complete
```

### Parallel Opportunities
- T003, T004, T005, T006 can all run in parallel within Phase 1
- T016–T020 (home), T022–T025 (community), T027–T030 (program), T035–T038 (contact) can all run in parallel once Phase 1 is done
- T040–T044 in Phase 7 can all run in parallel

---

## Placeholder Checklist (replace before launch)

| Placeholder | File(s) | Replace with |
|---|---|---|
| `#discord` | nav, index.html, community.html | `https://discord.gg/xcQxSrsNRC` ✅ |
| `#chapter-form` | community.html | Real Google Form URL — OPEN |
| `#job-board` | nav.html, footer.html | `https://maddieshlaimon.notion.site/PMReady-Job-Board-24dad6b675138027bd43e8e88c0aa955` ✅ |
| `#social` | contact.html, footer.html | Real social media URLs — OPEN |
| `YOUR_FORM_ID` | contact.html | `mzdqqjna` (full: `https://formspree.io/f/mzdqqjna`) ✅ |
| Program card content | `src/data/programs.js` | Real program names + descriptions — OPEN |
