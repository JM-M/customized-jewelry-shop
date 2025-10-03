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
import { TerminalCity } from "@/modules/terminal/types";
import { useTRPC } from "@/trpc/client";

interface CitiesSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  countryCode?: string;
  stateCode?: string;
}

export const CitiesSelect = ({
  value,
  onValueChange,
  placeholder = "Select city...",
  className,
  disabled = false,
  countryCode,
  stateCode,
}: CitiesSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const trpc = useTRPC();

  // Query cities data using the terminal cities procedure
  const {
    data: citiesData,
    isLoading,
    error,
  } = useQuery({
    ...trpc.terminal.getCities.queryOptions({
      country_code: countryCode || "",
      state_code: stateCode,
    }),
    enabled: !!countryCode,
  });

  const cities: TerminalCity[] = citiesData?.data || [];

  const selectedCity = cities.find((city) => city.name === value);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    onValueChange?.(newValue);
    setOpen(false);
  };

  if (!countryCode) {
    return (
      <Button
        variant="outline"
        className={cn("w-full justify-between rounded-lg", className)}
        disabled={true}
      >
        Select a country first
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Failed to load cities. Please try again.
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
          className={cn("w-full justify-between rounded-lg", className)}
          disabled={disabled || isLoading}
        >
          {isLoading
            ? "Loading cities..."
            : selectedCity
              ? selectedCity.name
              : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search cities..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No city found."}
            </CommandEmpty>
            <CommandGroup>
              {cities.map((city, index) => (
                <CommandItem
                  key={index}
                  value={`${city.name} ${city.stateCode}`}
                  onSelect={() => handleSelect(city.name)}
                >
                  <div className="flex items-center gap-2">
                    <span>{city.name}</span>
                    {city.stateCode && (
                      <span className="text-muted-foreground">
                        ({city.stateCode})
                      </span>
                    )}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === city.name ? "opacity-100" : "opacity-0",
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
