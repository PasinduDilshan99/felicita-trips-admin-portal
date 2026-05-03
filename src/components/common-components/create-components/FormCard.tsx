"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface FormCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const FormCard: React.FC<FormCardProps> = ({
  children,
  className = "",
  noPadding = false,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div className={noPadding ? "" : "px-6 py-6"}>{children}</div>
    </div>
  );
};