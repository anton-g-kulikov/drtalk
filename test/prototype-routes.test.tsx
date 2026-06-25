import React, { Suspense } from 'react';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import LandingPage from '@/app/page';
import ReferralPage from '@/app/referral/page';
import OnboardingPage from '@/app/onboarding/page';
import DashboardPage from '@/app/dashboard/page';
import DentistDashboardPage from '@/app/dentist/dashboard/page';
import ChannelsPage from '@/app/channels/page';
import ReferralsPage from '@/app/referrals/page';
import SettingsPage from '@/app/settings/page';
import NotificationsPage from '@/app/settings/notifications/page';
import NetworkPage from '@/app/network/page';
import DentistNetworkPage from '@/app/dentist/network/page';
import DocumentDetailClient from '@/app/documents/[id]/DocumentDetailClient';
import ReferralDetailClient from '@/app/referrals/[id]/ReferralDetailClient';
import ExternalViewerClient from '@/app/external/viewer/[id]/viewer-client';
import { renderPrototype } from './utils/renderPrototype';

function renderRoute(ui: React.ReactElement) {
  return renderPrototype(<Suspense fallback={<div>Loading</div>}>{ui}</Suspense>);
}

describe('prototype route use cases', () => {
  it('public entry shows login, onboarding, and unauthenticated referral paths', () => {
    renderRoute(<LandingPage />);

    expect(screen.getByRole('heading', { name: /drtalk/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enter dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create or join practice/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refer a patient without an account/i })).toBeInTheDocument();
  });

  it('guest referral flow advances through the visible prototype steps', async () => {
    const user = userEvent.setup();
    renderRoute(<ReferralPage />);

    await user.selectOptions(screen.getAllByRole('combobox')[0], 'AZ');
    await user.type(screen.getByPlaceholderText(/type practice name/i), 'Valley');
    await user.click(await screen.findByRole('button', { name: /valley endodontics/i }));
    expect(await screen.findByText(/selected:\s*valley endodontics/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your email/i)).toBeInTheDocument();
  });

  it('onboarding flow advances through account, verification, practice, role, invite, and success states', async () => {
    const user = userEvent.setup();
    renderRoute(<OnboardingPage />);

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^create account$/i }));
    expect(screen.getByRole('heading', { name: /verify email/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /verify & continue/i }));
    expect(screen.getByRole('heading', { name: /welcome to drtalk/i })).toBeInTheDocument();

    await user.click(screen.getByText(/create practice/i));
    expect(screen.getByRole('heading', { name: /practice details/i })).toBeInTheDocument();

    await user.click(screen.getByPlaceholderText(/valley dental care/i));
    expect(await screen.findByDisplayValue(/valley endodontics/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next step/i }));
    expect(screen.getByRole('heading', { name: /choose your role/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByRole('heading', { name: /invite your team/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /skip for now/i }));
    expect(screen.getByRole('heading', { name: /success/i })).toBeInTheDocument();
  });

  it('specialist dashboard renders the core prototype regions and actions', async () => {
    renderRoute(<DashboardPage />);

    expect(await screen.findByText(/referrals received/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^documents$/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /send document/i })).toBeInTheDocument();
  });

  it('dentist dashboard renders referral and document actions', async () => {
    renderRoute(<DentistDashboardPage />);

    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refer a patient/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send document/i })).toBeInTheDocument();
  });

  it('channels route renders list search and message/document tabs', async () => {
    renderRoute(<ChannelsPage />);

    expect(await screen.findByPlaceholderText(/search conversations/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/message #/i)).toBeInTheDocument();
    expect(screen.getByTitle(/attach document/i)).toBeInTheDocument();
  });

  it('network routes render role-specific analytics, directory tabs, and primary actions', async () => {
    const user = userEvent.setup();
    renderRoute(<NetworkPage />);

    expect(await screen.findByRole('heading', { name: /practice network/i })).toBeInTheDocument();
    expect(screen.getByText(/total referrals received/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /my network/i }));
    expect(screen.getAllByText(/chat now/i).length).toBeGreaterThan(0);

    cleanup();
    renderRoute(<DentistNetworkPage />);
    expect(await screen.findByRole('heading', { name: /specialist network/i })).toBeInTheDocument();
    expect(screen.getByText(/total referrals sent/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /my network/i }));
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    const actionMenus = screen.getAllByRole('button', { name: /practice actions/i });
    expect(actionMenus.length).toBeGreaterThan(0);
    await user.click(actionMenus[0]);
    await user.click(screen.getByRole('button', { name: /remove connection/i }));
    expect(confirmSpy).toHaveBeenCalled();
    expect(screen.getByText(/connection removed with/i)).toBeInTheDocument();
    confirmSpy.mockRestore();
  });

  it('document detail renders preview metadata and archives active inbox documents', async () => {
    const user = userEvent.setup();
    localStorage.setItem('drtalk_specialist_docs', JSON.stringify([
      {
        id: 'doc-custom',
        name: 'REFERRAL_FORM_JOHN_DOE.PDF',
        sender: 'Dr. Jane Doe (Dentist)',
        date: '09:15 AM 05/18/2026',
        size: '1.2 MB',
        fromChannel: false,
      },
    ]));

    renderRoute(<DocumentDetailClient id="doc-custom" />);

    expect(await screen.findByRole('heading', { name: /referral_form_john_doe.pdf/i })).toBeInTheDocument();
    expect(screen.getByText(/clinical document review/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /archive/i }));
    expect(screen.getByText(/archived from inbox/i)).toBeInTheDocument();
  });

  it('referral detail renders case activity and auto-accepts referral', async () => {
    const user = userEvent.setup();
    renderRoute(<ReferralDetailClient id="2" />);

    expect(await screen.findByRole('heading', { name: /bob marley/i })).toBeInTheDocument();
    expect(screen.getByText(/case activity/i)).toBeInTheDocument();
    expect(await screen.findByText(/^accepted$/i)).toBeInTheDocument();
  });

  it('unrecognized sender renders as page with document and categorize tabs', async () => {
    const user = userEvent.setup();
    renderRoute(<ReferralDetailClient id="doc-unrecognized-1" />);

    expect(await screen.findByRole('heading', { name: /unrecognized sender/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /categorize & route/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /categorize & route/i }));
    expect(screen.getByPlaceholderText(/type to search and add practice/i)).toBeInTheDocument();
  });

  it('external secure viewer renders case documents, status actions, and reply composer', async () => {
    const user = userEvent.setup();
    renderRoute(<ExternalViewerClient />);

    expect(await screen.findByRole('heading', { name: /drtalk secure portal/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /alice cooper/i })).toBeInTheDocument();
    expect(screen.getByText(/documents provided/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /release/i }));
    expect(await screen.findByText(/pipeline updated in referring dentist/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/compose secure reply/i), 'Please schedule follow-up imaging.');
    await user.click(screen.getByRole('button', { name: /send reply/i }));
    expect(await screen.findByText(/please schedule follow-up imaging/i)).toBeInTheDocument();
  });

  it('referrals and settings routes render their prototype sections', async () => {
    renderRoute(<ReferralsPage />);
    expect(await screen.findByRole('heading', { name: /referrals/i })).toBeInTheDocument();

    cleanup();
    renderRoute(<SettingsPage />);
    expect(screen.getAllByText(/practice settings/i).length).toBeGreaterThan(0);

    cleanup();
    renderRoute(<NotificationsPage />);
    await waitFor(() => {
      expect(screen.getAllByText(/referral notifications/i).length).toBeGreaterThan(0);
    });
  });
});
