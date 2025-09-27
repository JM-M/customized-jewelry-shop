import { AdminSubcategoryView } from "@/modules/admin/categories/ui/views/admin-subcategory-view";

interface AdminSubcategoryPageProps {
  params: Promise<{
    categorySlug: string;
    subcategorySlug: string;
  }>;
}

export default async function AdminSubcategoryPage({
  params,
}: AdminSubcategoryPageProps) {
  const { categorySlug, subcategorySlug } = await params;
  return (
    <AdminSubcategoryView
      categorySlug={categorySlug}
      subcategorySlug={subcategorySlug}
    />
  );
}
