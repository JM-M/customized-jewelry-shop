import { DEFAULT_PAGE } from "@/constants/api";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

// Price range type
export type PriceRange = {
  min?: number;
  max?: number;
};

// Product filters type
export type ProductFilters = {
  // Price range filter
  priceRange?: PriceRange;
  // Category filters (for subcategory filtering within the main category)
  categoryIds?: string[];
  // Material filters
  materialIds?: string[];
};

export const useProductsFilters = () => {
  return useQueryStates({
    // Search query
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),

    // Page for pagination
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),

    // Price range filters
    minPrice: parseAsInteger
      .withDefault(0)
      .withOptions({ clearOnDefault: true }),

    maxPrice: parseAsInteger
      .withDefault(0)
      .withOptions({ clearOnDefault: true }),

    // Category filters (comma-separated string)
    categories: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),

    // Material filters (comma-separated string)
    materials: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),

    // Sort option
    sort: parseAsStringEnum([
      "newest",
      "oldest",
      "price-low",
      "price-high",
      "name-a-z",
      "name-z-a",
    ])
      .withDefault("newest")
      .withOptions({ clearOnDefault: true }),
  });
};

// Helper function to convert URL state to product filters object
export const urlStateToProductFilters = (
  urlState: ReturnType<typeof useProductsFilters>[0],
): ProductFilters => {
  const filters: ProductFilters = {};

  // Price range
  if (urlState.minPrice > 0 || urlState.maxPrice > 0) {
    filters.priceRange = {
      min: urlState.minPrice > 0 ? urlState.minPrice : undefined,
      max: urlState.maxPrice > 0 ? urlState.maxPrice : undefined,
    };
  }

  // Categories
  if (urlState.categories) {
    filters.categoryIds = urlState.categories.split(",").filter(Boolean);
  }

  // Materials
  if (urlState.materials) {
    filters.materialIds = urlState.materials.split(",").filter(Boolean);
  }

  return filters;
};

// Helper function to convert product filters object to URL state
export const productFiltersToUrlState = (filters: ProductFilters) => {
  const urlState: Record<string, string | number> = {};

  if (filters.priceRange?.min) {
    urlState.minPrice = filters.priceRange.min;
  }

  if (filters.priceRange?.max) {
    urlState.maxPrice = filters.priceRange.max;
  }

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    urlState.categories = filters.categoryIds.join(",");
  }

  if (filters.materialIds && filters.materialIds.length > 0) {
    urlState.materials = filters.materialIds.join(",");
  }

  return urlState;
};
