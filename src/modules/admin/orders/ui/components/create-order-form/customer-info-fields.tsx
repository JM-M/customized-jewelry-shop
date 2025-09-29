"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

import { CustomerSearchCommand } from "@/components/admin/shared";
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
    setValue("customerName", customer.name);
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
        <div className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="customerName">Name</Label>
            <Input
              id="customerName"
              placeholder="Enter customer name..."
              {...register("customerName")}
            />
            {errors.customerName && (
              <span className="text-destructive text-sm">
                {errors.customerName.message}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
