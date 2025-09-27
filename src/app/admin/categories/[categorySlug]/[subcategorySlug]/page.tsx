import { AdminSubcategoryView } from "@/modules/admin/categories/ui/views/admin-subcategory-view";

interface AdminSubcategoryPageProps {
  params: {
    categorySlug: string;
    subcategorySlug: string;
  };
}

export default function AdminSubcategoryPage({
  params,
}: AdminSubcategoryPageProps) {
  return (
    <AdminSubcategoryView
      categorySlug={params.categorySlug}
      subcategorySlug={params.subcategorySlug}
    />
  );
}
