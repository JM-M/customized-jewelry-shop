"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { useState } from "react";

import { useProduct } from "../../contexts/product";
import { NoUserReview } from "./no-user-review";
import { ProductReviewForm } from "./product-review-form";
import { ProductReviewItem } from "./product-review-item";

interface UserReviewProps {
  className?: string;
}

export const UserReview = ({ className }: UserReviewProps) => {
  const { product } = useProduct();
  const productId = product.id;
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  // Get user's purchase status and existing review
  const { data: reviewStatus, isLoading: isReviewStatusLoading } = useQuery(
    trpc.products.getUserProductReviewStatus.queryOptions({
      productId,
    }),
  );

  // Mutation for updating reviews
  const {
    mutate: updateProductReview,
    isPending: isUpdatingReview,
    error: updateError,
  } = useMutation(trpc.products.updateProductReview.mutationOptions());

  // Mutation for deleting reviews
  const {
    mutate: deleteProductReview,
    isPending: isDeletingReview,
    error: deleteError,
  } = useMutation(trpc.products.deleteProductReview.mutationOptions());

  const hasUserPurchasedProduct = reviewStatus?.hasPurchased ?? false;
  const userReview = reviewStatus?.userReview ?? null;

  const handleReviewSubmit = async (review: {
    rating: number;
    comment: string;
    title?: string;
  }) => {
    if (!userReview) {
      console.error("No user review found for editing");
      return;
    }

    updateProductReview(
      {
        reviewId: userReview.id,
        rating: review.rating,
        comment: review.comment,
        title: review.title,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
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
        },
        onError: (error) => {
          console.error("Failed to update review:", error);
        },
      },
    );
  };

  const handleEditReview = () => {
    setIsEditing(true);
  };

  const handleDeleteReview = () => {
    if (!userReview) {
      console.error("No user review found for deletion");
      return;
    }

    deleteProductReview(
      { reviewId: userReview.id },
      {
        onSuccess: () => {
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
        },
        onError: (error) => {
          console.error("Failed to delete review:", error);
        },
      },
    );
  };

  // Show loading state
  if (isReviewStatusLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="h-32 animate-pulse rounded-lg bg-gray-200" />
      </div>
    );
  }

  // If user hasn't purchased the product, don't show anything
  if (!hasUserPurchasedProduct) {
    return null;
  }

  // If user has purchased but hasn't reviewed yet, show the no review component
  if (!userReview && !isEditing) {
    return (
      <NoUserReview
        productId={productId}
        onReviewSubmitted={() => {
          // Refetch the review status to show the new review
          // The query will automatically refetch due to invalidation
        }}
        className={className}
      />
    );
  }

  // If user has an existing review, show it with edit/delete options
  if (userReview && !isEditing) {
    return (
      <div className={cn("space-y-4", className)}>
        <ProductReviewItem
          review={{
            id: userReview.id,
            customerName: "You", // or user's actual name
            rating: userReview.rating,
            date: userReview.createdAt,
            comment: userReview.comment ?? "",
            verifiedPurchase: true,
            title: userReview.title ?? "",
            createdAt: userReview.createdAt,
            updatedAt: userReview.updatedAt,
          }}
          showActions
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
          isDeleting={isDeletingReview}
        />
        {deleteError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {deleteError.message ||
              "Failed to delete review. Please try again."}
          </div>
        )}
      </div>
    );
  }

  // If editing mode, show the form with existing data
  return (
    <div className={cn("space-y-4", className)}>
      <ProductReviewForm
        onSubmit={handleReviewSubmit}
        initialRating={userReview!.rating}
        initialComment={userReview!.comment}
        initialTitle={userReview!.title}
        isEditing={true}
        isSubmitting={isUpdatingReview}
        onCancel={() => setIsEditing(false)}
        className="border-primary"
      />
      {(updateError || deleteError) && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {updateError?.message ||
            deleteError?.message ||
            "Failed to update review. Please try again."}
        </div>
      )}
    </div>
  );
};
