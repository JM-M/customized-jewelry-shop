import { db } from "@/db";
import { categories } from "@/db/schema/shop";

export interface CategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
}

export async function seedCategories() {
  console.log("📁 Creating jewelry categories...");

  const categoryData: CategoryData[] = [
    // Parent Categories (Level 1)
    {
      name: "Rings",
      slug: "rings",
      description: "Beautiful rings for every occasion",
      image: "/images/categories/5.jpg",
    },
    {
      name: "Necklaces",
      slug: "necklaces",
      description: "Elegant necklaces to complement your style",
      image: "/images/categories/3.png",
    },
    {
      name: "Earrings",
      slug: "earrings",
      description: "Stunning earrings for any outfit",
      image: "/images/categories/4.jpg",
    },
    {
      name: "Bracelets",
      slug: "bracelets",
      description: "Charming bracelets for your wrist",
      image: "/images/categories/2.png",
    },
    {
      name: "Watches",
      slug: "watches",
      description: "Luxury timepieces for every style",
      image: "/images/categories/1.png",
    },
  ];

  // First, create parent categories
  const createdCategories = [];
  const parentCategoryMap = new Map<string, string>(); // slug -> id mapping

  for (const categoryInfo of categoryData) {
    try {
      console.log(`Creating parent category: ${categoryInfo.name}`);

      const [createdCategory] = await db
        .insert(categories)
        .values({
          name: categoryInfo.name,
          slug: categoryInfo.slug,
          description: categoryInfo.description,
          image: categoryInfo.image!,
          parentId: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      createdCategories.push(createdCategory);
      parentCategoryMap.set(categoryInfo.slug, createdCategory.id);
      console.log(`✅ Created parent category: ${categoryInfo.name}`);
    } catch (error) {
      console.warn(
        `⚠️ Error creating parent category ${categoryInfo.name}:`,
        error,
      );
    }
  }

  // Now create subcategories (Level 2)
  const subcategoryData: CategoryData[] = [
    // Ring subcategories
    {
      name: "Engagement Rings",
      slug: "engagement-rings",
      description: "Perfect engagement rings for your special moment",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("rings"),
    },
    {
      name: "Wedding Bands",
      slug: "wedding-bands",
      description: "Classic and modern wedding bands",
      image:
        "https://images.unsplash.com/photo-1544376664-80b17f09d399?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("rings"),
    },
    {
      name: "Fashion Rings",
      slug: "fashion-rings",
      description: "Trendy fashion rings for everyday wear",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("rings"),
    },

    // Necklace subcategories
    {
      name: "Pendants",
      slug: "pendants",
      description: "Elegant pendants to hang on chains",
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("necklaces"),
    },
    {
      name: "Chains",
      slug: "chains",
      description: "Beautiful chains for layering or solo wear",
      image:
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("necklaces"),
    },
    {
      name: "Statement Necklaces",
      slug: "statement-necklaces",
      description: "Bold statement necklaces for special occasions",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("necklaces"),
    },

    // Earring subcategories
    {
      name: "Stud Earrings",
      slug: "stud-earrings",
      description: "Classic stud earrings for any occasion",
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("earrings"),
    },
    {
      name: "Hoop Earrings",
      slug: "hoop-earrings",
      description: "Timeless hoop earrings in various sizes",
      image:
        "https://images.unsplash.com/photo-1596944946107-d7ddbf4ba9a6?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("earrings"),
    },
    {
      name: "Drop Earrings",
      slug: "drop-earrings",
      description: "Elegant drop earrings for formal events",
      image:
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("earrings"),
    },

    // Bracelet subcategories
    {
      name: "Chain Bracelets",
      slug: "chain-bracelets",
      description: "Sophisticated chain bracelets",
      image:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("bracelets"),
    },
    {
      name: "Bangle Bracelets",
      slug: "bangle-bracelets",
      description: "Sleek bangle bracelets for stacking",
      image:
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("bracelets"),
    },
    {
      name: "Charm Bracelets",
      slug: "charm-bracelets",
      description: "Personalized charm bracelets",
      image:
        "https://images.unsplash.com/photo-1584302179602-e4ace3a0590b?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("bracelets"),
    },

    // Watch subcategories
    {
      name: "Luxury Watches",
      slug: "luxury-watches",
      description: "High-end luxury timepieces",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("watches"),
    },
    {
      name: "Smart Watches",
      slug: "smart-watches",
      description: "Modern smartwatches with technology features",
      image:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("watches"),
    },
    {
      name: "Classic Watches",
      slug: "classic-watches",
      description: "Traditional classic timepieces",
      image:
        "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=300&fit=crop&auto=format",
      parentId: parentCategoryMap.get("watches"),
    },
  ];

  // Create subcategories
  for (const subcategoryInfo of subcategoryData) {
    try {
      console.log(`Creating subcategory: ${subcategoryInfo.name}`);

      const [createdSubcategory] = await db
        .insert(categories)
        .values({
          name: subcategoryInfo.name,
          slug: subcategoryInfo.slug,
          description: subcategoryInfo.description,
          image: subcategoryInfo.image!,
          parentId: subcategoryInfo.parentId,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      createdCategories.push(createdSubcategory);
      console.log(`✅ Created subcategory: ${subcategoryInfo.name}`);
    } catch (error) {
      console.warn(
        `⚠️ Error creating subcategory ${subcategoryInfo.name}:`,
        error,
      );
    }
  }

  console.log(`✅ Created ${createdCategories.length} categories total`);
  console.log("\n📁 Categories created:");

  // Display parent categories
  const parentCategories = createdCategories.filter((cat) => !cat.parentId);
  const subcategories = createdCategories.filter((cat) => cat.parentId);

  parentCategories.forEach((parent) => {
    console.log(`📁 ${parent.name} (${parent.slug})`);
    const children = subcategories.filter((sub) => sub.parentId === parent.id);
    children.forEach((child) => {
      console.log(`  └─ ${child.name} (${child.slug})`);
    });
  });

  return createdCategories;
}
