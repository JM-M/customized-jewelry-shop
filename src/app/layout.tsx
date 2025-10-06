import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";
import HolyLoader from "holy-loader";
import type { Metadata } from "next";
import { EB_Garamond, Geist_Mono, Niconne, Work_Sans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { siteConfig } from "../../site.config";
import "./globals.css";

const niconne = Niconne({
  variable: "--font-niconne",
  subsets: ["latin"],
  weight: "400",
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: "400",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "jewelry",
    "customized jewelry",
    "accessories",
    "handmade",
    "unique jewelry",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@_temmyaccessories",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <html lang="en">
        <HolyLoader
          color="linear-gradient(to right, #f59e0b, #d97706)"
          height="3px"
          speed={300}
          easing="ease-in-out"
        />
        <body
          className={`${workSans.variable} ${geistMono.variable} ${niconne.variable} ${ebGaramond.variable} flex min-h-screen flex-col font-sans antialiased`}
        >
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </body>
      </html>
    </TRPCReactProvider>
  );
}
