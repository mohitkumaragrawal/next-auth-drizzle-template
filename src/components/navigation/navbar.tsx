import ModeToggle from "./mode-toggle";

import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { auth } from "@/auth/server";

import LoginButton from "./login-button";
import ProfileDropdown from "./profile-dropdown";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900", "600"],
  style: "normal",
});

export async function NavBar() {
  const session = await auth();

  return (
    <nav className="border-b px-5 py-3 flex items-center justify-between">
      <Link href={"/"}>
        <p className={cn("text-xl font-semibold", poppins.className)}>
          Template
        </p>
      </Link>

      <div className="flex items-center gap-3">
        <ModeToggle />
        {session ? (
          <ProfileDropdown session={session} status="authenticated" />
        ) : (
          <LoginButton />
        )}
      </div>
    </nav>
  );
}
