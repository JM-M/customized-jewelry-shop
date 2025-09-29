import { ProductCustomizationOptionType } from "../../../types";
import { AdminProductMaterial } from "../admin-product-material";
import { Engraving } from "./engraving";
import { TextShape } from "./text-shape";

interface ProductCustomizationOptionProps {
  type: ProductCustomizationOptionType;
}

export const ProductCustomizationOption = ({
  type,
}: ProductCustomizationOptionProps) => {
  if (type === "material") {
    return <AdminProductMaterial />;
  }

  if (type === "text_shape") {
    return <TextShape />;
  }

  if (type === "text_customization") {
    return <Engraving type="text" />;
  }

  if (type === "image_customization") {
    return <Engraving type="image" />;
  }

  if (type === "qr_code_customization") {
    return <Engraving type="qr_code" />;
  }

  return null;
};
