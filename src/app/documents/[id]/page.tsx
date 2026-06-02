import DocumentDetailClient from './DocumentDetailClient';

export async function generateStaticParams() {
  return [
    { id: 'doc-1' },
    { id: 'doc-2' },
    { id: 'doc-3' },
    { id: 'doc-dentist-1' },
    { id: 'doc-dentist-2' },
    { id: 'doc-dentist-3' }
  ];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <DocumentDetailClient id={params.id} />;
}
