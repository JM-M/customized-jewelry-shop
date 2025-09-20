import { Button } from "@/components/ui/button";
import { SiInstagram } from "react-icons/si";

export const SocialMedia = () => {
  return (
    <section className="p-3">
      <div className="space-y-5 py-8 text-center">
        <p>
          We love to see all of you wearing and unwrapping ByNouck. Want to get
          featured?Tag{" "}
          <a
            href="https://www.instagram.com/_temmyaccessories/"
            className="text-primary font-medium"
          >
            @_temmyaccessories
          </a>{" "}
          on Instagram.
          {/* Link to the instagram page */}
        </p>
        <Button className="mx-auto flex h-12 !px-5" asChild>
          <a
            href="https://www.instagram.com/_temmyaccessories/"
            className="text-primary font-medium"
          >
            <SiInstagram />
            Follow us on Instagram
          </a>
        </Button>
      </div>
    </section>
  );
};
