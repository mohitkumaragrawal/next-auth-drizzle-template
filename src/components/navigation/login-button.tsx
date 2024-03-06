import Link from "next/link";
import { Button } from "../ui/button";

export default function LoginButton() {
  return (
    <Link href={"/auth/login"}>
      <Button>Login</Button>
    </Link>
  );
}
