"use client";

import { useMutation } from "@tanstack/react-query";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";

import { useAdminProduct } from "../../../contexts/admin-product";
import { ProductImagesFields } from "./fields";
import { ProductImagesView } from "./view";

export const ProductImagesCard = () => {
  const { product, refetchProduct, setProductData } = useAdminProduct();
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState<string[]>(product.images || []);
  const trpc = useTRPC();

  const { mutate: updateImagesMutation, isPending } = useMutation(
    trpc.admin.products.updateProduct.mutationOptions(),
  );

  const updateImages = (values: Parameters<typeof updateImagesMutation>[0]) => {
    // Optimistically update the product data
    setProductData({
      images: values.images,
      primaryImage: values.images?.[0],
    });
    setIsEditing(false);

    updateImagesMutation(values, {
      onSuccess: () => {
        toast.success("Product images updated successfully!");
        refetchProduct();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update images");
        setIsEditing(true);
      },
    });
  };

  const handleSave = () => {
    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }
    updateImages({
      productId: product.id,
      images,
    });
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
            <EditIcon />
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
                <XIcon />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? (
                  <>
                    <Spinner />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon />
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
