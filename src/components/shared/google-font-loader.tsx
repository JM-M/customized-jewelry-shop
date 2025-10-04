"use client";

import { useGoogleFont } from "@/hooks/use-google-font";

interface GoogleFontLoaderProps {
  font: string;
}

export function GoogleFontLoader({ font }: GoogleFontLoaderProps) {
  useGoogleFont(font);

  return (
    <style jsx global>{`
      :root {
        --font-custom: "${font}", sans-serif;
      }
    `}</style>
  );
}
