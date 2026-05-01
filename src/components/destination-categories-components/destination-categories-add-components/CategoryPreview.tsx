// components/destination-categories-components/add-category-components/CategoryPreview.tsx
"use client";

import React, { useState } from "react";
import { Tag, Eye } from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import ImageModal, { ImageModalImage } from "@/components/common-components/ImageModal";

interface CategoryPreviewProps {
  categoryName: string;
  description: string;
  color: string;
  hoverColor: string;
  images: Array<{ previewUrl?: string; imageUrl?: string; name: string; description?: string }>;
}

const CategoryPreview: React.FC<CategoryPreviewProps> = ({
  categoryName,
  description,
  color,
  hoverColor,
  images,
}) => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    return images.map((img, index) => ({
      url: img.imageUrl || img.previewUrl || PLACE_HOLDER_IMAGE,
      name: img.name || `Image ${index + 1}`,
      description: img.description,
      id: index,
    }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="rounded-2xl shadow-lg p-6 sticky top-24"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text }}>
          <Eye className="w-5 h-5" style={{ color: theme.primary }} />
          Live Preview
        </h2>

        <div
          className="rounded-xl p-4 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(color, 0.05)}, ${hexToRgba(hoverColor, 0.05)})`,
            border: `1px solid ${color}`,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(color, 0.2)}, ${hexToRgba(hoverColor, 0.1)})`,
              }}
            >
              <Tag className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <h3 className="font-semibold text-lg" style={{ color }}>
                {categoryName || "Category Name"}
              </h3>
              <div className="flex gap-2 mt-1">
                <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                <div className="w-6 h-1.5 rounded-full" style={{ backgroundColor: hoverColor }} />
              </div>
            </div>
          </div>
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            {description || "Category description will appear here..."}
          </p>
          {images.length > 0 && (
            <div className="mt-3 flex gap-2">
              {images.slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleImageClick(idx)}
                  className="cursor-pointer group relative"
                >
                  <img
                    src={img.previewUrl || img.imageUrl || PLACE_HOLDER_IMAGE}
                    alt={img.name}
                    className="w-12 h-12 rounded-lg object-cover transition-all duration-200 group-hover:scale-105 group-hover:shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </button>
              ))}
              {images.length > 3 && (
                <button
                  onClick={() => handleImageClick(3)}
                  className="cursor-pointer group relative w-12 h-12 rounded-lg flex items-center justify-center text-xs transition-all duration-200 hover:scale-105 hover:shadow-md"
                  style={{
                    backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                    color: theme.textSecondary,
                  }}
                >
                  <span>+{images.length - 3}</span>
                  <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        images={getModalImages()}
        initialIndex={selectedImageIndex}
        onClose={handleModalClose}
        showNavigation={true}
        showDownload={true}
        showZoom={true}
        allowKeyboardNavigation={true}
      />
    </>
  );
};

export default CategoryPreview;