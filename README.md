# drTalk Platform Prototype

This repository contains a high-fidelity, interactive prototype of the drTalk platform, featuring a professional black-and-white "wireframe" aesthetic. It is designed to demonstrate core workflows including onboarding, referral management, clinical collaboration, and practice networking.

## 🚀 Live Prototype
The prototype is automatically deployed and accessible at:
**[https://prototype.drtalk.com](https://prototype.drtalk.com)**

## ✨ Key Features

### 1. Referral Management (Activity Center)
A comprehensive system for tracking and processing clinical referrals with specialized views for both Sending and Receiving practices.
- **Specialist Pipeline**: 4-stage processing: `Received`, `Working on`, `Processed`, and `Archived`.
- **Dentist Tracking**: Status updates for sent cases: `Draft`, `Sent`, `Accepted`, `Scheduled`, `In Progress`, and `Completed`.
- **Referral Detail View**: Full patient context, attachments, and clinical history.
- **AI-Assisted Processing**: UI indicators for data extraction confidence and manual correction banners.

### 2. Clinical Communication (Channels)
Secure, context-aware messaging for clinical teams.
- **Internal Channels**: Dedicated spaces for practice-wide discussion.
- **Case-Specific Chat**: Communication tied directly to specific patient referrals.
- **Inter-Practice Hubs**: Seamless collaboration between dentists and specialists.

### 3. Practice Network & Directory
A searchable ecosystem for finding and connecting with clinical partners.
- **Specialist Network**: For dentists to find, vet, and refer patients to specialists.
- **Dentist Network**: For specialists to discover and manage relationships with referring practices.
- **Bidirectional Connections**: Streamlined "Connect" and "Refer" workflows.

### 4. Learning Hub (Academy)
Integrated educational module for continuous professional development and practice growth.

### 5. Multi-Role Dashboard
Tailored experiences for different clinical roles:
- **Dentist Dashboard**: Focus on outgoing referrals, patient capture, and clinical networking.
- **Specialist Dashboard**: Focus on incoming case volume, processing efficiency, and referring partner management.

### 6. Prototype Feedback System
Integrated real-time commenting system using **Supabase**.
- **Contextual Annotations**: Feedback markers placed throughout the UI.
- **Anonymous Participation**: Allows viewers to leave feedback without formal accounts.

## 🎨 Design Aesthetic
- **Wireframe Aesthetic**: High-contrast B&W theme to focus on workflow and architecture.
- **Mobile First**: Fully optimized for Desktop, Tablet, and Mobile viewports.
- **Interactive Transitions**: Smooth UI state changes and modal-based workflows.

## 🛠 Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Persistence**: Supabase (for prototype feedback)
- **Deployment**: GitHub Pages (Static Export)

## 📂 Project Structure
- `src/app/`: Core application routes and layouts.
- `src/components/`: Reusable UI components and specialized modules (Comments, Navigation).
- `src/lib/`: Shared utilities, types, and API clients.
- `_meta/`: Design documentation, implementation plans, and domain models.

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build & Export
```bash
npm run build
```
The static export will be generated in the `out/` directory.

## 📖 Documentation
Detailed project documentation and research are available in the `/_meta` directory:
- `implementation_plan.md`: Detailed implementation steps.
- `project-task-list.md`: Current progress and roadmap.
- `schema.json`: Data models.
- `drtalk_ Objects and Roles model.md`: Detailed domain model.
- `drtalk_ Progressive Onboarding v2.md`: Onboarding logic.
- `drtalk_ Referrals&Activity Center.md`: Referral processing details.
