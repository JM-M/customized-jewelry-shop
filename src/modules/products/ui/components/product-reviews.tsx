"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { TRPCError } from "@trpc/server";
import { useProduct } from "../../contexts/product";
import { ProductReviewOverview } from "./product-review-overview";
import { ProductReviewsList } from "./product-reviews-list";
import { UserReview } from "./user-review";

export const ProductReviews = () => {
  const { product } = useProduct();
  const productId = product.id;
  const trpc = useTRPC();

  // Fetch product review stats
  const {
    data: productReviewStats,
    isLoading,
    error,
  } = useQuery(
    trpc.products.getProductReviewStats.queryOptions({
      productId,
    }),
  );

  // Fetch user's review status
  const { data: userReviewStatus, isLoading: isUserReviewStatusLoading } =
    useQuery(
      trpc.products.getUserProductReviewStatus.queryOptions({
        productId,
      }),
    );

  const hasReviews = !!Number(productReviewStats?.totalReviews || 0);

  return (
    <div id="product-reviews" className="space-y-6 p-4">
      <h3 className="text-xl font-semibold">Customer Reviews</h3>
      {hasReviews && (
        <ProductReviewOverview
          reviewStats={productReviewStats}
          isLoading={isLoading}
          error={error as TRPCError | Error | null}
        />
      )}
      <UserReview
        reviewStatus={userReviewStatus}
        isReviewStatusLoading={isUserReviewStatusLoading}
      />
      {hasReviews && (
        <ProductReviewsList
          productId={product.id}
          reviewStats={productReviewStats}
        />
      )}
    </div>
  );
};
