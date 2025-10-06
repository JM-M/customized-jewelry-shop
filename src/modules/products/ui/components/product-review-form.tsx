"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import { useState } from "react";

import { Spinner } from "@/components/shared/spinner";

interface ProductReviewFormProps {
  onSubmit?: (review: {
    rating: number;
    comment: string;
    title?: string;
  }) => void;
  onCancel?: () => void;
  className?: string;
  initialRating?: number;
  initialComment?: string | null;
  initialTitle?: string | null;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export const ProductReviewForm = ({
  onSubmit,
  onCancel,
  className,
  initialRating = 0,
  initialComment = "",
  initialTitle = "",
  isEditing = false,
  isSubmitting = false,
}: ProductReviewFormProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(initialComment || "");
  const [title, setTitle] = useState(initialTitle || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    onSubmit?.({ rating, comment, title: title.trim() || undefined });
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
      <h4 className="mb-4 text-lg font-semibold">
        {isEditing ? "Edit Your Review" : "Write a Review"}
      </h4>

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

        {/* Review Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Review Title (Optional)
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience..."
            maxLength={100}
          />
          <div className="text-right text-xs text-gray-500">
            {title.length}/100 characters
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
            className="px-6"
          >
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Submitting..."
              : isEditing
                ? "Update Review"
                : "Submit Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};
