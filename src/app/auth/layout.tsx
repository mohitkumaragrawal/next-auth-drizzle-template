export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100%-70px)] flex items-center justify-center p-3">
      {children}
    </div>
  );
}
