export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchUsersResponse {
  users: AdminUser[];
}
