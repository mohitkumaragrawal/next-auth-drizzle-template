import React from "react";

import { Button } from "@/components/ui/button";
import { auth } from "@/auth/server";

export default async function HomePage() {
  const session = await auth();

  return <div></div>;
}
