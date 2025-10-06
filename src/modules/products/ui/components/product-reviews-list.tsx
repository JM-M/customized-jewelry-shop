"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ProductReviewItem } from "./product-review-item";

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
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex w-full items-center justify-center">
        <span className="text-muted-foreground text-sm">
          Showing {reviews.length} reviews
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <ProductReviewItem key={review.id} review={review} />
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
