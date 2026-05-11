# Project Task List

## Delivered Prototype Scope

- [x] Core Next.js prototype shell with shared layout, role-aware navigation, and static export build
- [x] Public landing page for dentist vs specialist entry
- [x] Guest referral submission flow
- [x] Specialist onboarding and verification prototype flows
- [x] Specialist dashboard, referral queue, referral detail, channels, network, academy, and settings screens
- [x] Dentist dashboard, referral creation, sent-referral tracking, channels, network, academy, and settings screens
- [x] Team, role, and PHI access management screens
- [x] Subscription trial banner and pricing/paywall modal
- [x] Supabase-backed contextual comment system
- [x] Documentation alignment audit for current repo state

## Current Gaps / Next Work

- [ ] Resolve current `npm run lint` failures in onboarding and verification state initialization
- [ ] Add an automated test suite for critical route rendering and context-driven flows
- [ ] Move inline mock data into shared fixtures or a clearer fake-data layer
- [ ] Replace placeholder invite, billing, and configuration actions with explicit prototype states or connected backends
- [ ] Add a structured route-level QA pass for mobile and desktop breakpoints
- [ ] Separate product-domain state from view components if the prototype continues to grow

## Deferred / Optional

- [ ] Real authentication and session handling
- [ ] Persistent referral, team, and messaging backends
- [ ] Accessibility audit and keyboard-navigation hardening
- [ ] Analytics / event instrumentation
