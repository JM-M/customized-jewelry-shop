import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

interface ProductReviewsProps {
  rating?: number;
  reviewCount?: number;
  showReviewCount?: boolean;
  className?: string;
  onReviewsClick?: () => void;
}

export const ProductReviews = ({
  rating = 4.7,
  reviewCount = 146,
  showReviewCount = true,
  className,
  onReviewsClick,
}: ProductReviewsProps) => {
  const fullStars = Math.floor(rating);
  const hasPartialStar = rating % 1 !== 0;
  const partialStarFill = (rating % 1) * 100;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Star Rating */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => {
          const starIndex = index + 1;
          const isFullStar = starIndex <= fullStars;
          const isPartialStar = hasPartialStar && starIndex === fullStars + 1;

          return (
            <div key={index} className="relative">
              {/* Empty star background */}
              <StarIcon
                className="h-4 w-4 fill-gray-200 text-gray-200"
                fill="currentColor"
              />
              {/* Filled star overlay */}
              {(isFullStar || isPartialStar) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    width: isPartialStar ? `${partialStarFill}%` : "100%",
                  }}
                >
                  <StarIcon
                    className="h-4 w-4 fill-black text-black"
                    fill="currentColor"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Rating Number */}
      <span className="text-sm font-medium text-gray-900">{rating}</span>

      {/* Review Count */}
      {showReviewCount && (
        <button
          onClick={onReviewsClick}
          className="text-sm text-gray-500 underline transition-colors hover:text-gray-700"
        >
          {reviewCount} reviews
        </button>
      )}
    </div>
  );
};
