import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { GetAllCategoriesOutput } from "../../types";

interface CategoryCardProps {
  category: GetAllCategoriesOutput[number];
  onClick?: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <div>
      <Card
        className="cursor-pointer p-0 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        onClick={onClick}
      >
        <CardContent className="relative flex aspect-square items-center justify-center p-0">
          {category.image && (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
            />
          )}
        </CardContent>
      </Card>
      <div className="mt-2">
        <span className="text-muted-foreground duration-300">
          {category.name}
        </span>
      </div>
    </div>
  );
};
