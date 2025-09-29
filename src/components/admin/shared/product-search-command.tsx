"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash-es";
import { forwardRef, useCallback, useEffect, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface ProductSearchCommandProps {
  onProductSelect: (product: { id: string; name: string }) => void;
  onInputChange?: (value: string) => void;
  initialValue?: string;
  excludeProductIds?: string[];
}

export const ProductSearchCommand = forwardRef<
  HTMLInputElement,
  ProductSearchCommandProps
>(
  (
    {
      onProductSelect,
      onInputChange,
      initialValue = "",
      excludeProductIds = [],
    },
    ref,
  ) => {
    const trpc = useTRPC();
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState(initialValue);
    const [isOpen, setIsOpen] = useState(false);

    // Debounce the search query
    const debouncedSetQuery = useCallback(
      debounce((query: string) => {
        setDebouncedQuery(query);
      }, 300),
      [],
    );

    useEffect(() => {
      if (searchQuery && searchQuery !== "Selected Product") {
        debouncedSetQuery(searchQuery);
      } else {
        setDebouncedQuery("");
      }
    }, [searchQuery, debouncedSetQuery]);

    // Reset search query when initialValue changes (e.g., when form is cleared)
    useEffect(() => {
      setSearchQuery(initialValue);
    }, [initialValue]);

    const {
      data: searchResults,
      isLoading,
      error,
    } = useQuery(
      trpc.admin.products.searchProducts.queryOptions(
        {
          query: debouncedQuery,
          limit: 10,
        },
        {
          enabled: !!debouncedQuery && debouncedQuery.length > 0,
        },
      ),
    );

    const products =
      searchResults?.products
        ?.filter((product) => !excludeProductIds.includes(product.id))
        ?.map((product) => ({
          value: product.id,
          label: product.name,
          id: product.id,
          name: product.name,
        })) || [];

    return (
      <Command
        className="rounded-lg border shadow-md"
        onValueChange={(value) => {
          setSearchQuery(value);
        }}
        shouldFilter={false}
      >
        <CommandInput
          ref={ref}
          placeholder="Search products..."
          value={searchQuery}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 100)}
          onValueChange={(value) => {
            setSearchQuery(value);
            onInputChange?.(value);
          }}
        />
        {searchQuery && searchQuery !== "Selected Product" && isOpen && (
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Searching..." : "No products found."}
            </CommandEmpty>
            {error && (
              <div className="text-destructive p-2 text-sm">
                Error: {error.message}
              </div>
            )}
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.value}
                  value={product.value}
                  onSelect={() => {
                    setSearchQuery(product.name);
                    onProductSelect({
                      id: product.id,
                      name: product.name,
                    });
                  }}
                >
                  {product.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    );
  },
);

ProductSearchCommand.displayName = "ProductSearchCommand";
