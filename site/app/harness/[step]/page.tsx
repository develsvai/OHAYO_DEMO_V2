import { notFound } from 'next/navigation';
import { HarnessStageViewer } from '@/components/HarnessStageViewer';
import { buildStages } from '@/lib/scenario';

export default async function HarnessPage({ params, searchParams }: {
  params: Promise<{ step: string }>;
  searchParams: Promise<{ speed?: string }>;
}) {
  const { step } = await params;
  if (!/^[1-5]$/.test(step)) notFound();
  const stage = buildStages[Number(step) - 1];
  const requestedSpeed = Number((await searchParams).speed);
  const speed = Number.isFinite(requestedSpeed) && requestedSpeed >= 1 && requestedSpeed <= 60 ? requestedSpeed : 1;
  return <HarnessStageViewer stage={stage} speed={speed} />;
}
