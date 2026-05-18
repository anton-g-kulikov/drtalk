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

## Active Task: Send Document Feature on Dentist Dashboard (Completed)

- [x] **Goal**: Add a "Send Document" button to the dentist dashboard that opens a structured form to select a connected practice and an optional referral, and allows file attachment/upload.
- [x] **Success Criteria**:
  1. A second button "Send Document" next to "Send a Referral" on the Dentist Dashboard.
  2. The button opens a modal similar to the "Attach Document" modal in the inter-practice chat.
  3. The modal contains a "Connected Practice" dropdown listing all inter-practice connections.
  4. The modal contains an optional "Associated Sent Referral" dropdown listing sent referrals.
  5. The referral dropdown automatically filters based on selected practice, or selecting a referral auto-selects its practice.
  6. The modal contains the premium file attachment/upload zone, patient information fields, and custom message field.
  7. Clicking "Send Document" validates inputs, simulates a secure document transfer, triggers a toast success notification, and adds the document/message to the mock channel history.
- [x] **In Scope**:
  - Dentist dashboard UI modifications.
  - New "Send Document Modal" component or inline modal.
  - Dropdown selection logic for connected practices and referrals.
  - Integration with existing mock state/messages/documents.
- [x] **Out of Scope**:
  - Real file uploads to a backend (uses existing premium mock/file-selection behavior).
  - Real database persistence.

## Deferred / Optional

- [ ] Real authentication and session handling
- [ ] Persistent referral, team, and messaging backends
- [ ] Accessibility audit and keyboard-navigation hardening
- [ ] Analytics / event instrumentation
