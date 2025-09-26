"use client";

import {
  GetProductByIdOutput,
  GetProductCustomizationOptionsOutput,
  GetProductMaterialsOutput,
} from "@/modules/products/types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";

interface AdminProductContextType {
  // Data
  product: GetProductByIdOutput | null;
  productMaterials: GetProductMaterialsOutput;
  customizationOptions: GetProductCustomizationOptionsOutput;
  isLoading: boolean;
  isMaterialsLoading: boolean;
  isCustomizationOptionsLoading: boolean;

  // Computed values
  hasProduct: boolean;
}

const AdminProductContext = createContext<AdminProductContextType | undefined>(
  undefined,
);

interface AdminProductProviderProps {
  children: ReactNode;
}

export function AdminProductProvider({ children }: AdminProductProviderProps) {
  const params = useParams();
  const productSlug = params.productSlug as string;
  const trpc = useTRPC();

  // Query product data
  const { data: product, isLoading: productLoading } = useQuery(
    trpc.products.getBySlug.queryOptions({ slug: productSlug }),
  );

  const { data: productMaterials, isLoading: materialsLoading } = useQuery({
    ...trpc.products.getProductMaterials.queryOptions({
      productId: product?.id || "",
    }),
    enabled: !!product?.id,
  });

  const { data: customizationOptions, isLoading: customizationOptionsLoading } =
    useQuery({
      ...trpc.products.getProductCustomizationOptions.queryOptions({
        productId: product?.id || "",
      }),
      enabled: !!product?.id,
    });

  // Computed values
  const isLoading =
    productLoading || materialsLoading || customizationOptionsLoading;
  const hasProduct = !!product;

  const contextValue: AdminProductContextType = {
    // Data
    product: product || null,
    productMaterials: productMaterials || [],
    customizationOptions: customizationOptions || [],
    isLoading,
    isMaterialsLoading: materialsLoading,
    isCustomizationOptionsLoading: customizationOptionsLoading,

    // Computed values
    hasProduct,
  };

  return (
    <AdminProductContext.Provider value={contextValue}>
      {children}
    </AdminProductContext.Provider>
  );
}

export function useAdminProduct() {
  const context = useContext(AdminProductContext);
  if (context === undefined) {
    throw new Error(
      "useAdminProduct must be used within an AdminProductProvider",
    );
  }
  return context;
}
