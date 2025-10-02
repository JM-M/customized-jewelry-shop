"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";

interface FooterSection {
  title: string;
  items: string[];
}

const footerSections: FooterSection[] = [
  {
    title: "Help",
    items: [
      "FAQ",
      "Track My Order",
      "Shipping & Delivery",
      "Return & Exchanges",
      "Payment",
      "Size Guide",
      "Contact Us",
      "Warranty",
    ],
  },
  {
    title: "About Us",
    items: ["Our Story", "Careers", "Press", "Sustainability"],
  },
  {
    title: "More Info",
    items: [
      "Terms of Service",
      "Privacy Policy",
      "Cookie Policy",
      "Accessibility",
    ],
  },
];

export const Footer = () => {
  // On larger screens, all sections should be open
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["Help", "About Us", "More Info"]),
  );

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        newSet.add(sectionTitle);
      }
      return newSet;
    });
  };

  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {footerSections.map((section) => {
            const isOpen = openSections.has(section.title);

            return (
              <Collapsible
                key={section.title}
                open={isOpen}
                onOpenChange={() => toggleSection(section.title)}
              >
                <div className="space-y-2">
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 text-left transition-colors hover:bg-gray-50 md:pointer-events-none">
                    <h3 className="font-medium text-gray-900">
                      {section.title}
                    </h3>
                    <div className="flex items-center md:hidden">
                      {isOpen ? (
                        <Minus className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Plus className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="space-y-2">
                    <ul className="space-y-2 pl-2">
                      {section.items.map((item) => (
                        <li key={item}>
                          <a
                            href="#"
                            className="block rounded-md px-2 py-1 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 md:px-0"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Temmy Accessories. All rights
              reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="transition-colors hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-gray-900">
                Terms of Service
              </a>
              <a href="#" className="transition-colors hover:text-gray-900">
                Contact
              </a>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="mt-6 flex flex-col items-center space-y-3">
            <h3 className="font-niconne text-lg font-medium text-gray-700">
              Follow Us
            </h3>
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
                  <SiInstagram size={20} />
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
                  <SiTiktok size={20} />
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
                  <SiWhatsapp size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
