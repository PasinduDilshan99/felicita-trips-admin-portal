// components/destination-categories-components/destination-categories-terminate-components/CategoryTerminationDetails.tsx
"use client";

import React, { useState } from "react";
import { CategoryDetailsByIdResponse } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import NavigationButton from "@/components/common-components/NavigationButton";

interface CategoryTerminationDetailsProps {
  categoryDetails: CategoryDetailsByIdResponse;
  onTerminate: () => void;
  terminating: boolean;
}

const CategoryTerminationDetails: React.FC<CategoryTerminationDetailsProps> = ({
  categoryDetails,
  onTerminate,
  terminating,
}) => {
  const { theme } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getModalImages = (): ImageModalImage[] => {
    return categoryDetails.images.map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription || undefined, // Convert null to undefined
      id: img.imageId,
    }));
  };

  const handleImageClick = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? categoryDetails.images.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % categoryDetails.images.length);
  };

  const categoryColor = categoryDetails.color || theme.primary;
  const categoryHoverColor = categoryDetails.hoverColor || theme.accent;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Images & Basic Info */}
        <div className="space-y-6">
          {/* Image Gallery */}
          <div
            className="rounded-2xl shadow-lg overflow-hidden"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div className="relative aspect-video bg-black/5">
              <img
                src={
                  categoryDetails.images[currentImageIndex]?.imageUrl ||
                  PLACE_HOLDER_IMAGE
                }
                alt={
                  categoryDetails.images[currentImageIndex]?.imageName ||
                  categoryDetails.category
                }
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handleImageClick(currentImageIndex)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                }}
              />

              {/* Image Counter */}
              {categoryDetails.images.length > 0 && (
                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-2">
                    📷
                    {currentImageIndex + 1} / {categoryDetails.images.length}
                  </span>
                </div>
              )}

              {/* Navigation Arrows */}
              {categoryDetails.images.length > 1 && (
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
            </div>

            {/* Thumbnail Gallery */}
            {categoryDetails.images.length > 1 && (
              <div
                className="p-4 border-t"
                style={{ borderColor: theme.border }}
              >
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categoryDetails.images.map((image, index) => (
                    <button
                      key={image.imageId}
                      className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                        currentImageIndex === index
                          ? "ring-2 ring-offset-2"
                          : ""
                      }`}
                      style={{
                        boxShadow:
                          currentImageIndex === index
                            ? `0 0 0 2px ${categoryColor}`
                            : "none",
                        borderRadius: "8px",
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image.imageUrl}
                        alt={image.imageName}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PLACE_HOLDER_IMAGE;
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div
            className="rounded-2xl shadow-lg p-6"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{ color: theme.textSecondary }}
              >
                Current Status
              </span>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 ${
                  categoryDetails.categoryStatus === "ACTIVE"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {categoryDetails.categoryStatus === "ACTIVE" ? (
                  <>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Active
                  </>
                ) : (
                  "Inactive"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div
            className="rounded-2xl shadow-lg p-6"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: theme.text }}
            >
              <span className="text-xl">ℹ️</span>
              Basic Information
            </h2>
            <div className="space-y-3">
              <div>
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: theme.textSecondary }}
                >
                  Category Name
                </div>
                <div
                  className="text-base font-semibold px-3 py-2 rounded-lg"
                  style={{
                    color: categoryColor,
                    backgroundColor: hexToRgba(categoryColor, 0.1),
                  }}
                >
                  {categoryDetails.category}
                </div>
              </div>
              <div>
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: theme.textSecondary }}
                >
                  Description
                </div>
                <p
                  className="text-sm leading-relaxed px-3 py-2 rounded-lg"
                  style={{
                    color: theme.text,
                    backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                  }}
                >
                  {categoryDetails.categoryDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div
            className="rounded-2xl shadow-lg p-6"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: theme.text }}
            >
              <span className="text-xl">🎨</span>
              Brand Colors
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div
                  className="text-sm font-medium mb-2"
                  style={{ color: theme.textSecondary }}
                >
                  Primary Color
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg shadow-md"
                    style={{ backgroundColor: categoryColor }}
                  />
                  <code
                    className="px-2 py-1 rounded text-sm"
                    style={{
                      backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                      color: theme.text,
                    }}
                  >
                    {categoryColor}
                  </code>
                </div>
              </div>
              <div>
                <div
                  className="text-sm font-medium mb-2"
                  style={{ color: theme.textSecondary }}
                >
                  Hover Color
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg shadow-md"
                    style={{ backgroundColor: categoryHoverColor }}
                  />
                  <code
                    className="px-2 py-1 rounded text-sm"
                    style={{
                      backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                      color: theme.text,
                    }}
                  >
                    {categoryHoverColor}
                  </code>
                </div>
              </div>
            </div>
            <div
              className="mt-4 pt-3 border-t"
              style={{ borderColor: theme.border }}
            >
              <div
                className="h-12 rounded-lg transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${categoryColor}, ${categoryHoverColor})`,
                }}
              />
            </div>
          </div>

          {/* Statistics */}
          <div
            className="rounded-2xl shadow-lg p-6"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: theme.text }}
            >
              <span className="text-xl">📊</span>
              Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: hexToRgba(categoryColor, 0.1) }}
                >
                  <span className="text-xl">📷</span>
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Total Images
                  </div>
                  <div
                    className="text-xl font-bold"
                    style={{ color: theme.text }}
                  >
                    {categoryDetails.images.length}
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: hexToRgba(theme.warning, 0.1) }}
                >
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Destinations
                  </div>
                  <div
                    className="text-xl font-bold"
                    style={{ color: theme.text }}
                  >
                    {categoryDetails.destinations?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div
            className="rounded-2xl shadow-lg p-6"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: theme.text }}
            >
              <span className="text-xl">⏰</span>
              Timestamps
            </h2>
            <div className="space-y-3">
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                }}
              >
                <span className="text-xl">📅</span>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Created At
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    {formatDate(categoryDetails.createdAt)}
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                }}
              >
                <span className="text-xl">🔄</span>
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
                    {formatDate(categoryDetails.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        images={getModalImages()}
        initialIndex={modalImageIndex}
        onClose={() => setIsModalOpen(false)}
        showNavigation={true}
        showDownload={true}
        showZoom={true}
        allowKeyboardNavigation={true}
      />
    </>
  );
};

export default CategoryTerminationDetails;
