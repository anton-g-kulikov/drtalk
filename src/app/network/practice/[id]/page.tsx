import React from 'react';
import { NetworkPracticeDetailContent } from '@/components/prototype/NetworkPracticeDetailContent';

export function generateStaticParams() {
  const ids: string[] = [];
  for (let i = 1; i <= 5; i++) ids.push(`sp-${i}`);
  for (let i = 1; i <= 16; i++) ids.push(`dn-${i}`);
  for (let i = 1; i <= 15; i++) ids.push(`ext-${i}`);
  return ids.map((id) => ({ id }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SpecialistPracticeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <NetworkPracticeDetailContent
      practiceId={id}
      role="specialist"
    />
  );
}
