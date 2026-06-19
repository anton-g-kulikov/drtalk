import ExternalViewerClient from './viewer-client';

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: 'D-1002' },
    { id: 'D-1003' },
    { id: 'D-1004' },
    { id: 'D-1005' },
    { id: 'D-1006' },
    { id: 'D-1007' },
    { id: 'D-1008' }
  ];
}

export const dynamicParams = false;

export default function ExternalViewerPage() {
  return <ExternalViewerClient />;
}
