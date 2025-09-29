"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash-es";
import { useCallback, useEffect, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface CustomerSearchCommandProps {
  onCustomerSelect: (customer: {
    email: string;
    name: string;
    id: string;
  }) => void;
  onInputChange?: (value: string) => void;
  initialValue?: string;
}

export const CustomerSearchCommand = ({
  onCustomerSelect,
  onInputChange,
  initialValue = "",
}: CustomerSearchCommandProps) => {
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
    if (searchQuery) {
      debouncedSetQuery(searchQuery);
    } else {
      setDebouncedQuery("");
    }
  }, [searchQuery, debouncedSetQuery]);

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery(
    trpc.admin.users.searchUsers.queryOptions(
      {
        query: debouncedQuery,
        limit: 10,
      },
      {
        enabled: !!debouncedQuery && debouncedQuery.length > 0,
      },
    ),
  );

  const customers =
    searchResults?.users?.map((user) => ({
      value: user.email,
      label: `${user.name} (${user.email})`,
      id: user.id,
      name: user.name,
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
        placeholder="Customer email..."
        value={searchQuery}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        onValueChange={(value) => {
          setSearchQuery(value);
          onInputChange?.(value);
        }}
      />
      {searchQuery && isOpen && (
        <CommandList>
          <CommandEmpty>
            {isLoading ? "Searching..." : "No customer found."}
          </CommandEmpty>
          {error && (
            <div className="text-destructive p-2 text-sm">
              Error: {error.message}
            </div>
          )}
          <CommandGroup>
            {customers.map((customer) => (
              <CommandItem
                key={customer.value}
                value={customer.value}
                onSelect={() => {
                  setSearchQuery(customer.value);
                  onCustomerSelect({
                    email: customer.value,
                    name: customer.name,
                    id: customer.id,
                  });
                }}
              >
                {customer.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
};
