"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AddReviewButtonProps {
  onAddReview: () => void;
  disabled?: boolean;
}

export const AddReviewButton = ({
  onAddReview,
  disabled = false,
}: AddReviewButtonProps) => {
  return (
    <Button
      onClick={onAddReview}
      className="flex items-center gap-2"
      variant="outline"
      disabled={disabled}
    >
      <PlusIcon className="h-4 w-4" />
      Add your review
    </Button>
  );
};
