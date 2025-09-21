"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import {
  EngravingContent,
  GetEngravingAreasByProductIdOutput,
  GetMaterialsByProductIdOutput,
  GetProductByIdOutput,
} from "../types";

interface ProductContextType {
  // Data
  product: GetProductByIdOutput;
  productMaterials: GetMaterialsByProductIdOutput;
  productEngravingAreas: GetEngravingAreasByProductIdOutput;
  isLoading: boolean;
  isMaterialsLoading: boolean;
  isEngravingAreasLoading: boolean;

  // Customization State
  selectedMaterial: string | null;
  engravings: Record<string, EngravingContent>;

  // Actions
  setSelectedMaterial: (materialId: string | null) => void;
  updateEngraving: (areaId: string, content: EngravingContent) => void;
  clearEngravings: () => void;
  resetCustomization: () => void;

  // Computed values
  isCustomizationComplete: boolean;
  hasEngravings: boolean;
  totalEngravings: number;
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
  const [engravings, setEngravings] = useState<
    Record<string, EngravingContent>
  >({});

  // Query product data
  const { data: product, isLoading: productLoading } = useSuspenseQuery(
    trpc.products.getBySlug.queryOptions({ slug: productSlug }),
  );

  const { data: productMaterials, isLoading: materialsLoading } =
    useSuspenseQuery(
      trpc.products.getProductMaterialsByProductId.queryOptions({
        productId: product.id,
      }),
    );

  const { data: productEngravingAreas, isLoading: engravingAreasLoading } =
    useSuspenseQuery(
      trpc.products.getProductEngravingAreasByProductId.queryOptions({
        productId: product.id,
      }),
    );

  // Action handlers
  const updateEngraving = (areaId: string, content: EngravingContent) => {
    setEngravings((prev) => ({
      ...prev,
      [areaId]: content,
    }));
  };

  const clearEngravings = () => {
    setEngravings({});
  };

  const resetCustomization = () => {
    setSelectedMaterial(null);
    setEngravings({});
  };

  // Computed values
  const isLoading = productLoading;
  const isMaterialsLoading = materialsLoading;
  const isEngravingAreasLoading = engravingAreasLoading;

  const isCustomizationComplete = useMemo(() => {
    // Check if material is selected (required for most products)
    const hasMaterial = selectedMaterial !== null;

    // Check if all required engraving areas are filled
    const hasRequiredEngravings = productEngravingAreas.every((area) => {
      // If there are engraving areas, they might be optional
      // You can add business logic here to determine which are required
      return true; // For now, assume all engravings are optional
    });

    return hasMaterial && hasRequiredEngravings;
  }, [selectedMaterial, productEngravingAreas]);

  const hasEngravings = useMemo(() => {
    return Object.keys(engravings).length > 0;
  }, [engravings]);

  const totalEngravings = useMemo(() => {
    return Object.keys(engravings).length;
  }, [engravings]);

  const contextValue: ProductContextType = {
    // Data
    product,
    productMaterials,
    productEngravingAreas,
    isLoading,
    isMaterialsLoading,
    isEngravingAreasLoading,

    // Customization State
    selectedMaterial,
    engravings,

    // Actions
    setSelectedMaterial,
    updateEngraving,
    clearEngravings,
    resetCustomization,

    // Computed values
    isCustomizationComplete,
    hasEngravings,
    totalEngravings,
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
