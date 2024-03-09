export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100%-70px)] items-center justify-center p-3">
      {children}
    </div>
  );
}
