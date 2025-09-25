"use client";

import { Categories } from "../components/categories";
import { Hero } from "../components/hero";
import { HomeProducts } from "../components/home-products";
import { Newsletter } from "../components/newsletter";
import { SocialMedia } from "../components/social-media";

export const HomeView = () => {
  return (
    <div className="space-y-5">
      <div>
        <Hero />
        <Categories />
      </div>
      {/* <SocialProof /> */}
      <HomeProducts />
      <div className="md:grid md:grid-cols-2">
        <SocialMedia />
        <Newsletter />
      </div>
    </div>
  );
};
