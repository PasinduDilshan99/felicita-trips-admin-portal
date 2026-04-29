// components/destination-categories-components/destination-categories-view-components/CategoryCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Image as ImageIcon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowRight,
  Layers,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
  PLACE_HOLDER_IMAGE,
} from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import { ActiveCategory } from "@/types/destination-types";
import { hexToRgba } from "@/utils/functions";
import NavigationButton from "@/components/common-components/NavigationButton";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";

interface CategoryCardProps {
  category: ActiveCategory;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const images = category.images;
  const hasMultipleImages = images.length > 1;

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    return images.map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription || undefined, // Convert null to undefined
      id: img.imageId,
    }));
  };

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!isAutoRotating || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, images.length]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
    setIsAutoRotating(false);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    setIsAutoRotating(false);
  };

  const handleMainImageClick = () => {
    setModalImageIndex(currentImageIndex);
    setIsModalOpen(true);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoRotating(false);
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleViewDetails = () => {
    router.push(
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/categories/view/${category.categoryId}`,
    );
  };

  const currentImage =
    images[currentImageIndex]?.imageUrl || PLACE_HOLDER_IMAGE;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div
        className="group rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: `0 10px 15px -3px ${hexToRgba(theme.text, 0.1)}, 0 4px 6px -2px ${hexToRgba(theme.text, 0.05)}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = category.color || theme.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme.border;
        }}
      >
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <div className="relative w-full h-full">
            <img
              src={currentImage}
              alt={category.category}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
              }}
              onClick={handleMainImageClick}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${
                  category.categoryStatus === "ACTIVE"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                }`}
              >
                {category.categoryStatus === "ACTIVE" ? (
                  <>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    Active
                  </>
                ) : (
                  "Inactive"
                )}
              </span>
            </div>

            {/* Quick View Button */}
            <button
              onClick={handleViewDetails}
              className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-white/90 hover:text-gray-900 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Quick View</span>
            </button>

            {/* Navigation Arrows - Using NavigationButton */}
            {hasMultipleImages && (
              <>
                <NavigationButton
                  direction="left"
                  onClick={handlePrevImage}
                  size="sm"
                />
                <NavigationButton
                  direction="right"
                  onClick={handleNextImage}
                  size="sm"
                />
              </>
            )}

            {/* Image Counter */}
            {images.length > 0 && (
              <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                  {currentImageIndex + 1} / {images.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {hasMultipleImages && (
          <div
            className="px-4 pt-3"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.slice(0, 5).map((image, index) => (
                <div
                  key={image.imageId}
                  className="relative flex-shrink-0 cursor-pointer"
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.imageName}
                    className={`w-14 h-14 rounded-lg object-cover border-2 transition-all duration-200 ${
                      currentImageIndex === index
                        ? "scale-105"
                        : "hover:opacity-80"
                    }`}
                    style={{
                      borderColor:
                        currentImageIndex === index
                          ? category.color || theme.primary
                          : theme.border,
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                    }}
                  />
                </div>
              ))}
              {images.length > 5 && (
                <div
                  className="flex items-center justify-center w-14 h-14 rounded-lg"
                  style={{
                    backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                  }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: theme.textSecondary }}
                  >
                    +{images.length - 5}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-5 flex-grow flex flex-col">
          {/* Title with Color Accent */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${hexToRgba(category.color || theme.primary, 0.2)}, ${hexToRgba(category.hoverColor || theme.accent, 0.1)})`,
                }}
              >
                <Tag
                  className="w-4 h-4"
                  style={{ color: category.color || theme.primary }}
                />
              </div>
              <h3
                className="text-xl font-bold line-clamp-1 transition-colors duration-200 cursor-pointer flex-1"
                style={{ color: theme.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = category.color || theme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.text;
                }}
                onClick={handleViewDetails}
              >
                {category.category}
              </h3>
            </div>

            {/* Color Indicators */}
            <div className="flex items-center gap-2 ml-10">
              <div
                className="w-8 h-2 rounded-full"
                style={{ backgroundColor: category.color || theme.primary }}
              />
              <div
                className="w-8 h-2 rounded-full"
                style={{ backgroundColor: category.hoverColor || theme.accent }}
              />
              <span className="text-xs" style={{ color: theme.textSecondary }}>
                Brand Colors
              </span>
            </div>
          </div>

          {/* Description */}
          <p
            className="text-sm mb-4 line-clamp-3 flex-grow leading-relaxed"
            style={{ color: theme.textSecondary }}
          >
            {category.categoryDescription}
          </p>

          {/* Stats */}
          <div
            className="grid grid-cols-2 gap-3 py-3 rounded-xl mb-4"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(category.color || theme.primary, 0.05)}, ${hexToRgba(category.hoverColor || theme.accent, 0.05)})`,
              borderTop: `1px solid ${theme.border}`,
              marginTop: "auto",
            }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(category.color || theme.accent, 0.1)}, ${hexToRgba(category.color || theme.accent, 0.05)})`,
                  }}
                >
                  <ImageIcon
                    className="w-3.5 h-3.5"
                    style={{ color: category.color || theme.accent }}
                  />
                </div>
              </div>
              <div
                className="text-xs mb-1"
                style={{ color: theme.textSecondary }}
              >
                Images
              </div>
              <div className="text-sm font-bold" style={{ color: theme.text }}>
                {category.images.length}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.warning, 0.1)}, ${hexToRgba(theme.warning, 0.05)})`,
                  }}
                >
                  <Calendar
                    className="w-3.5 h-3.5"
                    style={{ color: theme.warning }}
                  />
                </div>
              </div>
              <div
                className="text-xs mb-1"
                style={{ color: theme.textSecondary }}
              >
                Created
              </div>
              <div
                className="text-xs font-semibold"
                style={{ color: theme.text }}
              >
                {formatDate(category.createdAt)}
              </div>
            </div>
          </div>

          {/* View Details Button */}
          <button
            onClick={handleViewDetails}
            className="group/btn relative cursor-pointer w-full mt-auto font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 ease-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${category.color || theme.primary}, ${category.hoverColor || theme.accent})`,
              color: "#fff",
              boxShadow: `0 4px 10px -2px ${category.color || theme.primary}55`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `0 8px 20px -4px ${category.color || theme.primary}70`;
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `0 4px 10px -2px ${category.color || theme.primary}55`;
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0) scale(0.97)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-2px) scale(1)";
            }}
          >
            {/* Shine effect - slides across on hover */}
            <span
              className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out"
              style={{
                background:
                  "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%)",
              }}
            />

            {/* Top border highlight */}
            <span
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: "rgba(255,255,255,0.3)" }}
            />

            <Info className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
            <span className="relative tracking-wide">View Category</span>
            <ArrowRight className="relative w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
          </button>
        </div>
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

export default CategoryCard;
