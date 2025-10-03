import { Card, CardContent } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  GetNewArrivalsOutput,
  GetProductsByCategorySlugOutput,
} from "../../types";

type ProductItem =
  | GetNewArrivalsOutput["items"][0]
  | GetProductsByCategorySlugOutput["items"][0];

interface ProductCardProps {
  product: ProductItem;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/products/${product.slug}`} className="block">
      <Card className="cursor-pointer p-0 transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <CardContent className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg p-0">
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        </CardContent>
      </Card>
      <div className="mt-2">
        <span className="text-muted-foreground duration-300">
          {product.name}
        </span>
      </div>
      <div>{formatNaira(+product.price)}</div>
    </Link>
  );
};
