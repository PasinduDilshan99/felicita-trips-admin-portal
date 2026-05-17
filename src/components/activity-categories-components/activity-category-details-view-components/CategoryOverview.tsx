// components/activity-categories-components/view-category-details-components/CategoryOverview.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Palette, FileText } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface CategoryOverviewProps {
  name: string;
  description: string;
  color: string;
  hoverColor: string;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const CategoryOverview: React.FC<CategoryOverviewProps> = ({
  name,
  description,
  color,
  hoverColor,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatedDescription =
    description?.length > 400 && !isExpanded
      ? description.slice(0, 400) + "..."
      : description;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
          Category Overview
        </h2>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{
            backgroundColor: hexToRgba(color, 0.1),
            border: `1px solid ${hexToRgba(color, 0.2)}`,
          }}
        >
          <Palette className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-xs font-medium" style={{ color }}>
            {color}
          </span>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Category Name */}
        <div>
          <p
            className="text-xs font-medium uppercase tracking-wide mb-1"
            style={{ color: theme.textSecondary }}
          >
            Category Name
          </p>
          <h3 className="text-xl font-bold" style={{ color: theme.text }}>
            {name}
          </h3>
        </div>

        {/* Color Preview */}
        <div>
          <p
            className="text-xs font-medium uppercase tracking-wide mb-2"
            style={{ color: theme.textSecondary }}
          >
            Color Scheme
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl shadow-md"
                style={{ backgroundColor: color }}
              />
              <div>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Primary
                </p>
                <p className="text-xs font-mono" style={{ color }}>
                  {color}
                </p>
              </div>
            </div>
            {hoverColor && hoverColor !== color && (
              <>
                <div className="text-2xl text-gray-400">→</div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-xl shadow-md"
                    style={{ backgroundColor: hoverColor }}
                  />
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Hover
                    </p>
                    <p
                      className="text-xs font-mono"
                      style={{ color: hoverColor }}
                    >
                      {hoverColor}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {description && (
          <div>
            <p
              className="text-xs font-medium uppercase tracking-wide mb-2"
              style={{ color: theme.textSecondary }}
            >
              Description
            </p>
            <div
              className="text-sm leading-relaxed rounded-xl p-3"
              style={{
                backgroundColor: hexToRgba(color, 0.04),
                border: `1px solid ${hexToRgba(color, 0.1)}`,
              }}
            >
              <div className="flex gap-2">
                <FileText
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color }}
                />
                <div>
                  <p style={{ color: theme.textSecondary }}>
                    {truncatedDescription}
                  </p>
                  {description.length > 400 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="inline-flex items-center gap-1 mt-2 text-xs font-medium transition-colors"
                      style={{ color }}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          Read More
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
