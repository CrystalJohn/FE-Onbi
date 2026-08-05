import ChildPinGuard from '@/components/parent/ChildPinGuard';

export default async function ChildEditLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChildPinGuard childId={id}>{children}</ChildPinGuard>;
}
