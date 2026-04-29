// components/destination-categories-components/update-category-components/RemovedImagesManager.tsx
"use client";

import React, { useState } from "react";
import { Trash2, CheckCircle2, Eye } from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import ImageModal, { ImageModalImage } from "@/components/common-components/ImageModal";

interface RemovedImage {
  imageId: number;
  name: string;
  imageUrl: string;
  description?: string;
}

interface RemovedImagesManagerProps {
  images: RemovedImage[];
  onRestoreImage: (imageId: number) => void;
}

const RemovedImagesManager: React.FC<RemovedImagesManagerProps> = ({
  images,
  onRestoreImage,
}) => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (images.length === 0) return null;

  const getModalImages = (): ImageModalImage[] => {
    return images.map((img) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description,
      id: img.imageId,
    }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="rounded-2xl shadow-lg p-6 opacity-75"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.error}`,
        }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: theme.error }}>
          <Trash2 className="w-5 h-5" />
          Removed Images (Will be deleted on save)
          <span
            className="text-sm px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.error, 0.1),
              color: theme.error,
            }}
          >
            {images.length}
          </span>
        </h2>

        <div className="space-y-3">
          {images.map((image, idx) => (
            <div
              key={image.imageId}
              className="flex items-center gap-3 p-3 rounded-lg opacity-60 transition-all duration-200 hover:opacity-80"
              style={{
                backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                border: `1px solid ${theme.border}`,
              }}
            >
              <div 
                className="cursor-pointer relative group/img"
                onClick={() => handleImageClick(idx)}
              >
                <img
                  src={image.imageUrl || PLACE_HOLDER_IMAGE}
                  alt={image.name}
                  className="w-16 h-16 rounded-lg object-cover grayscale transition-all duration-200 group-hover/img:scale-105 group-hover/img:shadow-md"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="font-medium line-through" style={{ color: theme.textSecondary }}>
                  {image.name}
                </div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                  Will be permanently deleted
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRestoreImage(image.imageId)}
                className="p-2 rounded-lg transition-all duration-200 hover:opacity-70 hover:scale-110 active:scale-95"
                style={{ color: theme.primary }}
                title="Restore image"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        images={getModalImages()}
        initialIndex={selectedImageIndex}
        onClose={() => setIsModalOpen(false)}
        showNavigation={true}
        showDownload={true}
        showZoom={true}
        allowKeyboardNavigation={true}
      />
    </>
  );
};

export default RemovedImagesManager;