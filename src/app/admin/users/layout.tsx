import { assertRole } from "@/actions/assert-role";
import { notFound } from "next/navigation";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await assertRole("owner");
    return <>{children}</>;
  } catch {
    return notFound();
  }
}
