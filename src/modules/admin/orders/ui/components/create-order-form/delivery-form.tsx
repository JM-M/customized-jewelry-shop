"use client";

import { PhoneInput } from "@/components/shared/phone-input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CitiesSelect } from "@/modules/checkout/ui/components/cities-select";
import { CountriesSelect } from "@/modules/checkout/ui/components/countries-select";
import { StatesSelect } from "@/modules/checkout/ui/components/states-select";
import { useGetStates } from "@/modules/terminal/hooks/use-get-states";
import { useFormContext } from "react-hook-form";
import { DeliveryInfoFormValues } from "./schemas";

export const AdminOrderDeliveryForm = () => {
  const form = useFormContext<DeliveryInfoFormValues>();
  const countryCode = form.watch("country");
  const stateName = form.watch("state");

  const { states } = useGetStates({
    countryCode,
  });
  const stateCode = states.find((state) => state.name === stateName)?.isoCode;

  return (
    <div className="space-y-5">
      {/* Contact Information Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  defaultCountry="NG"
                  placeholder="Enter phone number"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      {/* Address Information Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Delivery Address</h3>
        <FormField
          control={form.control}
          name="line1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter street address"
                  maxLength={45}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-right">
                {field.value?.length ?? 0} / 45 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="line2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2 (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  maxLength={45}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-right">
                {field.value?.length ?? 0} / 45 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <CountriesSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select country..."
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <StatesSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select state..."
                    className="w-full"
                    countryCode={form.watch("country")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <CitiesSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select city..."
                      className="w-full"
                      countryCode={countryCode}
                      stateCode={stateCode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ZIP code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Delivery Rate Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Delivery Rate</h3>
        <FormField
          control={form.control}
          name="selectedRateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Delivery Rate</FormLabel>
              <FormControl>
                <Input placeholder="Enter delivery rate ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
