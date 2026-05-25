// components/common-components/CommonExpandedGallery.tsx
"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Info, Image as ImageIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export interface CommonGalleryImage {
  url: string;
  name?: string;
  description?: string;
  id?: string | number;
}

interface CommonExpandedGalleryProps {
  images: CommonGalleryImage[];
  onClose: () => void;
  onImageClick?: (index: number) => void;
  showFullSizeButton?: boolean;
  fullSizeButtonText?: string;
  allowKeyboardNavigation?: boolean;
  showImageInfo?: boolean;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const CommonExpandedGallery: React.FC<CommonExpandedGalleryProps> = ({
  images,
  onClose,
  onImageClick,
  showFullSizeButton = true,
  fullSizeButtonText = "Open Full Size Viewer",
  allowKeyboardNavigation = true,
  showImageInfo = true,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (images.length > 0) {
      setIsVisible(true);
      setSelectedImage(0);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [images.length]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailStripRef.current && selectedImage !== null && isVisible) {
      const strip = thumbnailStripRef.current;
      const active = strip.children[selectedImage] as HTMLElement;
      if (active) {
        active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [selectedImage, isVisible]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!allowKeyboardNavigation) return;
    
    switch (e.key) {
      case "Escape":
        handleClose();
        break;
      case "ArrowLeft":
        if (selectedImage !== null && images.length > 1) {
          setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
          setImageLoaded(false);
        }
        break;
      case "ArrowRight":
        if (selectedImage !== null && images.length > 1) {
          setSelectedImage((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
          setImageLoaded(false);
        }
        break;
      case "i":
        if (showImageInfo) setShowInfo((prev) => !prev);
        break;
    }
  }, [allowKeyboardNavigation, selectedImage, images.length, handleClose, showImageInfo]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const currentImage = selectedImage !== null ? images[selectedImage] : null;

  const handleThumbnailClick = (index: number) => {
    if (index === selectedImage) return;
    setSelectedImage(index);
    setImageLoaded(false);
  };

  const handleFullSizeClick = () => {
    if (selectedImage !== null && onImageClick) {
      onImageClick(selectedImage);
      handleClose();
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        @keyframes ceg-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ceg-fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes ceg-slideIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ceg-slideOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.96); }
        }
        @keyframes ceg-slideLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes ceg-slideRight {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes ceg-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .ceg-backdrop {
          animation: ${isVisible ? "ceg-fadeIn" : "ceg-fadeOut"} 0.3s ease forwards;
        }
        .ceg-content {
          animation: ${isVisible ? "ceg-slideIn" : "ceg-slideOut"} 0.3s ease forwards;
        }
        .ceg-image-enter {
          animation: ceg-slideIn 0.25s ease-out;
        }
        .ceg-spinner {
          animation: ceg-pulse 1s ease-in-out infinite;
        }
        .ceg-thumb {
          transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
          flex-shrink: 0;
        }
        .ceg-thumb:hover {
          transform: scale(1.08) translateY(-2px);
        }
        .ceg-thumb-active {
          transform: scale(1.08) translateY(-3px);
        }
        .ceg-nav-btn {
          transition: background 0.18s, transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .ceg-nav-btn:hover {
          background: rgba(255,255,255,0.2) !important;
          transform: scale(1.12);
        }
        .ceg-nav-btn:active {
          transform: scale(0.96);
        }
        
        /* Hide scrollbar for thumbnail strip */
        .ceg-thumb-strip::-webkit-scrollbar {
          height: 4px;
        }
        .ceg-thumb-strip::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .ceg-thumb-strip::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 4px;
        }
        .ceg-thumb-strip::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.5);
        }
        
        @media (max-width: 640px) {
          .ceg-nav-btn {
            width: 36px !important;
            height: 36px !important;
          }
          .ceg-thumb {
            width: 56px !important;
            height: 56px !important;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="ceg-backdrop fixed inset-0 z-[1000]"
        style={{
          backgroundColor: "rgba(8, 14, 22, 0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="ceg-content fixed inset-0 z-[1001] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <h2 className="text-white text-base sm:text-lg font-semibold">
              Gallery ({images.length})
            </h2>
            {selectedImage !== null && currentImage && (
              <p className="text-white/50 text-xs mt-0.5">
                {selectedImage + 1} of {images.length}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showImageInfo && selectedImage !== null && (
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                title="Toggle info (I)"
                aria-label="Toggle image information"
              >
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110 hover:rotate-90"
              aria-label="Close gallery"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Main Image Area */}
        {selectedImage !== null && currentImage && (
          <div className="flex-1 flex items-center justify-center p-3 sm:p-6 relative min-h-0">
            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={() => {
                  setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
                  setImageLoaded(false);
                }}
                className="ceg-nav-btn absolute left-2 sm:left-6 p-2 sm:p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Loading Spinner */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="ceg-spinner w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white/20 border-t-white"
                  style={{ animation: "ceg-pulse 1s ease-in-out infinite" }}
                />
              </div>
            )}

            {/* Main Image */}
            <img
              key={selectedImage}
              src={currentImage.url}
              alt={currentImage.name || `Gallery image ${selectedImage + 1}`}
              className={`max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain rounded-lg shadow-2xl transition-opacity duration-200 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              draggable={false}
            />

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={() => {
                  setSelectedImage((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
                  setImageLoaded(false);
                }}
                className="ceg-nav-btn absolute right-2 sm:right-6 p-2 sm:p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Image Info Panel */}
            {showImageInfo && showInfo && currentImage && (currentImage.name || currentImage.description) && (
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-xl p-3 sm:p-4 max-w-[90%] min-w-[200px] text-center border border-white/10 shadow-xl"
                style={{ animation: "ceg-slideIn 0.2s ease-out" }}
              >
                {currentImage.name && (
                  <p className="text-white text-sm font-medium mb-1">
                    {currentImage.name}
                  </p>
                )}
                {currentImage.description && (
                  <p className="text-white/70 text-xs sm:text-sm">
                    {currentImage.description}
                  </p>
                )}
                {currentImage.id && (
                  <p className="text-white/30 text-[10px] mt-2">
                    ID: {currentImage.id}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div
            ref={thumbnailStripRef}
            className="ceg-thumb-strip overflow-x-auto py-3 sm:py-4 px-2"
            style={{
              scrollbarWidth: "thin",
              msOverflowStyle: "auto",
            }}
          >
            <div className="flex gap-2 justify-center min-w-max">
              {images.map((img, idx) => (
                <button
                  key={img.id ?? idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`ceg-thumb flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedImage === idx
                      ? "ceg-thumb-active ring-2 ring-white shadow-lg"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                  title={img.name || `Image ${idx + 1}`}
                >
                  <img
                    src={img.url}
                    alt={img.name || `Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Full Size Button */}
        {showFullSizeButton && selectedImage !== null && onImageClick && (
          <div className="text-center py-3 sm:py-4">
            <button
              onClick={handleFullSizeClick}
              className="px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200 text-xs sm:text-sm font-medium hover:scale-105 active:scale-95"
            >
              {fullSizeButtonText}
            </button>
          </div>
        )}
      </div>
    </>
  );
};