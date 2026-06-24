"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DentistSubscriptionRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dentist/settings');
  }, [router]);
  return null;
}
