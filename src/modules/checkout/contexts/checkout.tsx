"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface CheckoutContextType {
  // State
  selectedAddressId: string | null;

  // Actions
  setSelectedAddressId: (addressId: string | null) => void;
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

  const clearSelectedAddress = () => {
    setSelectedAddressId(null);
  };

  const contextValue: CheckoutContextType = {
    // State
    selectedAddressId,

    // Actions
    setSelectedAddressId,
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
