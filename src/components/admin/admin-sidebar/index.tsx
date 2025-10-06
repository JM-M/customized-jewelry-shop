"use client";

import {
  ChartBarIcon,
  CreditCardIcon,
  FolderIcon,
  GiftIcon,
  LayoutDashboardIcon,
  LucideIcon,
  MapPinIcon,
  PackageIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AuthButton } from "@/components/main-sidebar/auth-button";
import { LogoutButton } from "@/components/main-sidebar/logout-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

import { SidebarItemComponent } from "./sidebar-item-component";

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
        id: "analytics",
        label: "Analytics",
        icon: ChartBarIcon,
        children: [
          {
            id: "sales-analytics",
            label: "Sales",
            href: "/admin/analytics/sales",
            icon: TrendingUpIcon,
          },
          {
            id: "orders-analytics",
            label: "Orders",
            href: "/admin/analytics/orders",
            icon: ShoppingBagIcon,
          },
          // {
          //   id: "products-analytics",
          //   label: "Products",
          //   href: "/admin/analytics/products",
          //   icon: GiftIcon,
          // },
          // {
          //   id: "inventory-analytics",
          //   label: "Inventory",
          //   href: "/admin/analytics/inventory",
          //   icon: BarChart3Icon,
          // },
          {
            id: "customers-analytics",
            label: "Customers",
            href: "/admin/analytics/customers",
            icon: UsersIcon,
          },
        ],
      },
      {
        id: "orders",
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingBagIcon,
      },
      {
        id: "products",
        label: "Products",
        href: "/admin/products",
        icon: GiftIcon,
      },
      {
        id: "categories",
        label: "Categories",
        href: "/admin/categories",
        icon: FolderIcon,
      },
      {
        id: "transactions",
        label: "Transactions",
        href: "/admin/transactions",
        icon: CreditCardIcon,
      },
      {
        id: "customers",
        label: "Customers",
        href: "/admin/customers",
        icon: UsersIcon,
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
  const { isMobile, setOpenMobile } = useSidebar();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
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
      <SidebarContent className="gap-0 py-4 text-lg">
        {sidebarConfig.map((group, index) => (
          <SidebarGroup key={index} className="py-0">
            {group.label && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              {group.items.map((item) => (
                <SidebarItemComponent
                  key={item.id}
                  item={item}
                  isOpen={openItems.has(item.id)}
                  onToggle={toggleItem}
                  onLinkClick={handleLinkClick}
                />
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
