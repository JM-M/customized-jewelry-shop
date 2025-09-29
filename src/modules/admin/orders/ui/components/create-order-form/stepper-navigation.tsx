"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface StepperNavigationProps {
  stepper: {
    all: Array<{ id: string; label: string }>;
    current: { id: string };
    goTo: (id: "customer-info" | "order-items" | "review") => void;
  };
  steps: Array<{ id: string; label: string }>;
  utils: {
    getIndex: (id: string) => number;
  };
  currentIndex: number;
  onStepClick: (stepId: string, stepIndex: number) => Promise<void>;
}

export const StepperNavigation = ({
  stepper,
  steps,
  utils,
  currentIndex,
  onStepClick,
}: StepperNavigationProps) => {
  return (
    <nav aria-label="Order Creation Steps" className="group my-4">
      <ol
        className="flex items-center justify-between gap-2"
        aria-orientation="horizontal"
      >
        {stepper.all.map((step, index, array) => (
          <React.Fragment key={step.id}>
            <li className="flex flex-shrink-0 items-center gap-4">
              <Button
                type="button"
                role="tab"
                variant={index <= currentIndex ? "default" : "secondary"}
                aria-current={
                  stepper.current.id === step.id ? "step" : undefined
                }
                aria-posinset={index + 1}
                aria-setsize={steps.length}
                aria-selected={stepper.current.id === step.id}
                className="flex size-10 items-center justify-center rounded-full"
                onClick={() => onStepClick(step.id, index)}
              >
                {index + 1}
              </Button>
              <span className="text-sm font-medium">{step.label}</span>
            </li>
            {index < array.length - 1 && (
              <Separator
                className={`flex-1 ${
                  index < currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
