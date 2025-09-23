import { db } from "@/db";
import { engravingAreas, productEngravingAreas } from "@/db/schema/shop";

export interface EngravingAreaData {
  name: string;
  description?: string;
}

export interface ProductEngravingAssociation {
  productSlug: string;
  engravingAreas: Array<{
    name: string;
    engravingType: "text" | "image" | "qr_code";
    maxCharacters?: number;
    displayOrder?: number;
    referenceImage?: string;
  }>;
}

export async function seedEngravingAreas(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdProducts: any[],
) {
  console.log("✨ Creating engraving areas...");

  // Create a map of product slug to ID for easy lookup
  const productMap = new Map<string, string>();
  createdProducts.forEach((product) => {
    productMap.set(product.slug, product.id);
  });

  // Define the different engraving areas
  const engravingAreaData: EngravingAreaData[] = [
    {
      name: "Front",
      description: "Front surface of the jewelry piece",
    },
    {
      name: "Back",
      description: "Back surface of the jewelry piece",
    },
    {
      name: "Inside Band",
      description: "Inner surface of rings and bands",
    },
    {
      name: "Clasp",
      description: "Clasp area of bracelets and necklaces",
    },
    {
      name: "Pendant Back",
      description: "Back side of pendant pieces",
    },
    {
      name: "Watch Case Back",
      description: "Back of watch case",
    },
    {
      name: "Side Edge",
      description: "Side edge of the jewelry piece",
    },
  ];

  // Create engraving areas
  const createdEngravingAreas = [];
  const engravingAreaMap = new Map<string, string>(); // name -> id mapping

  for (const areaInfo of engravingAreaData) {
    try {
      console.log(`Creating engraving area: ${areaInfo.name}`);

      const [createdArea] = await db
        .insert(engravingAreas)
        .values({
          name: areaInfo.name,
          description: areaInfo.description,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      createdEngravingAreas.push(createdArea);
      engravingAreaMap.set(areaInfo.name, createdArea.id);
      console.log(`✅ Created engraving area: ${areaInfo.name}`);
    } catch (error) {
      console.warn(`⚠️ Error creating engraving area ${areaInfo.name}:`, error);
    }
  }

  // Define which products can have which engraving areas with different types
  const productEngravingAssociations: ProductEngravingAssociation[] = [
    // Engagement Rings - Text engravings for traditional personalization
    {
      productSlug: "classic-solitaire-diamond-ring",
      engravingAreas: [
        {
          name: "Inside Band",
          engravingType: "text",
          maxCharacters: 50,
          displayOrder: 1,
          referenceImage:
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
        },
        {
          name: "Side Edge",
          engravingType: "text",
          maxCharacters: 30,
          displayOrder: 2,
          referenceImage:
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
        },
      ],
    },
    {
      productSlug: "vintage-halo-engagement-ring",
      engravingAreas: [
        {
          name: "Inside Band",
          engravingType: "text",
          maxCharacters: 50,
          displayOrder: 1,
          referenceImage:
            "https://images.unsplash.com/photo-1544376664-80b17f09d399?w=400&h=300&fit=crop",
        },
        {
          name: "Side Edge",
          engravingType: "qr_code", // QR code for modern couples (wedding website, etc.)
          displayOrder: 2,
          referenceImage:
            "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop",
        },
      ],
    },

    // Wedding Bands - Mix of text and QR codes
    {
      productSlug: "classic-gold-wedding-band",
      engravingAreas: [
        {
          name: "Inside Band",
          engravingType: "text",
          maxCharacters: 75,
          displayOrder: 1,
          referenceImage:
            "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop",
        },
        {
          name: "Side Edge",
          engravingType: "qr_code", // QR code linking to wedding photos/memories
          displayOrder: 2,
          referenceImage:
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
        },
      ],
    },

    // Fashion Rings - Text and small images
    {
      productSlug: "art-deco-emerald-ring",
      engravingAreas: [
        {
          name: "Inside Band",
          engravingType: "text",
          maxCharacters: 40,
          displayOrder: 1,
          referenceImage:
            "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=300&fit=crop",
        },
        {
          name: "Back",
          engravingType: "image", // Small decorative images or symbols
          displayOrder: 2,
          referenceImage:
            "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=300&fit=crop",
        },
      ],
    },

    // Pendants - All three types for maximum customization
    {
      productSlug: "heart-locket-pendant",
      engravingAreas: [
        {
          name: "Front",
          engravingType: "image", // Photos, portraits, or decorative images
          displayOrder: 1,
          referenceImage:
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
        },
        {
          name: "Back",
          engravingType: "text", // Names, dates, or messages
          maxCharacters: 30,
          displayOrder: 2,
          referenceImage:
            "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=300&fit=crop",
        },
        {
          name: "Pendant Back",
          engravingType: "qr_code", // QR code for digital memories or messages
          displayOrder: 3,
          referenceImage:
            "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=300&fit=crop",
        },
      ],
    },

    // Chains - QR codes for modern functionality
    {
      productSlug: "box-chain-necklace",
      engravingAreas: [
        {
          name: "Clasp",
          engravingType: "qr_code", // QR code for contact info or emergency details
          displayOrder: 1,
          referenceImage:
            "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=400&h=300&fit=crop",
        },
      ],
    },

    // Stud Earrings - Small images or symbols
    {
      productSlug: "diamond-stud-earrings",
      engravingAreas: [
        {
          name: "Back",
          engravingType: "image", // Small symbols, initials as images, or decorative patterns
          displayOrder: 1,
          referenceImage:
            "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=300&fit=crop",
        },
      ],
    },

    // Hoop Earrings - Text and images
    {
      productSlug: "gold-hoop-earrings",
      engravingAreas: [
        {
          name: "Side Edge",
          engravingType: "text", // Text around the hoop
          maxCharacters: 25,
          displayOrder: 1,
          referenceImage:
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop",
        },
        {
          name: "Back",
          engravingType: "image", // Small decorative images
          displayOrder: 2,
          referenceImage:
            "https://images.unsplash.com/photo-1625652567408-4b9bb4a2a0d6?w=400&h=300&fit=crop",
        },
      ],
    },

    // Bracelets - Mix of text and QR codes
    {
      productSlug: "tennis-bracelet",
      engravingAreas: [
        {
          name: "Clasp",
          engravingType: "text", // Traditional text engraving
          maxCharacters: 30,
          displayOrder: 1,
          referenceImage:
            "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&h=300&fit=crop",
        },
        {
          name: "Side Edge",
          engravingType: "qr_code", // QR code for modern functionality
          displayOrder: 2,
          referenceImage:
            "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=300&fit=crop",
        },
      ],
    },

    // Watches - All three types for comprehensive customization
    {
      productSlug: "swiss-luxury-watch",
      engravingAreas: [
        {
          name: "Watch Case Back",
          engravingType: "image", // Photos, logos, or detailed engravings
          displayOrder: 1,
          referenceImage:
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=300&fit=crop",
        },
      ],
    },
  ];

  // Create product-engraving area associations
  const createdAssociations = [];

  for (const association of productEngravingAssociations) {
    const productId = productMap.get(association.productSlug);

    if (!productId) {
      console.warn(`⚠️ Product not found: ${association.productSlug}`);
      continue;
    }

    for (const engravingArea of association.engravingAreas) {
      const engravingAreaId = engravingAreaMap.get(engravingArea.name);

      if (!engravingAreaId) {
        console.warn(`⚠️ Engraving area not found: ${engravingArea.name}`);
        continue;
      }

      try {
        console.log(
          `Associating ${association.productSlug} with ${engravingArea.name} (${engravingArea.engravingType})`,
        );

        const [createdAssociation] = await db
          .insert(productEngravingAreas)
          .values({
            productId: productId,
            engravingAreaId: engravingAreaId,
            engravingType: engravingArea.engravingType,
            maxCharacters: engravingArea.maxCharacters,
            referenceImage: engravingArea.referenceImage,
            displayOrder: engravingArea.displayOrder || 1,
            isActive: true,
            createdAt: new Date(),
          })
          .returning();

        createdAssociations.push(createdAssociation);
        console.log(
          `✅ Associated ${association.productSlug} with ${engravingArea.name} (${engravingArea.engravingType})`,
        );
      } catch (error) {
        console.warn(
          `⚠️ Error associating ${association.productSlug} with ${engravingArea.name}:`,
          error,
        );
      }
    }
  }

  console.log(`✅ Created ${createdEngravingAreas.length} engraving areas`);
  console.log(
    `✅ Created ${createdAssociations.length} product-engraving associations`,
  );

  console.log("\n✨ Engraving areas created:");
  createdEngravingAreas.forEach((area) => {
    console.log(`✨ ${area.name} - ${area.description}`);
  });

  console.log("\n🔗 Product engraving associations:");
  const associationsByProduct = new Map<string, string[]>();

  for (const association of productEngravingAssociations) {
    if (productMap.has(association.productSlug)) {
      associationsByProduct.set(
        association.productSlug,
        association.engravingAreas.map((area) => area.name),
      );
    }
  }

  associationsByProduct.forEach((areas, productSlug) => {
    const productName =
      createdProducts.find((p) => p.slug === productSlug)?.name || productSlug;
    console.log(`🔗 ${productName}: ${areas.join(", ")}`);
  });

  return {
    engravingAreas: createdEngravingAreas,
    associations: createdAssociations,
  };
}
