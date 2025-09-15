import { HandbagIcon, MenuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const MainNavbar = () => {
  return (
    <nav className="flex items-center justify-between p-4">
      <h1 className="font-serif text-2xl font-medium">
        <Link href="/">Temi Accessories</Link>
      </h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <SearchIcon />
        </Button>
        <Button variant="ghost" size="icon">
          <HandbagIcon />
        </Button>
        <Button variant="ghost" size="icon">
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};
