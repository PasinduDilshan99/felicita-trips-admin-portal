// components/activities-components/view-activity-details-components/ActivityGalleryMini.tsx
"use client";

import React from "react";
import { Grid, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityImage } from "@/types/activity-types";

interface ActivityGalleryMiniProps {
  images: ActivityImage[];
  onImageClick: (index: number) => void;
  onViewAll: () => void;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const ActivityGalleryMini: React.FC<ActivityGalleryMiniProps> = ({
  images,
  onImageClick,
  onViewAll,
}) => {
  const { theme } = useTheme();

  if (!images.length) {
    return null;
  }

  const displayImages = images.slice(0, 4);
  const remainingCount = images.length - 4;

  return (
    <div
      className="rounded-2xl overflow-hidden"
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
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4" style={{ color: theme.primary }} />
          <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
            Gallery
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.1),
              color: theme.primary,
            }}
          >
            {images.length}
          </span>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
          style={{ color: theme.primary }}
        >
          View All
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-2">
          {displayImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => onImageClick(idx)}
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
            >
              <img
                src={img.image_url}
                alt={img.name || `Gallery image ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
            </button>
          ))}
        </div>

        {remainingCount > 0 && (
          <button
            onClick={onViewAll}
            className="mt-3 w-full text-center text-sm font-medium py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.05),
              color: theme.primary,
            }}
          >
            +{remainingCount} more {remainingCount === 1 ? "image" : "images"}
          </button>
        )}
      </div>
    </div>
  );
};