"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface FormHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  description,
  icon: Icon,
  badge,
  badgeColor,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className="flex items-center gap-3 px-6 py-4"
      style={{ borderBottom: `1px solid ${theme.border}` }}
    >
      <span
        className="flex items-center justify-center w-8 h-8 rounded-lg"
        style={{
          backgroundColor: `${theme.primary}18`,
          color: theme.primary,
        }}
      >
        <Icon className="w-4 h-4" />
      </span>
      <div>
        <h2
          className="text-base font-semibold leading-tight"
          style={{ color: theme.text }}
        >
          {title}
        </h2>
        <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
          {description}
        </p>
      </div>
      {badge && (
        <span
          className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: badgeColor ? `${badgeColor}12` : `${theme.primary}12`,
            color: badgeColor || theme.primary,
            border: `1px solid ${badgeColor ? `${badgeColor}25` : `${theme.primary}25`}`,
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
};