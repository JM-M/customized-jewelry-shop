"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PhoneInput } from "@/components/shared/phone-input";
import { Spinner2 } from "@/components/shared/spinner-2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CitiesSelect } from "@/modules/checkout/ui/components/cities-select";
import { CountriesSelect } from "@/modules/checkout/ui/components/countries-select";
import { StatesSelect } from "@/modules/checkout/ui/components/states-select";
import { useTRPC } from "@/trpc/client";

// TODO: Remove fields that can be inferred from business information

// Pickup address form validation schema
const pickupAddressFormSchema = z.object({
  // Terminal address fields
  city: z.string().min(1, "City is required"),
  country: z.string().length(2, "Country must be a 2-letter ISO code"),
  state: z.string().min(1, "State is required"),
  email: z.string().email("Invalid email format").optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  zip: z.string().optional(),
  is_residential: z.boolean(),

  // Pickup address fields
  isDefault: z.boolean(),
  nickname: z.string().optional(),
});

type PickupAddressFormValues = z.infer<typeof pickupAddressFormSchema>;

interface PickupAddressFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<PickupAddressFormValues>;
}

export const PickupAddressForm = ({
  onSuccess,
  initialValues,
}: PickupAddressFormProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createPickupAddressMutation = useMutation(
    trpc.terminal.createPickupAddress.mutationOptions(),
  );

  const isLoading = createPickupAddressMutation.isPending;

  const form = useForm<PickupAddressFormValues>({
    resolver: zodResolver(pickupAddressFormSchema),
    defaultValues: {
      city: "",
      country: "NG", // Default to Nigeria
      state: "",
      email: "",
      first_name: "",
      last_name: "",
      name: "",
      phone: "",
      line1: "",
      line2: "",
      zip: "",
      is_residential: true,
      isDefault: false,
      nickname: "",
      ...initialValues,
    },
  });

  const handleFormSubmit = async (data: PickupAddressFormValues) => {
    createPickupAddressMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.terminal.getPickupAddresses.queryOptions({
            page: 1,
            limit: 20,
          }),
        );
        onSuccess?.();
        router.push("/admin/pickup-addresses");
      },
      onError: (error) => {
        console.error("Failed to create pickup address:", error);
      },
    });
  };

  return (
    <Card className="mx-auto w-full max-w-2xl p-3">
      <CardContent className="p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {/* Address Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address Information</h3>

              {/* Name Fields */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Company/Organization Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company/Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder="Enter phone number"
                          value={field.value}
                          onChange={field.onChange}
                          defaultCountry="NG"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Lines */}
              <FormField
                control={form.control}
                name="line1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
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
                      <Input placeholder="Apartment, suite, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City, State, ZIP */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <CitiesSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select city..."
                          className="w-full"
                          countryCode={form.watch("country")}
                          stateCode={form.watch("state")}
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
                      <FormLabel>State/Province *</FormLabel>
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
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP/Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ZIP code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <CountriesSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select country..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pickup Address Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pickup Address Settings</h3>

              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Main Warehouse, Office"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="is_residential"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Residential Address</FormLabel>
                        <p className="text-muted-foreground text-sm">
                          Check if this is a residential address
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Default Pickup Address</FormLabel>
                        <p className="text-muted-foreground text-sm">
                          Set as the default pickup address for shipments
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner2 />
                    Creating...
                  </>
                ) : (
                  "Create Pickup Address"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
