"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Spinner2 } from "./spinner-2";

interface InfiniteLoadingTriggerProps {
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  children?: React.ReactNode;
  loadingContent?: React.ReactNode;
  hasMoreContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

export const InfiniteLoadingTrigger = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  children,
  loadingContent,
  hasMoreContent,
  endContent,
}: InfiniteLoadingTriggerProps) => {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px", // Start loading when element is 100px away from viewport
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div ref={ref} className="flex justify-center py-8">
      {isFetchingNextPage
        ? loadingContent || (
            <div className="flex items-center space-x-2">
              <Spinner2 />
              <span className="text-sm text-gray-600">Loading more...</span>
            </div>
          )
        : hasNextPage
          ? hasMoreContent || (
              <div className="text-sm text-gray-500">
                Scroll down to load more
              </div>
            )
          : endContent || (
              <div className="text-sm text-gray-500">
                You{"'"}ve reached the end
              </div>
            )}
      {children}
    </div>
  );
};
