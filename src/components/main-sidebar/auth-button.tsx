import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import Link from "next/link";

interface AuthButtonProps {
  onClick: () => void;
}

export const AuthButton = ({ onClick }: AuthButtonProps) => {
  return (
    <Button
      variant="ghost"
      className="flex w-full justify-start"
      onClick={onClick}
      asChild
    >
      <Link href="/sign-in">
        <UserIcon />
        Sign In | Create Account
      </Link>
    </Button>
  );
};
