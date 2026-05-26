export default function AdminDeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Chi tiết Device</h1>
      {/* TODO: Device detail - who activated, assigned to which child */}
    </div>
  );
}
