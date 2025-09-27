"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Dropzone } from "@/components/shared/dropzone";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";

// Form validation schema
const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  image: z.string().min(1, "Image is required"),
  parentId: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormValues> & { id?: string };
  onSubmit?: (data: CategoryFormValues) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const CategoryForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
}: CategoryFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Get parent categories for subcategory creation
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery(
    trpc.categories.getAll.queryOptions(),
  );

  const createCategoryMutation = useMutation(
    trpc.admin.categories.createCategory.mutationOptions(),
  );

  const updateCategoryMutation = useMutation(
    trpc.admin.categories.updateCategory.mutationOptions(),
  );

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: undefined,
      image: "",
      parentId: undefined,
      isActive: true,
      ...initialValues,
    },
  });

  const isEditing = !!initialValues?.id;
  const isSubmitting =
    createCategoryMutation.isPending ||
    updateCategoryMutation.isPending ||
    isLoading;

  // Auto-generate slug from name
  const watchedName = form.watch("name");
  useEffect(() => {
    if (!isEditing && watchedName) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  }, [watchedName, isEditing, form]);

  const handleFormSubmit = async (data: CategoryFormValues) => {
    try {
      const submitData = {
        ...data,
        parentId: data.parentId === "none" ? undefined : data.parentId,
      };

      if (isEditing && initialValues?.id) {
        await updateCategoryMutation.mutateAsync({
          id: initialValues.id,
          ...submitData,
        });
      } else {
        await createCategoryMutation.mutateAsync(submitData);
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: trpc.categories.getParentCategories.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.categories.getAll.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.admin.categories.getCategoryWithSubcategories.queryKey(),
      });

      onSubmit?.(data);
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const parentCategories = categoriesData?.filter((cat) => !cat.parentId) || [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter category name"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug Field */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="category-slug"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter category description"
                  className="min-h-[100px]"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Field */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image *</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    placeholder="Enter image URL or path"
                    {...field}
                    disabled={isSubmitting}
                  />
                  <Dropzone
                    id="category-image"
                    onFileChange={(e) => {
                      // Handle file upload - you may want to implement actual upload logic
                      const file = e.target.files?.[0];
                      if (file) {
                        form.setValue("image", file.name);
                      }
                    }}
                    accept="image/*"
                    disabled={isSubmitting}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Parent Category Field */}
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "none"}
                  disabled={isSubmitting || isLoadingCategories}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">
                      No parent (top-level category)
                    </SelectItem>
                    {parentCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Active Status */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <div className="text-muted-foreground text-sm">
                    Category is visible to customers
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Error Display */}
        {(createCategoryMutation.error || updateCategoryMutation.error) && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">
              {createCategoryMutation.error?.message ||
                updateCategoryMutation.error?.message}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {isEditing ? "Updating..." : "Creating..."}
              </div>
            ) : isEditing ? (
              "Update Category"
            ) : (
              "Create Category"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
