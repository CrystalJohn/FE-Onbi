export default function MonitoringDashboardPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Giám sát</h1>
      {/* TODO: Current session, start/stop monitoring, history, WebRTC live stream */}
    </div>
  );
}
