// components/destinations-components/view-destination-details-components/GalleryMini.tsx
"use client";

import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { IconBadge } from "./IconBadge";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";

interface GalleryMiniProps {
  images: Array<{ imageId: number; imageUrl: string; imageName: string; imageDescription?: string }>;
  onImageClick: (index: number) => void;
  onViewAll: () => void;
}

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const GalleryMini: React.FC<GalleryMiniProps> = ({
  images,
  onImageClick,
  onViewAll,
}) => {
  const { theme } = useTheme();
  const totalImages = images.length;

  // Custom color for gallery (you can adjust these values)
  const galleryColor = "#be185d"; // Pink color

  return (
    <div
      className="rounded-2xl border shadow-sm p-5 fade-up delay-6 transition-colors duration-300"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
      }}
    >
      <h3
        className="flex items-center gap-2.5 text-base font-bold mb-4"
        style={{ color: theme.text }}
      >
        <IconBadge icon={ImageIcon} color={galleryColor} />
        Image Gallery
        <span
          className="ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold border"
          style={{
            backgroundColor: hexToRgba(galleryColor, 0.1),
            color: galleryColor,
            borderColor: hexToRgba(galleryColor, 0.3),
          }}
        >
          {totalImages}
        </span>
      </h3>
      <div className="grid grid-cols-3 gap-2 mb-3.5">
        {images.slice(0, 6).map((img, idx) => (
          <div
            key={img.imageId}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105"
            style={{
              borderColor: "transparent",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent";
            }}
            onClick={() => onImageClick(idx)}
          >
            <img
              src={img.imageUrl}
              alt={img.imageName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
              }}
            />
          </div>
        ))}
        {totalImages > 6 && (
          <div
            className="aspect-square rounded-lg flex items-center justify-center text-sm font-bold border cursor-pointer hover:scale-105 transition-all duration-200"
            style={{
              backgroundColor: theme.background,
              color: theme.textSecondary,
              borderColor: theme.border,
            }}
            onClick={onViewAll}
          >
            +{totalImages - 6}
          </div>
        )}
      </div>
      <button
        onClick={onViewAll}
        className="w-full text-center text-sm font-semibold py-1.5 transition-colors"
        style={{ color: theme.primary }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = theme.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = theme.primary;
        }}
      >
        View all images →
      </button>
    </div>
  );
};