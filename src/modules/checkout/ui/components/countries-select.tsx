"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TerminalCountry } from "@/modules/terminal/types";
import { useTRPC } from "@/trpc/client";

interface CountriesSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const CountriesSelect = ({
  value,
  onValueChange,
  placeholder = "Select country...",
  className,
  disabled = false,
}: CountriesSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const trpc = useTRPC();

  // Query countries data using the terminal countries procedure
  const {
    data: countriesData,
    isLoading,
    error,
  } = useQuery(trpc.terminal.getCountries.queryOptions());

  const countries: TerminalCountry[] = countriesData?.data || [];

  const selectedCountry = countries.find(
    (country) => country.isoCode === value,
  );

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    onValueChange?.(newValue);
    setOpen(false);
  };

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Failed to load countries. Please try again.
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between rounded-none", className)}
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            "Loading countries..."
          ) : selectedCountry ? (
            <div className="flex items-center gap-2">
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search countries..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No country found."}
            </CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.isoCode}
                  value={`${country.name} ${country.isoCode}`}
                  onSelect={() => handleSelect(country.isoCode)}
                >
                  <div className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                    <span className="text-muted-foreground">
                      ({country.isoCode})
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === country.isoCode ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
