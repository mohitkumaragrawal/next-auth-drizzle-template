"use client";

import { signOut } from "next-auth/react";
import { LayoutDashboardIcon, LogOutIcon, UserIcon } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import type { Session } from "next-auth";
import hasRole from "@/data/has-role";
import { DropdownMenuSub } from "@radix-ui/react-dropdown-menu";

interface Props {
  session: Session;
  status: string;
}

export default function ProfileDropdown({ session, status }: Props) {
  if (status === "unauthenticated") {
    return (
      <div>
        <Link href="/auth/signin">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    signOut();
  };

  const owner = hasRole(session, "owner");

  if (status === "authenticated") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <img
              src={session?.user?.image ?? ""}
              alt="profile imge"
              className="h-full w-full object-cover"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="flex gap-4 p-5">
            <img
              src={session?.user?.image ?? ""}
              alt="profile imge"
              className="h-10 w-10 overflow-hidden rounded-full"
            />
            <div>
              <p>{session.user.name}</p>
              <p className="font-normal opacity-60">{session.user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/dashboard">
            <DropdownMenuItem>
              <LayoutDashboardIcon className="mr-3" />
              Dashboard
            </DropdownMenuItem>
          </Link>

          {owner && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="">Owner</DropdownMenuLabel>

              <Link href="/admin/users">
                <DropdownMenuItem>
                  <UserIcon className="mr-3" />
                  Manage Users
                </DropdownMenuItem>
              </Link>
            </>
          )}
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOutIcon className="mr-3" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
