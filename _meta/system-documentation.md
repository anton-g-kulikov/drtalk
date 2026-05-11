# System Documentation

## Purpose

This repository contains a static-exported product prototype for `drTalk`. It is built to demonstrate referral intake, referral tracking, communication, verification gating, practice management, and educational/community surfaces across dentist and specialist workflows.

This document is the source of truth for current technical behavior. Product ideation and historical notes remain in the other `_meta/*.md` files.

## Technology and Build

- `Next.js 16` with the App Router
- `TypeScript`
- `Tailwind CSS`
- `lucide-react`
- static export enabled in [`next.config.mjs`](/Users/antonkulikov/Projects/drtalk/next.config.mjs)
- unoptimized images enabled for export builds

Build output is generated into `out/`.

## Application Shape

The app is almost entirely client-rendered. Most route files contain mock data and UI logic directly inside the page component. Shared stateful behaviors are handled through React context providers mounted in [`src/app/layout.tsx`](/Users/antonkulikov/Projects/drtalk/src/app/layout.tsx).

Primary route groups:

- public entry: `/`, `/referral`, `/onboarding`, `/verify`
- specialist workspace: `/dashboard`, `/referrals`, `/channels`, `/network`, `/academy`, `/settings`
- dentist workspace: `/dentist/*`

Several dentist routes re-export shared route implementations and rely on pathname checks to switch copy and navigation behavior.

## Shared Runtime State

### Verification

Verification state is provided by [`src/components/VerificationContext.tsx`](/Users/antonkulikov/Projects/drtalk/src/components/VerificationContext.tsx).

Stored local keys:

- `drtalk_owner_verified`
- `drtalk_user_role`
- `drtalk_has_practice_owner`

Behavior:

- controls whether referral-processing flows redirect to `/verify`
- distinguishes owner, clinical, and admin role states
- allows the prototype to simulate the "no verified owner yet" scenario

### Subscription

Subscription state is provided by [`src/components/SubscriptionContext.tsx`](/Users/antonkulikov/Projects/drtalk/src/components/SubscriptionContext.tsx).

Stored local keys:

- `drtalk_subscription_plan`
- `drtalk_trial_ended`
- `drtalk_trial_days`

Behavior:

- powers the specialist trial banner
- opens the pricing/paywall modal
- simulates upgrade and reset flows without a billing backend

### Comments

The review/comment system is mounted globally through [`src/components/Comments`](/Users/antonkulikov/Projects/drtalk/src/components/Comments/index.tsx).

Behavior:

- feedback markers are embedded throughout the prototype UI
- comment threads are keyed by `marker_id`
- reads historical comments from Supabase
- subscribes to insert events for realtime updates
- writes new comments optimistically before server confirmation

Environment dependency:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

If those values are missing, [`src/lib/supabase.ts`](/Users/antonkulikov/Projects/drtalk/src/lib/supabase.ts) falls back to placeholder values so the UI can still render, but comment operations are not valid.

## Feature Areas

### Public Entry and Onboarding

- landing page lets users choose dentist or specialist tracks
- guest referral flow captures sender identity, patient details, case details, and attachments
- onboarding models account creation, email verification, practice setup, invite flows, and role assignment
- verification flow models NPI lookup, manual credential entry, and persona-style identity steps

### Specialist Track

- dashboard emphasizes intake queue, unresolved referrals, team access, messaging, and trial status
- referrals queue models intake stages: `Received`, `Working on`, `Processed`, `Archived`
- referral detail surfaces patient data, attachments, source metadata, comments, and low-confidence editing affordances
- channels include internal, inter-practice, patient, and public communications
- settings include notifications plus team/PHI management

### Dentist Track

- dashboard emphasizes referral creation, sent-referral tracking, specialist collaboration, and network activity
- referral flow is a structured outbound referral wizard
- sent referrals expose downstream statuses such as `Draft`, `Sent`, `Accepted`, `Scheduled`, `In Progress`, and `Completed`
- channels and network views are adapted for the referring practice perspective

### Shared Support Surfaces

- learning hub / academy
- practice network directory
- team membership management and member-level PHI controls

## Routing Notes

The current app uses a mix of dedicated route implementations and re-exported shared pages. This keeps some UX aligned across tracks, but it also means role behavior is partly inferred from `usePathname()` checks rather than explicit domain models.

This is acceptable for a prototype, but it is a constraint if the repo is evolved into a production application.

## Testing and Verification Status

There is no automated test suite in the repository at the time of this review.

Current repo-level checks:

- `npm run lint`
- `npm run build`

Manual verification guidance lives in [test/test-documentation.md](/Users/antonkulikov/Projects/drtalk/test/test-documentation.md).

## Known Constraints

- most domain data is mocked inline instead of coming from APIs or fixtures
- route actions such as invite, forward, configure, and billing are mostly non-persistent
- production auth, authorization, and HIPAA-grade backend safeguards are not implemented
- Supabase is used only for prototype feedback, not core product workflows
- the app currently optimizes for design/prototype fidelity over separation of UI, state, and data layers
