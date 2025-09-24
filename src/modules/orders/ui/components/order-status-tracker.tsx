import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetUserOrderOutput } from "@/modules/orders/types";
import { CheckCircle, Package, Truck, XCircle } from "lucide-react";

// TODO: Add time for each status

interface OrderStatusTrackerProps {
  order: GetUserOrderOutput;
}

interface StatusStep {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
  current: boolean;
}

export const OrderStatusTracker = ({ order }: OrderStatusTrackerProps) => {
  const { status, shippedAt, deliveredAt } = order;

  const getStatusSteps = (): StatusStep[] => {
    const steps: StatusStep[] = [
      {
        id: "confirmed",
        label: "Order Confirmed",
        description: "Your order has been confirmed and is being prepared",
        icon: CheckCircle,
        completed: ["confirmed", "processing", "shipped", "delivered"].includes(
          status,
        ),
        current: status === "confirmed",
      },
      {
        id: "processing",
        label: "Processing",
        description: "Your order is being processed and prepared for shipment",
        icon: Package,
        completed: ["processing", "shipped", "delivered"].includes(status),
        current: status === "processing",
      },
      {
        id: "shipped",
        label: "Shipped",
        description: shippedAt
          ? `Your order was shipped on ${new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date(shippedAt as string))}`
          : "Your order will be shipped soon",
        icon: Truck,
        completed: ["shipped", "delivered"].includes(status),
        current: status === "shipped",
      },
      {
        id: "delivered",
        label: "Delivered",
        description: deliveredAt
          ? `Your order was delivered on ${new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date(deliveredAt as string))}`
          : "Your order will be delivered soon",
        icon: CheckCircle,
        completed: status === "delivered",
        current: status === "delivered",
      },
    ];

    // Handle cancelled and refunded statuses
    if (status === "cancelled" || status === "refunded") {
      return [
        {
          id: "cancelled",
          label: status === "cancelled" ? "Order Cancelled" : "Order Refunded",
          description:
            status === "cancelled"
              ? "This order has been cancelled"
              : "This order has been refunded",
          icon: XCircle,
          completed: true,
          current: true,
        },
      ];
    }

    return steps;
  };

  const steps = getStatusSteps();

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Order Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      step.completed
                        ? "border-green-500 bg-green-50 text-green-600"
                        : step.current
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 bg-gray-50 text-gray-400"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mt-2 h-8 w-0.5 ${
                        step.completed ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <h4
                    className={`text-sm font-medium ${
                      step.completed || step.current
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p
                    className={`text-sm ${
                      step.completed || step.current
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
