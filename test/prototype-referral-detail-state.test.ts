import { describe, expect, it } from 'vitest';
import { getMessages, initialReferrals, saveMessages, saveReferrals } from '@/lib/referrals';
import {
  appendReferralComment,
  getReferralActivityStorageKey,
  loadReferralActivityLogs,
  transitionReferralDetailStatus,
} from '@/prototype/referralDetailState';

describe('prototype referral detail state helpers', () => {
  it('seeds activity logs and falls back from malformed localStorage', () => {
    const referral = initialReferrals[1];
    localStorage.setItem(getReferralActivityStorageKey(referral.id), '{bad json');

    const logs = loadReferralActivityLogs(referral);

    expect(logs[0].text).toContain(referral.practice || referral.dentist);
    expect(JSON.parse(localStorage.getItem(getReferralActivityStorageKey(referral.id)) || '[]')).toHaveLength(2);
  });

  it('transitions accepted status, writes activity, and sends one case-channel message', () => {
    const referral = initialReferrals.find((item) => item.id === 'ext-ref-1') || initialReferrals[0];
    saveReferrals(initialReferrals);
    saveMessages({ [`case_${referral.id}`]: [] });

    const first = transitionReferralDetailStatus({
      referral,
      newStatus: 'Accepted',
      currentLogs: [],
    });
    transitionReferralDetailStatus({
      referral,
      newStatus: 'Accepted',
      currentLogs: first.activityLogs,
    });

    expect(first.referrals.find((item) => item.id === referral.id)?.status).toBe('Accepted');
    expect(first.activityLogs[0].text).toMatch(/accepted/i);
    expect(getMessages()[`case_${referral.id}`]).toHaveLength(1);
    expect(getMessages()[`case_${referral.id}`][0]).toMatchObject({ transport: 'Email' });
  });

  it('appends comments to the visible activity log', () => {
    const updatedLogs = appendReferralComment({
      referralId: '1',
      commentText: 'Call patient before scheduling.',
      currentLogs: [],
    });

    expect(updatedLogs).toMatchObject([
      {
        user: 'Administrator',
        text: 'Call patient before scheduling.',
        isDark: true,
      },
    ]);
  });
});
