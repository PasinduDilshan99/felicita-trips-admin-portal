"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Image as ImageIcon,
  Calendar,
  Eye,
  ArrowRight,
  Info,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import NavigationButton from "@/components/common-components/NavigationButton";
import ImageModal from "@/components/common-components/ImageModal";
import { DestinationCategoryListCardProps } from "@/types/destination-category-types";
import { ImageModalImage } from "@/types/common-components-types";
import { DESTINATION_CATEGORY_DETAILS_VIEW_URL } from "@/utils/urls";
import { hexToRgba } from "@/utils/functions";
import { formatDate } from "@/utils/utils";

const CategoryListCard: React.FC<DestinationCategoryListCardProps> = ({
  category,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const images = category.images;
  const hasMultipleImages = images.length > 1;

  const getModalImages = (): ImageModalImage[] => {
    return images.map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription || undefined,
      id: img.imageId,
    }));
  };

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
      `${DESTINATION_CATEGORY_DETAILS_VIEW_URL}/${category.categoryId}?name=${category.category}`,
    );
  };

  const currentImage =
    images[currentImageIndex]?.imageUrl || PLACE_HOLDER_IMAGE;

  return (
    <>
      <div
        className="group rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
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
        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery Section */}
          <div className="lg:w-2/5 xl:w-1/3 relative h-64 lg:h-auto">
            <div className="relative w-full h-full">
              <img
                src={currentImage}
                alt={category.category}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                onClick={handleMainImageClick}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

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

              {/* View Details Button */}
              <button
                onClick={handleViewDetails}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm hover:bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: `${hexToRgba("#ffffff", 0.9)}` }}
              >
                <Eye className="w-3 h-3" />
                View Details
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
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" />
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasMultipleImages && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <div className="flex space-x-2 overflow-x-auto">
                  {images.slice(0, 4).map((image, index) => (
                    <div key={image.imageId} className="relative flex-shrink-0">
                      <img
                        src={image.imageUrl}
                        alt={image.imageName}
                        className={`w-12 h-12 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                          currentImageIndex === index
                            ? "border-white scale-110"
                            : "border-transparent hover:border-white/50"
                        }`}
                        onClick={() => handleThumbnailClick(index)}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PLACE_HOLDER_IMAGE;
                        }}
                      />
                    </div>
                  ))}
                  {images.length > 4 && (
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-black/50 backdrop-blur-sm">
                      <span className="text-xs font-medium text-white">
                        +{images.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-3/5 xl:w-2/3 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(category.color || theme.primary, 0.2)}, ${hexToRgba(category.hoverColor || theme.accent, 0.1)})`,
                    }}
                  >
                    <Tag
                      className="w-6 h-6"
                      style={{ color: category.color || theme.primary }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-2xl font-bold transition-colors duration-200 cursor-pointer"
                      style={{ color: theme.text }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color =
                          category.color || theme.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.text;
                      }}
                      onClick={handleViewDetails}
                    >
                      {category.category}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-6 h-1.5 rounded-full"
                        style={{
                          backgroundColor: category.color || theme.primary,
                        }}
                      />
                      <div
                        className="w-6 h-1.5 rounded-full"
                        style={{
                          backgroundColor: category.hoverColor || theme.accent,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p
              className="mb-6 leading-relaxed pl-4 py-2 rounded-r-lg"
              style={{
                color: theme.textSecondary,
                borderLeft: `4px solid ${category.color || theme.primary}`,
                background: `linear-gradient(90deg, ${hexToRgba(category.color || theme.primary, 0.05)}, transparent)`,
              }}
            >
              {category.categoryDescription}
            </p>

            {/* Stats Grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 py-5 mb-6"
              style={{
                borderTop: `1px solid ${theme.border}`,
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(category.color || theme.accent, 0.1)}, ${hexToRgba(category.color || theme.accent, 0.05)})`,
                  }}
                >
                  <ImageIcon
                    className="w-5 h-5"
                    style={{ color: category.color || theme.accent }}
                  />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Total Images
                  </div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: theme.text }}
                  >
                    {category.images.length}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.warning, 0.1)}, ${hexToRgba(theme.warning, 0.05)})`,
                  }}
                >
                  <Calendar
                    className="w-5 h-5"
                    style={{ color: theme.warning }}
                  />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Created Date
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    {formatDate(category.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.05)})`,
                  }}
                >
                  <Clock className="w-5 h-5" style={{ color: theme.primary }} />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Last Updated
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    {formatDate(category.updatedAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(category.color || theme.primary, 0.1)}, ${hexToRgba(category.hoverColor || theme.accent, 0.1)})`,
                    }}
                  >
                    <ImageIcon
                      className="w-3 h-3"
                      style={{ color: category.color || theme.primary }}
                    />
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: theme.textSecondary }}
                  >
                    Gallery Preview:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {images.slice(0, 6).map((image, index) => (
                    <img
                      key={image.imageId}
                      src={image.imageUrl}
                      alt={image.imageName}
                      className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => handleThumbnailClick(index)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                      }}
                    />
                  ))}
                  {images.length > 6 && (
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
                      style={{
                        backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                      }}
                      onClick={() => handleThumbnailClick(6)}
                    >
                      <span
                        className="text-xs font-medium"
                        style={{ color: theme.textSecondary }}
                      >
                        +{images.length - 6}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* View Details Button */}
            <button
              onClick={handleViewDetails}
              className="font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group/btn w-full md:w-auto"
              style={{
                background: `linear-gradient(135deg, ${category.color || theme.primary}, ${category.hoverColor || theme.accent})`,
                color: "#fff",
              }}
            >
              <Info className="w-4 h-4" />
              <span>View Category Details</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
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

export default CategoryListCard;
