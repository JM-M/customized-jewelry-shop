/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatNaira } from "@/lib/utils";
import {
  CartCustomization,
  GetProductCustomizationOptionsOutput,
  GetProductMaterialsOutput,
} from "@/modules/products/types";

// Seller WhatsApp phone number - you should configure this in your environment
export const SELLER_WHATSAPP_NUMBER = "+2349167888435"; // Replace with actual seller's WhatsApp number

interface WhatsAppMessageData {
  productName: string;
  productPrice: number;
  productDescription?: string;
  selectedMaterial: string | null;
  productMaterials: GetProductMaterialsOutput;
  customizations: Record<string, CartCustomization>;
  customizationOptions: GetProductCustomizationOptionsOutput;
}

export function generateWhatsAppInterestMessage(
  data: WhatsAppMessageData,
): string {
  const {
    productName,
    productPrice,
    productDescription,
    selectedMaterial,
    productMaterials,
    customizations,
    customizationOptions,
  } = data;

  let message = `🛍️ *Product Inquiry*\n\n`;

  // Product details
  message += `*Product:* ${productName}\n`;
  message += `*Price:* ${formatNaira(productPrice)}\n`;

  if (productDescription) {
    message += `*Description:* ${productDescription}\n`;
  }

  message += `\n`;

  // Material selection
  if (selectedMaterial && productMaterials.length > 0) {
    const selectedMaterialData = productMaterials.find(
      (m) => m.id === selectedMaterial,
    );
    const name = selectedMaterialData?.material.name;
    const price = selectedMaterialData?.price && +selectedMaterialData.price;
    if (selectedMaterialData) {
      message += `*Selected Material:* ${name}\n`;
      if (price) {
        message += `*Material Price:* ${formatNaira(price)}\n`;
      }
    }
  } else if (productMaterials.length > 0) {
    message += `*Available Materials:*\n`;
    productMaterials.forEach((material) => {
      const name = material.material.name;
      const price = material.price && +material.price;
      message += `• ${name}${price ? ` - ${formatNaira(price)}` : ""}\n`;
    });
  }

  message += `\n`;

  // Customization details
  if (Object.keys(customizations).length > 0) {
    message += `*Custom Customizations:*\n`;

    Object.entries(customizations).forEach(([optionId, customization]) => {
      const option = customizationOptions.find((o: any) => o.id === optionId);
      const optionName = option?.name || `Option ${optionId}`;

      message += `• *${optionName}:*\n`;

      switch (customization.type) {
        case "text":
          if (customization.content) {
            message += `  Text: "${customization.content}"\n`;
          }
          break;
        case "image":
          if (customization.content) {
            message += `  Image: ${customization.content}\n`;
          }
          break;
        case "qr_code":
          if (customization.content) {
            message += `  QR Code Data: ${customization.content}\n`;
          }
          break;
      }
    });
  } else if (customizationOptions.length > 0) {
    message += `*Available Customization Options:*\n`;
    customizationOptions.forEach((option: any) => {
      message += `• ${option.name} (${option.type})\n`;
      if (option.description) {
        message += `  ${option.description}\n`;
      }
    });
  }

  message += `\n`;
  message += `I'm interested in purchasing this product. Can you provide more details about availability and next steps.\n\n`;
  message += `Thank you! 🙏`;

  return message;
}

export function createWhatsAppUrl(
  phoneNumber: string,
  message: string,
): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`;
}
