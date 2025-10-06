"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

import { AddReviewButton } from "./add-review-button";
import { ProductReviewForm } from "./product-review-form";

interface NoUserReviewProps {
  productId: string;
  onReviewSubmitted?: () => void;
  className?: string;
}

export const NoUserReview = ({
  productId,
  onReviewSubmitted,
  className,
}: NoUserReviewProps) => {
  const [isAddingReview, setIsAddingReview] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const {
    mutate: createProductReview,
    isPending,
    error,
  } = useMutation(trpc.products.createProductReview.mutationOptions());

  const handleAddReview = () => {
    setIsAddingReview(true);
  };

  const handleReviewSubmit = async (review: {
    rating: number;
    comment: string;
    title?: string;
  }) => {
    createProductReview(
      {
        productId,
        rating: review.rating,
        comment: review.comment,
        title: review.title,
      },
      {
        onSuccess: () => {
          setIsAddingReview(false);
          // Invalidate relevant queries to refetch data
          queryClient.invalidateQueries({
            queryKey: trpc.products.getUserProductReviewStatus.queryKey({
              productId,
            }),
          });
          queryClient.invalidateQueries({
            queryKey: trpc.products.getProductReviews.queryKey({ productId }),
          });
          queryClient.invalidateQueries({
            queryKey: trpc.products.getProductReviewStats.queryKey({
              productId,
            }),
          });
          onReviewSubmitted?.();
        },
        onError: (error) => {
          console.error("Failed to create review:", error);
        },
      },
    );
  };

  if (isAddingReview) {
    return (
      <div className={cn("space-y-4", className)}>
        <ProductReviewForm
          onSubmit={handleReviewSubmit}
          isSubmitting={isPending}
          onCancel={() => setIsAddingReview(false)}
        />
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error.message || "Failed to submit review. Please try again."}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-center">
        <AddReviewButton onAddReview={handleAddReview} disabled={isPending} />
      </div>
    </div>
  );
};
