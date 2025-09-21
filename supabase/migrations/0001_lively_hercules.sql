CREATE TABLE "engraving_areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"hex_color" text NOT NULL,
	"description" text,
	"is_active" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "materials_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "product_engraving_areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"engraving_area_id" uuid NOT NULL,
	"engraving_type" "engraving_type" DEFAULT 'text' NOT NULL,
	"max_characters" integer,
	"product_specific_image" text,
	"display_order" integer,
	"is_active" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "product_engraving_areas_product_id_engraving_area_id_unique" UNIQUE("product_id","engraving_area_id")
);
--> statement-breakpoint
ALTER TABLE "product_materials" DROP CONSTRAINT "product_materials_name_unique";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "image" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "images" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_materials" ADD COLUMN "product_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "product_materials" ADD COLUMN "material_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "product_materials" ADD COLUMN "price" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_materials" ADD COLUMN "is_default" boolean;--> statement-breakpoint
ALTER TABLE "product_materials" ADD COLUMN "stock_quantity" integer;--> statement-breakpoint
ALTER TABLE "product_engraving_areas" ADD CONSTRAINT "product_engraving_areas_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_engraving_areas" ADD CONSTRAINT "product_engraving_areas_engraving_area_id_engraving_areas_id_fk" FOREIGN KEY ("engraving_area_id") REFERENCES "public"."engraving_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_materials" ADD CONSTRAINT "product_materials_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_materials" ADD CONSTRAINT "product_materials_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_materials" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "product_materials" DROP COLUMN "hex_color";--> statement-breakpoint
ALTER TABLE "product_materials" DROP COLUMN "price_multiplier";--> statement-breakpoint
ALTER TABLE "product_materials" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "product_reviews" DROP COLUMN "is_verified";--> statement-breakpoint
ALTER TABLE "product_reviews" DROP COLUMN "is_approved";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "original_price";--> statement-breakpoint
ALTER TABLE "product_materials" ADD CONSTRAINT "product_materials_product_id_material_id_unique" UNIQUE("product_id","material_id");