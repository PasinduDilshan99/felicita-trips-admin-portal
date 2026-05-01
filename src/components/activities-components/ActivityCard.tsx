// components/activities-components/ActivityCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Tag,
  Clock,
  Users,
  Star,
  Check,
  Eye,
  ArrowRight,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import NavigationButton from "@/components/common-components/NavigationButton";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import { ACTIVITY_DETAILS_VIEW_PAGE_URL } from "@/utils/urls";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0, 0, 0, ${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Helper function to truncate description
const truncateDescription = (
  description: string,
  maxLength: number = 120,
): string => {
  if (!description) return "";
  if (typeof description !== "string") return String(description);
  if (description.length <= maxLength) return description;

  let truncated = description.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > 0 && lastSpaceIndex > maxLength - 20) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }

  return truncated + "...";
};

// Helper to safely get string value from any type
const getSafeString = (value: any, fallback: string = ""): string => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "object") {
    // If it's an object with a name property, return that
    if (value.name) return getSafeString(value.name, fallback);
    // If it's an object with a label property, return that
    if (value.label) return getSafeString(value.label, fallback);
    // Otherwise stringify (but don't for complex objects)
    try {
      const stringified = JSON.stringify(value);
      if (stringified.length > 50) return fallback;
      return stringified;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

// Helper to safely get number value
const getSafeNumber = (value: any, fallback: number = 0): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value) || fallback;
  return fallback;
};

interface ActivityCardProps {
  activity: any; // Use any temporarily to debug
  onImageClick?: (imageIndex: number) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onImageClick,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  // State for current image index and selected primary image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Safely extract data with fallbacks
  const images = activity?.images || [];
  const activityId = activity?.id || activity?.activityId || "unknown";
  const activityName = getSafeString(
    activity?.name || activity?.activityName,
    "Unnamed Activity",
  );
  const description = getSafeString(activity?.description, "");
  const fullDescription = description;
  const truncatedDesc = truncateDescription(fullDescription, 120);
  const needsTruncation = fullDescription.length > 120;
  const displayedDescription = isDescriptionExpanded
    ? fullDescription
    : truncatedDesc;

  // Handle season - could be string or array
  let seasons: string[] = [];
  if (activity?.season) {
    if (typeof activity.season === "string") {
      const seasons: string[] = activity.season
        ? activity.season.split(",").map((s: string) => s.trim())
        : [];
    } else if (Array.isArray(activity.season)) {
      seasons = activity.season;
    }
  }

  // Handle category - could be string or object
  const categoryName = getSafeString(
    activity?.activities_category || activity?.activityCategory,
    "Uncategorized",
  );

  // Handle status
  const status = activity?.status || activity?.statusName || "INACTIVE";

  // Handle destination ID
  const destinationId =
    activity?.destination_id ||
    activity?.destinationId ||
    activity?.destination?.id ||
    "N/A";

  // Handle duration
  const duration = getSafeNumber(
    activity?.duration_hours || activity?.durationHours,
    0,
  );

  // Handle participants
  const minParticipate = getSafeNumber(
    activity?.min_participate || activity?.minParticipate,
    1,
  );
  const maxParticipate = getSafeNumber(
    activity?.max_participate || activity?.maxParticipate,
    10,
  );

  // Handle prices
  const priceLocal = getSafeNumber(
    activity?.price_local || activity?.priceLocal,
    0,
  );

