"use client";

import {
  GetProductByIdOutput,
  GetProductCustomizationOptionsOutput,
  GetProductMaterialsOutput,
} from "@/modules/products/types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  // Actions
  removeCustomizationOption: (optionId: string) => void;
  isRemovingCustomizationOption: boolean;
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
  const queryClient = useQueryClient();

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
      ...trpc.adminProducts.getCustomizationOptions.queryOptions({
        productId: product?.id || "",
      }),
      enabled: !!product?.id,
    });

  // Mutation for removing customization options
  const {
    mutate: removeCustomizationOptionMutation,
    isPending: isRemovingCustomizationOption,
  } = useMutation(
    trpc.adminProducts.removeCustomizationOption.mutationOptions({
      onSuccess: () => {
        // Invalidate and refetch customization options
        queryClient.invalidateQueries({
          queryKey: trpc.adminProducts.getCustomizationOptions.queryKey({
            productId: product?.id || "",
          }),
        });
      },
    }),
  );

  // Wrapper function to handle the string parameter and convert to object
  const removeCustomizationOption = (optionId: string) => {
    removeCustomizationOptionMutation({ optionId });
  };

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

    // Actions
    removeCustomizationOption,
    isRemovingCustomizationOption,
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
