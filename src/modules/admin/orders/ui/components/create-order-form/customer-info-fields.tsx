"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

import { CustomerSearchCommand } from "@/components/admin/shared/customer-search-command";
import { CustomerInfoFormValues } from "./schemas";

export const CustomerInfoFields = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CustomerInfoFormValues>();

  const handleCustomerSelect = (customer: {
    email: string;
    name: string;
    id: string;
  }) => {
    setValue("customerEmail", customer.email);
    // Split the name into first and last name
    const nameParts = customer.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    setValue("customerFirstName", firstName);
    setValue("customerLastName", lastName);
    setValue("customerId", customer.id);
  };

  const customerEmail = watch("customerEmail");

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="p-0">
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email</Label>
          <CustomerSearchCommand
            onCustomerSelect={handleCustomerSelect}
            initialValue={customerEmail}
          />
          {errors.customerEmail && (
            <span className="text-destructive text-sm">
              {errors.customerEmail.message}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerFirstName">First Name</Label>
            <Input
              id="customerFirstName"
              placeholder="Enter first name..."
              {...register("customerFirstName")}
            />
            {errors.customerFirstName && (
              <span className="text-destructive text-sm">
                {errors.customerFirstName.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerLastName">Last Name</Label>
            <Input
              id="customerLastName"
              placeholder="Enter last name..."
              {...register("customerLastName")}
            />
            {errors.customerLastName && (
              <span className="text-destructive text-sm">
                {errors.customerLastName.message}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
