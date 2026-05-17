// components/activities-components/view-activity-details-components/ExpandedGallery.tsx
"use client";

import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ActivityImage } from "@/types/activity-types";

interface ExpandedGalleryProps {
  images: ActivityImage[];
  onClose: () => void;
  onImageClick: (index: number) => void;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const ExpandedGallery: React.FC<ExpandedGalleryProps> = ({
  images,
  onClose,
  onImageClick,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
    if (e.key === "ArrowLeft" && selectedImage !== null) {
      setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
    }
    if (e.key === "ArrowRight" && selectedImage !== null) {
      setSelectedImage((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <>
      <style jsx>{`
        @keyframes galleryFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes galleryFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes gallerySlideIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .gallery-backdrop {
          animation: ${isVisible ? "galleryFadeIn" : "galleryFadeOut"} 0.3s ease forwards;
        }
        .gallery-content {
          animation: ${isVisible ? "gallerySlideIn" : "galleryFadeOut"} 0.3s ease forwards;
        }
      `}</style>

      <div
        className="fixed inset-0 z-[1000] gallery-backdrop"
        style={{
          backgroundColor: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(8px)",
        }}
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-[1001] flex flex-col gallery-content">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-white text-lg font-semibold">
            Gallery ({images.length})
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Selected Image Viewer */}
        {selectedImage !== null && (
          <div className="flex-1 flex items-center justify-center p-4 relative">
            <button
              onClick={() =>
                setSelectedImage((prev) =>
                  prev! > 0 ? prev! - 1 : images.length - 1
                )
              }
              className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={images[selectedImage].image_url}
              alt={images[selectedImage].name || "Gallery image"}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />

            <button
              onClick={() =>
                setSelectedImage((prev) =>
                  prev! < images.length - 1 ? prev! + 1 : 0
                )
              }
              className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Info */}
            {(images[selectedImage].name || images[selectedImage].description) && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-center max-w-[80%]">
                {images[selectedImage].name && (
                  <p className="text-white text-sm font-medium">
                    {images[selectedImage].name}
                  </p>
                )}
                {images[selectedImage].description && (
                  <p className="text-white/70 text-xs">
                    {images[selectedImage].description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Thumbnail Strip */}
        <div
          className="overflow-x-auto py-4 px-2"
          style={{
            scrollbarWidth: "thin",
            msOverflowStyle: "auto",
          }}
        >
          <div className="flex gap-2 justify-center min-w-max">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                  selectedImage === idx
                    ? "ring-2 ring-white scale-105"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img.image_url}
                  alt={img.name || `Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* View Full Size Button */}
        {selectedImage !== null && (
          <div className="text-center pb-4">
            <button
              onClick={() => {
                onImageClick(selectedImage);
                handleClose();
              }}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200 text-sm font-medium"
            >
              View Full Size
            </button>
          </div>
        )}
      </div>
    </>
  );
};