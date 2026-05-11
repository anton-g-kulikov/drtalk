# drTalk Prototype

`drTalk` is a high-fidelity product prototype for dental referral workflows. The app models two main tracks:

- dentist users who create referrals and monitor specialist follow-up
- specialist practices that intake referrals, coordinate care, and manage patient communication

This repository currently represents a static-exported frontend prototype. Most workflow data is mocked in the client. The live comment panel is the only feature wired to Supabase.

## Current Prototype Scope

- landing page that branches into dentist and specialist tracks
- guest referral submission flow at `/referral`
- account and practice onboarding flow at `/onboarding`
- owner verification gate at `/verify`
- specialist dashboard, referrals queue, referral detail, channels, network, learning hub, and settings flows
- dentist dashboard, referral creation, sent-referral tracking, channels, network, learning hub, and settings flows
- team and PHI access management screens
- subscription trial/paywall prototype for specialist practices
- contextual feedback markers with a Supabase-backed side panel

## Architecture Summary

- framework: `Next.js 16` App Router
- language: `TypeScript`
- styling: `Tailwind CSS`
- icons: `lucide-react`
- data model: hard-coded mock data for most product surfaces
- persisted prototype state: browser `localStorage`
- comments backend: `@supabase/supabase-js`
- deployment target: static export via `next build` to `out/`

More durable system notes live in [_meta/system-documentation.md](/Users/antonkulikov/Projects/drtalk/_meta/system-documentation.md).

## Key Runtime Behaviors

- verification state is stored locally and gates referral processing / PHI access
- subscription state is stored locally and drives the trial banner and paywall modal
- navigation labels and some page copy adapt based on whether the pathname is under `/dentist`
- comment markers open a shared review panel and read/write comment threads from Supabase
- if Supabase env vars are missing, the app still renders but comment requests target a placeholder client

## Repository Layout

- `src/app` route files and layouts
- `src/components` shared UI, comments, verification, subscription, and team-management components
- `src/lib` small client utilities such as Supabase initialization
- `_meta` product, system, and project-status documentation
- `test` test-status and verification notes
- `out` generated static export output

## Local Setup

### Prerequisites

- Node.js `20+`
- npm

### Install

```bash
npm install
```

### Environment

The comment system expects these public environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

You can start from [`.env.example`](/Users/antonkulikov/Projects/drtalk/.env.example).

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Checks

```bash
npm run lint
npm run build
```

The static export is written to `out/`.

## Route Map

Public entry points:

- `/`
- `/referral`
- `/onboarding`
- `/verify`
- `/specialist`
- `/dentist`

Specialist routes:

- `/dashboard`
- `/referrals`
- `/referrals/[id]`
- `/channels`
- `/network`
- `/academy`
- `/settings`
- `/settings/notifications`
- `/dashboard/settings/team`
- `/dashboard/settings/team/[id]`

Dentist routes:

- `/dentist/dashboard`
- `/dentist/referral`
- `/dentist/referrals`
- `/dentist/channels`
- `/dentist/network`
- `/dentist/academy`
- `/dentist/settings`
- `/dentist/settings/notifications`
- `/dentist/settings/team`
- `/dentist/settings/team/[id]`

## Known Limitations

- no automated test suite is checked into the repo yet
- most business entities are mocked inline in page/component files
- several actions are intentionally non-persistent or placeholder-only
- some routes model product intent rather than complete backend behavior
- the prototype is heavily client-side and is not suitable for production PHI handling

## Documentation

- [_meta/system-documentation.md](/Users/antonkulikov/Projects/drtalk/_meta/system-documentation.md): current technical behavior and ownership boundaries
- [_meta/project-task-list.md](/Users/antonkulikov/Projects/drtalk/_meta/project-task-list.md): delivered scope and remaining work
- [_meta/implementation_plan.md](/Users/antonkulikov/Projects/drtalk/_meta/implementation_plan.md): implementation snapshot and near-term focus
- [test/test-documentation.md](/Users/antonkulikov/Projects/drtalk/test/test-documentation.md): current verification approach and gaps
- [_meta/drtalk_ Objects and Roles model.md](</Users/antonkulikov/Projects/drtalk/_meta/drtalk_ Objects and Roles model.md>): domain model notes
- [_meta/drtalk_ Progressive Onboarding v2.md](</Users/antonkulikov/Projects/drtalk/_meta/drtalk_ Progressive Onboarding v2.md>): onboarding concept notes
- [_meta/drtalk_ Referrals&Activity Center.md](</Users/antonkulikov/Projects/drtalk/_meta/drtalk_ Referrals&Activity Center.md>): referral workflow concept notes
