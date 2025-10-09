import { Button } from "@/components/ui/button";
import {
  createWhatsAppUrl,
  generateWhatsAppInterestMessage,
  SELLER_WHATSAPP_NUMBER,
} from "@/lib/whatsapp-utils";
import { SiWhatsapp } from "react-icons/si";
import { useProduct } from "../../contexts/product";

export const BuyOnWhatsappBtn = () => {
  const {
    product,
    productMaterials,
    customizationOptions,
    selectedMaterial,
    customizations,
  } = useProduct();

  const handleWhatsAppClick = () => {
    const message = generateWhatsAppInterestMessage({
      productName: product.name,
      productPrice: Number(product.price),
      productDescription: product.description || undefined,
      selectedMaterial,
      productMaterials,
      customizations,
      customizationOptions,
    });

    const whatsappUrl = createWhatsAppUrl(SELLER_WHATSAPP_NUMBER, message);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button
      className="flex h-12 w-full rounded-full bg-[#1DAD52] text-white"
      onClick={handleWhatsAppClick}
    >
      <SiWhatsapp className="size-5" />
      Buy on WhatsApp
    </Button>
  );
};
