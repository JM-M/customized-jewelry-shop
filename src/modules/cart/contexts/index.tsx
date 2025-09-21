"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { GetCartOutput } from "../types";

// TODO: Verify that engravings implementation work for all types of engravings

interface CartItem {
  id: string;
  productId: string;
  materialId?: string;
  quantity: number;
  price: string;
  engravings?: Record<
    string,
    {
      type: "text" | "image" | "qr_code";
      content: string;
      additionalPrice?: number;
    }
  >;
  notes?: string;
  product: {
    id: string;
    name: string;
    slug: string;
    primaryImage: string;
  };
  material?: {
    id: string;
    name: string;
    displayName: string;
    hexColor: string;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
  status: "active" | "abandoned" | "completed";
}

interface CartContextType {
  // UI State
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  // Cart Data
  cart: GetCartOutput | null;
  cartSummary: { itemCount: number; totalAmount: number };
  isLoading: boolean;

  // Cart Mutations - TypeScript will infer the correct types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addItemMutation: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateQuantityMutation: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeItemMutation: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clearCartMutation: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Query cart data (auth is handled in the procedure)
  const { data: cart, isLoading } = useQuery(trpc.cart.getCart.queryOptions());

  // Mutations with query invalidation
  const addItemMutation = useMutation(
    trpc.cart.addItem.mutationOptions({
      onSuccess: () => {
        // Invalidate and refetch cart queries
        queryClient.invalidateQueries({
          queryKey: trpc.cart.getCart.queryOptions(),
        });
      },
    }),
  );

  const updateQuantityMutation = useMutation(
    trpc.cart.updateQuantity.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.cart.getCart.queryOptions(),
        });
      },
    }),
  );

  const removeItemMutation = useMutation(
    trpc.cart.removeItem.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.cart.getCart.queryOptions(),
        });
      },
    }),
  );

  const clearCartMutation = useMutation(
    trpc.cart.clearCart.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.cart.getCart.queryOptions(),
        });
      },
    }),
  );

  const cartSummary = useMemo(() => {
    return {
      itemCount:
        cart?.items.reduce((acc, item) => acc + Number(item.quantity), 0) ?? 0,
      totalAmount:
        cart?.items.reduce((acc, item) => acc + Number(item.price), 0) ?? 0,
    };
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        isOpen,
        setIsOpen,
        cart: cart ?? null,
        cartSummary,
        isLoading,
        addItemMutation,
        updateQuantityMutation,
        removeItemMutation,
        clearCartMutation,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
