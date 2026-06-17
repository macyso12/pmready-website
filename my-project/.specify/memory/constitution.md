# my-project Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

Every line of code must be clean, readable, and maintainable:
- Functions do one thing; files have a single clear responsibility
- No dead code, commented-out blocks, or TODO left unresolved at merge time
- Names are self-documenting — avoid abbreviations and cryptic identifiers
- Complexity must be justified; prefer the simpler solution unless benchmarks prove otherwise
- All PRs require at least one reviewer approval before merging
- Linting and formatting checks must pass in CI — no exceptions

### II. Testing Standards (NON-NEGOTIABLE)

Test-driven development is the default, not the exception:
- Unit tests are required for all business logic and utility functions
- Integration tests are required for all API boundaries and data layer interactions
- End-to-end tests cover all critical user journeys (happy path + key failure paths)
- Minimum coverage gate: 80% line coverage; 70% branch coverage enforced in CI
- Tests must be deterministic — no flaky tests permitted; fix or delete immediately
- Test names describe behavior, not implementation: `it("returns 404 when user not found")` not `it("test getUserById")`
- Mocks are restricted to external I/O (network, filesystem, time); never mock the thing under test

### III. User Experience Consistency

All user-facing surfaces follow a unified design language:
- Components are built from the shared design system — no one-off styles without design approval
- Interaction patterns (loading states, error states, empty states) are consistent across the app
- Accessibility is required, not optional: WCAG 2.1 AA compliance minimum
- All user-visible copy goes through a content review before shipping
- Responsive behavior is tested across mobile, tablet, and desktop breakpoints
- No feature ships without UX sign-off from a designer or product lead

### IV. Performance Requirements

Performance is a feature and must be measured, not assumed:
- Core Web Vitals targets: LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1 on real devices
- API response times: p50 ≤ 200ms, p95 ≤ 500ms under normal load
- Bundle size regressions > 10KB (compressed) require explicit justification
- No N+1 queries — all data access patterns reviewed before merging
- Performance budgets are tracked in CI; regressions block merge
- Lazy-load non-critical assets; defer third-party scripts that are not essential to first render

### V. Observability & Reliability

Every feature must be observable in production:
- Structured logging required for all significant operations (use consistent log levels)
- Errors are always caught at system boundaries and reported to the error tracker
- Feature flags are used for high-risk rollouts; stale flags are cleaned up within one sprint
- Runbooks exist for all on-call scenarios before a feature goes to production

## Development Workflow

- **Branch strategy**: feature branches off `main`; squash-merge PRs
- **PR size**: aim for < 400 lines changed; split larger changes into stacked PRs
- **CI gates** (all must pass before merge): lint, type-check, unit tests, integration tests, performance budget, coverage threshold
- **Dependency updates**: reviewed weekly; security patches applied within 48 hours
- **Breaking changes**: require a deprecation period and migration guide

## Quality Gates

All of the following must pass before any code merges to `main`:

- [ ] Linting and formatting clean
- [ ] Type-check passes (zero errors)
- [ ] Unit test suite passes with coverage thresholds met
- [ ] Integration tests pass
- [ ] No new accessibility violations introduced
- [ ] Performance budget not exceeded
- [ ] Reviewer approval obtained

## Governance

This constitution supersedes all other development practices. Conflicts are resolved in favor of the constitution.

Amendments require:
1. Written proposal explaining the change and motivation
2. Team discussion and consensus
3. Updated version number and ratification date below

All PRs and code reviews must verify compliance with these principles. Non-compliance must be called out in review, not silently merged.

**Version**: 1.0.0 | **Ratified**: 2026-06-17 | **Last Amended**: 2026-06-17
