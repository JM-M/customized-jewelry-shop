"use client";

import { Categories } from "../components/categories";
import { Hero } from "../components/hero";
import { HomeProducts } from "../components/home-products";

export const HomeView = () => {
  return (
    <div className="space-y-5">
      <div>
        <Hero />
        <Categories />
      </div>
      {/* <SocialProof /> */}
      <HomeProducts />
      {/* <SocialMedia /> */}
    </div>
  );
};
