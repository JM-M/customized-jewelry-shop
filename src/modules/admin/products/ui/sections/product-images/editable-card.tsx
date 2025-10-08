"use client";

import { useMutation } from "@tanstack/react-query";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ProductImagesFields } from "./fields";
import { ProductImagesView } from "./view";

interface ProductImagesCardProps {
  product: {
    id: string;
    images: string[];
  };
}

export const ProductImagesCard = ({ product }: ProductImagesCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState<string[]>(product.images || []);

  const { mutate: updateImages, isPending } = useMutation({
    mutationFn: async () => {
      // TODO: Implement actual update mutation
      console.log("Updating images:", {
        productId: product.id,
        images,
        primaryImage: images[0],
      });
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success("Product images updated successfully!");
      setIsEditing(false);
      // TODO: Invalidate product query
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update images");
    },
  });

  const handleSave = () => {
    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }
    updateImages();
  };

  const handleCancel = () => {
    setImages(product.images || []);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-medium">Product Images</CardTitle>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <EditIcon className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <ProductImagesFields images={images} onImagesChange={setImages} />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
              >
                <XIcon className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <ProductImagesView images={product.images || []} />
        )}
      </CardContent>
    </Card>
  );
};
