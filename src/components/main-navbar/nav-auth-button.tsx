import { UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export const NavAuthButton = () => {
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/sign-in">
        <UserIcon strokeWidth={1.2} />
      </Link>
    </Button>
  );
};
