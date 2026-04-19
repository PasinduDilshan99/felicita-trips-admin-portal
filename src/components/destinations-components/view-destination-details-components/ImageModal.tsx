"use client";

import React, { useState, useEffect } from "react";
import { X, Download, ZoomIn, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";

interface ImageModalProps {
  images: Array<{ imageId: number; imageUrl: string; imageName: string }>;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const { theme } = useTheme();
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const currentImage = images[currentIndex];

  const handleDownload = async () => {
    try {
      const response = await fetch(currentImage.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = currentImage.imageName || `image-${currentImage.imageId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(currentImage.imageUrl, "_blank");
    }
  };

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
    setIsZoomed(false);
  };

  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
    setIsZoomed(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [currentIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
      >
        <X size={24} />
      </button>

      <button
        onClick={handleDownload}
        className="absolute top-4 right-20 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
      >
        <Download size={20} />
      </button>

      <button
        onClick={() => setIsZoomed(!isZoomed)}
        className="absolute top-4 right-36 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
      >
        {isZoomed ? <Maximize size={20} /> : <ZoomIn size={20} />}
      </button>

      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
      >
        <ChevronRight size={28} />
      </button>

      <div
        className={`relative max-w-[90vw] max-h-[90vh] ${isZoomed ? "cursor-zoom-out overflow-auto" : "cursor-zoom-in"}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!isZoomed) setIsZoomed(true);
        }}
        onMouseMove={handleMouseMove}
      >
        <img
          src={currentImage.imageUrl}
          alt={currentImage.imageName}
          className={`transition-all duration-300 ${
            isZoomed
              ? "w-auto h-auto max-w-none cursor-zoom-out"
              : "max-w-[90vw] max-h-[90vh] object-contain"
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  transform: "scale(2)",
                  cursor: "zoom-out",
                }
              : {}
          }
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
          }}
        />
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-10">
        <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-2">
          {images.map((img, idx) => (
            <button
              key={img.imageId}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(idx);
                setIsZoomed(false);
              }}
              className={`flex-shrink-0 transition-all duration-200 ${
                idx === currentIndex
                  ? "ring-2 ring-white ring-offset-2 ring-offset-transparent scale-105"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.imageUrl}
                alt={img.imageName}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};