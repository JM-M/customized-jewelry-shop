import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { authClient } from "@/lib/auth-client";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "user" | "admin" | "super_admin";
}

export async function seedUsers() {
  console.log("👥 Creating users with passwords...");
  const password = "12345678";

  const userData: UserData[] = [
    {
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@example.com",
      emailVerified: true,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      role: "super_admin",
    },
    {
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      emailVerified: true,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      role: "admin",
    },
    {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      emailVerified: true,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      role: "user",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      emailVerified: true,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      role: "user",
    },
  ];

  // Create users one by one using better-auth signup
  const createdUsers = [];
  for (const userInfo of userData) {
    try {
      console.log(`Creating user: ${userInfo.email}`);

      // Use better-auth to create user with password
      const result = await authClient.signUp.email({
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        password: password,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
      });

      if (result.error) {
        console.log(result.error);
        console.warn(
          `⚠️ Could not create user ${userInfo.email}: ${result.error.message}`,
        );
        // Fallback: create user manually without password
        const manualUser = await db
          .insert(user)
          .values({
            id: uuidv4(),
            name: `${userInfo.firstName} ${userInfo.lastName}`,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            emailVerified: userInfo.emailVerified,
            image: userInfo.image,
            role: userInfo.role,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
        createdUsers.push(manualUser[0]);
      } else {
        console.log(`✅ Created user: ${userInfo.email}`);
        // The user was created successfully by better-auth
        // We need to update the role since better-auth creates users with default role
        const dbUser = await db
          .select()
          .from(user)
          .where(eq(user.email, userInfo.email))
          .limit(1);

        if (dbUser.length > 0) {
          // Update the user's role and other properties
          const updatedUser = await db
            .update(user)
            .set({
              role: userInfo.role,
              image: userInfo.image,
              emailVerified: userInfo.emailVerified,
              updatedAt: new Date(),
            })
            .where(eq(user.id, dbUser[0].id))
            .returning();
          createdUsers.push(updatedUser[0]);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Error creating user ${userInfo.email}:`, error);
      // Fallback: create user manually
      const manualUser = await db
        .insert(user)
        .values({
          id: uuidv4(),
          name: `${userInfo.firstName} ${userInfo.lastName}`,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          emailVerified: userInfo.emailVerified,
          image: userInfo.image,
          role: userInfo.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      createdUsers.push(manualUser[0]);
    }
  }

  console.log(`✅ Created ${createdUsers.length} users`);
  console.log(`🔑 All users can now login with password: ${password}`);
  console.log("\n👥 Users created:");
  userData.forEach((u) => {
    console.log(
      `- ${u.role.toUpperCase()}: ${u.firstName} ${u.lastName} (${u.email})`,
    );
  });

  return createdUsers;
}
