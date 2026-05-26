export default function ChildDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Chi tiết hồ sơ trẻ</h1>
      {/* TODO: Child detail view/edit/delete */}
    </div>
  );
}
