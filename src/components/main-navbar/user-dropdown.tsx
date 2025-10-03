"use client";

import { authClient } from "@/lib/auth-client";
import { LogOut, User, UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Spinner2 } from "../shared/spinner-2";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const UserDropdown = () => {
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);

    try {
      await authClient.signOut();
      setPending(false);
    } catch {
      setPending(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserIcon strokeWidth={1.2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <User className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={pending}
          className="flex items-center gap-2"
        >
          {pending ? <Spinner2 /> : <LogOut className="size-4" />}
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
