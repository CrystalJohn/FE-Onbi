export default function SnapshotsPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Snapshots & Alerts</h1>
      {/* TODO: Snapshot gallery - filter by session, type (left_desk, bad_posture, manual) */}
    </div>
  );
}
