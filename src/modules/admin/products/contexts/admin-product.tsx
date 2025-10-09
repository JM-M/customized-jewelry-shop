"use client";

import { GetProductForEditOutput } from "@/modules/admin/products/types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";

interface AdminProductContextType {
  // Data
  product: NonNullable<GetProductForEditOutput>;
  isLoading: boolean;

  // Computed values
  hasProduct: boolean;

  // Actions
  removeCustomizationOption: (optionId: string) => void;
  isRemovingCustomizationOption: boolean;
  refetchProduct: () => void;
  setProductData: (update: Partial<GetProductForEditOutput>) => void;
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

  // Single query to fetch product with all related data
  const {
    data: product,
    isLoading,
    refetch: refetchProduct,
  } = useQuery(
    trpc.admin.products.getProductForEdit.queryOptions({ slug: productSlug }),
  );

  const invalidateProduct = () => {
    queryClient.invalidateQueries({
      queryKey: trpc.admin.products.getProductForEdit.queryKey({
        slug: productSlug,
      }),
    });
  };

  // Function to optimistically update the product data
  const setProductData = (update: Partial<GetProductForEditOutput>) => {
    queryClient.setQueryData(
      trpc.admin.products.getProductForEdit.queryKey({ slug: productSlug }),
      (oldData: GetProductForEditOutput | undefined) => {
        if (!oldData) return oldData;

        // Merge the partial update with the old data
        return {
          ...oldData,
          ...update,
        };
      },
    );
  };

  // Mutation for removing customization options
  const {
    mutate: removeCustomizationOptionMutation,
    isPending: isRemovingCustomizationOption,
  } = useMutation(
    trpc.admin.products.removeCustomizationOption.mutationOptions({
      onMutate: async (variables) => {
        // Cancel any outgoing refetches to avoid overwriting optimistic update
        await queryClient.cancelQueries({
          queryKey: trpc.admin.products.getProductForEdit.queryKey({
            slug: productSlug,
          }),
        });

        // Snapshot the previous value
        const previousProduct = queryClient.getQueryData(
          trpc.admin.products.getProductForEdit.queryKey({
            slug: productSlug,
          }),
        );

        // Optimistically update by removing the customization option
        const currentProduct =
          queryClient.getQueryData<GetProductForEditOutput>(
            trpc.admin.products.getProductForEdit.queryKey({
              slug: productSlug,
            }),
          );

        if (currentProduct) {
          setProductData({
            customizationOptions: currentProduct.customizationOptions.filter(
              (option) => option.id !== variables.optionId,
            ),
          });
        }

        // Return context with the previous value
        return { previousProduct };
      },
      onError: (_error, _variables, context) => {
        // Rollback to the previous value on error
        if (context?.previousProduct) {
          queryClient.setQueryData(
            trpc.admin.products.getProductForEdit.queryKey({
              slug: productSlug,
            }),
            context.previousProduct,
          );
        }
      },
      onSettled: () => {
        // Refetch to ensure data is in sync with server
        invalidateProduct();
      },
    }),
  );

  // Wrapper function to handle the string parameter and convert to object
  const removeCustomizationOption = (optionId: string) => {
    removeCustomizationOptionMutation({ optionId });
  };

  // Computed values
  const hasProduct = !!product;

  // Don't render children until product is loaded
  if (isLoading || !product) {
    return null;
  }

  const contextValue: AdminProductContextType = {
    // Data
    product,
    isLoading,

    // Computed values
    hasProduct,

    // Actions
    removeCustomizationOption,
    isRemovingCustomizationOption,
    refetchProduct,
    setProductData,
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
