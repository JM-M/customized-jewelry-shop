import { Footer } from "@/components/footer";
import { MainNavbar } from "@/components/main-navbar";

type Props = {
  children: React.ReactNode;
};
const ShopLayout = ({ children }: Props) => {
  return (
    <>
      <MainNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
};
export default ShopLayout;
