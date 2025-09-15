import { HandbagIcon, HistoryIcon, UserIcon } from "lucide-react";
import Link from "next/link";

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
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";

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
  return (
    <Sidebar side="right">
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link
          href="/"
          className="flex items-center gap-2 px-2 pt-2 font-serif text-2xl font-medium"
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
                    <Link href={group.href}>
                      <span className="uppercase">{group.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>CATEGORIES</SidebarGroupLabel>
          <SidebarGroupContent className="pl-3">
            <SidebarMenu>
              {categories.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
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
        <Button variant="ghost" className="flex w-full justify-start">
          <HandbagIcon />
          Cart
        </Button>
        <Button variant="ghost" className="flex w-full justify-start">
          <HistoryIcon />
          History
        </Button>
        <Button variant="ghost" className="flex w-full justify-start">
          <UserIcon />
          Sign In | Create Account
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
