import { formatNaira } from "@/lib/utils";
import {
  EngravingContent,
  GetEngravingAreasByProductIdOutput,
  GetMaterialsByProductIdOutput,
} from "@/modules/products/types";

// Seller WhatsApp phone number - you should configure this in your environment
export const SELLER_WHATSAPP_NUMBER = "+2349167888435"; // Replace with actual seller's WhatsApp number

interface WhatsAppMessageData {
  productName: string;
  productPrice: number;
  productDescription?: string;
  selectedMaterial: string | null;
  productMaterials: GetMaterialsByProductIdOutput;
  engravings: Record<string, EngravingContent>;
  productEngravingAreas: GetEngravingAreasByProductIdOutput;
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
    engravings,
    productEngravingAreas,
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

  // Engraving details
  if (Object.keys(engravings).length > 0) {
    message += `*Custom Engravings:*\n`;

    Object.entries(engravings).forEach(([areaId, engraving]) => {
      const area = productEngravingAreas.find((a) => a.id === areaId);
      const areaName = area?.engravingArea.name || `Area ${areaId}`;

      message += `• *${areaName}:*\n`;

      switch (engraving.type) {
        case "text":
          if (engraving.textContent) {
            message += `  Text: "${engraving.textContent}"\n`;
          }
          break;
        case "image":
          if (engraving.imageFilename) {
            message += `  Image: ${engraving.imageFilename}\n`;
          }
          break;
        case "qr_code":
          if (engraving.qrData) {
            message += `  QR Code Data: ${engraving.qrData}\n`;
          }
          break;
      }
    });
  } else if (productEngravingAreas.length > 0) {
    message += `*Available Engraving Areas:*\n`;
    productEngravingAreas.forEach((area) => {
      message += `• ${area.engravingArea.name} (${area.engravingType})\n`;
      if (area.engravingArea.description) {
        message += `  ${area.engravingArea.description}\n`;
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
