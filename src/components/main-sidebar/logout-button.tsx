import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner2 } from "../shared/spinner-2";

interface LogoutButtonProps {
  onClick?: () => void;
}

export const LogoutButton = ({ onClick }: LogoutButtonProps) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);

    try {
      await authClient.signOut();
      setPending(false);
      router.push("/");
    } catch {
      setPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="flex w-full justify-start"
      onClick={() => {
        handleLogout();
        onClick?.();
      }}
      disabled={pending}
    >
      {pending ? <Spinner2 /> : <LogOutIcon />}
      Logout
    </Button>
  );
};
