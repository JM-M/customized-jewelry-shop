"use client";

import { useMutation } from "@tanstack/react-query";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CustomizationOptionsFields } from "./fields";
import { CustomizationOptionsView } from "./view";

interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  type: "text" | "image" | "qr_code";
  maxCharacters?: string;
  sampleImage?: string;
}

interface CustomizationOptionsCardProps {
  product: {
    id: string;
    customizationOptions?: Array<{
      id: string;
      name: string;
      description: string | null;
      type: string;
      maxCharacters: number | null;
      sampleImage: string | null;
    }>;
  };
}

export const CustomizationOptionsCard = ({
  product,
}: CustomizationOptionsCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [options, setOptions] = useState<CustomizationOption[]>(
    product.customizationOptions?.map((opt) => ({
      id: opt.id,
      name: opt.name,
      description: opt.description || "",
      type: opt.type as "text" | "image" | "qr_code",
      maxCharacters: opt.maxCharacters?.toString(),
      sampleImage: opt.sampleImage || undefined,
    })) || [],
  );

  const { mutate: updateOptions, isPending } = useMutation({
    mutationFn: async () => {
      // TODO: Implement actual update mutation
      console.log("Updating customization options:", {
        productId: product.id,
        options,
      });
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success("Customization options updated successfully!");
      setIsEditing(false);
      // TODO: Invalidate product query
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update options");
    },
  });

  const handleSave = () => {
    updateOptions();
  };

  const handleCancel = () => {
    setOptions(
      product.customizationOptions?.map((opt) => ({
        id: opt.id,
        name: opt.name,
        description: opt.description || "",
        type: opt.type as "text" | "image" | "qr_code",
        maxCharacters: opt.maxCharacters?.toString(),
        sampleImage: opt.sampleImage || undefined,
      })) || [],
    );
    setIsEditing(false);
  };

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        name: "",
        description: "",
        type: "text",
        maxCharacters: "50",
      },
    ]);
  };

  const updateOption = (id: string, updates: Partial<CustomizationOption>) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, ...updates } : opt)),
    );
  };

  const removeOption = (id: string) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-medium">Customization Options</CardTitle>
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
            <CustomizationOptionsFields
              options={options}
              onAddOption={addOption}
              onUpdateOption={updateOption}
              onRemoveOption={removeOption}
            />
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
          <CustomizationOptionsView options={product.customizationOptions} />
        )}
      </CardContent>
    </Card>
  );
};
