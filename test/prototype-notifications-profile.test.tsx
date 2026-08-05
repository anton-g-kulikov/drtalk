import React from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotificationsPage from '@/app/settings/notifications/page';
import { UserProfilePage } from '@/components/UserProfilePage';
import { renderPrototype } from './utils/renderPrototype';

describe('Notifications & User Profile feedback updates', () => {
  it('renders updated Administrative Messages headings and consistent Email toggles on NotificationsPage', () => {
    renderPrototype(<NotificationsPage />);
    
    expect(screen.getByText(/3\. Administrative Messages/i)).toBeInTheDocument();
    expect(screen.getByText(/Join Requests & New Users/i)).toBeInTheDocument();
    expect(screen.queryByText(/Email Only/i)).toBeNull();
  });

  it('renders updated User Profile subcopy without "when away"', () => {
    renderPrototype(<UserProfilePage />);

    expect(screen.getByText(/When new messages or documents are shared in direct messages/i)).toBeInTheDocument();
    expect(screen.getByText(/When new posts or messages are published in channels and the Learning Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/Consolidated email summary of unread activity/i)).toBeInTheDocument();
    expect(screen.queryByText(/when away/i)).toBeNull();
  });
});
