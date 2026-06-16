import ReferralDetailClient from "./ReferralDetailClient";

import { generateMockData } from "@/lib/mockGenerator";

export function generateStaticParams() {
  const mockData = generateMockData();
  const ids = mockData.referrals.map((r) => ({ id: r.id }));
  // Add unrecognized-sender placeholder IDs so static export never 404s
  ids.push({ id: 'doc-unrecognized-1' }, { id: 'doc-unrecognized-2' }, { id: 'doc-unrecognized-3' }, { id: 'doc-unrecognized-4' });
  return ids;
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

