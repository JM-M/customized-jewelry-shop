import { seedCategories } from "./seed-categories";
import { seedMaterials } from "./seed-materials";
import { seedProducts } from "./seed-products";
import { seedUsers } from "./seed-users";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    await seedUsers();
    const createdCategories = await seedCategories();
    const createdMaterials = await seedMaterials();
    await seedProducts(createdCategories, createdMaterials);
    console.log("🎉 Database seeding completed!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Run the seed function
seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
