"use client";

import { ProductReviewOverview } from "./product-review-overview";
import { ProductReviewsList } from "./product-reviews-list";
import { UserReview } from "./user-review";

export const ProductReviews = () => {
  return (
    <div id="product-reviews" className="space-y-8 p-4">
      <h3 className="text-xl font-semibold">Customer Reviews</h3>
      <ProductReviewOverview />
      <UserReview />
      <ProductReviewsList />
    </div>
  );
};
