import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetAllCategoriesOutput } from "@/modules/categories/types";
import { format } from "date-fns";

interface CategoryDetailsCardProps {
  category: GetAllCategoriesOutput[number];
  parentCategory?: GetAllCategoriesOutput[number] | null;
}

export const CategoryDetailsCard = ({
  category,
  parentCategory,
}: CategoryDetailsCardProps) => {
  return (
    <Card className="gap-3 p-3">
      <CardHeader className="gap-0 p-0">
        <CardTitle>Category Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div>
          <label className="text-sm font-medium text-gray-500">Name</label>
          <p className="text-lg font-semibold">{category.name}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Slug</label>
          <p className="font-mono text-sm">{category.slug}</p>
        </div>

        {category.description && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Description
            </label>
            <p className="text-sm">{category.description}</p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-500">Status</label>
          <div className="mt-1">
            <Badge
              variant={category.isActive ? "default" : "secondary"}
              className={
                category.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Type</label>
          <p className="text-sm">
            {category.parentId ? "Subcategory" : "Parent Category"}
          </p>
        </div>

        {parentCategory && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Parent Category
            </label>
            <p className="text-sm">{parentCategory.name}</p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-500">
            Created At
          </label>
          <p className="text-sm">
            {format(new Date(category.createdAt), "PPP p")}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">
            Updated At
          </label>
          <p className="text-sm">
            {format(new Date(category.updatedAt), "PPP p")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
