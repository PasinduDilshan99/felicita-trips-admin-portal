// components/activity-categories-components/view-category-details-components/CategoryHeroImage.tsx
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityCategoryImage } from "@/types/activity-category-types";

interface CategoryHeroImageProps {
  images: ActivityCategoryImage[];
  currentIndex: number;
  status: string;
  color: string;
  onPrev: () => void;
  onNext: () => void;
  onImageChange: (index: number) => void;
  imgTransition: boolean;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const CategoryHeroImage: React.FC<CategoryHeroImageProps> = ({
  images,
  currentIndex,
  status,
  color,
  onPrev,
  onNext,
  onImageChange,
  imgTransition,
}) => {
  const { theme } = useTheme();
  const currentImage = images[currentIndex];
  
  const getStatusColor = () => {
    switch (status) {
      case "ACTIVE": return "#10b981";
      case "INACTIVE": return "#f59e0b";
      case "TERMINATED": return "#ef4444";
      default: return theme.textSecondary;
    }
  };

  if (!images.length) {
    return (
      <div
        className="rounded-2xl overflow-hidden flex items-center justify-center min-h-[320px]"
        style={{
          backgroundColor: hexToRgba(color || theme.primary, 0.05),
          border: `1px solid ${hexToRgba(color || theme.primary, 0.2)}`,
        }}
      >
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: hexToRgba(color || theme.primary, 0.1) }}
          >
            <span className="text-3xl" style={{ color: color || theme.primary }}>
              🏷️
            </span>
          </div>
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No images available for this category
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden group"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      {/* Status Badge */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm text-white"
          style={{ backgroundColor: getStatusColor() }}
        >
          {status}
        </span>
      </div>

      {/* Category Color Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color || theme.primary }}
          />
          <span className="text-white text-xs font-medium">Category Color</span>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-900/20">
        <img
          src={currentImage?.imageUrl}
          alt={currentImage?.imageName || "Category image"}
          className={`w-full h-full object-cover transition-all duration-300 ${
            imgTransition ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((img, idx) => (
            <button
              key={img.imageId}
              onClick={() => onImageChange(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                idx === currentIndex
                  ? "w-6 bg-white"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 px-2 py-1 rounded-md bg-black/50 text-white text-xs backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};