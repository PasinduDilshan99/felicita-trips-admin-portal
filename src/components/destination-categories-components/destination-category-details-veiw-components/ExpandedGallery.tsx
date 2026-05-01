"use client";

import React from "react";
import { X } from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";

interface ExpandedGalleryProps {
  images: Array<{ imageId: number; imageName: string; imageUrl: string }>;
  onClose: () => void;
  onImageClick: (index: number) => void;
}

const ExpandedGallery = ({
  images,
  onClose,
  onImageClick,
}: ExpandedGalleryProps) => {
  const { theme } = useTheme();

  const hexToRgba = (hex: string, opacity: number) => {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: `${hexToRgba(theme.background, 0.98)}` }}
    >
      <div className="min-h-screen px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: theme.text }}>
            All Images ({images.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: theme.textSecondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hexToRgba(
                theme.primary,
                0.1,
              );
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.imageId}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => onImageClick(index)}
            >
              <img
                src={image.imageUrl}
                alt={image.imageName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium px-3 py-1 rounded-full bg-black/50">
                  Click to view
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ExpandedGallery };
