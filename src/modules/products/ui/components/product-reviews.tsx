"use client";

import { ProductReviewForm } from "./product-review-form";
import { ProductReviewOverview } from "./product-review-overview";
import { ProductReviewsList } from "./product-reviews-list";

export const ProductReviews = () => {
  const handleReviewSubmit = async (review: {
    rating: number;
    comment: string;
  }) => {
    // TODO: Implement actual review submission logic
    console.log("New review submitted:", review);

    // For now, just show a success message
    alert("Review submitted successfully! Thank you for your feedback.");
  };

  return (
    <div id="product-reviews" className="space-y-8 p-4">
      <h3 className="text-xl font-semibold">Customer Reviews</h3>
      <ProductReviewOverview />
      <ProductReviewForm onSubmit={handleReviewSubmit} />
      <ProductReviewsList />
    </div>
  );
};
