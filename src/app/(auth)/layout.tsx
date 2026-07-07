export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-surface flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4 sm:p-8">
      <div className="w-full max-w-5xl">{children}</div>
    </div>
  );
}
