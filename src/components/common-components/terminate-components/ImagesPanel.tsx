// components/common-components/termination/ImagesPanel.tsx
"use client";

import React from "react";
import { ImageIcon, AlertCircle } from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export interface TerminationImage {
  id: number | string;
  url: string;
  name: string;
  description?: string;
}

export interface ImagesPanelProps {
  images: TerminationImage[];
  onImageClick?: (index: number) => void;
  title?: string;
  showDeletionBadge?: boolean;
  deletionBadgeText?: string;
  maxDisplayCount?: number;
  emptyMessage?: string;
}

export const ImagesPanel: React.FC<ImagesPanelProps> = ({
  images,
  onImageClick,
  title = "Images",
  showDeletionBadge = true,
  deletionBadgeText = "Will be deleted",
  maxDisplayCount = 6,
  emptyMessage = "No images available",
}) => {
  const { theme } = useTheme();

  if (images.length === 0) {
    return (
      <div
        className="rounded-xl overflow-hidden transition-all duration-200"
        style={{
          background: hexToRgba(theme.border, 0.1),
          border: `1.5px dashed ${hexToRgba(theme.border, 0.5)}`,
        }}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <ImageIcon className="w-4 h-4" style={{ color: theme.textSecondary }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>{title}</h3>
        </div>
        <div className="px-4 py-6 text-center">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: theme.textSecondary }} />
          <p className="text-xs" style={{ color: theme.textSecondary }}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  const displayImages = images.slice(0, maxDisplayCount);
  const remainingCount = images.length - maxDisplayCount;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: hexToRgba(theme.accent, 0.05),
        border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}` }}
      >
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" style={{ color: theme.accent }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            {title} ({images.length})
          </h3>
        </div>
        {showDeletionBadge && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: hexToRgba(theme.error, 0.1),
              color: theme.error,
              border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
            }}
          >
            {deletionBadgeText}
          </span>
        )}
      </div>
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          {displayImages.map((img, idx) => (
            <button
              key={img.id}
              className="aspect-square rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0 group"
              style={{ 
                border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
              }}
              onClick={() => onImageClick?.(idx)}
              aria-label={`View full size: ${img.name}`}
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                onError={(e) => { (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE; }}
                loading="lazy"
              />
            </button>
          ))}
          {remainingCount > 0 && (
            <button
              className="aspect-square rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{
                background: hexToRgba(theme.accent, 0.1),
                border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
              }}
              onClick={() => onImageClick?.(maxDisplayCount)}
              aria-label={`View ${remainingCount} more images`}
            >
              <span className="text-xs font-semibold" style={{ color: theme.accent }}>+{remainingCount}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};