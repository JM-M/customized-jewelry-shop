import { AdminNavbar } from "@/components/admin/admin-navbar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { db } from "@/db";
import { user as usersTable } from "@/db/schema/auth";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { siteConfig } from "../../../site.config";

export const metadata: Metadata = {
  title: {
    template: `%s - Admin | ${siteConfig.name}`,
  },
  description: `Manage your ${siteConfig.name} store operations, orders, and inventory`,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If no session, redirect to sign-in
  if (!session) {
    redirect("/sign-in");
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.user.id));
  if (!user) {
    notFound();
  }

  // If user doesn't have admin or super_admin role, show 404
  if (user.role !== "admin" && user.role !== "super_admin") {
    notFound();
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex min-h-screen max-w-full flex-1 flex-col">
        <AdminNavbar />
        <main className="@container flex-1 p-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
