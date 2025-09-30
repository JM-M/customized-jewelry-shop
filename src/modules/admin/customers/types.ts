export interface AdminUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "user" | "admin" | "super_admin";
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersResponse {
  items: AdminUser[];
  totalCount: number;
  hasMore: boolean;
  nextCursor: number | null;
}

export interface SearchUsersResponse {
  users: AdminUser[];
}
