import { db } from "@/db";
import { productMaterials, products } from "@/db/schema/products";

export interface ProductMaterialVariant {
  materialName: string; // e.g., "14k_yellow_gold"
  price: string; // Price for this specific material variant
  stockQuantity: number; // Stock for this material variant
  isDefault: boolean; // Whether this is the default material
}

export interface ProductData {
  name: string;
  slug: string;
  description: string;
  price: string; // Fallback/base price
  sku: string;
  categoryId: string;
  primaryImage: string;
  images: string[];
  stockQuantity: number; // Fallback stock quantity
  metaTitle?: string;
  metaDescription?: string;
  materials?: ProductMaterialVariant[]; // Materials available for this product
}

export async function seedProducts(
  createdCategories: any[],
  createdMaterials: any[],
) {
  console.log("💍 Creating jewelry products...");

  // Create a map of category slug to ID for easy lookup
  const categoryMap = new Map<string, string>();
  createdCategories.forEach((category) => {
    categoryMap.set(category.slug, category.id);
  });

  // Create a map of material name to ID for easy lookup
  const materialMap = new Map<string, string>();
  createdMaterials.forEach((material) => {
    materialMap.set(material.name, material.id);
  });

  const productData: ProductData[] = [
    // Engagement Rings
    {
      name: "Classic Solitaire Diamond Ring",
      slug: "classic-solitaire-diamond-ring",
      description:
        "A timeless solitaire engagement ring featuring a brilliant cut diamond in a classic four-prong setting. Crafted in 18k white gold with exceptional attention to detail.",
      price: "2999.99",
      sku: "ENG-SOL-001",
      categoryId: categoryMap.get("engagement-rings") || "",
      primaryImage:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop",
      ],
      stockQuantity: 15,
      metaTitle: "Classic Solitaire Diamond Ring - Premium Engagement Ring",
      metaDescription:
        "Stunning solitaire engagement ring with brilliant cut diamond in 18k white gold. Perfect for your special proposal moment.",
      materials: [
        {
          materialName: "18k_white_gold",
          price: "2999.99",
          stockQuantity: 8,
          isDefault: true,
        },
        {
          materialName: "18k_yellow_gold",
          price: "2899.99",
          stockQuantity: 5,
          isDefault: false,
        },
        {
          materialName: "platinum",
          price: "3999.99",
          stockQuantity: 3,
          isDefault: false,
        },
      ],
    },
    {
      name: "Vintage Halo Engagement Ring",
      slug: "vintage-halo-engagement-ring",
      description:
        "Elegant vintage-style engagement ring with a center diamond surrounded by a halo of smaller diamonds. Set in rose gold for a romantic touch.",
      price: "3999.99",
      sku: "ENG-HAL-002",
      categoryId: categoryMap.get("engagement-rings") || "",
      materials: [
        {
          materialName: "18k_rose_gold",
          price: "3999.99",
          stockQuantity: 6,
          isDefault: true,
        },
        {
          materialName: "14k_rose_gold",
          price: "3299.99",
          stockQuantity: 8,
          isDefault: false,
        },
        {
          materialName: "18k_white_gold",
          price: "4199.99",
          stockQuantity: 4,
          isDefault: false,
        },
      ],
      primaryImage:
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
      ],
      stockQuantity: 8,
      metaTitle: "Vintage Halo Engagement Ring - Rose Gold Diamond Ring",
      metaDescription:
        "Romantic vintage halo engagement ring in rose gold. Features a center diamond with surrounding halo for maximum sparkle.",
    },

    // Wedding Bands
    {
      name: "Classic Gold Wedding Band",
      slug: "classic-gold-wedding-band",
      description:
        "Timeless 14k yellow gold wedding band with a comfort fit design. Simple, elegant, and perfect for everyday wear.",
      price: "899.99",
      sku: "WED-CL-001",
      categoryId: categoryMap.get("wedding-bands") || "",
      primaryImage:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
      ],
      stockQuantity: 25,
      metaTitle: "Classic Gold Wedding Band - 14k Yellow Gold",
      metaDescription:
        "Traditional 14k yellow gold wedding band with comfort fit. A symbol of eternal love and commitment.",
      materials: [
        {
          materialName: "14k_yellow_gold",
          price: "899.99",
          stockQuantity: 15,
          isDefault: true,
        },
        {
          materialName: "18k_yellow_gold",
          price: "1199.99",
          stockQuantity: 10,
          isDefault: false,
        },
      ],
    },

    // Fashion Rings
    {
      name: "Art Deco Emerald Ring",
      slug: "art-deco-emerald-ring",
      description:
        "Stunning Art Deco inspired ring featuring a vibrant emerald center stone surrounded by diamond accents. Set in platinum for durability and elegance.",
      price: "2499.99",
      sku: "FASH-EM-001",
      categoryId: categoryMap.get("fashion-rings") || "",
      primaryImage:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
      ],
      stockQuantity: 12,
      metaTitle: "Art Deco Emerald Ring - Vintage Style Fashion Ring",
      metaDescription:
        "Vintage Art Deco emerald ring with diamond accents. A statement piece that captures the glamour of the 1920s.",
    },

    // Pendants
    {
      name: "Heart Locket Pendant",
      slug: "heart-locket-pendant",
      description:
        "Romantic heart-shaped locket pendant in sterling silver. Features intricate engravings and opens to hold precious photos or keepsakes.",
      price: "299.99",
      sku: "PEND-HEART-001",
      categoryId: categoryMap.get("pendants") || "",
      primaryImage:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      ],
      stockQuantity: 30,
      metaTitle: "Heart Locket Pendant - Sterling Silver Keepsake",
      metaDescription:
        "Beautiful heart locket pendant in sterling silver. Perfect for holding treasured memories close to your heart.",
    },

    // Chains
    {
      name: "Box Chain Necklace",
      slug: "box-chain-necklace",
      description:
        "Classic box chain necklace in 14k white gold. Features a sleek, modern design that complements any pendant or can be worn alone.",
      price: "599.99",
      sku: "CHAIN-BOX-001",
      categoryId: categoryMap.get("chains") || "",
      primaryImage:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
      ],
      stockQuantity: 20,
      metaTitle: "Box Chain Necklace - 14k White Gold Chain",
      metaDescription:
        "Elegant box chain necklace in 14k white gold. Versatile design perfect for layering or wearing with pendants.",
    },

    // Stud Earrings
    {
      name: "Diamond Stud Earrings",
      slug: "diamond-stud-earrings",
      description:
        "Classic diamond stud earrings in 14k white gold. Features brilliant cut diamonds in a secure four-prong setting.",
      price: "1299.99",
      sku: "STUD-DIA-001",
      categoryId: categoryMap.get("stud-earrings") || "",
      primaryImage:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
      ],
      stockQuantity: 18,
      metaTitle: "Diamond Stud Earrings - Classic White Gold",
      metaDescription:
        "Timeless diamond stud earrings in 14k white gold. Perfect for everyday elegance or special occasions.",
    },

    // Hoop Earrings
    {
      name: "Gold Hoop Earrings",
      slug: "gold-hoop-earrings",
      description:
        "Elegant 14k yellow gold hoop earrings in a medium size. Features a smooth, polished finish for maximum shine.",
      price: "799.99",
      sku: "HOOP-GOLD-001",
      categoryId: categoryMap.get("hoop-earrings") || "",
      primaryImage:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
      ],
      stockQuantity: 22,
      metaTitle: "Gold Hoop Earrings - 14k Yellow Gold Medium",
      metaDescription:
        "Classic gold hoop earrings in 14k yellow gold. Medium size perfect for everyday wear or special occasions.",
    },

    // Chain Bracelets
    {
      name: "Tennis Bracelet",
      slug: "tennis-bracelet",
      description:
        "Elegant tennis bracelet featuring a continuous line of brilliant cut diamonds. Set in 14k white gold with a secure clasp.",
      price: "4999.99",
      sku: "BRACE-TENNIS-001",
      categoryId: categoryMap.get("chain-bracelets") || "",
      primaryImage:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
      ],
      stockQuantity: 6,
      metaTitle: "Tennis Bracelet - Diamond Tennis Bracelet",
      metaDescription:
        "Luxurious tennis bracelet with continuous line of diamonds in 14k white gold. A true statement piece.",
    },

    // Luxury Watches
    {
      name: "Swiss Luxury Watch",
      slug: "swiss-luxury-watch",
      description:
        "Premium Swiss-made luxury watch with automatic movement. Features a sapphire crystal face and genuine leather strap.",
      price: "8999.99",
      sku: "WATCH-SWISS-001",
      categoryId: categoryMap.get("luxury-watches") || "",
      primaryImage:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      ],
      stockQuantity: 4,
      metaTitle: "Swiss Luxury Watch - Automatic Movement",
      metaDescription:
        "Premium Swiss luxury watch with automatic movement and sapphire crystal. A timepiece for discerning collectors.",
    },
  ];

  const createdProducts = [];

  for (const productInfo of productData) {
    try {
      console.log(`Creating product: ${productInfo.name}`);

      const [createdProduct] = await db
        .insert(products)
        .values({
          name: productInfo.name,
          slug: productInfo.slug,
          description: productInfo.description,
          price: productInfo.price,
          sku: productInfo.sku,
          categoryId: productInfo.categoryId,
          primaryImage: productInfo.primaryImage,
          images: productInfo.images,
          stockQuantity: productInfo.stockQuantity,
          metaTitle: productInfo.metaTitle,
          metaDescription: productInfo.metaDescription,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Create material relationships for this product
      if (productInfo.materials && productInfo.materials.length > 0) {
        const materialRelations = productInfo.materials.map(
          (materialVariant) => {
            const materialId = materialMap.get(materialVariant.materialName);
            if (!materialId) {
              throw new Error(
                `Material ${materialVariant.materialName} not found`,
              );
            }

            return {
              productId: createdProduct.id,
              materialId: materialId,
              price: materialVariant.price,
              isDefault: materialVariant.isDefault,
              stockQuantity: materialVariant.stockQuantity,
              createdAt: new Date(),
            };
          },
        );

        await db.insert(productMaterials).values(materialRelations);
        console.log(
          `✅ Created ${materialRelations.length} material variants for: ${productInfo.name}`,
        );
      } else {
        // Fallback: Create a default material relationship if none specified
        const defaultMaterialId = materialMap.get("sterling_silver"); // Use sterling silver as default
        if (defaultMaterialId) {
          await db.insert(productMaterials).values({
            productId: createdProduct.id,
            materialId: defaultMaterialId,
            price: productInfo.price,
            isDefault: true,
            stockQuantity: productInfo.stockQuantity,
            createdAt: new Date(),
          });
          console.log(
            `✅ Created default material (Sterling Silver) for: ${productInfo.name}`,
          );
        }
      }

      createdProducts.push(createdProduct);
      console.log(`✅ Created product: ${productInfo.name}`);
    } catch (error) {
      console.warn(`⚠️ Error creating product ${productInfo.name}:`, error);
    }
  }

  console.log(`✅ Created ${createdProducts.length} products total`);
  console.log("\n💍 Products created:");

  createdProducts.forEach((product) => {
    const category = createdCategories.find(
      (cat) => cat.id === product.categoryId,
    );
    console.log(
      `💍 ${product.name} - $${product.price} (${category?.name || "Unknown Category"})`,
    );
  });

  return createdProducts;
}
