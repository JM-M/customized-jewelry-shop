import { CustomizationContent } from "@/modules/products/types";
import { z } from "zod";

// Define Zod schemas for each step
export const customerInfoSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().min(1, "Customer email is required"),
  customerId: z.string().optional(),
});

export const orderItemSchema = z.object({
  id: z.string(),
  productId: z.string().min(1, "Product is required"),
  materialId: z.string().min(1, "Material is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  engravings: z.any().optional(),
  notes: z.string().optional(),
  customizations: z
    .record(z.string(), z.custom<CustomizationContent>())
    .optional(),
});

export const orderItemsSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

export const deliveryInfoSchema = z.object({
  deliveryAddressId: z.string().min(1, "Delivery address is required"),
  pickupAddressId: z.string().min(1, "Pickup address is required"),
  deliveryFee: z.number().min(0, "Delivery fee must be positive"),
});

export const reviewSchema = z.object({});

// Type definitions
export type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>;
export type OrderItemsFormValues = z.infer<typeof orderItemsSchema>;
export type DeliveryInfoFormValues = z.infer<typeof deliveryInfoSchema>;
export type ReviewFormValues = z.infer<typeof reviewSchema>;
