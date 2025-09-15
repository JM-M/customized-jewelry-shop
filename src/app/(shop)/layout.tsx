import { Footer } from "@/components/footer";
import { MainNavbar } from "@/components/main-navbar";
import { MainSidebar } from "@/components/main-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
};
const ShopLayout = ({ children }: Props) => {
  return (
    <>
      <SidebarProvider>
        <MainSidebar />
        <div className="flex min-h-screen max-w-full flex-1 flex-col">
          <MainNavbar />
          <main>{children}</main>
        </div>
      </SidebarProvider>
      <Footer />
    </>
  );
};
export default ShopLayout;
