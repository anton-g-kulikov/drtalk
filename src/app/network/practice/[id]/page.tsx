"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { NetworkPracticeDetailContent } from '@/components/prototype/NetworkPracticeDetailContent';

export default function SpecialistPracticeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  return (
    <NetworkPracticeDetailContent
      practiceId={id}
      role="specialist"
      onBack={() => router.push('/network')}
    />
  );
}
