import { AdminCategoryView } from "@/modules/admin/categories/ui/views/admin-category-view";

interface AdminCategoryPageProps {
  params: {
    categorySlug: string;
  };
}

export default function AdminCategoryPage({ params }: AdminCategoryPageProps) {
  return <AdminCategoryView categorySlug={params.categorySlug} />;
}
