"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, StarIcon, XIcon } from "lucide-react";

import { Dropzone } from "@/components/shared/dropzone";
import { Button } from "@/components/ui/button";
import { BUCKETS } from "@/constants/storage";
import { cn } from "@/lib/utils";

interface ProductImagesFieldsProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

interface SortableImageProps {
  id: string;
  image: string;
  index: number;
  onRemove: () => void;
  onSetAsPrimary: () => void;
}

const SortableImage = ({
  id,
  image,
  index,
  onRemove,
  onSetAsPrimary,
}: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group border-border bg-background relative rounded-lg border-2",
        isDragging && "z-50 opacity-50",
      )}
    >
      <img
        src={image}
        alt={`Product ${index + 1}`}
        className="h-32 w-full rounded-lg object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={onSetAsPrimary}
          title="Set as primary"
        >
          <StarIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={onRemove}
          title="Remove image"
        >
          <XIcon className="h-4 w-4" />
        </Button>
        <div
          {...attributes}
          {...listeners}
          className="bg-primary text-primary-foreground flex h-8 w-8 cursor-grab items-center justify-center rounded-md active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVerticalIcon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export const ProductImagesFields = ({
  images,
  onImagesChange,
}: ProductImagesFieldsProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((_, i) => `image-${i}` === active.id);
      const newIndex = images.findIndex((_, i) => `image-${i}` === over.id);

      // Only allow reordering within positions 1+ (skip primary at index 0)
      if (oldIndex > 0 && newIndex > 0) {
        const reordered = arrayMove(images, oldIndex, newIndex);
        onImagesChange(reordered);
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleSetAsPrimary = (index: number) => {
    const newImages = [...images];
    // Swap the selected image with the current primary (index 0)
    [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
    onImagesChange(newImages);
  };

  const handleAddImage = (url: string) => {
    onImagesChange([...images, url]);
  };

  const primaryImage = images?.[0];
  const otherImages = images?.slice(1) ?? [];

  return (
    <div className="space-y-6">
      {/* Primary Image Section */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Primary Image <span className="text-destructive">*</span>
        </label>
        {primaryImage ? (
          <div className="relative">
            <div className="border-primary relative overflow-hidden rounded-lg border-2">
              <img
                src={primaryImage}
                alt="Primary product"
                className="h-48 w-full object-cover"
              />
              <div className="bg-primary text-primary-foreground absolute top-2 left-2 rounded px-2 py-1 text-xs font-semibold">
                Primary
              </div>
              {images.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => handleRemove(0)}
                  title="Remove primary image"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Dropzone
            id="primary-image"
            accept="image/*"
            showPreview={false}
            enableUpload
            bucket={BUCKETS.PRODUCT_IMAGES}
            onUploadSuccess={(url) => onImagesChange([url])}
          />
        )}
        <p className="text-muted-foreground mt-2 text-xs">
          This image will be displayed as the main product image
        </p>
      </div>

      {/* Other Images Section */}
      {primaryImage && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Additional Images
          </label>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={otherImages.map((_, i) => `image-${i + 1}`)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {otherImages.map((image, index) => (
                  <SortableImage
                    key={`image-${index + 1}`}
                    id={`image-${index + 1}`}
                    image={image}
                    index={index + 1}
                    onRemove={() => handleRemove(index + 1)}
                    onSetAsPrimary={() => handleSetAsPrimary(index + 1)}
                  />
                ))}
                {images.length < 9 && (
                  <Dropzone
                    id={`additional-image-${images.length}`}
                    accept="image/*"
                    showPreview={false}
                    enableUpload
                    bucket={BUCKETS.PRODUCT_IMAGES}
                    onUploadSuccess={handleAddImage}
                  />
                )}
              </div>
            </SortableContext>
          </DndContext>
          <p className="text-muted-foreground mt-2 text-xs">
            Drag to reorder, click star to set as primary. Up to 9 images total.
          </p>
        </div>
      )}
    </div>
  );
};
