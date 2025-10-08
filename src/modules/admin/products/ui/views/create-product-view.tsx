"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";

import { CreateProductForm } from "../components/create-product-form";

export const CreateProductView = () => {
  return (
    <div>
      <AdminPageHeader
        title="Create Product"
        description="Add a new product to your jewelry shop."
      />
      <div className="mt-6">
        <CreateProductForm />
      </div>
    </div>
  );
};
