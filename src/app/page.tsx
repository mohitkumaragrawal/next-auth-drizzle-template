import React from "react";

import { Button } from "@/components/ui/button";
import { auth } from "@/auth/server";

export default async function HomePage() {
  const session = await auth();

  return (
    <div>
      <Button>Hello</Button>
      <Button variant="secondary">Hello</Button>

      <pre>{JSON.stringify(session?.user, null, 2)}</pre>
    </div>
  );
}
