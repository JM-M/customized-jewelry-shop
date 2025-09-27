"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { Spinner2 } from "@/components/shared/spinner-2";
import {
  AdminProductProvider,
  useAdminProduct,
} from "../../contexts/admin-product";
import { AdminProductDetails } from "../components/admin-product-details";

const AdminProductDetailsContent = () => {
  const { product, isLoading, hasProduct } = useAdminProduct();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );
  }

  if (!hasProduct) {
    return (
      <div className="flex items-center justify-center gap-2">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={product!.name}
        description={`Manage and view details for ${product!.name}`}
      />
      <AdminProductDetails />
    </div>
  );
};

export const AdminProductDetailsView = () => {
  return (
    <AdminProductProvider>
      <AdminProductDetailsContent />
    </AdminProductProvider>
  );
};
