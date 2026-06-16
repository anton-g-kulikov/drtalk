import ReferralDetailClient from "./ReferralDetailClient";

import { generateMockData } from "@/lib/mockGenerator";

export function generateStaticParams() {
  const mockData = generateMockData();
  return mockData.referrals.map((r) => ({ id: r.id }));
}

// Don't throw for generated referral IDs not in the static list
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <ReferralDetailClient id={resolvedParams.id} />;
}

