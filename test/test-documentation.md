# Test Documentation

## Current Status

There is no automated test suite checked into this repository today.

For this prototype, verification currently relies on:

- `npm run lint` - currently failing on two existing `react-hooks/set-state-in-effect` errors
- `npm run build` - passing as of this documentation update
- manual smoke testing of the major route flows

Current lint failures:

- [`src/app/onboarding/page.tsx:60`](/Users/antonkulikov/Projects/drtalk/src/app/onboarding/page.tsx:60) sets invite state from inside an effect
- [`src/components/VerificationContext.tsx:36`](/Users/antonkulikov/Projects/drtalk/src/components/VerificationContext.tsx:36) sets stored verification state synchronously inside an effect

## Why Coverage Is Missing

The project has grown as a high-fidelity product prototype with most behavior implemented directly in page components and backed by inline mock data. That made UI iteration fast, but it left the repo without a formal test harness.

## Minimum Manual Smoke Checklist

### Public and Onboarding

- `/` renders and branches to dentist and specialist tracks
- `/referral` advances through identify, patient, case, attachment, and success states
- `/onboarding` advances through account, verification, role, practice, and invite steps
- `/verify` completes and returns the user to the dashboard flow

### Specialist Flow

- `/dashboard` shows verification and owner-state banners correctly
- `/referrals` filters by pipeline state and search query
- `/referrals/[id]` loads the referral detail layout
- `/channels` switches between channel types and shows patient communication states
- `/settings`, `/settings/notifications`, and `/dashboard/settings/team` render without navigation breaks

### Dentist Flow

- `/dentist/dashboard` renders referral tracking and quick actions
- `/dentist/referral` advances through the outbound referral wizard
- `/dentist/referrals` reflects dentist copy and navigation behavior
- `/dentist/channels`, `/dentist/network`, and `/dentist/academy` render without role regressions
- `/dentist/settings`, `/dentist/settings/notifications`, and `/dentist/settings/team` render without navigation breaks

### Send Document Flow from Dentist Dashboard

- Click "Send Document" button on `/dentist/dashboard` to verify that the Send Document Modal opens correctly.
- Verify the list of connected practices in the practice dropdown match the `'inter-practice'` channels.
- Verify the list of sent referrals in the referral dropdown match the active referrals.
- Verify that selecting a practice filters the referral dropdown, and selecting a referral auto-fills the practice.
- Verify that the drag-and-drop zone works (triggers "Quick attach mock scan" or native file browse).
- Verify that patient info fields (First Name, Last Name, DOB) and custom message can be filled.
- Verify that clicking "Send Document" triggers a toast notification, closes the modal, and creates a corresponding mock message in that practice's channel.

### Shared Stateful Behaviors

- resetting verification state changes banner and routing behavior
- ending the trial opens the paywall path for specialist flows
- comment markers open the side panel
- comment loading and posting work when valid Supabase env vars are configured

## Recommended First Automated Checks

1. route render smoke tests for public, specialist, and dentist entry points
2. context tests for verification gating and subscription modal behavior
3. interaction tests for referral and onboarding step transitions
4. comment-panel rendering tests with a mocked Supabase client
