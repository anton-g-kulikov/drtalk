import ReferralDetailClient from '@/app/referrals/[id]/ReferralDetailClient';

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: 'doc-unrecognized-1' },
    { id: 'doc-unrecognized-2' },
    { id: 'doc-unrecognized-3' },
    { id: 'doc-unrecognized-4' },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <ReferralDetailClient id={resolvedParams.id} />;
}
