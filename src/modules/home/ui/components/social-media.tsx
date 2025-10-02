import Link from "next/link";
import { SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";

import { Button } from "@/components/ui/button";

export const SocialMedia = () => {
  return (
    <section className="p-3">
      <h2 className="font-niconne mb-4 text-center text-2xl font-medium">
        Follow Us
      </h2>
      <div className="flex justify-center gap-4">
        <Button
          asChild
          size="icon"
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-110 hover:from-pink-600 hover:to-purple-700"
        >
          <Link
            href="https://www.instagram.com/_temmyaccessories"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiInstagram size={24} />
          </Link>
        </Button>
        <Button
          asChild
          size="icon"
          className="bg-black text-white hover:scale-110 hover:bg-gray-800"
        >
          <Link
            href="https://www.tiktok.com/@_temmyaccessories"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiTiktok size={24} />
          </Link>
        </Button>
        <Button
          asChild
          size="icon"
          className="bg-green-600 text-white hover:scale-110 hover:bg-green-700"
        >
          <Link
            href="https://wa.me/2348109525002"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiWhatsapp size={24} />
          </Link>
        </Button>
      </div>
    </section>
  );
};
