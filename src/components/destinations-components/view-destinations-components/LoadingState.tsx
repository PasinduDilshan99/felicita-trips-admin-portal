"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading destinations...", 
  subMessage = "Fetching the latest travel experiences" 
}) => {
  const { theme } = useTheme();

  return (
    <div 
      className="rounded-xl shadow-sm border p-16 text-center transition-colors duration-300"
      style={{ 
        backgroundColor: theme.surface,
        borderColor: theme.border 
      }}
    >
      <div className="relative">
        <Loader2 className="w-12 h-12 animate-spin mx-auto" style={{ color: theme.primary }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-8 h-8 rounded-full"
            style={{ background: `linear-gradient(135deg, ${theme.primary}20, ${theme.accent}20)` }}
          />
        </div>
      </div>
      <span className="mt-4 text-lg font-medium block" style={{ color: theme.text }}>
        {message}
      </span>
      <p className="mt-2" style={{ color: theme.textSecondary }}>
        {subMessage}
      </p>
    </div>
  );
};