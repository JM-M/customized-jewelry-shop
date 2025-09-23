"use client";

import { MenuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";
import { CartButton } from "./cart-button";

export const MainNavbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="bg-background sticky top-0 z-50 flex h-17 items-center justify-between p-4">
      <h1 className="font-serif text-2xl font-medium">
        <Link href="/" className="font-niconne">
          Temmy Accessories
        </Link>
      </h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <SearchIcon strokeWidth={1.2} />
        </Button>
        <CartButton />
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <MenuIcon className="size-5" strokeWidth={1.2} />
        </Button>
      </div>
    </nav>
  );
};
