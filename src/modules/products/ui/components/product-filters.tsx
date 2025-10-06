import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, X } from "lucide-react";

const SAMPLE_MATERIALS = [
  { id: "gold-14k", name: "14K Gold", color: "#FFD700" },
  { id: "gold-18k", name: "18K Gold", color: "#FFA500" },
  { id: "silver-925", name: "Sterling Silver", color: "#C0C0C0" },
  { id: "platinum", name: "Platinum", color: "#E5E4E2" },
  { id: "rose-gold", name: "Rose Gold", color: "#E8B4B8" },
  { id: "white-gold", name: "White Gold", color: "#F5F5DC" },
];

const SAMPLE_CATEGORIES = [
  {
    id: "rings",
    name: "Rings",
    subcategories: [
      { id: "engagement-rings", name: "Engagement Rings" },
      { id: "wedding-bands", name: "Wedding Bands" },
      { id: "fashion-rings", name: "Fashion Rings" },
      { id: "cocktail-rings", name: "Cocktail Rings" },
    ],
  },
  {
    id: "necklaces",
    name: "Necklaces",
    subcategories: [
      { id: "pendants", name: "Pendants" },
      { id: "chains", name: "Chains" },
      { id: "statement-necklaces", name: "Statement Necklaces" },
      { id: "chokers", name: "Chokers" },
    ],
  },
  {
    id: "earrings",
    name: "Earrings",
    subcategories: [
      { id: "studs", name: "Studs" },
      { id: "hoops", name: "Hoops" },
      { id: "dangly", name: "Dangly" },
      { id: "ear-cuffs", name: "Ear Cuffs" },
    ],
  },
  {
    id: "bracelets",
    name: "Bracelets",
    subcategories: [
      { id: "bangles", name: "Bangles" },
      { id: "chain-bracelets", name: "Chain Bracelets" },
      { id: "cuff-bracelets", name: "Cuff Bracelets" },
      { id: "charm-bracelets", name: "Charm Bracelets" },
    ],
  },
];

export const ProductFilters = () => {
  return (
    <div className="space-y-4 p-4 pr-0">
      {/* Active Filters Summary */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Active Filters</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            Rings
            <button className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Engagement Rings
            <button className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
          <Badge variant="secondary" className="text-xs">
            14K Gold
            <button className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
          <Badge variant="secondary" className="text-xs">
            $100 - $500
            <button className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-2">
        <div>
          <h4 className="mb-2 text-sm font-medium">Price Range</h4>
          <div className="space-y-3">
            <Slider
              value={[0, 1000]}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>$0</span>
              <span>$1000</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Categories</h4>
        <div className="space-y-2">
          {SAMPLE_CATEGORIES.map((category) => (
            <Collapsible key={category.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id={category.id} />
                  <label
                    htmlFor={category.id}
                    className="cursor-pointer text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-2 pt-2 pl-6">
                {category.subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox id={subcategory.id} />
                    <label
                      htmlFor={subcategory.id}
                      className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {subcategory.name}
                    </label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      <Separator />

      {/* Materials */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Materials</h4>
        <div className="space-y-2">
          {SAMPLE_MATERIALS.map((material) => (
            <div key={material.id} className="flex items-center space-x-2">
              <Checkbox id={material.id} />
              <label
                htmlFor={material.id}
                className="flex cursor-pointer items-center space-x-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <div
                  className="h-4 w-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: material.color }}
                />
                <span>{material.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
