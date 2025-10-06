"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { StarIcon } from "lucide-react";

interface ProductReviewOverviewProps {
  className?: string;
  reviewStats?: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      fiveStars: number;
      fourStars: number;
      threeStars: number;
      twoStars: number;
      oneStar: number;
    };
  } | null;
  isLoading?: boolean;
  error?: TRPCError | Error | null;
}

export const ProductReviewOverview = ({
  className,
  reviewStats,
  isLoading,
  error,
}: ProductReviewOverviewProps) => {
  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("mx-auto max-w-lg space-y-4", className)}>
        <div className="text-center">
          <div className="mb-2 h-10 w-16 animate-pulse rounded bg-gray-200" />
          <div className="mb-2 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-6 w-6 animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-4 w-2 animate-pulse rounded bg-gray-200" />
              <div className="h-3 flex-1 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-6 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={cn("mx-auto max-w-lg text-center", className)}>
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error.message || "Failed to load review statistics"}
        </div>
      </div>
    );
  }

  // Return null if no reviews
  if (!reviewStats || reviewStats.totalReviews === 0) {
    return null;
  }

  const distribution = [
    { stars: 5, count: reviewStats.ratingDistribution.fiveStars },
    { stars: 4, count: reviewStats.ratingDistribution.fourStars },
    { stars: 3, count: reviewStats.ratingDistribution.threeStars },
    { stars: 2, count: reviewStats.ratingDistribution.twoStars },
    { stars: 1, count: reviewStats.ratingDistribution.oneStar },
  ];

  return (
    <div className={cn("mx-auto max-w-lg space-y-4", className)}>
      {/* Overall Rating Summary */}
      <div className="text-center">
        <div className="mb-2 text-4xl font-bold text-gray-900">
          {reviewStats.averageRating}
        </div>
        <div className="mb-2 flex items-center justify-center gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon key={index} className="h-6 w-6 fill-black text-black" />
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Based on {reviewStats.totalReviews.toLocaleString()} reviews
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-3">
        {distribution.map(({ stars, count }) => {
          const percentage =
            reviewStats.totalReviews > 0
              ? (count / reviewStats.totalReviews) * 100
              : 0;

          return (
            <div key={stars} className="flex items-center gap-3">
              <div className="w-fit text-sm text-nowrap text-gray-600">
                {stars}
              </div>
              <div className="flex-1">
                <Progress value={percentage} className="h-3" />
              </div>
              <div className="w-7.5 text-sm text-gray-600">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
