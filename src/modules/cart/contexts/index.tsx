"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { GetCartOutput } from "../types";

// TODO: Verify that engravings implementation work for all types of engravings

type OptimisticUpdater = (
  oldData: GetCartOutput | null | undefined,
) => GetCartOutput | null;

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

  updateCartOptimistically: (updater: OptimisticUpdater) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Query cart data (auth is handled in the procedure)
  const { data: cart, isLoading } = useQuery(trpc.cart.getCart.queryOptions());
  // Get the query key for cart data
  const cartQueryKey = trpc.cart.getCart.queryOptions().queryKey;

  // Helper function to update cart data optimistically
  const updateCartOptimistically = (updater: OptimisticUpdater) => {
    queryClient.setQueryData(cartQueryKey, updater);
  };

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
        updateCartOptimistically,
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
