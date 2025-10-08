"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import {
  seoMetadataSchema,
  SeoMetadataFormValues,
} from "../../../schemas";
import { SeoMetadataFields } from "./fields";
import { SeoMetadataView } from "./view";

interface SeoMetadataCardProps {
  product: {
    id: string;
    metaTitle: string | null;
    metaDescription: string | null;
  };
}

export const SeoMetadataCard = ({ product }: SeoMetadataCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<SeoMetadataFormValues>({
    resolver: zodResolver(seoMetadataSchema),
    defaultValues: {
      metaTitle: product.metaTitle || "",
      metaDescription: product.metaDescription || "",
    },
  });

  const { mutate: updateSeo, isPending } = useMutation({
    mutationFn: async (values: SeoMetadataFormValues) => {
      // TODO: Implement actual update mutation
      console.log("Updating SEO metadata:", {
        productId: product.id,
        ...values,
      });
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success("SEO metadata updated successfully!");
      setIsEditing(false);
      // TODO: Invalidate product query
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update SEO metadata");
    },
  });

  const onSubmit = (values: SeoMetadataFormValues) => {
    updateSeo(values);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-medium">SEO & Metadata</CardTitle>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <EditIcon className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <SeoMetadataFields form={form} />
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
                <Button type="submit" disabled={isPending}>
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
            </form>
          </Form>
        ) : (
          <SeoMetadataView
            metaTitle={product.metaTitle}
            metaDescription={product.metaDescription}
          />
        )}
      </CardContent>
    </Card>
  );
};
