"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

export const LoadingState: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
      <div className="text-center">
        <div 
          className="w-14 h-14 rounded-full border-3 mx-auto mb-4 animate-spin"
          style={{ 
            borderColor: `${theme.primary}30`,
            borderTopColor: theme.primary
          }}
        />
        <p className="text-sm" style={{ color: theme.textSecondary }}>
          Loading destination…
        </p>
      </div>
    </div>
  );
};