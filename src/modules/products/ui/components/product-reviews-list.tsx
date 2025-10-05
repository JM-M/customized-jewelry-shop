"use client";

import { StarIcon } from "lucide-react";

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
}

interface ProductReviewsListProps {
  reviews?: Review[];
  className?: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    customerName: "Sarah M.",
    rating: 5,
    date: "2024-01-15",
    comment:
      "Absolutely beautiful piece! The craftsmanship is outstanding and it arrived exactly as described. Highly recommend!",
    verifiedPurchase: true,
    helpfulCount: 12,
    location: "Lagos, Lagos",
  },
  {
    id: "2",
    customerName: "Michael R.",
    rating: 4,
    date: "2024-01-10",
    comment:
      "Great quality jewelry. The design is elegant and the materials feel premium. Shipping was fast too.",
    verifiedPurchase: true,
    helpfulCount: 8,
    location: "Abuja, FCT",
  },
  {
    id: "3",
    customerName: "Emma L.",
    rating: 5,
    date: "2024-01-08",
    comment:
      "I love this piece! It's become my go-to accessory. The attention to detail is remarkable.",
    verifiedPurchase: true,
    helpfulCount: 15,
    location: "Port Harcourt, Rivers",
  },
  {
    id: "4",
    customerName: "David K.",
    rating: 4,
    date: "2024-01-05",
    comment:
      "Very satisfied with my purchase. The jewelry exceeded my expectations in terms of quality and design.",
    verifiedPurchase: true,
    helpfulCount: 6,
    location: "Kano, Kano",
  },
];

export const ProductReviewsList = ({
  reviews = mockReviews,
  className,
}: ProductReviewsListProps) => {
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
    <div className={cn("space-y-4", className)}>
      <div className="flex w-full items-center justify-center">
        <span className="text-muted-foreground text-sm">
          Showing {reviews.length} reviews
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="space-y-3 rounded-lg border border-gray-200 p-4"
          >
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
            </div>

            {/* Review Content */}
            <p className="leading-relaxed text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="pt-4 text-center">
        <Button variant="outline" size="sm" className="h-10 rounded-full px-5">
          Load More Reviews
        </Button>
      </div>
    </div>
  );
};
