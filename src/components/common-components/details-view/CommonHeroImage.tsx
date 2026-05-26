"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { CommonGalleryImage } from "./CommonExpandedGallery";
import { hexToRgba } from "@/utils/functions";

interface CommonHeroImageProps {
  images: CommonGalleryImage[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onImageChange: (index: number) => void;
  imgTransition: boolean;
  statusBadge?: React.ReactNode;
  topRightBadge?: React.ReactNode;
  fallbackIcon?: React.ReactNode;
  aspectRatio?: "video" | "square" | "portrait";
  showThumbnails?: boolean;
  showCounter?: boolean;
}

export const CommonHeroImage: React.FC<CommonHeroImageProps> = ({
  images,
  currentIndex,
  onPrev,
  onNext,
  onImageChange,
  imgTransition,
  statusBadge,
  topRightBadge,
  fallbackIcon,
  aspectRatio = "video",
  showThumbnails = true,
  showCounter = true,
}) => {
  const { theme } = useTheme();
  const currentImage = images[currentIndex];

  const aspectRatioClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  };

  if (!images.length) {
    return (
      <div
        className={`rounded-2xl overflow-hidden flex items-center justify-center min-h-[240px] sm:min-h-[320px] ${aspectRatioClasses[aspectRatio]}`}
        style={{
          backgroundColor: hexToRgba(theme.primary, 0.05),
          border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
        }}
      >
        <div className="text-center">
          {fallbackIcon || (
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}
            >
              <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: theme.primary }} />
            </div>
          )}
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No images available
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
      {/* Badges */}
      {(statusBadge || topRightBadge) && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex gap-2">
          {statusBadge}
        </div>
      )}
      {topRightBadge && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          {topRightBadge}
        </div>
      )}

      {/* Main Image */}
      <div className={`relative overflow-hidden bg-gray-900/20 ${aspectRatioClasses[aspectRatio]}`}>
        <img
          src={currentImage?.url}
          alt={currentImage?.name || "Gallery image"}
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
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Thumbnail Strip */}
      {showThumbnails && images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 sm:gap-2">
          {images.map((img, idx) => (
            <button
              key={img.id ?? idx}
              onClick={() => onImageChange(idx)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                idx === currentIndex
                  ? "w-4 sm:w-6 bg-white"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to image ${idx + 1}`}
              title={img.name || `Image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {showCounter && images.length > 1 && (
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-black/50 text-white text-[10px] sm:text-xs backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};