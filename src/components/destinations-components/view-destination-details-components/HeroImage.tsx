"use client";

import React from "react";
import { ChevronLeft, ChevronRight, XCircle, Bookmark } from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";

interface HeroImageProps {
  images: Array<{ imageId: number; imageUrl: string; imageName: string }>;
  currentIndex: number;
  statusName: string;
  isWishlisted: boolean;
  onPrev: () => void;
  onNext: () => void;
  onImageChange: (index: number) => void;
  imgTransition: boolean;
}

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const HeroImage: React.FC<HeroImageProps> = ({
  images,
  currentIndex,
  statusName,
  isWishlisted,
  onPrev,
  onNext,
  onImageChange,
  imgTransition,
}) => {
  const { theme } = useTheme();
  const currentImage = images[currentIndex];
  const totalImages = images.length;

  return (
    <div 
      className="rounded-2xl border shadow-sm overflow-hidden scale-in transition-colors duration-300"
      style={{ 
        backgroundColor: theme.surface,
        borderColor: theme.border 
      }}
    >
      <div className="relative h-[420px] overflow-hidden rounded-t-2xl">
        <img
          src={currentImage?.imageUrl || PLACE_HOLDER_IMAGE}
          alt="Destination"
          className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 ${
            imgTransition ? "opacity-50" : "opacity-100"
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />

        {totalImages > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute top-1/2 left-4 -translate-y-1/2 w-11 h-11 bg-white/95 rounded-full flex items-center justify-center shadow-md border hover:bg-white hover:scale-105 transition-all"
              style={{ borderColor: theme.border }}
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              onClick={onNext}
              className="absolute top-1/2 right-4 -translate-y-1/2 w-11 h-11 bg-white/95 rounded-full flex items-center justify-center shadow-md border hover:bg-white hover:scale-105 transition-all"
              style={{ borderColor: theme.border }}
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 right-4">
          <span className="px-3.5 py-1.5 bg-black/55 backdrop-blur-md rounded-full text-white text-xs font-semibold">
            {currentIndex + 1} / {totalImages}
          </span>
        </div>

        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
              statusName === "ACTIVE"
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            {statusName === "ACTIVE" ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
              </>
            ) : (
              <>
                <XCircle size={12} /> Inactive
              </>
            )}
          </span>
          {isWishlisted && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-pink-50 text-pink-600 border border-pink-200">
              <Bookmark size={12} /> Wishlisted
            </span>
          )}
        </div>
      </div>

      {totalImages > 1 && (
        <div className="p-4 border-t" style={{ borderColor: theme.border }}>
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {images.map((img, idx) => (
              <img
                key={img.imageId}
                src={img.imageUrl}
                alt={img.imageName}
                className={`w-[68px] h-[68px] rounded-lg object-cover cursor-pointer transition-all flex-shrink-0 ${
                  currentIndex === idx
                    ? "-translate-y-0.5"
                    : "opacity-80 hover:opacity-100"
                }`}
                style={{ 
                  ...(currentIndex === idx && {
                    outline: `2px solid ${theme.primary}`,
                    outlineOffset: "2px",
                    boxShadow: `0 4px 12px ${hexToRgba(theme.primary, 0.25)}`
                  })
                }}
                onClick={() => onImageChange(idx)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};