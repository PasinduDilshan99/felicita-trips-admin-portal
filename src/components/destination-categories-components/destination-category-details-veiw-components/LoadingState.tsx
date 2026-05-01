"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const LoadingState = () => {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div
          className="flex flex-col justify-center items-center py-16 rounded-xl shadow-sm border"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
        >
          <Loader2
            className="w-12 h-12 animate-spin"
            style={{ color: theme.primary }}
          />
          <span
            className="mt-4 text-lg font-medium"
            style={{ color: theme.text }}
          >
            Loading category details...
          </span>
        </div>
      </div>
    </div>
  );
};

export { LoadingState };
