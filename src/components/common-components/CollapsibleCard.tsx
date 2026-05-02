// components/common-components/CollapsibleCard.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CollapsibleCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  badge?: string | number;
  badgeColor?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  icon,
  children,
  defaultExpanded = true,
  badge,
  badgeColor,
  actions,
  className = "",
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const hexToRgba = (hex: string, opacity: number): string => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${className}`}
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer transition-colors duration-200"
        style={{
          borderBottom: isExpanded ? `1px solid ${theme.border}` : "none",
          backgroundColor: isExpanded ? `${theme.border}20` : "transparent",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                backgroundColor: `${theme.primary}18`,
                color: theme.primary,
              }}
            >
              {icon}
            </span>
          )}
          <div>
            <h3
              className="text-base font-semibold leading-tight"
              style={{ color: theme.text }}
            >
              {title}
            </h3>
          </div>
          {badge !== undefined && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: badgeColor 
                  ? hexToRgba(badgeColor, 0.15)
                  : `${theme.primary}15`,
                color: badgeColor || theme.primary,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" style={{ color: theme.textSecondary }} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: theme.textSecondary }} />
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 py-5 transition-all duration-300">{children}</div>
      )}
    </div>
  );
};