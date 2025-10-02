"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDownIcon, MenuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSidebar } from "../ui/sidebar";
import { CartButton } from "./cart-button";

export const MainNavbar = () => {
  const pathname = usePathname();
  const { toggleSidebar, isMobile } = useSidebar();

  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );
  const parentCategories = categories.filter((c) => !c.parentId);
  const activeParentCategory = parentCategories.find((c) =>
    pathname.startsWith(`/categories/${c.slug}`),
  );

  return (
    <nav className="bg-background sticky top-0 z-50 flex h-17 items-center justify-between p-4">
      <h1 className="font-serif text-2xl font-medium">
        <Link href="/" className="font-niconne">
          Temmy Accessories
        </Link>
      </h1>
      {!isMobile && (
        <div className="mx-auto flex items-center gap-5">
          {parentCategories.map((parentCategory) => {
            const childCategories = categories.filter(
              (c) => c.parentId === parentCategory.id,
            );
            const isActive = activeParentCategory?.id === parentCategory.id;

            return (
              <DropdownMenu key={parentCategory.id}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "hover:text-primary flex items-center gap-1 text-base font-medium",
                      {
                        "ring-primary/50 ring-[2px]": isActive,
                      },
                    )}
                  >
                    {parentCategory.name}
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 rounded-2xl">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href={`/categories/${parentCategory.slug}`}
                      className="w-full"
                    >
                      All {parentCategory.name}
                    </Link>
                  </DropdownMenuItem>
                  {childCategories.length > 0 && (
                    <>
                      <div className="my-1 border-t" />
                      {childCategories.map((childCategory) => (
                        <DropdownMenuItem
                          key={childCategory.id}
                          asChild
                          className="cursor-pointer"
                        >
                          <Link
                            href={`/categories/${childCategory.slug}`}
                            className="w-full"
                          >
                            {childCategory.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <SearchIcon strokeWidth={1.2} />
        </Button>
        <CartButton />
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <MenuIcon className="size-5" strokeWidth={1.2} />
          </Button>
        )}
      </div>
    </nav>
  );
};
