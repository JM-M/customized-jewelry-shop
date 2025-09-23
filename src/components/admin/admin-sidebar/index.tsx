"use client";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  GiftIcon,
  LayoutDashboardIcon,
  LucideIcon,
  MapPinIcon,
  PackageIcon,
  TruckIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AuthButton } from "@/components/main-sidebar/auth-button";
import { LogoutButton } from "@/components/main-sidebar/logout-button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

// Data structure for sidebar items
interface SidebarItem {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  children?: SidebarItem[];
}

interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

// Sidebar configuration
const sidebarConfig: SidebarGroup[] = [
  {
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        id: "products",
        label: "Products",
        href: "/admin/products",
        icon: GiftIcon,
      },
    ],
  },
  {
    items: [
      {
        id: "logistics",
        label: "Logistics",
        icon: TruckIcon,
        children: [
          {
            id: "packaging",
            label: "Packaging",
            href: "/admin/packaging",
            icon: PackageIcon,
          },
          {
            id: "pickup-addresses",
            label: "Pickup Addresses",
            href: "/admin/pickup-addresses",
            icon: MapPinIcon,
          },
        ],
      },
    ],
  },
];

export function AdminSidebar() {
  const session = authClient.useSession();
  const { isMobile, setOpenMobile, setOpen } = useSidebar();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Helper component for rendering a single sidebar item
  const SidebarItemComponent = ({ item }: { item: SidebarItem }) => {
    const isOpen = openItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      return (
        <Collapsible open={isOpen} onOpenChange={() => toggleItem(item.id)}>
          <SidebarMenu>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {isOpen ? (
                    <ChevronDownIcon className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="ml-auto h-4 w-4" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children?.map((child) => (
                    <SidebarMenuSubItem key={child.id}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          href={child.href || "#"}
                          onClick={handleLinkClick}
                        >
                          {child.icon && <child.icon className="size-4" />}
                          {child.label}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </SidebarMenu>
        </Collapsible>
      );
    }

    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={item.href || "#"} onClick={handleLinkClick}>
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  };

  return (
    <Sidebar side="left">
      <SidebarHeader className="text-sidebar-accent-foreground h-17 justify-center border-b">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 px-2 pt-2 text-2xl font-medium"
          onClick={handleLinkClick}
        >
          <span className="font-niconne">Temmy Accessories</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="text-lg">
        {sidebarConfig.map((group, index) => (
          <SidebarGroup key={index}>
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              {group.items.map((item) => (
                <SidebarItemComponent key={item.id} item={item} />
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        {session?.data ? (
          <LogoutButton onClick={handleLinkClick} />
        ) : (
          <AuthButton onClick={handleLinkClick} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
