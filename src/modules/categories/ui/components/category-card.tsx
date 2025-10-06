import { GetAllCategoriesOutput } from "@/modules/categories/types";
import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = GetAllCategoriesOutput[number];

export const CategoryCard = ({ name, image, slug }: CategoryCardProps) => {
  return (
    <div className="space-y-2">
      <Link
        href={`/categories/${slug}`}
        className="block cursor-pointer space-y-1"
      >
        <div className="aspect-square overflow-hidden">
          {image && (
            <Image
              src={image}
              alt={name}
              width={500}
              height={600}
              className="h-full w-full rounded-md object-cover"
            />
          )}
        </div>
        <div className="text-center text-sm">
          <span className="hover:underline hover:underline-offset-2">
            {name}
          </span>
        </div>
      </Link>
    </div>
  );
};
