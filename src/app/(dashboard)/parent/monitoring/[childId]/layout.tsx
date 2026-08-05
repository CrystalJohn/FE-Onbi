import ChildPinGuard from '@/components/parent/ChildPinGuard';

export default async function MonitoringChildLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  return <ChildPinGuard childId={childId}>{children}</ChildPinGuard>;
}
