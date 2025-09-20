"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface EngravingPart {
  id: string;
  name: string;
  image: string;
}

const engravingParts: EngravingPart[] = [
  {
    id: "front",
    name: "Front",
    image: "/images/1.png", // Using existing images from the project
  },
  {
    id: "back",
    name: "Back",
    image: "/images/2.png",
  },
  {
    id: "inside",
    name: "Inside Band",
    image: "/images/3.png",
  },
];

export const ProductEngraving = () => {
  const [engravings, setEngravings] = useState<Record<string, string>>({});
  const [showImages, setShowImages] = useState(false);

  const handleEngravingChange = (partId: string, text: string) => {
    setEngravings((prev) => ({
      ...prev,
      [partId]: text,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowImages(!showImages)}
          className="gap-2"
        >
          {showImages ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {showImages ? "Hide" : "Show"} Images
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {engravingParts.map((part) => (
          <Card
            key={part.id}
            className={cn(
              "p-4 shadow-none transition-all",
              engravings[part.id] && "ring-primary/20 ring-1",
            )}
          >
            <div className="space-y-3">
              {/* Part Image - Conditionally rendered */}
              {showImages && (
                <div className="relative aspect-square overflow-hidden rounded-md bg-gray-50">
                  <Image
                    src={part.image}
                    alt={`${part.name} engraving area`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Part Name and Input */}
              <div className="space-y-2">
                <Label
                  htmlFor={`engraving-${part.id}`}
                  className="text-sm font-medium"
                >
                  {part.name}
                </Label>
                <Input
                  id={`engraving-${part.id}`}
                  placeholder={`Enter text for ${part.name.toLowerCase()}`}
                  value={engravings[part.id] || ""}
                  onChange={(e) =>
                    handleEngravingChange(part.id, e.target.value)
                  }
                  className="text-sm"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary */}
      {Object.keys(engravings).some((key) => engravings[key]) && (
        <Card className="bg-muted/30 p-4">
          <h4 className="mb-2 text-sm font-medium">Engraving Summary</h4>
          <div className="text-muted-foreground space-y-1 text-sm">
            {engravingParts.map(
              (part) =>
                engravings[part.id] && (
                  <div key={part.id} className="flex justify-between">
                    <span>{part.name}:</span>
                    <span className="text-foreground font-medium">
                      &quot;{engravings[part.id]}&quot;
                    </span>
                  </div>
                ),
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
