// components/common-components/CommonGalleryMini.tsx
"use client";

import React from "react";
import { Grid, ChevronRight, Image as ImageIcon, Camera } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CommonGalleryImage } from "./CommonExpandedGallery";

interface CommonGalleryMiniProps {
  images: CommonGalleryImage[];
  onImageClick: (index: number) => void;
  onViewAll: () => void;
  title?: string;
  showCount?: boolean;
  maxDisplayCount?: number;
  emptyMessage?: string;
  className?: string;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const CommonGalleryMini: React.FC<CommonGalleryMiniProps> = ({
  images,
  onImageClick,
  onViewAll,
  title = "Gallery",
  showCount = true,
  maxDisplayCount = 4,
  emptyMessage = "No images in gallery",
  className = "",
}) => {
  const { theme } = useTheme();

  if (!images.length) {
    return (
      <div
        className={`rounded-2xl overflow-hidden ${className}`}
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4" style={{ color: theme.primary }} />
            <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
              {title}
            </h2>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
          <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-30" style={{ color: theme.textSecondary }} />
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  const displayImages = images.slice(0, maxDisplayCount);
  const remainingCount = images.length - maxDisplayCount;

  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4" style={{ color: theme.primary }} />
          <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
            {title}
          </h2>
          {showCount && (
            <span
              className="text-xs px-1.5 sm:px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: hexToRgba(theme.primary, 0.1),
                color: theme.primary,
              }}
            >
              {images.length}
            </span>
          )}
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

      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="grid grid-cols-2 gap-2">
          {displayImages.map((img, idx) => (
            <button
              key={img.id ?? idx}
              onClick={() => onImageClick(idx)}
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
            >
              <img
                src={img.url}
                alt={img.name || `Gallery image ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
              {img.name && (
                <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-white text-[10px] sm:text-xs truncate px-1">{img.name}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        {remainingCount > 0 && (
          <button
            onClick={onViewAll}
            className="mt-3 w-full text-center text-xs sm:text-sm font-medium py-2 rounded-lg transition-colors hover:opacity-80"
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