"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useTRPC } from "@/trpc/client";
import { defineStepper } from "@stepperize/react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CustomerInfoFields } from "./customer-info-fields";
import { DeliveryFields } from "./delivery-fields";
import { OrderItemsFields } from "./order-items-fields";
import { Review } from "./review";
import {
  CustomerInfoFormValues,
  customerInfoSchema,
  DeliveryInfoFormValues,
  deliveryInfoSchema,
  OrderItemsFormValues,
  orderItemsSchema,
  reviewSchema,
} from "./schemas";
import { StepperNavigation } from "./stepper-navigation";

// Define stepper
const { useStepper, steps, utils } = defineStepper(
  {
    id: "customer-info",
    label: "Customer Info",
    schema: customerInfoSchema,
  },
  {
    id: "order-items",
    label: "Order Items",
    schema: orderItemsSchema,
  },
  {
    id: "delivery",
    label: "Delivery",
    schema: deliveryInfoSchema,
  },
  {
    id: "review",
    label: "Review",
    schema: reviewSchema,
  },
);

export const CreateOrderForm = () => {
  const stepper = useStepper();
  const router = useRouter();
  const trpc = useTRPC();

  // State to accumulate form data from all steps
  const [accumulatedData, setAccumulatedData] = useState<{
    customerInfo?: CustomerInfoFormValues;
    orderItems?: OrderItemsFormValues;
    delivery?: DeliveryInfoFormValues;
    deliveryCache?: {
      addressId: string;
      addressData: {
        phone: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
      rates?: Array<{
        rate_id: string;
        amount: number;
        carrier_name: string;
        delivery_time: string;
        currency: string;
      }>;
    };
  }>({});

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
    defaultValues: {
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "NG",
      selectedRateId: "",
      ...accumulatedData.delivery,
    },
  });
  console.log(form.formState.errors);

  // Create order mutation
  const {
    mutate: createOrder,
    isPending,
    error,
  } = useMutation(trpc.admin.orders.createOrder.mutationOptions());

  const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
    // Store the current step's data
    if (stepper.current.id === "customer-info") {
      setAccumulatedData((prev) => ({
        ...prev,
        customerInfo: values as CustomerInfoFormValues,
      }));
    } else if (stepper.current.id === "order-items") {
      setAccumulatedData((prev) => ({
        ...prev,
        orderItems: values as OrderItemsFormValues,
      }));
    } else if (stepper.current.id === "delivery") {
      setAccumulatedData((prev) => ({
        ...prev,
        delivery: values as DeliveryInfoFormValues,
      }));
    }

    if (stepper.isLast) {
      // Handle final submission - create the order
      if (!accumulatedData.customerInfo || !accumulatedData.orderItems) {
        toast.error("Missing order information");
        return;
      }

      const deliveryAddressId = accumulatedData.deliveryCache?.addressId;
      const rateId = accumulatedData.delivery?.selectedRateId;

      if (!deliveryAddressId) {
        toast.error("Delivery address is required");
        return;
      }

      if (!rateId) {
        toast.error("Delivery rate is required");
        return;
      }

      createOrder(
        {
          customerId: accumulatedData.customerInfo.customerId,
          customerEmail: accumulatedData.customerInfo.customerEmail,
          customerFirstName: accumulatedData.customerInfo.customerFirstName,
          customerLastName: accumulatedData.customerInfo.customerLastName,
          items: accumulatedData.orderItems.items.map((item) => ({
            productId: item.productId,
            materialId: item.materialId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            notes: item.notes,
            customizations: item.customizations,
          })),
          deliveryAddressId,
          rateId,
        },
        {
          onSuccess: (data) => {
            toast.success(
              `Order ${data.order.orderNumber} created successfully!`,
            );
            stepper.reset();
            setAccumulatedData({});
            form.reset();
            // Navigate to the order details page
            router.push(`/admin/orders/${data.order.orderNumber}`);
          },
          onError: (error) => {
            toast.error(error.message || "Failed to create order");
          },
        },
      );
    } else {
      stepper.next();
    }
  };

  const currentIndex = utils.getIndex(stepper.current.id);

  const handleStepClick = async (stepId: string, stepIndex: number) => {
    const valid = await form.trigger();
    if (!valid) return;
    if (stepIndex - currentIndex > 1) return;
    stepper.goTo(stepId as typeof stepper.current.id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between">
          <h2 className="text-lg font-medium">Create Order</h2>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              Step {currentIndex + 1} of {steps.length}
            </span>
          </div>
        </div>

        <ScrollArea>
          <StepperNavigation
            stepper={{
              all: steps,
              current: { id: stepper.current.id },
              goTo: stepper.goTo,
            }}
            steps={steps}
            utils={{
              getIndex: (id: string) =>
                utils.getIndex(id as typeof stepper.current.id),
            }}
            currentIndex={currentIndex}
            onStepClick={handleStepClick}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="space-y-4">
          {stepper.switch({
            "customer-info": () => <CustomerInfoFields />,
            "order-items": () => <OrderItemsFields />,
            delivery: () => (
              <DeliveryFields
                customerInfo={accumulatedData.customerInfo}
                deliveryCache={accumulatedData.deliveryCache}
                onCacheUpdate={(cache) => {
                  setAccumulatedData((prev) => ({
                    ...prev,
                    deliveryCache: cache,
                  }));
                }}
                onRatesUpdate={(rates) => {
                  setAccumulatedData((prev) => ({
                    ...prev,
                    deliveryCache: {
                      ...prev.deliveryCache!,
                      rates,
                    },
                  }));
                }}
              />
            ),
            review: () => <Review accumulatedData={accumulatedData} />,
          })}

          {error && stepper.isLast && (
            <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
              {error.message || "Failed to create order. Please try again."}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={stepper.prev}
              disabled={stepper.isFirst || isPending}
            >
              Back
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Creating..."
                : stepper.isLast
                  ? "Create Order"
                  : "Next"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
