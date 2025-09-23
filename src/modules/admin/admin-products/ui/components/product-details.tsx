"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import {
  GetEngravingAreasByProductIdOutput,
  GetMaterialsByProductIdOutput,
  GetProductByIdOutput,
} from "@/modules/products/types";
import Image from "next/image";
import { useState } from "react";

interface ProductDetailsProps {
  product: GetProductByIdOutput;
  productMaterials?: GetMaterialsByProductIdOutput;
  productEngravingAreas?: GetEngravingAreasByProductIdOutput;
}

// TODO: This component is a work in progress, it needs to be improved.

export const ProductDetails = ({
  product,
  productMaterials = [],
  productEngravingAreas = [],
}: ProductDetailsProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const images = [product.primaryImage, ...product.images];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {product.sku && (
            <Badge variant="secondary" className="text-sm">
              SKU: {product.sku}
            </Badge>
          )}
        </div>
        <div className="text-primary text-2xl font-semibold">
          {formatNaira(Number(product.price))}
        </div>
        {product.stockQuantity !== null && (
          <div className="text-muted-foreground text-sm">
            Stock: {product.stockQuantity} available
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
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
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Description */}
          {product.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Price:</span>
                  <div className="text-primary text-lg font-semibold">
                    {formatNaira(Number(product.price))}
                  </div>
                </div>
                {product.sku && (
                  <div>
                    <span className="font-medium">SKU:</span>
                    <div className="text-muted-foreground">{product.sku}</div>
                  </div>
                )}
                <div>
                  <span className="font-medium">Stock:</span>
                  <div className="text-muted-foreground">
                    {product.stockQuantity} available
                  </div>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <div className="text-muted-foreground">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Information */}
          {(product.metaTitle || product.metaDescription) && (
            <Card>
              <CardHeader>
                <CardTitle>SEO Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.metaTitle && (
                  <div>
                    <span className="text-sm font-medium">Meta Title:</span>
                    <div className="text-muted-foreground text-sm">
                      {product.metaTitle}
                    </div>
                  </div>
                )}
                {product.metaDescription && (
                  <div>
                    <span className="text-sm font-medium">
                      Meta Description:
                    </span>
                    <div className="text-muted-foreground text-sm">
                      {product.metaDescription}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" size="lg">
                Edit Product
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                View in Shop
              </Button>
              <Button variant="destructive" className="w-full" size="lg">
                Delete Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Materials Section */}
      {productMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Available Materials ({productMaterials.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {productMaterials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div
                    className="h-6 w-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: material.material.hexColor }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">
                      {material.material.displayName}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {formatNaira(Number(material.price))}
                    </div>
                    {material.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                    <div className="text-muted-foreground text-xs">
                      Stock: {material.stockQuantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engraving Areas Section */}
      {productEngravingAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Engraving Areas ({productEngravingAreas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {productEngravingAreas.map((area) => (
                <div key={area.id} className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{area.engravingArea.name}</h4>
                    <Badge variant="outline">{area.engravingType}</Badge>
                  </div>
                  {area.engravingArea.description && (
                    <p className="text-muted-foreground text-sm">
                      {area.engravingArea.description}
                    </p>
                  )}
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    {area.maxCharacters && (
                      <span>Max: {area.maxCharacters} chars</span>
                    )}
                    <span>Order: {area.displayOrder}</span>
                    <span
                      className={
                        area.isActive ? "text-green-600" : "text-red-600"
                      }
                    >
                      {area.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {area.referenceImage && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">
                        Reference Image:
                      </span>
                      <div className="text-muted-foreground truncate text-xs">
                        {area.referenceImage}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Product Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">
            <p>No reviews available yet.</p>
            <p className="mt-2 text-sm">
              Reviews will be displayed here once customers start leaving
              feedback.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Images Information */}
        <Card>
          <CardHeader>
            <CardTitle>Images ({images.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Primary Image:</span>
                <div className="text-muted-foreground truncate">
                  {product.primaryImage}
                </div>
              </div>
              {product.images.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Additional Images:</span>
                  <div className="space-y-1">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className="text-muted-foreground truncate"
                      >
                        {image}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <CardTitle>Timestamps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Created:</span>
              <div className="text-muted-foreground">
                {new Date(product.createdAt).toLocaleString()}
              </div>
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>
              <div className="text-muted-foreground">
                {new Date(product.updatedAt).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
