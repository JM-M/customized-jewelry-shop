"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useTRPC } from "@/trpc/client";

interface CheckoutContextType {
  // State
  selectedAddressId: string | null;
  selectedRateId: string | null;
  isLoadingSession: boolean;

  // Actions
  setSelectedAddressId: (addressId: string | null) => void;
  setSelectedRateId: (rateId: string | null) => void;
  clearSelectedAddress: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
);

interface CheckoutProviderProps {
  children: ReactNode;
}

export function CheckoutProvider({ children }: CheckoutProviderProps) {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);

  const trpc = useTRPC();

  // Load existing checkout session
  const { data: checkoutSession, isLoading: isLoadingSession } = useQuery(
    trpc.checkout.getCheckoutSession.queryOptions(),
  );

  const { mutate: upsertCheckoutSession } = useMutation(
    trpc.checkout.upsertCheckoutSession.mutationOptions(),
  );

  // Initialize state from existing session
  useEffect(() => {
    if (checkoutSession && !isLoadingSession) {
      if (checkoutSession.selectedAddressId) {
        setSelectedAddressId(checkoutSession.selectedAddressId);
      }
      if (checkoutSession.rateId) {
        setSelectedRateId(checkoutSession.rateId);
      }
    }
  }, [checkoutSession, isLoadingSession]);

  // Sync with database when address or rate changes
  useEffect(() => {
    if (selectedAddressId !== null || selectedRateId !== null) {
      upsertCheckoutSession({
        selectedAddressId,
        rateId: selectedRateId,
      });
    }
  }, [selectedAddressId, selectedRateId, upsertCheckoutSession]);

  const clearSelectedAddress = () => {
    setSelectedAddressId(null);
    setSelectedRateId(null);
  };

  const contextValue: CheckoutContextType = {
    // State
    selectedAddressId,
    selectedRateId,
    isLoadingSession,
    // Actions
    setSelectedAddressId,
    setSelectedRateId,
    clearSelectedAddress,
  };

  return (
    <CheckoutContext.Provider value={contextValue}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
