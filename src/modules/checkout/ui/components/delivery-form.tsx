"use client";

import { PhoneInput } from "@/components/shared/phone-input";
import {
  Form,
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
import { authClient } from "@/lib/auth-client";
import { TerminalAddress } from "@/modules/terminal/types";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Spinner2 } from "@/components/shared/spinner-2";
import { Button } from "@/components/ui/button";
import { useGetStates } from "@/modules/terminal/hooks/use-get-states";
import { ArrowRightIcon } from "lucide-react";
import { useCheckout } from "../../contexts/checkout";
import { CitiesSelect } from "./cities-select";
import { CountriesSelect } from "./countries-select";
import { StatesSelect } from "./states-select";

// Delivery form validation schema
const deliveryFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(1, {
    message: "Phone number is required.",
  }),
  line1: z
    .string()
    .min(5, {
      message: "Address must be at least 5 characters.",
    })
    .max(45, {
      message: "Address must not exceed 45 characters.",
    }),
  line2: z
    .string()
    .max(45, {
      message: "Address line 2 must not exceed 45 characters.",
    })
    .optional(),
  city: z.string().min(2, {
    message: "Please select a city.",
  }),
  state: z.string().min(2, {
    message: "Please select a state.",
  }),
  zip: z.string().min(5, {
    message: "ZIP code must be at least 5 characters.",
  }),
  country: z.string().length(2, {
    message: "Please select a country.",
  }),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

interface DeliveryFormProps {
  onSubmit?: (data: TerminalAddress) => void;
  initialValues?: Partial<DeliveryFormValues>;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const session = authClient.useSession();
  const firstName = session.data?.user?.firstName;
  const lastName = session.data?.user?.lastName;
  const email = session.data?.user?.email;
  const userId = session.data?.user?.id;

  const { setSelectedAddressId } = useCheckout();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createAddressMutation = useMutation(
    trpc.terminal.createAddress.mutationOptions(),
  );
  const isLoading = createAddressMutation.isPending;

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      email,
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "NG", // Default to Nigeria (ISO code)
      ...initialValues,
    },
  });

  const countryCode = form.watch("country");
  const stateName = form.watch("state");

  const { states } = useGetStates({
    countryCode,
  });
  const stateCode = states.find((state) => state.name === stateName)?.isoCode;

  const handleFormSubmit = async (data: DeliveryFormValues) => {
    const addressData = {
      ...data,
      metadata: {
        user_id: userId,
      },
    };

    createAddressMutation.mutate(addressData, {
      onSuccess: (data) => {
        form.reset();
        // Set the newly created address as selected in the checkout context
        setSelectedAddressId(data.data.address_id);
        onSubmit?.(data.data);
        queryClient.invalidateQueries(
          trpc.terminal.getUserAddresses.queryOptions(),
        );
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-5"
      >
        {/* Personal Information Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                      placeholder="Enter your email address"
                      {...field}
                      disabled
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCountry="NG"
                      placeholder="Enter your phone number"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                    placeholder="Enter your street address"
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
        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="h-12 w-full">
            {isLoading ? (
              <>
                Processing...
                <Spinner2 />
              </>
            ) : (
              <>
                Proceed
                <ArrowRightIcon />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
