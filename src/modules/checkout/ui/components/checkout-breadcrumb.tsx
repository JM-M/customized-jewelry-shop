import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { CHECKOUT_STEPS } from "../../constants";
import { useCheckoutParams } from "../../hooks/use-checkout-params";

const checkoutStepLabels: Record<string, string> = {
  delivery: "Delivery",
  "review-and-checkout": "Review & Checkout",
};

export const CheckoutBreadcrumb = () => {
  const [checkoutParams, setCheckoutParams] = useCheckoutParams();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {CHECKOUT_STEPS.map((step, index) => {
          const isActive = step === checkoutParams.step;
          return (
            <Fragment key={step}>
              <BreadcrumbItem
                onClick={() => setCheckoutParams({ step })}
                className={cn("cursor-pointer", isActive && "text-primary")}
              >
                <BreadcrumbLink>{checkoutStepLabels[step]}</BreadcrumbLink>
              </BreadcrumbItem>
              {index < CHECKOUT_STEPS.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
