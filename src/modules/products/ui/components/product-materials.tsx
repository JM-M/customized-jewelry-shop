"use client";

import { useProduct } from "../../contexts/product";
import { ProductMaterialSelect } from "./product-material-select";

export const ProductMaterials = () => {
  const { productMaterials, selectedMaterial, setSelectedMaterial } =
    useProduct();

  if (productMaterials.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 p-3">
      <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Material
      </h4>
      <ProductMaterialSelect
        productMaterials={productMaterials}
        selectedMaterial={selectedMaterial}
        onMaterialChange={setSelectedMaterial}
      />
    </div>
  );
};
