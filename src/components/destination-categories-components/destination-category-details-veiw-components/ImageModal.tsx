"use client";

import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";

interface ImageModalProps {
  images: Array<{ imageId: number; imageName: string; imageUrl: string }>;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const ImageModal = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
      if (e.key === "ArrowRight")
        onNavigate((currentIndex + 1) % images.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [currentIndex, images.length, onClose, onNavigate]);

  const currentImage = images[currentIndex]?.imageUrl || PLACE_HOLDER_IMAGE;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-w-7xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                onNavigate(
                  currentIndex === 0 ? images.length - 1 : currentIndex - 1,
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => onNavigate((currentIndex + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        <img
          src={currentImage}
          alt={images[currentIndex]?.imageName || "Category image"}
          className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
          }}
        />

        <div className="absolute bottom-4 left-0 right-0 text-center">
          <div className="inline-block bg-black/50 backdrop-blur-sm text-white py-2 px-4 rounded-lg text-sm">
            {images[currentIndex]?.imageName ||
              `Image ${currentIndex + 1} of ${images.length}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ImageModal };
