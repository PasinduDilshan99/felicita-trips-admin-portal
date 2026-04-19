"use client";

import React from "react";
import { XCircle, ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ErrorStateProps {
  error: string | null;
  onBack: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onBack }) => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
      <div 
        className="rounded-2xl p-12 text-center max-w-md shadow-sm border scale-in"
        style={{ 
          backgroundColor: theme.surface,
          borderColor: theme.border 
        }}
      >
        <XCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2" style={{ color: theme.text }}>
          {error ?? "Destination not found"}
        </h2>
        <p className="text-sm mb-6" style={{ color: theme.textSecondary }}>
          The destination couldn't be loaded. Please try again.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: theme.primary }}
        >
          <ArrowLeft size={16} /> Back to Destinations
        </button>
      </div>
    </div>
  );
};