import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetAllCategoriesOutput } from "@/modules/categories/types";
import Image from "next/image";

interface CategoryImageCardProps {
  category: GetAllCategoriesOutput[number];
}

export const CategoryImageCard = ({ category }: CategoryImageCardProps) => {
  return (
    <Card className="gap-3 p-3">
      <CardHeader className="p-0">
        <CardTitle>Category Image</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
};
