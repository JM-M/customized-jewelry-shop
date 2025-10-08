"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Combobox } from "@/components/shared/combobox";
import { Dropzone } from "@/components/shared/dropzone";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BUCKETS } from "@/constants/storage";

interface CustomizationOptionsFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  fieldCount: number;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
}

export const CustomizationOptionsFields = ({
  form,
  fieldCount,
  onAddOption,
  onRemoveOption,
}: CustomizationOptionsFieldsProps) => {
  return (
    <div className="space-y-4">
      {fieldCount === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-8 text-center">
          <p className="text-sm">No customization options added yet</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddOption}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Customization Option
          </Button>
        </div>
      ) : (
        <>
          {Array.from({ length: fieldCount }).map((_, index) => {
            const optionType = form.watch(`customizationOptions.${index}.type`);

            return (
              <div key={index} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium">Customization Option</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onRemoveOption(index)}
                  >
                    <Trash2Icon className="text-destructive h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`customizationOptions.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Front Engraving"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`customizationOptions.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Combobox
                            options={[
                              { value: "text", label: "Text" },
                              { value: "image", label: "Image" },
                              { value: "qr_code", label: "QR Code" },
                            ]}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select type"
                            allowClear={false}
                            className="w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`customizationOptions.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe this customization option..."
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {optionType === "text" && (
                  <FormField
                    control={form.control}
                    name={`customizationOptions.${index}.maxCharacters`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Characters</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="50"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name={`customizationOptions.${index}.sampleImage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sample Image (Optional)</FormLabel>
                      <FormControl>
                        <Dropzone
                          id={`customization-sample-${index}`}
                          accept="image/*"
                          showPreview
                          enableUpload
                          bucket={BUCKETS.PRODUCT_CUSTOMIZATIONS}
                          onUploadSuccess={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddOption}
            className="w-full"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Another Option
          </Button>
        </>
      )}
    </div>
  );
};
