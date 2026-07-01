import React from 'react';
import { NetworkPracticeDetailContent } from '@/components/prototype/NetworkPracticeDetailContent';
import { initialNetwork } from '@/lib/referrals';

export function generateStaticParams() {
  return initialNetwork.map((p) => ({
    id: p.id,
  }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DentistPracticeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <NetworkPracticeDetailContent
      practiceId={id}
      role="dentist"
    />
  );
}
