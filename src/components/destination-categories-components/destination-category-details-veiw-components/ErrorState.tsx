"use client";

import React from "react";
import { XCircle, ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0, 0, 0, ${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface ErrorStateProps {
  error: string | null;
  onBack: () => void;
}

const ErrorState = ({ error, onBack }: ErrorStateProps) => {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div
          className="rounded-xl shadow-sm border p-16 text-center"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
        >
          <div
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(theme.error, 0.1)}, ${hexToRgba(theme.error, 0.05)})`,
            }}
          >
            <XCircle className="w-12 h-12" style={{ color: theme.error }} />
          </div>
          <div
            className="text-2xl font-semibold mb-2"
            style={{ color: theme.text }}
          >
            {error || "Category not found"}
          </div>
          <p className="mb-6" style={{ color: theme.textSecondary }}>
            The category you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
              color: "#fff",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export { ErrorState };
