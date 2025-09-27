import { Button } from "@/components/ui/button";
import { ImagePlusIcon } from "lucide-react";

export const TextShape = () => {
  return (
    <div>
      <h3 className="text-sm font-medium">Text Shape</h3>
      <div className="mt-2 flex justify-end">
        <Button variant="ghost">
          <ImagePlusIcon /> Add Image
        </Button>
      </div>
    </div>
  );
};
