import Image from "next/image";
import Link from "next/link";

export const CategoryCard = () => {
  return (
    <div className="space-y-2">
      <Image
        src="https://picsum.photos/500/600"
        alt="Category"
        width={500}
        height={600}
      />
      <div className="text-center">
        <Link href="#" className="underline">
          Shop Category
        </Link>
      </div>
    </div>
  );
};
