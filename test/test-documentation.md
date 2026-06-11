# Prototype Test Documentation

## Current Status

This repository now has a lightweight automated test suite for the visual/UX prototype.

Primary commands:

- `npm test` - runs Vitest prototype coverage
- `npm run test:watch` - runs Vitest in watch mode
- `npm run lint` - validates the Next/React code style rules
- `npm run build` - validates the static Next export build

The tests intentionally focus on visible prototype behavior, route composition, and mock-state stability. They are not intended to prove production readiness, backend correctness, accessibility completeness, or pixel-perfect layout.

## Reusable Prototype Use Cases

### UC-01 Public Entry

Intent: A user can identify the prototype entry points from `/`.

Setup: Open `/` with empty localStorage.

Steps:

1. View the landing page.
2. Locate the dashboard login action.
3. Locate the practice onboarding action.
4. Locate the unauthenticated referral action.

Expected visible outcome: The drTalk entry screen renders with login, create/join practice, and refer-without-account paths.

Automated coverage: `test/prototype-routes.test.tsx`

### UC-02 Guest Referral

Intent: A referring user can progress through the visible referral wizard.

Setup: Open `/referral` with empty localStorage.

Steps:

1. Select a state.
2. Search for a receiving practice.
3. Select a practice.
4. Continue to the next step.

Expected visible outcome: The flow advances from target-practice selection to the user information step.

Automated coverage: `test/prototype-routes.test.tsx`

### UC-03 Specialist Dashboard

Intent: A specialist can see the dashboard prototype regions that drive most iteration.

Setup: Open `/dashboard` with seeded mock data.

Steps:

1. View summary metrics.
2. View the documents/referral work area.
3. Locate primary team/invite actions.

Expected visible outcome: The dashboard renders referral metrics, documents, and key actions without route or context failures.

Automated coverage: `test/prototype-routes.test.tsx`, `test/prototype-components.test.tsx`

### UC-04 Dentist Dashboard

Intent: A dentist can see sent-referral tracking and document-transfer actions.

Setup: Open `/dentist/dashboard` with seeded mock data.

Steps:

1. View sent referral metrics.
2. Locate "Send a Referral".
3. Locate "Send Document".

Expected visible outcome: Dentist dashboard actions and document/referral regions render without cross-role regressions.

Automated coverage: `test/prototype-routes.test.tsx`, `test/prototype-components.test.tsx`

### UC-05 Channels

Intent: A user can inspect channel navigation and switch between major communication surfaces.

Setup: Open `/channels` with seeded channels and messages.

Steps:

1. Locate channel search.
2. Locate messages, documents, and archived tabs.
3. Confirm the route renders from shared prototype fixtures rather than route-level exports.
4. Confirm channel sidebar grouping uses role-specific case channels and search can match either practice names or visible case names.

Expected visible outcome: The channel shell renders list search and communication tabs with usable mock data.

Automated coverage: `test/prototype-routes.test.tsx`, `test/prototype-state.test.ts`, `test/prototype-components.test.tsx`

### UC-06 Settings And Team Surfaces

Intent: Settings routes remain available while large page modules are split.

Setup: Open settings routes with provider defaults.

Steps:

1. View practice settings.
2. View notification settings.
3. Smoke-check related team/profile/intake routes during manual QA when they are edited.

Expected visible outcome: Settings pages render their expected prototype sections without navigation composition regressions.

Automated coverage: `test/prototype-routes.test.tsx`

### UC-07 Shared Prototype State

Intent: Mock data remains stable enough for future visual and UX iteration.

Setup: Run helpers with empty, stale, or malformed localStorage values.

Steps:

1. Read referrals.
2. Read network, channels, and messages.
3. Check referral labels and date-range helpers used by dashboard metrics.
4. Import shared channel fixtures directly from the prototype fixture module.

Expected visible outcome: Empty or stale browser state falls back to usable mock defaults, and shared data does not require importing route pages.

Automated coverage: `test/prototype-state.test.ts`

### UC-08 Shared Prototype Components

Intent: Reused visual chunks stay easy to change without drifting between role pages.

Setup: Render shared prototype components directly with small mock props.

Steps:

1. Render the shared dashboard stat grid.
2. Change the time range and click a stat card.
3. Render the shared dashboard action card and click it.
4. Render the shared prototype toast, click an optional action, and dismiss it.
5. Render the shared document section with rows and pagination.
6. Clear document search and move to the next page.
7. Confirm long pagination windows use the shared ellipsis behavior across document and referral lists.
8. Render shared channel list and message primitives with external, unread, document, and transport states.
9. Render shared channel attachment controls, attach a recent mock document, open the new-document action, and remove an attached document preview.
10. Render the shared channel document pane, search/clear documents, open the send-new-document action, and trigger view/download callbacks.
11. Render the shared channel document preview overlay for PDF and image mock documents, close it, and trigger the download callback.

Expected visible outcome: The shared components preserve the same visible controls used by role dashboards and channels while delegating page-specific actions to their parent page.

Automated coverage: `test/prototype-components.test.tsx`

## Manual Smoke Checklist

Run this after large visual splits or when changing route layout:

- `/` renders and branches to dentist and specialist tracks.
- `/referral` advances through identify, patient, case, attachment, and success states.
- `/onboarding` advances through account, verification, role, practice, and invite steps.
- `/verify` completes and returns the user to the dashboard flow.
- `/dashboard` shows verification and owner-state banners correctly.
- `/referrals` filters by pipeline state and search query.
- `/referrals/[id]` loads the referral detail layout.
- `/channels` switches between channel types and shows patient communication states.
- `/dentist/dashboard` renders referral tracking and quick actions.
- `/dentist/referral` advances through the outbound referral wizard.
- `/dentist/referrals` reflects dentist copy and navigation behavior.
- `/dentist/channels`, `/dentist/network`, and `/dentist/academy` render without role regressions.
- Settings pages for both roles render profile, notifications, intake, and team sections.

## Coverage Boundaries

These tests are designed to catch accidental breakage while refactoring the prototype. They should avoid brittle pixel snapshots, production-only contracts, real uploads, real billing, real auth, or Supabase integration assertions unless those behaviors become explicit prototype goals.
