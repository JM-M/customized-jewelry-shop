import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetAllCategoriesOutput } from "@/modules/categories/types";
import Image from "next/image";
import Link from "next/link";

interface SubcategoriesCardProps {
  subcategories: GetAllCategoriesOutput[number][];
  parentCategorySlug?: string;
}

export const SubcategoriesCard = ({
  subcategories,
  parentCategorySlug,
}: SubcategoriesCardProps) => {
  if (subcategories.length === 0) {
    return null;
  }

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="p-0">
        <CardTitle>Subcategories ({subcategories.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subcategories.map((subcategory) => {
            const content = (
              <div className="flex items-center space-x-3 rounded-lg border p-1 transition-colors hover:bg-gray-50">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg">
                  <Image
                    src={subcategory.image}
                    alt={subcategory.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{subcategory.name}</p>
                  <p className="text-xs text-gray-500">
                    {subcategory.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            );

            return parentCategorySlug ? (
              <Link
                key={subcategory.id}
                href={`/admin/categories/${parentCategorySlug}/${subcategory.slug}`}
              >
                {content}
              </Link>
            ) : (
              <div key={subcategory.id}>{content}</div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
