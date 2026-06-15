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

### UC-06A Network Directory

Intent: Specialist and dentist network pages preserve role-specific analytics, tabs, directory filtering, and primary actions after shared component extraction.

Setup: Open `/network` and `/dentist/network` with seeded network data.

Steps:

1. View analytics copy for each role.
2. Switch to My Network.
3. Locate specialist chat actions and dentist send-referral actions.

Expected visible outcome: Both routes render from the shared network prototype view while keeping role-specific copy and actions.

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

### UC-07B Detail Views

Intent: Document and referral detail screens remain editable as smaller prototype chunks while preserving mock state side effects.

Setup: Open `/documents/[id]` and `/referrals/[id]` with seeded localStorage.

Steps:

1. View document preview metadata.
2. Archive an active inbox document.
3. View referral case activity.
4. Advance a referral status.

Expected visible outcome: Detail headers, preview/action regions, status controls, and activity logs render without route composition regressions.

Automated coverage: `test/prototype-routes.test.tsx`

### UC-07A Onboarding

Intent: A practice or individual user can move through the visible onboarding prototype without losing route-level state.

Setup: Open `/onboarding` with empty localStorage.

Steps:

1. Create an account from the entry screen.
2. Verify the email code.
3. Choose whether to create or join a practice.
4. In create-practice mode, trigger the mock NPI autofill and continue through role/team invite.
5. In individual mode, verify directly into the learning success state.

Expected visible outcome: Each step renders the expected section copy, practice detail autofill remains visible, and success routes can be identified without a route composition regression.

Automated coverage: `test/prototype-routes.test.tsx`

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
8. Render shared dashboard document rows with external, archived, convert/attach, and open-in-channel states.
9. Render the shared dashboard document action modals for convert-to-referral and attach-to-referral flows.
10. Change the convert patient name, clear the attach search, and choose a target referral.
11. Render shared dashboard sidebar lists for recent conversations and suggested connections.
12. Click a sidebar conversation and a suggested connection action.
13. Render the dentist sent-referrals list with search, row navigation, urgency labels, and pagination actions.
14. Render the dentist dashboard header with verification banner, owner banner, role copy, quick referral/document actions, and comment-marker-safe mode.
15. Render the specialist dashboard header with verification banner, owner banner, role copy, send-document action, and comment-marker-safe mode.
16. Render the specialist referral queues with processing and newly received document states.
17. Click a specialist referral row and the view-all referrals action.
18. Render shared referral pipeline controls with role-aware tabs, search, time range, filter drawer, practice options, incomplete toggle, and clear-filters action.
19. Render shared guest-referral practice selector with preselected, internal multi-practice, guest state/search, selected summary, clear, and empty states.
20. Render shared guest-referral attachment step with upload dropzone, mock file row, patient-copy toggle, patient contact fields, disabled submit, and back/submit actions.
21. Render shared send-document practice selector with selected chips, search/open states, option selection, unverified badges, and empty state.
22. Render shared send-document referral selector with none/new-referral, referral row, search/open, and empty states.
23. Render shared send-document patient fields with name, date-of-birth, message, and edit callbacks.
24. Render shared send-document upload section with attached files, remove-file, real upload, and quick mock attach states.
25. Render shared channel list and message primitives with external, unread, document, and transport states.
26. Render shared channel sidebar sections with collapse, unread badge, optional action, and visible child states.
27. Render the full shared channel sidebar with search/clear, mobile close, connected/external practice case rows, group creation action, patient tip, and role-specific network link.
28. Render the shared channel content pane with conversation header actions, archived reactivation, message history, verification note, composer, and document-pane callbacks.
29. Render the shared channel conversation header with case-channel controls and message/document tab switching.
30. Render archived channel conversations with reactivation and empty-practice states.
31. Render the shared channel message composer with secure-email hints, patient delivery controls, attachment drawer, attached preview, and send states.
32. Render shared channel attachment controls, attach a recent mock document, open the new-document action, and remove an attached document preview.
33. Render shared channel document pane, search/clear documents, open the send-new-document action, and trigger view/download callbacks.
34. Render the shared channel document preview overlay for PDF and image mock documents, close it, and trigger the download callback.

Expected visible outcome: The shared components preserve the same visible controls used by role dashboards and channels while delegating page-specific actions to their parent page.

Automated coverage: `test/prototype-components.test.tsx`, `test/prototype-components.shared.test.tsx`, `test/prototype-components.dashboards.test.tsx`, `test/prototype-components.referral-flows.test.tsx`, `test/prototype-components.send-document.test.tsx`, `test/prototype-components.channels.test.tsx`, `test/prototype-dashboard-documents.test.ts`, `test/prototype-send-document-flow.test.ts`

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
