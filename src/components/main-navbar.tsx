"use client";

import { MenuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { HiShoppingBag } from "react-icons/hi2";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";

export const MainNavbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="flex h-17 items-center justify-between p-4">
      <h1 className="font-serif text-2xl font-medium">
        <Link href="/" className="font-niconne">
          Temmy Accessories
        </Link>
      </h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <SearchIcon strokeWidth={1.2} />
        </Button>
        <Button variant="ghost" size="icon">
          <HiShoppingBag className="size-4.5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <MenuIcon className="size-5" strokeWidth={1.2} />
        </Button>
      </div>
    </nav>
  );
};