  // Handle availability times
  const availableFrom =
    activity?.available_from || activity?.availableFrom || "00:00";
  const availableTo =
    activity?.available_to || activity?.availableTo || "23:59";

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!images || !Array.isArray(images)) return [];
    return images.map((img: any, idx: number) => ({
      url: img?.image_url || img?.imageUrl || "",
      name: img?.name || img?.imageName || `Image ${idx + 1}`,
      description: img?.description || img?.imageDescription || "",
      id: img?.id || img?.imageId || idx,
    }));
  };

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!isAutoRotating || !images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, images.length]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? (images?.length || 1) - 1 : prevIndex - 1,
    );
    setIsAutoRotating(false);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % (images?.length || 1),
    );
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

    if (onImageClick) {
      onImageClick(index);
    } else {
      setModalImageIndex(index);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleViewDetails = () => {
    router.push(
      `${ACTIVITY_DETAILS_VIEW_PAGE_URL}/${activityId}?name=${encodeURIComponent(activityName)}`,
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleViewDetails();
  };

  // Toggle description expansion
  const toggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const currentImage =
    images?.[currentImageIndex]?.image_url ||
    images?.[currentImageIndex]?.imageUrl ||
    PLACE_HOLDER_IMAGE;

  // Calculate availability status
  const isAvailableToday = () => {
    try {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [fromHour, fromMin] = availableFrom.split(":").map(Number);
      const [toHour, toMin] = availableTo.split(":").map(Number);
      const startMinutes = fromHour * 60 + fromMin;
      const endMinutes = toHour * 60 + toMin;

      return currentTime >= startMinutes && currentTime <= endMinutes;
    } catch {
      return false;
    }
  };

  // If activity is not valid, show nothing
  if (!activity) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
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
          animation: slideDown 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <div className="relative w-full h-full">
            <img
              src={currentImage}
              alt={activityName}
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
                  status === "ACTIVE"
                    ? isAvailableToday()
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                    : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                }`}
              >
                {status === "ACTIVE" ? (
                  <>
                    <div
                      className={`w-1.5 h-1.5 bg-white rounded-full ${isAvailableToday() ? "animate-pulse" : ""}`}
                    ></div>
                    {isAvailableToday() ? "Available Now" : "Available"}
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
            {primaryImageIndex === currentImageIndex &&
              images &&
              images.length > 0 && (
                <div className="absolute top-12 right-4">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3" />
                    Primary
                  </span>
                </div>
              )}

            {/* Navigation Arrows */}
            {images && images.length > 1 && (
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
            {images && images.length > 0 && (
              <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                  {currentImageIndex + 1} / {images.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {images && images.length > 1 && (
          <div
            className="px-4 pt-4"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.map((image: any, index: number) => (
                <div
                  key={image?.id || image?.imageId || index}
                  className="relative flex-shrink-0 group/thumb"
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={
                      image?.image_url || image?.imageUrl || PLACE_HOLDER_IMAGE
                    }
                    alt={
                      image?.name ||
                      image?.imageName ||
                      `Thumbnail ${index + 1}`
                    }
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
          {/* Title and Category */}
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
              {activityName}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})`,
                  }}
                >
                  <Tag className="w-4 h-4" style={{ color: theme.success }} />
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.success }}
                >
                  {categoryName}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin
                  className="w-3 h-3 mr-1"
                  style={{ color: theme.textSecondary }}
                />
                <span
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  ID: {destinationId}
                </span>
              </div>
            </div>
          </div>

          {/* Description with Read More */}
          {fullDescription && (
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
                      Show less <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Stats Grid */}
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
                  <Clock className="w-4 h-4" style={{ color: theme.accent }} />
                </div>
              </div>
              <div
                className="text-xs mb-1"
                style={{ color: theme.textSecondary }}
              >
                Duration
              </div>
              <div className="text-sm font-bold" style={{ color: theme.text }}>
                {duration}h
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
                  <Users className="w-4 h-4" style={{ color: theme.warning }} />
                </div>
              </div>
              <div
                className="text-xs mb-1"
                style={{ color: theme.textSecondary }}
              >
                Group Size
              </div>
              <div className="text-sm font-bold" style={{ color: theme.text }}>
                {minParticipate}-{maxParticipate}
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
                  <DollarSign
                    className="w-4 h-4"
                    style={{ color: theme.error }}
                  />
                </div>
              </div>
              <div
                className="text-xs mb-1"
                style={{ color: theme.textSecondary }}
              >
                Price
              </div>
              <div className="text-sm font-bold" style={{ color: theme.text }}>
                LKR {priceLocal.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Seasons */}
          {seasons.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Calendar
                  className="w-4 h-4 mr-2"
                  style={{ color: theme.textSecondary }}
                />
                <span
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  Best Seasons:
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {seasons.slice(0, 3).map((season: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background: hexToRgba(theme.primary, 0.1),
                      color: theme.primary,
                    }}
                  >
                    {season}
                  </span>
                ))}
                {seasons.length > 3 && (
                  <span
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background: hexToRgba(theme.textSecondary, 0.08),
                      color: theme.textSecondary,
                    }}
                  >
                    +{seasons.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* View Details Button */}
          <button
            onClick={handleViewDetails}
            className="group/btn relative cursor-pointer w-full mt-auto font-semibold py-3 px-5 rounded-xl flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 ease-out"
            style={{
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent || theme.primary} 100%)`,
              color: "#fff",
              boxShadow: `0 4px 15px -3px ${theme.primary}55, 0 2px 6px -2px ${theme.accent || theme.primary}33`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `0 8px 25px -4px ${theme.primary}70, 0 4px 10px -3px ${theme.accent || theme.primary}50`;
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `0 4px 15px -3px ${theme.primary}55, 0 2px 6px -2px ${theme.accent || theme.primary}33`;
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
            <span
              className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out"
              style={{
                background:
                  "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)",
              }}
            />
            <span
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: "rgba(255,255,255,0.35)" }}
            />
            <Eye className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
            <span className="relative tracking-wide text-sm">View Details</span>
            <ArrowRight className="relative w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
          </button>
        </div>
      </div>

      {/* Internal Image Modal */}
      {!onImageClick && getModalImages().length > 0 && (
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

export default ActivityCard;
