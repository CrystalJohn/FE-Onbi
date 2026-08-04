export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-surface flex min-h-screen items-center justify-center bg-slate-50/50 p-4 md:p-8">
      <div className="w-full max-w-5xl flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
