"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import NavigationButton from "@/components/common-components/NavigationButton";

interface CategoryHeroImageProps {
  images: Array<{ imageId: number; imageName: string; imageUrl: string }>;
  currentIndex: number;
  status: string;
  color: string;
  onPrev: () => void;
  onNext: () => void;
  onImageChange: (index: number) => void;
  imgTransition: boolean;
  onImageClick: () => void;
}

const CategoryHeroImage = ({
  images,
  currentIndex,
  status,
  color,
  onPrev,
  onNext,
  onImageChange,
  imgTransition,
  onImageClick,
}: CategoryHeroImageProps) => {
  const { theme } = useTheme();
  const hasMultipleImages = images.length > 1;

  const currentImage = images[currentIndex]?.imageUrl || PLACE_HOLDER_IMAGE;

  const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return `rgba(0, 0, 0, ${opacity})`;
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div
      className="rounded-2xl shadow-lg overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      {/* Main Image */}
      <div className="relative aspect-video bg-black/5">
        <img
          src={currentImage}
          alt={`Category image ${currentIndex + 1}`}
          className={`w-full h-full object-cover cursor-pointer transition-opacity duration-200 ${
            imgTransition ? "opacity-50" : "opacity-100"
          }`}
          onClick={onImageClick}
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${
              status === "ACTIVE"
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
            }`}
          >
            {status === "ACTIVE" ? (
              <>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                Active
              </>
            ) : (
              "Inactive"
            )}
          </span>
        </div>

        {/* Image Counter */}
        {images.length > 0 && (
          <div className="absolute bottom-4 right-4">
            <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-2">
              <ImageIcon className="w-3 h-3" />
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        )}

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <NavigationButton direction="left" onClick={onPrev} size="sm" />
            <NavigationButton direction="right" onClick={onNext} size="sm" />
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {hasMultipleImages && (
        <div className="p-4 border-t" style={{ borderColor: theme.border }}>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <div
                key={image.imageId}
                className={`relative flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  currentIndex === index ? "ring-2 ring-offset-2" : ""
                }`}
                style={{
                  // Use boxShadow instead of ringColor
                  boxShadow:
                    currentIndex === index ? `0 0 0 2px ${color}` : "none",
                }}
                onClick={() => onImageChange(index)}
              >
                <img
                  src={image.imageUrl}
                  alt={image.imageName}
                  className="w-20 h-20 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { CategoryHeroImage };
