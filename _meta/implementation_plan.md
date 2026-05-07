# Implementation Snapshot

This file now reflects the current implementation state instead of the original greenfield build checklist.

## What Exists

### Foundation

- Next.js App Router application with static export enabled
- global layout wiring for comments, verification, and subscription state
- Tailwind-based black-and-white prototype styling system

### Product Flows

- public landing flow for dentist vs specialist entry
- guest referral intake flow
- account onboarding and practice-creation flow
- owner verification / credential flow
- specialist workspace flow
- dentist workspace flow
- team/PHI management flow
- network and learning hub discovery flows

### State and Integration

- browser-local persistence for verification and subscription states
- Supabase integration for contextual reviewer comments
- hard-coded mock entities for dashboards, referrals, channels, team members, and directories

## Current Implementation Boundaries

- the app is a frontend prototype, not a production workflow system
- most actions update local component state only
- only the comments feature performs live network-backed reads/writes
- role behavior is partially inferred from pathname instead of a normalized domain/session model

## Near-Term Implementation Priorities

1. Resolve the current ESLint `react-hooks/set-state-in-effect` failures in onboarding and verification initialization.
2. Add automated coverage for route rendering and context-driven gates.
3. Consolidate mock data into stable fixtures.
4. Decide whether placeholder actions should remain decorative or become prototype-complete.
5. Improve code separation if the prototype keeps expanding.

## Documentation Ownership

- use [_meta/system-documentation.md](/Users/antonkulikov/Projects/drtalk/_meta/system-documentation.md) for evergreen technical behavior
- use [_meta/project-task-list.md](/Users/antonkulikov/Projects/drtalk/_meta/project-task-list.md) for status and remaining work
- use [test/test-documentation.md](/Users/antonkulikov/Projects/drtalk/test/test-documentation.md) for verification approach
