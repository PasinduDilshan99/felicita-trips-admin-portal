"use client";

import React, { useState } from "react";
import { XCircle, Bookmark } from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import NavigationButton from "@/components/common-components/NavigationButton";

interface HeroImageProps {
  images: Array<{
    imageId: number;
    imageUrl: string;
    imageName: string;
    imageDescription?: string;
  }>;
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
  hex = hex.replace("#", "");
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const currentImage = images[currentIndex];
  const totalImages = images.length;

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    return images.map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription,
      id: img.imageId,
    }));
  };

  const handleMainImageClick = () => {
    setModalImageIndex(currentIndex);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPrev();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNext();
  };

  return (
    <>
      <div
        className="rounded-2xl border shadow-sm overflow-hidden scale-in transition-colors duration-300"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
        }}
      >
        <div className="relative h-[420px] overflow-hidden rounded-t-2xl">
          <img
            src={currentImage?.imageUrl || PLACE_HOLDER_IMAGE}
            alt="Destination"
            className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 cursor-pointer ${
              imgTransition ? "opacity-50" : "opacity-100"
            }`}
            onClick={handleMainImageClick}
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent pointer-events-none" />

          {/* Navigation Buttons - Using reusable component */}
          {totalImages > 1 && (
            <>
              <NavigationButton
                direction="left"
                onClick={handlePrevClick}
                size="md"
              />
              <NavigationButton
                direction="right"
                onClick={handleNextClick}
                size="md"
              />
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
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />{" "}
                  Active
                </>
              ) : (
                <>
                  <XCircle size={12} /> {statusName}
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
                      boxShadow: `0 4px 12px ${hexToRgba(theme.primary, 0.25)}`,
                    }),
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

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        images={getModalImages()}
        initialIndex={modalImageIndex}
        onClose={handleModalClose}
        showNavigation={true}
        showDownload={true}
        showZoom={true}
        allowKeyboardNavigation={true}
      />
    </>
  );
};
