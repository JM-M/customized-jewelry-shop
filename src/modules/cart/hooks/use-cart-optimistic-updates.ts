import { v4 as uuidv4 } from "uuid";
import {
  CustomizationContent,
  GetProductByIdOutput,
  GetProductMaterialsOutput,
} from "../../products/types";
import { useCart } from "../contexts";
import { GetCartOutput } from "../types";

export const useCartOptimisticUpdates = () => {
  const { cart, updateCartOptimistically } = useCart();

  // Rollback function to restore cart state on failure
  const rollbackCart = (previousCartState: GetCartOutput | null) => {
    updateCartOptimistically(() => previousCartState);
  };

  const optimisticallyAddToCart = ({
    product,
    materialId,
    customizations,
    productMaterials,
  }: {
    product: GetProductByIdOutput;
    materialId: string;
    customizations: Record<string, CustomizationContent>;
    productMaterials: GetProductMaterialsOutput;
  }) => {
    const productId = product.id;

    // Capture current cart state for potential rollback
    const previousCartState = cart;

    // Generate item ID for consistency between optimistic update and server
    const generatedItemId = uuidv4();

    // Helper function to convert customizations to expected format
    const convertCustomizations = (
      customizationsToConvert: Record<string, CustomizationContent>,
    ) => {
      const converted: Record<
        string,
        {
          type: "text" | "image" | "qr_code";
          content: string;
          additionalPrice?: number;
        }
      > = {};
      Object.entries(customizationsToConvert).forEach(
        ([optionId, customization]) => {
          let content = "";
          let type: "text" | "image" | "qr_code" = "text";

          if (customization.type === "text") {
            content = customization.textContent || "";
            type = "text";
          } else if (customization.type === "image") {
            content = customization.imageUrl || "";
            type = "image";
          } else if (customization.type === "qr_code") {
            content = customization.qrData || "";
            type = "qr_code";
          }

          converted[optionId] = { type, content };
        },
      );
      return converted;
    };

    // Find the selected product material for pricing
    const selectedProductMaterial = productMaterials.find(
      (pm) => pm.materialId === materialId,
    );

    if (!selectedProductMaterial) {
      console.error("Selected material not found");
      return { previousCartState };
    }

    const price = Number(selectedProductMaterial.price);
    const quantity = 1;

    updateCartOptimistically((oldCart) => {
      // If no cart exists, create a new one
      if (!oldCart) {
        const newCartId = uuidv4();
        const now = new Date().toISOString();

        return {
          id: newCartId,
          userId: "", // Will be set by server
          status: "active" as const,
          createdAt: now,
          updatedAt: now,
          items: [
            {
              id: generatedItemId,
              cartId: newCartId,
              productId,
              materialId,
              quantity,
              price: price.toString(),
              customizations: customizations
                ? convertCustomizations(customizations)
                : {},
              notes: null,
              createdAt: now,
              updatedAt: now,
              product: {
                ...product,
                materials: productMaterials,
              },
              material: selectedProductMaterial.material,
            },
          ],
        };
      }

      // Cart exists, check if item with same product+material already exists
      const existingItemIndex = oldCart.items.findIndex(
        (item) =>
          item.productId === productId && item.materialId === materialId,
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...oldCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          customizations: customizations
            ? convertCustomizations(customizations)
            : updatedItems[existingItemIndex].customizations,
          updatedAt: new Date().toISOString(),
        };

        return {
          ...oldCart,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Add new item to cart
        const newItem = {
          id: generatedItemId,
          cartId: oldCart.id,
          productId,
          materialId,
          quantity,
          price: price.toString(),
          customizations: customizations
            ? convertCustomizations(customizations)
            : {},
          notes: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          product: {
            ...product,
            materials: productMaterials,
          },
          material: selectedProductMaterial.material,
        };

        return {
          ...oldCart,
          items: [...oldCart.items, newItem],
          updatedAt: new Date().toISOString(),
        };
      }
    });

    // Return previous cart state for potential rollback and generated item ID
    return { previousCartState, generatedItemId };
  };

  const optimisticallyRemoveFromCart = (itemId: string) => {
    // Capture current cart state for potential rollback
    const previousCartState = cart;

    updateCartOptimistically((oldCart) => {
      if (!oldCart) {
        // No cart exists, nothing to remove
        return null;
      }

      // Filter out the item with the matching ID
      const updatedItems = oldCart.items.filter((item) => item.id !== itemId);

      return {
        ...oldCart,
        items: updatedItems,
        updatedAt: new Date().toISOString(),
      };
    });

    // Return previous cart state for potential rollback
    return { previousCartState };
  };

  const optimisticallyUpdateQuantity = (
    itemId: string,
    newQuantity: number,
  ) => {
    // Capture current cart state for potential rollback
    const previousCartState = cart;

    updateCartOptimistically((oldCart) => {
      if (!oldCart) {
        // No cart exists, nothing to update
        return null;
      }

      if (newQuantity === 0) {
        // Remove item if quantity is 0 (mirrors server behavior)
        const updatedItems = oldCart.items.filter((item) => item.id !== itemId);
        return {
          ...oldCart,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        };
      }

      // Update the quantity of the specific item
      const updatedItems = oldCart.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              updatedAt: new Date().toISOString(),
            }
          : item,
      );

      return {
        ...oldCart,
        items: updatedItems,
        updatedAt: new Date().toISOString(),
      };
    });

    // Return previous cart state for potential rollback
    return { previousCartState };
  };

  return {
    optimisticallyAddToCart,
    optimisticallyRemoveFromCart,
    optimisticallyUpdateQuantity,
    rollbackCart,
  };
};
