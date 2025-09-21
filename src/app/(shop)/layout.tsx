import { CartSheet } from "@/components/cart/cart-sheet";
import { Footer } from "@/components/footer";
import { MainNavbar } from "@/components/main-navbar";
import { MainSidebar } from "@/components/main-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ShopProviders } from "./shop-providers";

type Props = {
  children: React.ReactNode;
};
const ShopLayout = ({ children }: Props) => {
  return (
    <ShopProviders>
      <CartSheet />
      <SidebarProvider>
        <MainSidebar />
        <div className="flex min-h-screen max-w-full flex-1 flex-col">
          <MainNavbar />
          <main>{children}</main>
        </div>
      </SidebarProvider>
      <Footer />
    </ShopProviders>
  );
};
export default ShopLayout;
