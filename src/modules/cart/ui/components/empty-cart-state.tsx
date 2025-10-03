import { Button } from "@/components/ui/button";
import Link from "next/link";
interface EmptyCartStateProps {
  onContinueShopping?: () => void;
}
export const EmptyCartState = ({ onContinueShopping }: EmptyCartStateProps) => {
  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping();
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4">
      <span>You shopping bag is empty</span>
      <Button asChild className="h-12 px-5" onClick={handleContinueShopping}>
        <Link href="/">Continue shopping</Link>
      </Button>
    </div>
  );
};
