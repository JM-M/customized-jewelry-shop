import { Categories } from "../components/categories";
import { Hero } from "../components/hero";
import { Newsletter } from "../components/newsletter";
import { Products } from "../components/products";
import { SocialMedia } from "../components/social-media";
import { SocialProof } from "../components/social-proof";

export const HomeView = () => {
  return (
    <div className="space-y-5">
      <Hero />
      <Categories />
      <SocialProof />
      <Products />
      <SocialMedia />
      <Newsletter />
    </div>
  );
};
