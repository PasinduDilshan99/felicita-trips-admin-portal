"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { IconBadgeProps } from "@/types/destination-types";

export const IconBadge: React.FC<IconBadgeProps> = ({ icon: Icon, color }) => {
  const { theme } = useTheme();

  return (
    <span
      className="w-9 h-9 rounded-xl inline-flex items-center justify-center flex-shrink-0 transition-colors duration-300"
      style={{ background: color || theme.primary }}
    >
      <Icon size={16} color="#fff" />
    </span>
  );
};
