import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { formatNaira } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useProductsFilters } from "../../hooks/use-products-filters";
import { GetProductFilterOptionsOutput } from "../../types";

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

interface ProductFiltersProps {
  filterOptions?: GetProductFilterOptionsOutput;
}

export const ProductFilters = ({ filterOptions }: ProductFiltersProps) => {
  const [filters, setFilters] = useProductsFilters();

  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );

  // Use real price range from filter options or fallback to defaults
  const priceRange = filterOptions?.priceRange || { min: 0, max: 1000 };
  const availableMaterials = filterOptions?.materials || [];
  const availableSubcategories = filterOptions?.subcategories || [];

  // Group subcategories by their parent category
  const groupedCategories = availableSubcategories.reduce(
    (acc, subcategory) => {
      // Find the actual category in the database to get its parentId
      const categoryData = categories.find((cat) => cat.id === subcategory.id);
      if (categoryData && categoryData.parentId) {
        const parent = categories.find(
          (cat) => cat.id === categoryData.parentId,
        );
        if (parent) {
          if (!acc[parent.id]) {
            acc[parent.id] = {
              parent,
              subcategories: [],
            };
          }
          acc[parent.id].subcategories.push(subcategory);
        }
      }
      return acc;
    },
    {} as Record<
      string,
      { parent: any; subcategories: typeof availableSubcategories }
    >,
  );

  const groupedCategoriesArray = Object.values(groupedCategories);

  // Local state for slider values to avoid excessive updates
  const [localPriceRange, setLocalPriceRange] = useState([
    filters.minPrice || priceRange.min,
    filters.maxPrice || priceRange.max,
  ]);

  return (
    <div>
      <ScrollArea className="h-[calc(100vh-2rem)] md:h-[calc(100vh-8rem)]">
        <div className="space-y-4 p-4">
          {/* Active Filters Summary */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {/* Price Range Filter */}
              {(filters.minPrice > 0 || filters.maxPrice > 0) && (
                <Badge variant="secondary" className="text-xs">
                  ${filters.minPrice || 0} - ${filters.maxPrice || "∞"}
                  <button
                    className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                    onClick={() => setFilters({ minPrice: 0, maxPrice: 0 })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {/* Category Filters */}
              {filters.categories &&
                filters.categories
                  .split(",")
                  .filter(Boolean)
                  .map((categoryId) => (
                    <Badge
                      key={categoryId}
                      variant="secondary"
                      className="text-xs"
                    >
                      {availableSubcategories.find(
                        (cat) => cat.id === categoryId,
                      )?.name || categoryId}
                      <button
                        className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                        onClick={() => {
                          const currentCategories =
                            filters.categories?.split(",").filter(Boolean) ||
                            [];
                          const newCategories = currentCategories.filter(
                            (id) => id !== categoryId,
                          );
                          setFilters({ categories: newCategories.join(",") });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}

              {/* Material Filters */}
              {filters.materials &&
                filters.materials
                  .split(",")
                  .filter(Boolean)
                  .map((materialId) => (
                    <Badge
                      key={materialId}
                      variant="secondary"
                      className="text-xs"
                    >
                      {availableMaterials.find((mat) => mat.id === materialId)
                        ?.displayName || materialId}
                      <button
                        className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                        onClick={() => {
                          const currentMaterials =
                            filters.materials?.split(",").filter(Boolean) || [];
                          const newMaterials = currentMaterials.filter(
                            (id) => id !== materialId,
                          );
                          setFilters({ materials: newMaterials.join(",") });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          {priceRange.min < priceRange.max && (
            <>
              <div className="space-y-2">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Price Range</h4>
                  <div className="space-y-3">
                    <Slider
                      value={localPriceRange}
                      max={priceRange.max}
                      min={priceRange.min}
                      step={10}
                      className="w-full"
                      onValueChange={(values) => {
                        // Update local state for immediate UI feedback
                        setLocalPriceRange(values);
                      }}
                      onValueCommit={(values) => {
                        // Update URL state only when user finishes dragging
                        setFilters({
                          minPrice: values[0],
                          maxPrice: values[1],
                        });
                      }}
                    />
                    <div className="text-muted-foreground flex justify-between text-sm">
                      <span>{formatNaira(localPriceRange[0])}</span>
                      <span>{formatNaira(localPriceRange[1])}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Categories */}
          {groupedCategoriesArray.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Categories</h4>
              <div className="space-y-2">
                {groupedCategoriesArray.map(({ parent, subcategories }) => {
                  const currentCategories =
                    filters.categories?.split(",").filter(Boolean) || [];

                  return (
                    <Collapsible key={parent.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <label className="cursor-pointer text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {parent.name}
                          </label>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="space-y-2 pt-2 pl-6">
                        {subcategories.map((subcategory) => {
                          const isSubcategorySelected =
                            currentCategories.includes(subcategory.id);

                          return (
                            <div
                              key={subcategory.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={subcategory.id}
                                checked={isSubcategorySelected}
                                onCheckedChange={(checked) => {
                                  const newCategories = checked
                                    ? [...currentCategories, subcategory.id]
                                    : currentCategories.filter(
                                        (id) => id !== subcategory.id,
                                      );
                                  setFilters({
                                    categories: newCategories.join(","),
                                  });
                                }}
                              />
                              <label
                                htmlFor={subcategory.id}
                                className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {subcategory.name}
                                <span className="text-muted-foreground ml-1 text-xs">
                                  ({subcategory.productCount})
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </div>
          )}

          <Separator />

          {/* Materials */}
          {availableMaterials.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Materials</h4>
              <div className="space-y-2">
                {availableMaterials.map((material) => {
                  const currentMaterials =
                    filters.materials?.split(",").filter(Boolean) || [];
                  const isMaterialSelected = currentMaterials.includes(
                    material.id,
                  );

                  return (
                    <div
                      key={material.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={material.id}
                        checked={isMaterialSelected}
                        onCheckedChange={(checked) => {
                          const newMaterials = checked
                            ? [...currentMaterials, material.id]
                            : currentMaterials.filter(
                                (id) => id !== material.id,
                              );
                          setFilters({ materials: newMaterials.join(",") });
                        }}
                      />
                      <label
                        htmlFor={material.id}
                        className="flex cursor-pointer items-center space-x-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <div
                          className="h-4 w-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: material.hexColor }}
                        />
                        <span>{material.displayName}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
