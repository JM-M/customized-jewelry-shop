import { CustomizationType } from "@/modules/products/types";

export const CUSTOMIZATION_TYPES: readonly CustomizationType[] = [
  "text",
  "image",
  "qr_code",
] as const;
