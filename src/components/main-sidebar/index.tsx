"use client";

import { HandbagIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AuthButton } from "./auth-button";

const productGroups = [
  {
    title: "New Arrivals",
    href: "#",
  },
  {
    title: "Customer Faves",
    href: "#",
  },
  {
    title: "Featured",
    href: "#",
  },
];

const categories = [
  {
    title: "Necklaces",
    href: "/categories/necklaces",
  },
  {
    title: "Bracelets & Watches",
    href: "/categories/bracelets-and-watches",
  },
  {
    title: "Earrings",
    href: "/categories/earrings",
  },
  {
    title: "Rings",
    href: "/categories/rings",
  },
];
export function MainSidebar() {
  const { isMobile, setOpenMobile, setOpen } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  return (
    <Sidebar side="right">
      <SidebarHeader className="text-sidebar-accent-foreground h-17 justify-center border-b">
        <Link
          href="/"
          className="font-niconne flex items-center gap-2 px-2 pt-2 text-2xl font-medium"
          onClick={handleLinkClick}
        >
          Temmy Accessories
        </Link>
      </SidebarHeader>
      <SidebarContent className="text-lg">
        <SidebarGroup>
          {/* <SidebarGroupLabel>CATEGORIES</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {productGroups.map((group) => (
                <SidebarMenuItem key={group.title}>
                  <SidebarMenuButton asChild>
                    <Link href={group.href} onClick={handleLinkClick}>
                      <span className="uppercase">{group.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            CATEGORIES
          </SidebarGroupLabel>
          <SidebarGroupContent className="pl-3">
            <SidebarMenu>
              {categories.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href} onClick={handleLinkClick}>
                      <span className="uppercase">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="flex w-full justify-start"
          onClick={handleLinkClick}
        >
          <HandbagIcon />
          Cart
        </Button>
        <Button
          variant="ghost"
          className="flex w-full justify-start"
          onClick={handleLinkClick}
        >
          <HistoryIcon />
          History
        </Button>
        <AuthButton onClick={handleLinkClick} />
      </SidebarFooter>
    </Sidebar>
  );
}
