import { Button } from "@/components/ui/button";
import { CustomizationType } from "@/modules/products/types";
import { ImagePlusIcon } from "lucide-react";

interface EngravingProps {
  type: CustomizationType;
}

export const Engraving = ({ type }: EngravingProps) => {
  let title = "";
  if (type === "text") {
    title = "Text Engraving";
  } else if (type === "image") {
    title = "Image Engraving";
  } else if (type === "qr_code") {
    title = "QR Code Engraving";
  }
  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="mt-2 flex justify-end">
        <Button variant="ghost">
          <ImagePlusIcon /> Add Image
        </Button>
      </div>
    </div>
  );
};
