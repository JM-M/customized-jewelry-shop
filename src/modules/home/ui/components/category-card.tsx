import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  image: string | null;
  href: string;
}

export const CategoryCard = ({ name, image, href }: CategoryCardProps) => {
  return (
    <div className="space-y-2">
      <Link href={href} className="block cursor-pointer space-y-1">
        <div className="aspect-[17/21] overflow-hidden">
          {image && (
            <Image
              src={image} // TODO: Implement proper fallback image url
              alt={name}
              width={500}
              height={600}
              className="h-full w-full rounded-md object-cover"
            />
          )}
        </div>
        <div className="text-center">
          <span className="underline underline-offset-2">{name}</span>
        </div>
      </Link>
    </div>
  );
};
