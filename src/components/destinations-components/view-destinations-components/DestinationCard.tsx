"use client";

import React, { useState, useEffect } from "react";
import { DestinationCardProps } from "@/types/destination-types";
import {
  MapPin,
  Tag,
  Clock,
  Users,
  Image as ImageIcon,
  Star,
  Check,
  Eye,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DESTINATION_CATEGORY_VIEW_PAGE_URL,
  DESTINATION_DETAILS_VIEW_PAGE_URL,
} from "@/utils/urls";
import NavigationButton from "@/components/common-components/NavigationButton";
import { hexToRgba, truncateDescription } from "@/utils/functions";
import { ImageModalImage } from "@/types/common-components-types";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import ImageModal from "@/components/common-components/ImageModal";
import PrivilegedButton from "@/components/common-components/PrivilegedButton";
import { DESTINATION_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onImageClick,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const images = destination.images;
  const minPrice =
    destination.activities.length > 0
      ? Math.min(...destination.activities.map((a) => a.priceLocal))
      : 0;

  const primaryCategory = destination.destinationCategoryDetailsDtos.find(
    (cat) => cat.isPrimary === true,
  );
  const allCategories = destination.destinationCategoryDetailsDtos;
  const hasMultipleCategories = allCategories.length > 1;
  const visibleCategories = showAllCategories
    ? allCategories
    : allCategories.slice(0, 3);
  const hasMoreCategories = allCategories.length > 3;

  // Get truncated description
  const fullDescription = destination.destinationDescription || "";
  const truncatedDesc = truncateDescription(fullDescription, 130);
  const needsTruncation = fullDescription.length > 130;
  const displayedDescription = isDescriptionExpanded
    ? fullDescription
    : truncatedDesc;

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    return images.map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription,
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

  const handleSelectPrimary = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPrimaryImageIndex(index);
    setCurrentImageIndex(index);
    setIsAutoRotating(false);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoRotating(false);

    // If onImageClick prop is provided, use it (for external modal)
    if (onImageClick) {
      onImageClick(index);
    } else {
      // Otherwise use the internal modal
      setModalImageIndex(index);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle view details button click
  const handleViewDetails = () => {
    router.push(
      `${DESTINATION_DETAILS_VIEW_PAGE_URL}/${destination.destinationId}?name=${destination.destinationName}`,
    );
  };

  // Handle quick view click
  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleViewDetails();
  };

  // Toggle categories view
  const toggleCategories = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAllCategories(!showAllCategories);
  };

  // Toggle description expansion
  const toggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const currentImage =
    images[currentImageIndex]?.imageUrl || PLACE_HOLDER_IMAGE;

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        
        .categories-enter {
          animation: slideDown 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .categories-exit {
          animation: slideUp 0.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .category-item {
          animation: slideDown 0.25s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        
        .more-button {
          transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        .more-button:hover {
          transform: translateY(-1px);
        }
        
        .more-button:active {
          transform: translateY(0);
        }
        
        .description-text {
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        .read-more-btn {
          transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        .read-more-btn:hover {
          transform: translateX(2px);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .expanded-description {
          animation: fadeInUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      <div
        className="group rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: `0 10px 15px -3px ${hexToRgba(theme.text, 0.1)}, 0 4px 6px -2px ${hexToRgba(theme.text, 0.05)}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme.border;
        }}
      >
        <div className="relative h-64 overflow-hidden">
          <div className="relative w-full h-full">
            <img
              src={currentImage}
              alt={destination.destinationName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
              }}
              onClick={() => handleImageClick(currentImageIndex)}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${
                  destination.statusName === "ACTIVE"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                }`}
              >
                {destination.statusName === "ACTIVE" ? (
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
              onClick={handleQuickView}
              className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-white/90 hover:text-gray-900 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Quick View</span>
            </button>

            {/* Primary Image Indicator */}
            {primaryImageIndex === currentImageIndex && (
              <div className="absolute top-12 right-4">
                <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3" />
                  Primary
                </span>
              </div>
            )}

            {/* Navigation Arrows - Using reusable NavigationButton */}
            {images.length > 1 && (
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
        {images.length > 1 && (
          <div
            className="px-4 pt-4"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <div
                  key={image.imageId}
                  className="relative flex-shrink-0 group/thumb"
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.imageName}
                    className={`w-16 h-16 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                      currentImageIndex === index
                        ? "scale-105"
                        : "hover:opacity-80"
                    }`}
                    style={{
                      borderColor:
                        currentImageIndex === index
                          ? theme.primary
                          : theme.border,
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                    }}
                  />

                  {/* Primary Selection Button */}
                  <button
                    onClick={(e) => handleSelectPrimary(index, e)}
                    className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                      primaryImageIndex === index
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                        : "bg-white/90 backdrop-blur-sm text-gray-600 opacity-0 group-hover/thumb:opacity-100 hover:bg-blue-500 hover:text-white"
                    }`}
                    title={
                      primaryImageIndex === index
                        ? "Primary Image"
                        : "Set as Primary"
                    }
                  >
                    {primaryImageIndex === index ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Star className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-5 flex-grow flex flex-col">
          {/* Title and Location */}
          <div className="mb-4">
            <h3
              className="text-xl font-bold mb-2 line-clamp-1 transition-colors duration-200 cursor-pointer"
              style={{ color: theme.text }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.text;
              }}
              onClick={handleViewDetails}
            >
              {destination.destinationName}
            </h3>
            <div className="flex items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                style={{
                  background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`,
                }}
              >
                <MapPin className="w-4 h-4" style={{ color: theme.primary }} />
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: theme.textSecondary }}
              >
                {destination.location}
              </span>
            </div>
          </div>

          {/* Description with Read More functionality */}
          <div className="mb-4">
            <p
              className={`text-sm leading-relaxed description-text ${
                isDescriptionExpanded ? "expanded-description" : ""
              }`}
              style={{ color: theme.textSecondary }}
            >
              {displayedDescription}
            </p>
            {needsTruncation && (
              <button
                onClick={toggleDescription}
                className="cursor-pointer read-more-btn text-xs font-medium mt-1.5 inline-flex items-center gap-1 transition-all duration-200"
                style={{ color: theme.primary }}
              >
                {isDescriptionExpanded ? (
                  <>
                    Show less
                    <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Read more
                    <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Categories Section */}
          <div className="mb-6">
            {/* Primary Category Badge */}
            {primaryCategory && (
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})`,
                    }}
                  >
                    <Tag className="w-4 h-4" style={{ color: theme.success }} />
                  </div>
                  <div>
                    <div
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Primary Category
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: theme.success }}
                    >
                      {primaryCategory.name}
                    </div>
                  </div>
                </div>

                {/* Category Count Badge - Now Clickable */}
                {hasMoreCategories && (
                  <button
                    onClick={toggleCategories}
                    className="cursor-pointer more-button flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.1),
                      color: theme.primary,
                    }}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">
                      {showAllCategories
                        ? "Show Less"
                        : `+${allCategories.length - 3} more`}
                    </span>
                    {showAllCategories ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            )}

            {/* All Categories with Animation */}
            <div className="mt-2 overflow-hidden">
              <div
                className={`flex flex-wrap gap-2 ${
                  showAllCategories ? "categories-enter" : ""
                }`}
              >
                {visibleCategories.map((category, index) => (
                  <span
                    key={category.id}
                    onClick={() => {
                      router.push(
                        `${DESTINATION_CATEGORY_VIEW_PAGE_URL}/${category.id}?name=${category.name}`,
                      );
                    }}
                    className={`category-item inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm ${
                      category.isPrimary ? "border" : ""
                    }`}
                    style={{
                      background: category.isPrimary
                        ? `linear-gradient(135deg, ${hexToRgba(theme.success, 0.15)}, ${hexToRgba(theme.success, 0.08)})`
                        : hexToRgba(theme.textSecondary, 0.08),
                      color: category.isPrimary
                        ? theme.success
                        : theme.textSecondary,
                      borderColor: category.isPrimary
                        ? hexToRgba(theme.success, 0.3)
                        : "transparent",
                      animationDelay: `${index * 0.03}s`,
                    }}
                  >
                    {category.isPrimary && (
                      <Star className="w-2.5 h-2.5 mr-1.5" />
                    )}
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-3 py-4 rounded-xl mb-4"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.05)}, ${hexToRgba(theme.accent, 0.05)})`,
              borderTop: `1px solid ${theme.border}`,
              marginTop: "auto",
            }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.accent, 0.1)}, ${hexToRgba(theme.accent, 0.05)})`,
                  }}
                >
                  <Users className="w-4 h-4" style={{ color: theme.accent }} />
                </div>
              </div>
              <div
                className="text-xs mb-1"
                style={{ color: theme.textSecondary }}
              >
                Activities
              </div>
              <div className="text-sm font-bold" style={{ color: theme.text }}>
                {destination.activities.length}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.warning, 0.1)}, ${hexToRgba(theme.warning, 0.05)})`,
                  }}
                >
                  <Clock className="w-4 h-4" style={{ color: theme.warning }} />
                </div>
              </div>
              <div
                className="text-xs mb-1"
                style={{ color: theme.textSecondary }}
              >
                Duration
              </div>
              <div className="text-sm font-bold" style={{ color: theme.text }}>
                {Math.round(
                  destination.activities.reduce(
                    (sum, a) => sum + a.durationHours,
                    0,
                  ) / destination.activities.length,
                ) || 0}
                h
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.error, 0.1)}, ${hexToRgba(theme.error, 0.05)})`,
                  }}
                >
                  <ImageIcon
                    className="w-4 h-4"
                    style={{ color: theme.error }}
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
                {destination.images.length}
              </div>
            </div>
          </div>

          <PrivilegedButton
            requiredPrivileges={[DESTINATION_DETAILS_VIEW_PRIVILEGE]}
            variant="primary"
            size="md"
            fullWidth={true}
            showShineEffect={true}
            showTopBorder={true}
            elevation="md"
            onClick={handleViewDetails}
            icon={<Eye className="w-4 h-4" />}
            iconPosition="left"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </PrivilegedButton>
        </div>
      </div>

      {!onImageClick && (
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
      )}
    </>
  );
};

export default DestinationCard;
