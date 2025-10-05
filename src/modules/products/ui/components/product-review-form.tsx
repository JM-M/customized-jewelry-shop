"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import { useState } from "react";

interface ProductReviewFormProps {
  onSubmit?: (review: { rating: number; comment: string }) => void;
  className?: string;
}

export const ProductReviewForm = ({
  onSubmit,
  className,
}: ProductReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit?.({ rating, comment });
      // Reset form after successful submission
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starIndex = index + 1;
      const isFilled = starIndex <= (hoveredRating || rating);

      return (
        <button
          key={index}
          type="button"
          className="transition-colors hover:scale-110"
          onClick={() => setRating(starIndex)}
          onMouseEnter={() => setHoveredRating(starIndex)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <StarIcon
            className={cn(
              "h-6 w-6",
              isFilled
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200",
            )}
          />
        </button>
      );
    });
  };

  return (
    <div
      className={cn(
        "mx-auto max-w-lg rounded-lg border border-gray-200 p-3",
        className,
      )}
    >
      <h4 className="mb-4 text-lg font-semibold">Write a Review</h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Your Rating *
          </label>
          <div className="flex items-center gap-1">
            {renderStars()}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {rating} star{rating !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Review Comment */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Your Review *
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <div className="text-right text-xs text-gray-500">
            {comment.length}/500 characters
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
            className="px-6"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};
