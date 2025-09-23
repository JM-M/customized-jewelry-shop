import { db } from "@/db";
import { materials } from "@/db/schema/shop";

export interface MaterialData {
  name: string;
  displayName: string;
  hexColor: string;
  description: string | null;
}

export async function seedMaterials(): Promise<MaterialData[]> {
  console.log("✨ Creating jewelry materials...");

  const materialsData: MaterialData[] = [
    {
      name: "sterling_silver",
      displayName: "Sterling Silver",
      hexColor: "#C0C0C0",
      description:
        "Classic sterling silver with timeless elegance and durability",
    },
    {
      name: "14k_yellow_gold",
      displayName: "14K Yellow Gold",
      hexColor: "#FFD700",
      description:
        "Traditional yellow gold with perfect balance of purity and strength",
    },
    {
      name: "18k_yellow_gold",
      displayName: "18K Yellow Gold",
      hexColor: "#FFA500",
      description: "Premium yellow gold with higher purity and richer color",
    },
    {
      name: "14k_white_gold",
      displayName: "14K White Gold",
      hexColor: "#F7F7F7",
      description: "Modern white gold with rhodium plating for brilliant shine",
    },
    {
      name: "18k_white_gold",
      displayName: "18K White Gold",
      hexColor: "#E5E5E5",
      description: "Premium white gold with superior durability and luster",
    },
    {
      name: "14k_rose_gold",
      displayName: "14K Rose Gold",
      hexColor: "#E8B4B8",
      description: "Romantic rose gold with warm pink undertones",
    },
    {
      name: "18k_rose_gold",
      displayName: "18K Rose Gold",
      hexColor: "#D4A574",
      description: "Luxurious rose gold with deeper copper tones",
    },
    {
      name: "platinum",
      displayName: "Platinum",
      hexColor: "#E5E4E2",
      description:
        "The ultimate luxury metal - naturally white and hypoallergenic",
    },
    {
      name: "palladium",
      displayName: "Palladium",
      hexColor: "#BEC2CB",
      description: "Lightweight platinum group metal with natural white color",
    },
    {
      name: "titanium",
      displayName: "Titanium",
      hexColor: "#878681",
      description: "Ultra-lightweight and hypoallergenic metal",
    },
    {
      name: "tungsten",
      displayName: "Tungsten",
      hexColor: "#2F2F2F",
      description: "Extremely durable metal with modern appeal",
    },
    {
      name: "stainless_steel",
      displayName: "Stainless Steel",
      hexColor: "#71797E",
      description: "Affordable and durable metal with contemporary look",
    },
  ];

  console.log(`📦 Inserting ${materialsData.length} materials...`);

  // Insert materials and get the created records
  const createdMaterials = await db
    .insert(materials)
    .values(materialsData)
    .returning();

  console.log(`✅ Successfully created ${createdMaterials.length} materials`);

  // Return the created materials with their IDs for use in product seeding
  return createdMaterials.map((material) => ({
    id: material.id,
    name: material.name,
    displayName: material.displayName,
    hexColor: material.hexColor,
    description: material.description,
  }));
}
