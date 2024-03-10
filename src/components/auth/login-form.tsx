"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "900",
  style: "normal",
});

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const login = (provider: string) => {
    signIn(provider, { callbackUrl });
  };

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <p className={cn("text-2xl font-bold", poppins.className)}>
          Welcome Back
        </p>
        <p className="text-muted-foreground">Login to continue</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className={"w-full space-x-3"}
          variant="default"
          onClick={() => login("github")}
        >
          <FaGithub size={24} />
          <div className="flex-1">Login With Github</div>
        </Button>
        <Button
          className={"w-full space-x-3"}
          variant="outline"
          onClick={() => login("google")}
        >
          <FaGoogle size={24} />
          <span className="flex-1">Login With Google</span>
        </Button>
      </CardContent>
    </Card>
  );
}
