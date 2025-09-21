import { CartProvider } from "@/modules/cart/contexts";

export const ShopProviders = ({ children }: { children: React.ReactNode }) => {
  return <CartProvider>{children}</CartProvider>;
};
