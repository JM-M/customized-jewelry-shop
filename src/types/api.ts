export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Helper type for pagination input
export interface PaginationInput {
  page: number;
  pageSize: number;
}

// Cursor-based pagination for infinite queries
export interface CursorPaginatedResponse<T> {
  items: T[];
  nextCursor: number | undefined;
  totalCount: number;
}

// Helper type for cursor pagination input
export interface CursorPaginationInput {
  cursor: number;
  limit: number;
}
