// components/destinations-components/terminate-destination-components/ImagesPanel.tsx
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
  images: Array<{ imageId: number; imageUrl: string; imageName: string; imageDescription?: string }>;
  onImageClick?: (index: number) => void;
}

export const ImagesPanel: React.FC<ImagesPanelProps> = ({ images, onImageClick }) => {
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
        <span className="text-xs ml-auto" style={{ color: theme.textSecondary }}>Click to preview</span>
      </div>
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          {images.slice(0, 6).map((img, idx) => (
            <button
              key={img.imageId}
              className="aspect-square rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{ 
                border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
              }}
              onClick={() => onImageClick?.(idx)}
              aria-label={`View full size: ${img.imageName}`}
            >
              <img
                src={img.imageUrl}
                alt={img.imageName}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE; }}
              />
            </button>
          ))}
          {images.length > 6 && (
            <button
              className="aspect-square rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{
                background: hexToRgba(theme.accent, 0.1),
                border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
              }}
              onClick={() => onImageClick?.(6)}
              aria-label={`View ${images.length - 6} more images`}
            >
              <span className="text-xs font-semibold" style={{ color: theme.accent }}>+{images.length - 6}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};