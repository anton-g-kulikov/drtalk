import { TeamMemberEdit } from "@/components/TeamMemberEdit";

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
}

export default async function SpecialistTeamMemberEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TeamMemberEdit memberId={id} backPath="/dashboard/settings/team" />;
}
