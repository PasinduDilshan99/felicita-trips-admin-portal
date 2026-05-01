// components/activities-components/ActivityListCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Tag,
  Clock,
  Users,
  Calendar,
  AlertCircle,
  DollarSign,
  Target,
  Eye,
  ArrowRight,
  Camera,
  Star,
  Check,
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
    // If it's an object with a value property, return that
    if (value.value) return getSafeString(value.value, fallback);
    // Otherwise return fallback
    return fallback;
  }
  return fallback;
};

// Helper to safely get number value
const getSafeNumber = (value: any, fallback: number = 0): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value) || fallback;
  if (typeof value === "object") return fallback;
  return fallback;
};

// Helper to safely get array from any value
const getSafeArray = (value: any, fallback: any[] = []): any[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.includes(",")) {
    return value.split(",").map((s) => s.trim());
  }
  return fallback;
};

interface ActivityListCardProps {
  activity: any;
  onImageClick?: (imageIndex: number) => void;
}

const ActivityListCard: React.FC<ActivityListCardProps> = ({
  activity,
  onImageClick,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  // State for current image index and selected primary image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Safely extract all data
  const images = getSafeArray(activity?.images);
  const activityId = activity?.id || activity?.activityId || "unknown";
  const activityName = getSafeString(
    activity?.name || activity?.activityName,
    "Unnamed Activity",
  );
  const description = getSafeString(
    activity?.description,
    "No description available",
  );

  // Handle season - could be string, array, or object
  // In the ActivityListCard component, update the seasons handling section:

  // Handle season - could be string, array, or object
  let seasons: string[] = [];
  if (activity?.season) {
    if (typeof activity.season === "string") {
      seasons = activity.season.split(",").map((s: string) => s.trim());
    } else if (Array.isArray(activity.season)) {
      seasons = activity.season.map((s: any) => getSafeString(s));
    } else if (typeof activity.season === "object") {
      seasons = [getSafeString(activity.season)];
    }
  }

  // Handle category - could be string or object
  const categoryValue =
    activity?.activities_category || activity?.activityCategory;
  const categoryName = getSafeString(categoryValue, "Uncategorized");

  // Handle status
  const status = activity?.status || activity?.statusName || "INACTIVE";

  // Handle destination ID
  const destinationId = getSafeString(
    activity?.destination_id || activity?.destinationId,
    "N/A",
  );

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
  const priceForeigners = getSafeNumber(
    activity?.price_foreigners || activity?.priceForeigners,
    0,
  );

  // Handle availability times
  const availableFrom =
    activity?.available_from || activity?.availableFrom || "00:00";
  const availableTo =
    activity?.available_to || activity?.availableTo || "23:59";

  // Handle schedules
  const schedulesCount = getSafeArray(activity?.schedules).length;

  // Handle requirements
  const requirements = getSafeArray(activity?.requirements);

  // Handle updated at
  const updatedAt = activity?.updated_at || activity?.updatedAt;

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

  const currentImage =
    images?.[currentImageIndex]?.image_url ||
    images?.[currentImageIndex]?.imageUrl ||
    PLACE_HOLDER_IMAGE;

  // Calculate availability status
  const isAvailableToday = () => {
    try {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [fromHour, fromMin] = String(availableFrom).split(":").map(Number);
      const [toHour, toMin] = String(availableTo).split(":").map(Number);
      const startMinutes = fromHour * 60 + fromMin;
      const endMinutes = toHour * 60 + toMin;

      return currentTime >= startMinutes && currentTime <= endMinutes;
    } catch {
      return false;
    }
  };

  // If no activity, return null
  if (!activity) return null;

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
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
            <div className="relative w-full h-full">
              <img
                src={currentImage}
                alt={activityName}
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

              {/* Quick View Button */}
              <button
                onClick={handleViewDetails}
                className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-white/90 hover:text-gray-900 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Quick View</span>
              </button>

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
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-2">
                    <Camera className="w-3 h-3" />
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images && images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image: any, index: number) => {
                    const imageUrl = image?.image_url || image?.imageUrl;
                    const imageName =
                      image?.name ||
                      image?.imageName ||
                      `Thumbnail ${index + 1}`;
                    const imageId = image?.id || image?.imageId || index;

                    return (
                      <div
                        key={imageId}
                        className="relative flex-shrink-0 group/thumb"
                        onClick={() => handleImageClick(index)}
                      >
                        <img
                          src={imageUrl || PLACE_HOLDER_IMAGE}
                          alt={imageName}
                          className={`w-12 h-12 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                            currentImageIndex === index
                              ? "border-white scale-110"
                              : "border-transparent hover:border-white/50"
                          }`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              PLACE_HOLDER_IMAGE;
                          }}
                        />

                        {/* Primary Selection Button */}
                        <button
                          onClick={(e) => handleSelectPrimary(index, e)}
                          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                            primaryImageIndex === index
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                              : "bg-gray-800/80 backdrop-blur-sm text-gray-300 opacity-0 group-hover/thumb:opacity-100 hover:bg-blue-500 hover:text-white"
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
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-3/5 xl:w-2/3 p-6">
            {/* Header with Title and Category */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex-1">
                <h3
                  className="text-2xl font-bold mb-2 transition-colors duration-200 cursor-pointer line-clamp-2"
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
                <div className="flex items-center flex-wrap gap-4">
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{
                        background: `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})`,
                      }}
                    >
                      <Tag
                        className="w-5 h-5"
                        style={{ color: theme.success }}
                      />
                    </div>
                    <div>
                      <div
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        Category
                      </div>
                      <div
                        className="text-lg font-semibold"
                        style={{ color: theme.success }}
                      >
                        {categoryName}
                      </div>
                    </div>
                  </div>

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
                        Destination ID
                      </div>
                      <div
                        className="text-lg font-semibold"
                        style={{ color: theme.text }}
                      >
                        {destinationId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 md:mt-0 md:ml-6">
                <div className="text-right">
                  <div
                    className="text-sm mb-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Local Price
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    LKR {priceLocal.toLocaleString()}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Foreign: LKR {priceForeigners.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p
              className="mb-6 leading-relaxed pl-4 py-2 rounded-r-lg line-clamp-3"
              style={{
                color: theme.textSecondary,
                borderLeft: `4px solid ${hexToRgba(theme.primary, 0.3)}`,
                background: `linear-gradient(90deg, ${hexToRgba(theme.primary, 0.05)}, transparent)`,
              }}
            >
              {description}
            </p>

            {/* Stats Grid */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 mb-6"
              style={{
                borderTop: `1px solid ${theme.border}`,
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.accent, 0.1)}, ${hexToRgba(theme.accent, 0.05)})`,
                  }}
                >
                  <Clock className="w-5 h-5" style={{ color: theme.accent }} />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Duration
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    {duration}h
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
                  <Users className="w-5 h-5" style={{ color: theme.warning }} />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Group Size
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    {minParticipate}-{maxParticipate}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})`,
                  }}
                >
                  <Calendar
                    className="w-5 h-5"
                    style={{ color: theme.success }}
                  />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Seasons
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    {seasons.length}
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
                  <Target className="w-5 h-5" style={{ color: theme.error }} />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Schedules
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    {schedulesCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Seasons and Requirements */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Seasons */}
              {seasons.length > 0 && (
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <Calendar
                      className="w-4 h-4 mr-3"
                      style={{ color: theme.textSecondary }}
                    />
                    <span
                      className="text-sm font-semibold"
                      style={{ color: theme.textSecondary }}
                    >
                      Best Seasons:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {seasons.slice(0, 4).map((season, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-sm rounded-lg transition-colors"
                        style={{
                          background: hexToRgba(theme.primary, 0.1),
                          color: theme.primary,
                          border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                        }}
                      >
                        {season}
                      </span>
                    ))}
                    {seasons.length > 4 && (
                      <span
                        className="px-3 py-1.5 text-sm rounded-lg"
                        style={{
                          background: hexToRgba(theme.textSecondary, 0.08),
                          color: theme.textSecondary,
                          border: `1px solid ${hexToRgba(theme.textSecondary, 0.2)}`,
                        }}
                      >
                        +{seasons.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <AlertCircle
                      className="w-4 h-4 mr-3"
                      style={{ color: theme.textSecondary }}
                    />
                    <span
                      className="text-sm font-semibold"
                      style={{ color: theme.textSecondary }}
                    >
                      Requirements:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {requirements.slice(0, 3).map((req: any, index: number) => {
                      const reqName = getSafeString(req?.name);
                      const reqValue = getSafeString(req?.value);
                      const reqColor = req?.color || theme.error;

                      return (
                        <span
                          key={req?.id || index}
                          className="px-3 py-1.5 text-sm rounded-lg transition-colors"
                          style={{
                            background: hexToRgba(theme.error, 0.1),
                            color: theme.error,
                            border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
                            borderLeftColor: reqColor,
                            borderLeftWidth: "4px",
                          }}
                        >
                          {reqName}: {reqValue}
                        </span>
                      );
                    })}
                    {requirements.length > 3 && (
                      <span
                        className="px-3 py-1.5 text-sm rounded-lg"
                        style={{
                          background: hexToRgba(theme.textSecondary, 0.08),
                          color: theme.textSecondary,
                          border: `1px solid ${hexToRgba(theme.textSecondary, 0.2)}`,
                        }}
                      >
                        +{requirements.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Availability and View Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Clock
                    className="w-4 h-4 mr-3"
                    style={{ color: theme.textSecondary }}
                  />
                  <div>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: theme.textSecondary }}
                    >
                      Available:{" "}
                    </span>
                    <span className="text-sm" style={{ color: theme.text }}>
                      {availableFrom} - {availableTo}
                    </span>
                  </div>
                </div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                  Last updated:{" "}
                  {updatedAt ? new Date(updatedAt).toLocaleDateString() : "N/A"}
                </div>
              </div>

              {/* View Details Button */}
              <button
                onClick={handleViewDetails}
                className="group/btn relative cursor-pointer font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 ease-out whitespace-nowrap"
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
                <span className="relative tracking-wide text-sm">
                  View Details
                </span>
                <ArrowRight className="relative w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
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

export default ActivityListCard;
