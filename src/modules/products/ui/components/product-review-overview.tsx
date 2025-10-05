"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

interface ProductReviewOverviewProps {
  averageRating?: number;
  totalReviews?: number;
  ratingDistribution?: {
    fiveStars: number;
    fourStars: number;
    threeStars: number;
    twoStars: number;
    oneStar: number;
  };
  className?: string;
}

export const ProductReviewOverview = ({
  averageRating = 4.8,
  totalReviews = 2124,
  ratingDistribution = {
    fiveStars: 1880,
    fourStars: 198,
    threeStars: 46,
    twoStars: 0,
    oneStar: 0,
  },
  className,
}: ProductReviewOverviewProps) => {
  const reviewData = {
    averageRating,
    totalReviews,
    ratingDistribution,
  };

  const distribution = [
    { stars: 5, count: reviewData.ratingDistribution.fiveStars },
    { stars: 4, count: reviewData.ratingDistribution.fourStars },
    { stars: 3, count: reviewData.ratingDistribution.threeStars },
    { stars: 2, count: reviewData.ratingDistribution.twoStars },
    { stars: 1, count: reviewData.ratingDistribution.oneStar },
  ];

  return (
    <div className={cn("mx-auto max-w-lg space-y-4", className)}>
      {/* Overall Rating Summary */}
      <div className="text-center">
        <div className="mb-2 text-4xl font-bold text-gray-900">
          {reviewData.averageRating}
        </div>
        <div className="mb-2 flex items-center justify-center gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon key={index} className="h-6 w-6 fill-black text-black" />
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Based on {reviewData.totalReviews.toLocaleString()} reviews
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-3">
        {distribution.map(({ stars, count }) => {
          const percentage =
            reviewData.totalReviews > 0
              ? (count / reviewData.totalReviews) * 100
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
