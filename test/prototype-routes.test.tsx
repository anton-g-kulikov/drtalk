import React, { Suspense } from 'react';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import LandingPage from '@/app/page';
import ReferralPage from '@/app/referral/page';
import DashboardPage from '@/app/dashboard/page';
import DentistDashboardPage from '@/app/dentist/dashboard/page';
import ChannelsPage from '@/app/channels/page';
import ReferralsPage from '@/app/referrals/page';
import SettingsPage from '@/app/settings/page';
import NotificationsPage from '@/app/settings/notifications/page';
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

  it('specialist dashboard renders the core prototype regions and actions', async () => {
    renderRoute(<DashboardPage />);

    expect(await screen.findByText(/referrals received/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^documents$/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /send document/i })).toBeInTheDocument();
  });

  it('dentist dashboard renders referral and document actions', async () => {
    renderRoute(<DentistDashboardPage />);

    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send a referral/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send document/i })).toBeInTheDocument();
  });

  it('channels route renders list search and message/document tabs', async () => {
    renderRoute(<ChannelsPage />);

    expect(await screen.findByPlaceholderText(/search conversations/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/message #/i)).toBeInTheDocument();
    expect(screen.getByTitle(/attach document/i)).toBeInTheDocument();
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
