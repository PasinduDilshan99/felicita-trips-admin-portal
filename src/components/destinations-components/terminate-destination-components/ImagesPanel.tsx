"use client";

import React from "react";
import { ImageIcon } from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface ImagesPanelProps {
  images: Array<{ imageId: number; imageUrl: string; imageName: string }>;
}

export const ImagesPanel: React.FC<ImagesPanelProps> = ({ images }) => {
  const { theme } = useTheme();

  if (images.length === 0) return null;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: hexToRgba(theme.accent, 0.05),
        border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}` }}
      >
        <ImageIcon className="w-4 h-4" style={{ color: theme.accent }} />
        <h3 className="text-sm font-semibold" style={{ color: theme.text }}>Images ({images.length})</h3>
      </div>
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          {images.slice(0, 6).map((img) => (
            <div
              key={img.imageId}
              className="aspect-square rounded-xl overflow-hidden transition-all duration-200 hover:scale-105"
              style={{ border: `1.5px solid ${hexToRgba(theme.border, 0.8)}` }}
            >
              <img
                src={img.imageUrl}
                alt={img.imageName}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE; }}
              />
            </div>
          ))}
          {images.length > 6 && (
            <div
              className="aspect-square rounded-xl flex items-center justify-center"
              style={{
                background: hexToRgba(theme.accent, 0.1),
                border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
              }}
            >
              <span className="text-xs font-semibold" style={{ color: theme.accent }}>+{images.length - 6}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};