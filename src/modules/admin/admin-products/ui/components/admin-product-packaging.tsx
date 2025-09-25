"use client";

import { Spinner2 } from "@/components/shared/spinner-2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetProductByIdOutput } from "@/modules/products/types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";

import { PackagingInfo } from "./packaging-info";

interface AdminProductPackagingProps {
  product: GetProductByIdOutput;
}

export const AdminProductPackaging = ({
  product,
}: AdminProductPackagingProps) => {
  const trpc = useTRPC();

  const { data: packaging, isLoading } = useQuery(
    trpc.terminal.getPackaging.queryOptions({
      perPage: 100,
      page: 1,
    }),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );
  }

  if (!packaging) {
    return (
      <div className="flex items-center justify-center gap-2">
        <p>No packaging options configured yet.</p>
      </div>
    );
  }

  const defaultPackaging = packaging.data.packaging.find(
    (packaging) => packaging.default,
  );

  let productPackaging = product.packagingId
    ? packaging.data.packaging.find(
        (packaging) => packaging.packaging_id === product.packagingId,
      )
    : defaultPackaging;

  const emptyContent = (
    <div className="text-muted-foreground py-5 text-center">
      <p>No packaging options configured yet.</p>
      <p className="mt-2 text-sm">
        Add gift boxes, wrapping paper, and other packaging options to enhance
        the customer experience.
      </p>
    </div>
  );

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="font-medium">Packaging</CardTitle>
        <Button variant="ghost">
          <EditIcon className="h-4 w-4" /> Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        {productPackaging ? (
          <PackagingInfo packaging={productPackaging} />
        ) : (
          emptyContent
        )}
      </CardContent>
    </Card>
  );
};
