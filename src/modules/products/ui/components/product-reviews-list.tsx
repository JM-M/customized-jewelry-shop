"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

import { ProductReviewItem } from "./product-review-item";

interface ProductReviewsListProps {
  productId: string;
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
}

export const ProductReviewsList = ({
  productId,
  className,
  reviewStats,
}: ProductReviewsListProps) => {
  const trpc = useTRPC();
  const session = authClient.useSession();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      ...trpc.products.getProductReviews.infiniteQueryOptions(
        {
          productId,
          limit: 10,
          excludeUserId: session.data?.user?.id,
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
      ),
      select: (data) => data.pages.flatMap((page) => page.items),
    });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <p>Loading reviews...</p>
      </div>
    );
  }

  // Only show "No reviews yet" if there are truly no reviews at all
  if (!Number(reviewStats?.totalReviews || 0)) {
    return (
      <div className="flex items-center justify-center gap-2">
        <p>No reviews yet</p>
      </div>
    );
  }

  // If there are reviews but none from other users, show nothing
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex w-full items-center justify-center">
        <span className="text-muted-foreground text-sm">
          Showing {data.length} reviews
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map((review) => (
          <ProductReviewItem key={review.id} review={review} />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="pt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-full px-5"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load More Reviews"}
          </Button>
        </div>
      )}
    </div>
  );
};
