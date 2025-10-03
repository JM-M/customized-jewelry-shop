"use client";

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
import { useGetStates } from "@/modules/terminal/hooks/use-get-states";

interface StatesSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  countryCode?: string;
}

export const StatesSelect = ({
  value,
  onValueChange,
  placeholder = "Select state...",
  className,
  disabled = false,
  countryCode,
}: StatesSelectProps) => {
  const [open, setOpen] = React.useState(false);

  // Query states data using the custom hook
  const { states, isLoading, error } = useGetStates({ countryCode });

  const selectedState = states.find((state) => state.name === value);

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
        Failed to load states. Please try again.
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
            ? "Loading states..."
            : selectedState
              ? selectedState.name
              : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search states..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No state found."}
            </CommandEmpty>
            <CommandGroup>
              {states.map((state, index) => (
                <CommandItem
                  key={index}
                  value={`${state.name} ${state.isoCode}`}
                  onSelect={() => handleSelect(state.name)}
                >
                  <div className="flex items-center gap-2">
                    <span>{state.name}</span>
                    <span className="text-muted-foreground">
                      ({state.isoCode})
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === state.name ? "opacity-100" : "opacity-0",
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
