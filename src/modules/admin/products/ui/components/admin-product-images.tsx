"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { useAdminProduct } from "../../contexts/admin-product";

export const AdminProductImages = () => {
  const { product } = useAdminProduct();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const images = product ? [product.primaryImage, ...product.images] : [];

  if (!product) {
    return null;
  }

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="font-medium">Product Images</CardTitle>
        <Button variant="ghost">
          <EditIcon className="h-4 w-4" /> Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={images[selectedImageIndex] || product.primaryImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-primary"
                      : "hover:border-muted-foreground border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
