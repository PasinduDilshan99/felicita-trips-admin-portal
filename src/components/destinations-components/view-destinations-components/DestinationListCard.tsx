"use client";

import React, { useState, useEffect } from "react";
import { DestinationListCardProps } from "@/types/destination-types";
import {
  MapPin,
  Tag,
  Clock,
  Image as ImageIcon,
  Activity,
  Star,
  Check,
  Camera,
  Eye,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ACTIVITY_DETAILS_VIEW_PAGE_URL,
  DESTINATION_CATEGORY_VIEW_PAGE_URL,
  DESTINATION_DETAILS_VIEW_PAGE_URL,
} from "@/utils/urls";
import NavigationButton from "@/components/common-components/NavigationButton";
import ImageModal from "@/components/common-components/ImageModal";
import { hexToRgba, truncateDescription } from "@/utils/functions";
import { ImageModalImage } from "@/types/common-components-types";
import { DESTINATION_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import PrivilegedButton from "@/components/common-components/PrivilegedButton";

const DestinationListCard: React.FC<DestinationListCardProps> = ({
  destination,
  onImageClick,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const images = destination.images;
  const minPrice =
    destination.activities.length > 0
      ? Math.min(...destination.activities.map((a) => a.priceLocal))
      : 0;

  const avgDuration =
    destination.activities.length > 0
      ? Math.round(
          destination.activities.reduce((sum, a) => sum + a.durationHours, 0) /
            destination.activities.length,
        )
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

  // Activities data
  const allActivities = destination.activities;
  const visibleActivities = showAllActivities
    ? allActivities
    : allActivities.slice(0, 3);
  const hasMoreActivities = allActivities.length > 3;

  // Description truncation
  const fullDescription = destination.destinationDescription || "";
  const truncatedDesc = truncateDescription(fullDescription, 260);
  const needsTruncation = fullDescription.length > 260;
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

  // Handle image click for modal
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoRotating(false);
    setModalImageIndex(index);
    setIsModalOpen(true);
    onImageClick?.(index);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalNavigate = (index: number) => {
    setModalImageIndex(index);
    setCurrentImageIndex(index);
    setIsAutoRotating(false);
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

  const handleSelectPrimary = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPrimaryImageIndex(index);
    setCurrentImageIndex(index);
    setIsAutoRotating(false);
  };

  const handleViewDetails = () => {
    router.push(
      `${DESTINATION_DETAILS_VIEW_PAGE_URL}/${destination.destinationId}?name=${destination.destinationName}`,
    );
  };

  const toggleCategories = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAllCategories(!showAllCategories);
  };

  // Toggle activities view
  const toggleActivities = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAllActivities(!showAllActivities);
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
        
        .categories-enter {
          animation: slideDown 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .activities-enter {
          animation: slideDown 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .category-item {
          animation: slideDown 0.25s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        
        .activity-item {
          animation: fadeInUp 0.25s cubic-bezier(0.22, 1, 0.36, 1) backwards;
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
        
        .expanded-description {
          animation: fadeInUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      <div
        className="group rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
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
        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery Section */}
          <div className="lg:w-2/5 xl:w-1/3 relative h-64 lg:h-auto">
            {/* Main Image with Navigation */}
            <div className="relative w-full h-full">
              <img
                src={currentImage}
                alt={destination.destinationName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                onClick={() => handleImageClick(currentImageIndex)}
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
                onClick={handleViewDetails}
                className="
                          absolute top-4 right-4 z-10
                          opacity-0 group-hover:opacity-100
                          group-hover:-translate-y-0.5 group-hover:scale-[1.025]
                          active:translate-y-0 active:scale-[0.97]
                          cursor-pointer overflow-hidden
                          inline-flex items-center gap-[7px]
                          px-4 py-2 rounded-[10px]
                          text-[13px] font-medium tracking-wide
                          text-white hover:text-[#0e2a22]
                          border border-white/35 hover:border-white
                          bg-white/8 hover:bg-white/95
                          backdrop-blur-md
                          shadow-none hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.28)]
                          transition-all duration-[220ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
                          before:absolute before:inset-y-0 before:left-0 before:w-[40%]
                          before:bg-white/25 before:skew-x-[-15deg]
                          before:-translate-x-full hover:before:translate-x-[220%]
                          before:transition-transform before:duration-500 before:ease-out
            "
                title="Quick View"
              >
                <Eye
                  className="
                          w-[18px] h-[18px] flex-shrink-0
                          transition-transform duration-[220ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
                          group-hover:scale-[1.18]
            "
                />
                <span className="relative z-10 transition-[letter-spacing] duration-200 group-hover:tracking-[0.025em]">
                  Quick View
                </span>
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

              {/* Navigation Arrows - Using reusable component */}
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
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-2">
                    <Camera className="w-3 h-3" />
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <div key={image.imageId} className="relative flex-shrink-0">
                      <img
                        src={image.imageUrl}
                        alt={image.imageName}
                        className={`w-12 h-12 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                          currentImageIndex === index
                            ? "border-white scale-110"
                            : "border-transparent hover:border-white/50"
                        }`}
                        onClick={() => handleImageClick(index)}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PLACE_HOLDER_IMAGE;
                        }}
                      />

                      {/* Primary Selection Dot */}
                      <button
                        onClick={(e) => handleSelectPrimary(index, e)}
                        className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                          primaryImageIndex === index
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                            : "bg-gray-800/80 backdrop-blur-sm text-gray-300 opacity-0 hover:opacity-100 group-hover:opacity-100 hover:bg-blue-500 hover:text-white"
                        }`}
                        title={
                          primaryImageIndex === index
                            ? "Primary Image"
                            : "Set as Primary"
                        }
                      >
                        {primaryImageIndex === index ? (
                          <Check className="w-2.5 h-2.5" />
                        ) : (
                          <Star className="w-2.5 h-2.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-3/5 xl:w-2/3 p-6">
            {/* Header with Title and Location */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex-1">
                <h3
                  className="text-2xl font-bold mb-2 transition-colors duration-200 cursor-pointer"
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
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`,
                    }}
                  >
                    <MapPin
                      className="w-5 h-5"
                      style={{ color: theme.primary }}
                    />
                  </div>
                  <div>
                    <div
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      Location
                    </div>
                    <div
                      className="text-lg font-semibold"
                      style={{ color: theme.text }}
                    >
                      {destination.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description with Read More functionality */}
            <div className="mb-6">
              <p
                className={`leading-relaxed pl-4 py-2 rounded-r-lg description-text ${
                  isDescriptionExpanded ? "expanded-description" : ""
                }`}
                style={{
                  color: theme.textSecondary,
                  borderLeft: `4px solid ${hexToRgba(theme.primary, 0.3)}`,
                  background: `linear-gradient(90deg, ${hexToRgba(theme.primary, 0.05)}, transparent)`,
                }}
              >
                {displayedDescription}
              </p>
              {needsTruncation && (
                <button
                  onClick={toggleDescription}
                  className="cursor-pointer read-more-btn text-xs font-medium mt-2 ml-4 inline-flex items-center gap-1 transition-all duration-200"
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

            {/* Stats Grid */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 mb-6"
              style={{
                borderTop: `1px solid ${theme.border}`,
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              {/* Categories Section */}
              <div className="flex items-start">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})`,
                  }}
                >
                  <Tag className="w-5 h-5" style={{ color: theme.success }} />
                </div>
                <div className="flex-1">
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Categories
                  </div>
                  {primaryCategory && (
                    <div
                      className="text-sm font-semibold mb-1"
                      style={{ color: theme.success }}
                    >
                      {primaryCategory.name}
                      {primaryCategory.isPrimary && (
                        <Star
                          className="w-3 h-3 inline-block ml-1"
                          style={{ color: theme.warning }}
                        />
                      )}
                    </div>
                  )}
                  {hasMoreCategories && (
                    <button
                      onClick={toggleCategories}
                      className="cursor-pointer more-button flex items-center gap-1 mt-1 text-xs font-medium transition-all duration-200"
                      style={{ color: theme.primary }}
                    >
                      <Layers className="w-3 h-3" />
                      {showAllCategories
                        ? "Show Less"
                        : `+${allCategories.length - 1} more categories`}
                      {showAllCategories ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.accent, 0.1)}, ${hexToRgba(theme.accent, 0.05)})`,
                  }}
                >
                  <Activity
                    className="w-5 h-5"
                    style={{ color: theme.accent }}
                  />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Activities
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    {destination.activities.length}
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
                  <Clock className="w-5 h-5" style={{ color: theme.warning }} />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Avg Duration
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    {avgDuration} hours
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.error, 0.1)}, ${hexToRgba(theme.error, 0.05)})`,
                  }}
                >
                  <ImageIcon
                    className="w-5 h-5"
                    style={{ color: theme.error }}
                  />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Images
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    {destination.images.length}
                  </div>
                </div>
              </div>
            </div>

            {/* All Categories Chips Section */}
            {hasMultipleCategories && (
              <div className="mb-6 overflow-hidden">
                <div className="flex items-center mb-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`,
                    }}
                  >
                    <Layers
                      className="w-3 h-3"
                      style={{ color: theme.primary }}
                    />
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: theme.textSecondary }}
                  >
                    All Categories:
                  </span>
                </div>
                <div
                  className={`flex flex-wrap gap-2 ${showAllCategories ? "categories-enter" : ""}`}
                >
                  {visibleCategories.map((category, index) => (
                    <span
                      key={category.id}
                      onClick={() => {
                        router.push(
                          `${DESTINATION_CATEGORY_VIEW_PAGE_URL}/${category.id}?name=${category.name}`,
                        );
                      }}
                      className={`category-item inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 ${
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
            )}

            {/* Activities Section with Expand/Collapse */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`,
                    }}
                  >
                    <Activity
                      className="w-4 h-4"
                      style={{ color: theme.primary }}
                    />
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: theme.textSecondary }}
                  >
                    Activities:
                  </span>
                </div>
                {hasMoreActivities && (
                  <button
                    onClick={toggleActivities}
                    className="cursor-pointer more-button flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.1),
                      color: theme.primary,
                    }}
                  >
                    {showAllActivities
                      ? "Show Less"
                      : `Show All (${allActivities.length})`}
                    {showAllActivities ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
              <div
                className={`flex flex-wrap gap-2 ${showAllActivities ? "activities-enter" : ""}`}
              >
                {visibleActivities.map((activity, index) => (
                  <div
                    key={activity.activityId}
                    className="activity-item group/activity relative"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <span
                      className="inline-flex flex-col px-4 py-2 text-sm rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`,
                        color: theme.primary,
                        border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                      }}
                      onClick={() => {
                        router.push(
                          `${ACTIVITY_DETAILS_VIEW_PAGE_URL}/${activity.activityId}?name=${activity.activityName}`,
                        );
                      }}
                    >
                      <span className="font-medium">
                        {activity.activityName}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
        </div>
      </div>

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

export default DestinationListCard;
