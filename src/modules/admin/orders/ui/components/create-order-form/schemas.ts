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
  productName: z.string().optional(), // Add product name to schema
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
  // Personal Information
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(1, {
    message: "Phone number is required.",
  }),
  // Delivery Address
  line1: z
    .string()
    .min(5, {
      message: "Address must be at least 5 characters.",
    })
    .max(45, {
      message: "Address must not exceed 45 characters.",
    }),
  line2: z
    .string()
    .max(45, {
      message: "Address line 2 must not exceed 45 characters.",
    })
    .optional(),
  city: z.string().min(2, {
    message: "Please select a city.",
  }),
  state: z.string().min(2, {
    message: "Please select a state.",
  }),
  zip: z.string().min(5, {
    message: "ZIP code must be at least 5 characters.",
  }),
  country: z.string().length(2, {
    message: "Please select a country.",
  }),
  // Delivery Rate
  selectedRateId: z.string().min(1, "Please select a delivery rate"),
});

export const reviewSchema = z.object({});

// Type definitions
export type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>;
export type OrderItemsFormValues = z.infer<typeof orderItemsSchema>;
export type DeliveryInfoFormValues = z.infer<typeof deliveryInfoSchema>;
export type ReviewFormValues = z.infer<typeof reviewSchema>;
