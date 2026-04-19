"use client";

import React from "react";
import { Globe, BadgeCheck } from "lucide-react";
import { IconBadge } from "./IconBadge";
import { useTheme } from "@/contexts/ThemeContext";

interface Category {
  id: number;
  name: string;
  description?: string;
  isPrimary: boolean;
}

interface DestinationOverviewProps {
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  categories: Category[];
}

export const DestinationOverview: React.FC<DestinationOverviewProps> = ({
  description,
  location,
  latitude,
  longitude,
  categories,
}) => {
  const { theme } = useTheme();
  const primaryCategory = categories.find((c) => c.isPrimary);
  const secondaryCategories = categories.filter((c) => !c.isPrimary);

  return (
    <div 
      className="bg-white rounded-2xl border shadow-sm p-7 fade-up delay-1 transition-colors duration-300"
      style={{ 
        backgroundColor: theme.surface,
        borderColor: theme.border 
      }}
    >
      <h2 className="flex items-center gap-2.5 text-lg font-bold mb-5" style={{ color: theme.text }}>
        <IconBadge icon={Globe} color={theme.primary} />
        Destination Overview
      </h2>
      <p className="leading-relaxed text-sm mb-6" style={{ color: theme.textSecondary }}>
        {description}
      </p>
      <div className="h-px my-5" style={{ backgroundColor: theme.border }} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: theme.textSecondary }}>
            Location Details
          </p>
          <div className="space-y-2.5">
            <div className="flex gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider w-[90px]" style={{ color: theme.textSecondary }}>
                Region
              </span>
              <span className="text-sm font-medium" style={{ color: theme.text }}>
                {location}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider w-[90px]" style={{ color: theme.textSecondary }}>
                Latitude
              </span>
              <span className="text-sm font-medium" style={{ color: theme.text }}>
                {latitude?.toFixed(6) ?? "N/A"}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider w-[90px]" style={{ color: theme.textSecondary }}>
                Longitude
              </span>
              <span className="text-sm font-medium" style={{ color: theme.text }}>
                {longitude?.toFixed(6) ?? "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: theme.textSecondary }}>
            Categories
          </p>
          <div className="space-y-2.5">
            {primaryCategory && (
              <div 
                className="p-3 rounded-xl border"
                style={{ 
                  backgroundColor: `${theme.primary}10`,
                  borderColor: `${theme.primary}30`
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <BadgeCheck size={13} style={{ color: theme.primary }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                    Primary
                  </span>
                </div>
                <p className="text-sm font-semibold" style={{ color: theme.text }}>
                  {primaryCategory.name}
                </p>
                {primaryCategory.description && (
                  <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                    {primaryCategory.description}
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {secondaryCategories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="px-3.5 py-2 rounded-xl border"
                  style={{ 
                    backgroundColor: theme.background,
                    borderColor: theme.border 
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: theme.text }}>
                    {cat.name}
                  </p>
                </div>
              ))}
              {!primaryCategory && secondaryCategories.length === 0 && (
                <p className="text-sm italic" style={{ color: theme.textSecondary }}>
                  No categories assigned
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};