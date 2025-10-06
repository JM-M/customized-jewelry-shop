"use client";

import { EditIcon, StarIcon, TrashIcon } from "lucide-react";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase?: boolean;
  helpfulCount?: number;
  location?: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductReviewItemProps {
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  isDeleting?: boolean;
}

export const ProductReviewItem = ({
  review,
  onEdit,
  onDelete,
  showActions = false,
  isDeleting = false,
}: ProductReviewItemProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starIndex = index + 1;
      const isFilled = starIndex <= rating;

      return (
        <StarIcon
          key={index}
          className={cn(
            "h-4 w-4",
            isFilled
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200",
          )}
        />
      );
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 p-4">
      {/* Review Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {review.customerName}
            </span>
            {review.verifiedPurchase && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {formatDate(review.date)}
            </span>
            {review.location && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-sm">
                  {review.location}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {renderStars(review.rating)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="h-7 w-7 p-0"
              >
                <EditIcon className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                disabled={isDeleting}
                className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
              >
                {isDeleting ? (
                  <Spinner className="h-3 w-3" />
                ) : (
                  <TrashIcon className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Review Content */}
      {review.title && (
        <h4 className="font-medium text-gray-900">{review.title}</h4>
      )}
      <p className="leading-relaxed text-gray-700">{review.comment}</p>

      {/* Last Updated */}
      {review.updatedAt &&
        review.createdAt &&
        review.updatedAt !== review.createdAt && (
          <p className="text-muted-foreground text-xs">
            Last updated: {formatDate(review.updatedAt)}
          </p>
        )}
    </div>
  );
};
