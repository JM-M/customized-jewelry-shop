import { CartSheet } from "@/components/cart/cart-sheet";
import { Footer } from "@/components/footer";
import { MainNavbar } from "@/components/main-navbar";
import { MainSidebar } from "@/components/main-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "../../../site.config";
import { ShopProviders } from "./shop-providers";

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: "Discover our collection of customized jewelry and accessories",
};

type Props = {
  children: React.ReactNode;
};
const ShopLayout = async ({ children }: Props) => {
  prefetch(trpc.categories.getAll.queryOptions());

  return (
    <HydrateClient>
      <Suspense fallback={<></>}>
        <ShopProviders>
          <CartSheet />
          <SidebarProvider>
            <MainSidebar />
            <div className="flex min-h-screen max-w-full flex-1 flex-col">
              <MainNavbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SidebarProvider>
        </ShopProviders>
      </Suspense>
    </HydrateClient>
  );
};
export default ShopLayout;
