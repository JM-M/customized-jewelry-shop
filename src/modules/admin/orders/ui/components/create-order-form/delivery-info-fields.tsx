"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

import { DeliveryInfoFormValues } from "./schemas";

export const DeliveryInfoFields = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<DeliveryInfoFormValues>();

  const deliveryAddressId = watch("deliveryAddressId");
  const pickupAddressId = watch("pickupAddressId");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="deliveryAddressId">Delivery Address</Label>
          <Select
            value={deliveryAddressId}
            onValueChange={(value) => setValue("deliveryAddressId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select delivery address" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="address-1">
                123 Main St, New York, NY 10001
              </SelectItem>
              <SelectItem value="address-2">
                456 Oak Ave, Los Angeles, CA 90210
              </SelectItem>
              <SelectItem value="address-3">
                789 Pine Rd, Chicago, IL 60601
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.deliveryAddressId && (
            <span className="text-destructive text-sm">
              {errors.deliveryAddressId.message}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickupAddressId">Pickup Address</Label>
          <Select
            value={pickupAddressId}
            onValueChange={(value) => setValue("pickupAddressId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pickup address" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pickup-1">
                Warehouse A - 100 Industrial Blvd
              </SelectItem>
              <SelectItem value="pickup-2">
                Warehouse B - 200 Commerce St
              </SelectItem>
              <SelectItem value="pickup-3">
                Store Location - 300 Retail Ave
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.pickupAddressId && (
            <span className="text-destructive text-sm">
              {errors.pickupAddressId.message}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryFee">Delivery Fee</Label>
          <Input
            id="deliveryFee"
            type="number"
            step="0.01"
            {...register("deliveryFee", { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.deliveryFee && (
            <span className="text-destructive text-sm">
              {errors.deliveryFee.message}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
