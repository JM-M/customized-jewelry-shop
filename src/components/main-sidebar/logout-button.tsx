import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner2 } from "../shared/spinner-2";

interface LogoutButtonProps {
  onClick?: () => void;
  isIconOnly?: boolean;
}

export const LogoutButton = ({
  onClick,
  isIconOnly = false,
}: LogoutButtonProps) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);

    try {
      await authClient.signOut();
      setPending(false);
      // TODO: Clear all protected trpc procedures
      router.push("/");
    } catch {
      setPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className={isIconOnly ? undefined : "flex w-full justify-start"}
      onClick={() => {
        handleLogout();
        onClick?.();
      }}
      disabled={pending}
      size={isIconOnly ? "icon" : "default"}
    >
      {pending ? <Spinner2 /> : <LogOutIcon strokeWidth={1.2} />}
      {isIconOnly ? null : "Logout"}
    </Button>
  );
};
