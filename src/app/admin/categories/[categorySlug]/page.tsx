import { AdminCategoryView } from "@/modules/admin/categories/ui/views/admin-category-view";

interface AdminCategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export default async function AdminCategoryPage({
  params,
}: AdminCategoryPageProps) {
  const { categorySlug } = await params;
  return <AdminCategoryView categorySlug={categorySlug} />;
}
