import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  image: string;
  href: string;
}

export const CategoryCard = ({ name, image, href }: CategoryCardProps) => {
  return (
    <div className="space-y-2">
      <Link href={href} className="block cursor-pointer space-y-1">
        <div className="aspect-[17/21] overflow-hidden">
          <Image
            src={image}
            alt={name}
            width={500}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-center">
          <span className="underline">{name}</span>
        </div>
      </Link>
    </div>
  );
};
