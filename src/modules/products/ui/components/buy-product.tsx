import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { SiWhatsapp } from "react-icons/si";

export const BuyProduct = () => {
  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between text-xl">
        <span>Subtotal:</span>
        <span>{formatNaira(20000)}</span>
      </div>
      <Button className="flex h-12 w-full rounded-full">Add To Bag</Button>
      <Button className="flex h-12 w-full rounded-full bg-[#1DAD52] text-white">
        <SiWhatsapp className="size-5" />
        Buy on WhatsApp
      </Button>
    </div>
  );
};
