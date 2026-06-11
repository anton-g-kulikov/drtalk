import React from 'react';
import { render } from '@testing-library/react';
import { CommentProvider } from '@/components/Comments/CommentContext';
import { SubscriptionProvider } from '@/components/SubscriptionContext';
import { VerificationProvider } from '@/components/VerificationContext';

export function renderPrototype(ui: React.ReactElement) {
  return render(
    <VerificationProvider>
      <SubscriptionProvider>
        <CommentProvider>
          {ui}
        </CommentProvider>
      </SubscriptionProvider>
    </VerificationProvider>
  );
}
