"use client";

import React from "react";
import { X, ZoomIn } from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";

interface ExpandedGalleryProps {
  images: Array<{ imageId: number; imageUrl: string; imageName: string }>;
  onClose: () => void;
  onImageClick: (index: number) => void;
}

export const ExpandedGallery: React.FC<ExpandedGalleryProps> = ({
  images,
  onClose,
  onImageClick,
}) => {
  const { theme } = useTheme();

  return (
    <div 
      className="fixed inset-0 z-[90] backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto"
      style={{ backgroundColor: `${theme.surface}F2` }}
    >
      <div 
        className="sticky top-0 px-6 py-4 flex items-center justify-between z-10 border-b"
        style={{ 
          backgroundColor: theme.surface,
          borderColor: theme.border 
        }}
      >
        <div>
          <h2 className="text-xl font-bold" style={{ color: theme.text }}>All Images</h2>
          <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
            {images.length} images available
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100"
          style={{ color: theme.textSecondary }}
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.imageId}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              style={{ backgroundColor: theme.background }}
              onClick={() => onImageClick(idx)}
            >
              <img
                src={img.imageUrl}
                alt={img.imageName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn size={32} className="text-white" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs truncate">{img.imageName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};