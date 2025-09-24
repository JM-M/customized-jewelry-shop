"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyableTextProps {
  text: string;
  className?: string;
  showIcon?: boolean;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
}

export const CopyableText = ({
  text,
  className = "",
  showIcon = true,
  iconPosition = "right",
  children,
}: CopyableTextProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const Icon = copied ? Check : Copy;

  return (
    <button
      onClick={handleCopy}
      className={`group flex items-center gap-2 rounded-md text-left transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none ${className}`}
      title={copied ? "Copied!" : "Click to copy"}
    >
      {showIcon && iconPosition === "left" && (
        <Icon
          className={`size-4 transition-colors ${
            copied
              ? "text-green-600"
              : "text-gray-400 group-hover:text-gray-600"
          }`}
        />
      )}
      <span className="flex-1 font-mono text-sm text-gray-700 group-hover:text-gray-900">
        {children || text}
      </span>
      {showIcon && iconPosition === "right" && (
        <Icon
          className={`size-4 transition-colors ${
            copied
              ? "text-green-600"
              : "text-gray-400 group-hover:text-gray-600"
          }`}
        />
      )}
    </button>
  );
};
