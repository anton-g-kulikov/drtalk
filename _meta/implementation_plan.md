# Implementation Plan: drTalk B&W Interactive Prototype

This plan outlines the steps to build a high-fidelity interactive prototype of the drTalk platform using a black-and-white wireframe aesthetic.

## 1. Project Initialization & Foundation
- [ ] Bootstrap Next.js project with TypeScript and Tailwind CSS.
- [ ] Define B&W Design System in `globals.css` (wireframe borders, mono-spaced or clean sans-serif fonts, high-contrast states).
- [ ] Implement Main Layout with Navigation Sidebar (icons from mockups).
- [ ] Set up basic routing (Dashboard, Referrals, Settings, Login).

## 1.5. Main Screen & Navigation
- [ ] **Left Navigation**: Collapsible sidebar with icons for Dashboard, Referrals, Channels, and Settings.
- [ ] **Header**: Persistent top bar showing the current Practice Title and a User Menu (profile, logout).
- [ ] **Breadcrumbs**: Simple navigation indicators for nested views.

## 2. Onboarding Experience
- [ ] **Step 1: Auth**: Login and Sign-up screens.
- [ ] **Step 2: Verification**: Email verification code entry.
- [ ] **Step 3: Role Selection**: Welcome screen with "Create Practice" vs "Join Team".
- [ ] **Step 4: Practice Setup**: 3-step wizard (Details -> NPI/License Verification -> Invite Team).

## 3. Referrals (Activity Center) Management
- [ ] **Dashboard**: High-level metrics (Referrals Received, Capture Rate, Conversion).
- [ ] **Referral Pipeline**: Tabbed table view (Received, Working on, Processed, Archived).
- [ ] **Filtering & Search**: Mock filtering and search functionality.
- [ ] **Confidence Scoring**: UI indicators for AI confidence levels.

## 4. Referral Detail & Collaboration
- [ ] **Detail Modal**: Side-panel or modal showing patient info and attachments grid.
- [ ] **Communication**: Right-side comments panel for internal discussion.
- [ ] **Status Control**: Workflow transitions (Move to In Progress, Complete, etc.).
- [ ] **AI Correction**: "Low Confidence" banner and Editor Mode for data refinement.

## 5. External/Guest Referral Flow
- [ ] **Landing Page**: Simplified entry for guest referrals.
- [ ] **Guest Form**: 3-part form (Patient Info, Case Details, Attachments).
- [ ] **Post-Submission**: Confirmation screen with "Create Account" upsell.

## 6. Channels and Communication
- [ ] **Internal Channels**: Communication within a practice (e.g., General, Clinical, Admin).
- [ ] **Inter-practice Channels**: Direct messaging between different practices.
- [ ] **Patient Channels**: Secure SMS/Email communication per patient.
- [ ] **Public Channels**: Open discovery channels for non-PHI discussion.
- [ ] **Messaging UI**: Chat interface with message history, status indicators, and transport types (App, SMS, Email).

## 7. Polish & Interaction
- [ ] Add transitions between states.
- [ ] Ensure responsive layout.
- [ ] Final audit against mockup PDFs.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Wireframe theme)
- **Icons**: Lucide React (or similar)
- **State**: React Context or Zustand (for prototype persistence)
