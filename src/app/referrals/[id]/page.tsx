import ReferralDetailClient from "./ReferralDetailClient";

// All base referral IDs from mock data
export function generateStaticParams() {
  return [
    // Specialist-side
    { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' },
    { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' },
    // Dentist-side
    { id: 'D-1002' }, { id: 'D-1003' }, { id: 'D-1004' },
    { id: 'D-1005' }, { id: 'D-1006' }, { id: 'D-1007' }, { id: 'D-1008' },
    // External referrals
    { id: 'ext-ref-1' }, { id: 'ext-ref-2' },
  ];
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

