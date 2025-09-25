import { ProductCustomizationOptionType } from "../../../types";
import { Engraving } from "./engraving";
import { Material } from "./material";
import { TextShape } from "./text-shape";

interface ProductCustomizationOptionProps {
  type: ProductCustomizationOptionType;
}

export const ProductCustomizationOption = ({
  type,
}: ProductCustomizationOptionProps) => {
  if (type === "material") {
    return <Material />;
  }

  if (type === "text_shape") {
    return <TextShape />;
  }

  if (type === "text_engraving") {
    return <Engraving type="text" />;
  }

  if (type === "image_engraving") {
    return <Engraving type="image" />;
  }

  if (type === "qr_code_engraving") {
    return <Engraving type="qr_code" />;
  }

  return null;
};
