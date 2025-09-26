"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CustomizationContent,
  GetProductByIdOutput,
  GetProductCustomizationOptionsOutput,
  GetProductMaterialsOutput,
} from "../types";

interface ProductContextType {
  // Data
  product: GetProductByIdOutput;
  productMaterials: GetProductMaterialsOutput;
  customizationOptions: GetProductCustomizationOptionsOutput;
  isLoading: boolean;
  isMaterialsLoading: boolean;
  isCustomizationOptionsLoading: boolean;

  // Customization State
  selectedMaterial: string | null;
  customizations: Record<string, CustomizationContent>;

  // Actions
  setSelectedMaterial: (materialId: string | null) => void;
  updateCustomization: (
    optionId: string,
    content: CustomizationContent,
  ) => void;
  clearCustomizations: () => void;
  resetCustomization: () => void;

  // Computed values
  isCustomizationComplete: boolean;
  hasCustomizations: boolean;
  totalCustomizations: number;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const params = useParams();
  const productSlug = params.productSlug as string;
  const trpc = useTRPC();

  // State management for customization
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [customizations, setCustomizations] = useState<
    Record<string, CustomizationContent>
  >({});

  // Query product data
  const { data: product, isLoading: productLoading } = useSuspenseQuery(
    trpc.products.getBySlug.queryOptions({ slug: productSlug }),
  );

  const { data: productMaterials, isLoading: materialsLoading } =
    useSuspenseQuery(
      trpc.products.getProductMaterials.queryOptions({
        productId: product.id,
      }),
    );

  const { data: customizationOptions, isLoading: customizationOptionsLoading } =
    useSuspenseQuery(
      trpc.products.getProductCustomizationOptions.queryOptions({
        productId: product.id,
      }),
    );

  // Auto-select first material if available and none selected
  useEffect(() => {
    if (
      productMaterials.length > 0 &&
      selectedMaterial === null &&
      !materialsLoading
    ) {
      setSelectedMaterial(productMaterials[0].material.id);
    }
  }, [productMaterials, selectedMaterial, materialsLoading]);

  // Action handlers
  const updateCustomization = (
    optionId: string,
    content: CustomizationContent,
  ) => {
    setCustomizations((prev) => ({
      ...prev,
      [optionId]: content,
    }));
  };

  const clearCustomizations = () => {
    setCustomizations({});
  };

  const resetCustomization = () => {
    setSelectedMaterial(null);
    setCustomizations({});
  };

  // Computed values
  const isLoading = productLoading;
  const isMaterialsLoading = materialsLoading;
  const isCustomizationOptionsLoading = customizationOptionsLoading;

  const isCustomizationComplete = useMemo(() => {
    // Check if material is selected (required for most products)
    const hasMaterial = selectedMaterial !== null;

    // Check if all required customization options are filled
    const hasRequiredCustomizations = customizationOptions.every(
      (option: any) => {
        // If there are customization options, they might be optional
        // You can add business logic here to determine which are required
        return true; // For now, assume all customizations are optional
      },
    );

    return hasMaterial && hasRequiredCustomizations;
  }, [selectedMaterial, customizationOptions]);

  const hasCustomizations = useMemo(() => {
    return Object.keys(customizations).length > 0;
  }, [customizations]);

  const totalCustomizations = useMemo(() => {
    return Object.keys(customizations).length;
  }, [customizations]);

  const contextValue: ProductContextType = {
    // Data
    product,
    productMaterials,
    customizationOptions,
    isLoading,
    isMaterialsLoading,
    isCustomizationOptionsLoading,

    // Customization State
    selectedMaterial,
    customizations,

    // Actions
    setSelectedMaterial,
    updateCustomization,
    clearCustomizations,
    resetCustomization,

    // Computed values
    isCustomizationComplete,
    hasCustomizations,
    totalCustomizations,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}
