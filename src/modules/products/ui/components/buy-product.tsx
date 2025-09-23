import { formatNaira } from "@/lib/utils";
import { useCart } from "@/modules/cart/contexts";
import { AddToBagButton } from "@/modules/products/ui/components/add-to-bag-button";
import { useProduct } from "../../contexts/product";
import { AddToBagCounter } from "./add-to-bag-counter";
import { BuyOnWhatsappBtn } from "./buy-on-whatsapp-btn";

export const BuyProduct = () => {
  const { product } = useProduct();
  const { cart } = useCart();
  const cartItem = cart?.items.find((item) => item.productId === product.id);

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between text-xl">
        <span>Subtotal:</span>
        <span>{formatNaira(+product.price)}</span>
      </div>
      {cartItem ? (
        <AddToBagCounter cartItem={cartItem} />
      ) : (
        <AddToBagButton className="flex h-12 w-full rounded-full" />
      )}
      <BuyOnWhatsappBtn />
    </div>
  );
};
