"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { defineStepper } from "@stepperize/react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CustomerInfoFields } from "./customer-info-fields";
import { DeliveryInfoFields } from "./delivery-info-fields";
import { OrderItemsFields } from "./order-items-fields";
import { Review } from "./review";
import {
  customerInfoSchema,
  deliveryInfoSchema,
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
    id: "delivery-info",
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

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
  });
  console.log(form.formState.errors);

  const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
    console.log(`Form values for step ${stepper.current.id}:`, values);
    if (stepper.isLast) {
      // Handle final submission
      console.log("Creating order with all data:", values);
      stepper.reset();
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
            "delivery-info": () => <DeliveryInfoFields />,
            review: () => <Review />,
          })}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={stepper.prev}
              disabled={stepper.isFirst}
            >
              Back
            </Button>
            <Button type="submit">
              {stepper.isLast ? "Create Order" : "Next"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
