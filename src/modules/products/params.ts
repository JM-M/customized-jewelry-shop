import { DEFAULT_PAGE } from "@/constants/api";
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

// Server-side search parameter parsing that mirrors the client-side hook
export const productsFilterSearchParams = {
  // Search query
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),

  // Page for pagination
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),

  // Price range filters
  minPrice: parseAsInteger.withDefault(0).withOptions({ clearOnDefault: true }),

  maxPrice: parseAsInteger.withDefault(0).withOptions({ clearOnDefault: true }),

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
};

// Server-side loader function
export const loadProductsSearchParams = createLoader(
  productsFilterSearchParams,
);
