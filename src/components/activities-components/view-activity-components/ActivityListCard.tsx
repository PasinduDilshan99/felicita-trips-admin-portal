"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  MapPin,
  Tag,
  Clock,
  Users,
  Calendar,
  AlertCircle,
  Target,
  Eye,
  ArrowRight,
  Camera,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import NavigationButton from "@/components/common-components/NavigationButton";
import ImageModal from "@/components/common-components/ImageModal";
import {
  ACTIVITY_DETAILS_VIEW_PAGE_URL,
  SEASONS_VIEW_PAGE_URL,
  DESTINATION_DETAILS_VIEW_PAGE_URL,
  ACTIVITY_CATEGORY_DETAILS_VIEW_URL,
} from "@/utils/urls";
import {
  ActivityImage,
  ActivityListCardProps,
  Requirement,
} from "@/types/activity-types";
import { hexToRgba } from "@/utils/functions";
import {
  formatTime,
  getSafeArray,
  getSafeString,
} from "@/utils/commonFunctions";
import { ImageModalImage } from "@/types/common-components-types";
import {
  buttonVariants,
  cardVariants,
  categoryBadgeVariants,
  contentVariants,
  imageVariants,
  itemVariants,
  overlayVariants,
  quickViewVariants,
  requirementItemVariants,
  requirementsVariants,
  seasonVariants,
  shineVariants,
  statCardVariants,
  thumbnailVariants,
} from "@/app/animations/variants";

const ActivityListCard: React.FC<ActivityListCardProps> = ({
  activity,
  onImageClick,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showAllRequirements, setShowAllRequirements] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const images = getSafeArray(activity?.images);
  const activityId = activity?.id || "unknown";
  const activityName = getSafeString(activity?.name, "Unnamed Activity");
  const description = getSafeString(
    activity?.description,
    "No description available",
  );

  let seasons: string[] = [];
  const seasonData = activity?.seasonName as any;
  if (seasonData) {
    if (typeof seasonData === "string") {
      seasons = seasonData.split(",").map((s: string) => s.trim());
    } else if (Array.isArray(seasonData)) {
      seasons = seasonData.map((s: any) => getSafeString(s));
    } else if (typeof seasonData === "object") {
      seasons = [getSafeString(seasonData.name || seasonData)];
    }
  }

  const categories = activity?.activities_category || [];
  const primaryCategory = categories.find((cat) => cat.is_primary);
  const displayCategory = primaryCategory || categories[0];
  const categoryName = displayCategory?.name || "Uncategorized";
  const categoryId = displayCategory?.id;

  const status = activity?.status || "INACTIVE";

  const destinationId = activity?.destination_id || "N/A";
  const destinationName = activity?.destinationName || "N/A";

  const duration = activity?.duration_hours || 0;

  const minParticipate = activity?.min_participate || 1;
  const maxParticipate = activity?.max_participate || 10;
  const availableFrom = formatTime(activity?.available_from || "00:00:00");
  const availableTo = formatTime(activity?.available_to || "23:59:59");
  const schedulesCount = getSafeArray(activity?.schedules).length;
  const requirements = getSafeArray(activity?.requirements);
  const visibleRequirements = showAllRequirements
    ? requirements
    : requirements.slice(0, 3);
  const hasMoreRequirements = requirements.length > 3;
  const updatedAt = activity?.updated_at;

  const handleCategoryClick = (
    e: React.MouseEvent,
    categoryId: number,
    categoryName: string,
  ) => {
    e.stopPropagation();
    router.push(
      `${ACTIVITY_CATEGORY_DETAILS_VIEW_URL}/${categoryId}?name=${encodeURIComponent(categoryName)}`,
    );
  };

  const handleSeasonClick = (e: React.MouseEvent, season: string) => {
    e.stopPropagation();
    router.push(`${SEASONS_VIEW_PAGE_URL}?name=${encodeURIComponent(season)}`);
  };

  const handleDestinationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (destinationId && destinationId !== "N/A") {
      router.push(
        `${DESTINATION_DETAILS_VIEW_PAGE_URL}/${destinationId}name=${destinationName}`,
      );
    }
  };

  const toggleRequirements = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAllRequirements(!showAllRequirements);
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!images || !Array.isArray(images)) return [];
    return images.map((img: ActivityImage, idx: number) => ({
      url: img?.image_url || "",
      name: img?.name || `Image ${idx + 1}`,
      description: img?.description || "",
      id: img?.id || idx,
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
    images?.[currentImageIndex]?.image_url || PLACE_HOLDER_IMAGE;

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

  // If no activity, return null
  if (!activity || !activity.id) return null;

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery Section */}
          <div className="lg:w-2/5 xl:w-1/3 relative h-64 lg:h-auto overflow-hidden">
            <div className="relative w-full h-full">
              <motion.img
                src={currentImage}
                alt={activityName}
                className="w-full h-full object-cover cursor-pointer"
                variants={imageVariants}
                initial="rest"
                animate={isHovered ? "hover" : "rest"}
                onClick={() => handleImageClick(currentImageIndex)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                }}
              />

              {/* Gradient Overlay */}
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate={isHovered ? "visible" : "hidden"}
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
              />

              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute top-4 left-4"
              >
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
                      <motion.div
                        className="w-1.5 h-1.5 bg-white rounded-full"
                        animate={
                          isAvailableToday() ? { scale: [1, 1.2, 1] } : {}
                        }
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      {isAvailableToday() ? "Available Now" : "Available"}
                    </>
                  ) : (
                    "Inactive"
                  )}
                </span>
              </motion.div>

              {/* Primary Image Indicator */}
              {primaryImageIndex === currentImageIndex &&
                images &&
                images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-12 right-4"
                  >
                    <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3" />
                      Primary
                    </span>
                  </motion.div>
                )}

              {/* Quick View Button */}
              <motion.button
                variants={quickViewVariants}
                initial="hidden"
                animate={isHovered ? "visible" : "hidden"}
                onClick={handleViewDetails}
                className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "white",
                  color: "#1f2937",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick View</span>
              </motion.button>

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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4"
                >
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-1.5">
                    <Camera className="w-3 h-3" />
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images && images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3"
              >
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image: ActivityImage, index: number) => {
                    const imageUrl = image?.image_url;
                    const imageName = image?.name || `Thumbnail ${index + 1}`;
                    const imageId = image?.id || index;

                    return (
                      <motion.div
                        key={imageId}
                        variants={thumbnailVariants}
                        initial="rest"
                        animate={
                          currentImageIndex === index ? "active" : "rest"
                        }
                        whileHover="hover"
                        className="relative flex-shrink-0"
                        onClick={() => handleImageClick(index)}
                      >
                        <img
                          src={imageUrl || PLACE_HOLDER_IMAGE}
                          alt={imageName}
                          className={`w-12 h-12 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                            currentImageIndex === index
                              ? "border-white scale-110"
                              : "border-transparent"
                          }`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              PLACE_HOLDER_IMAGE;
                          }}
                        />

                        {/* Primary Selection Button */}
                        <motion.button
                          onClick={(e) => handleSelectPrimary(index, e)}
                          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                            primaryImageIndex === index
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                              : "bg-gray-800/80 backdrop-blur-sm text-gray-300 opacity-0 group-hover/thumb:opacity-100"
                          }`}
                          title={
                            primaryImageIndex === index
                              ? "Primary Image"
                              : "Set as Primary"
                          }
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {primaryImageIndex === index ? (
                            <Check className="w-2.5 h-2.5" />
                          ) : (
                            <Star className="w-2.5 h-2.5" />
                          )}
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Content Section */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="lg:w-3/5 xl:w-2/3 p-5 sm:p-6"
          >
            {/* Header with Title and Category */}
            <motion.div variants={itemVariants} className="mb-6">
              <motion.h3
                className="text-xl sm:text-2xl font-bold mb-3 transition-colors duration-200 cursor-pointer line-clamp-2"
                style={{ color: theme.text }}
                whileHover={{ color: theme.primary }}
                onClick={handleViewDetails}
              >
                {activityName}
              </motion.h3>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Primary Category */}
                <div className="flex items-center">
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3 cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})`,
                    }}
                    whileHover={{ scale: 1.05 }}
                    onClick={(e) =>
                      categoryId &&
                      handleCategoryClick(e, categoryId, categoryName)
                    }
                  >
                    <Tag className="w-5 h-5" style={{ color: theme.success }} />
                  </motion.div>
                  <div>
                    <div
                      className="text-xs sm:text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      Category
                    </div>
                    <div
                      className="text-base sm:text-lg font-semibold cursor-pointer"
                      style={{ color: theme.success }}
                      onClick={(e) =>
                        categoryId &&
                        handleCategoryClick(e, categoryId, categoryName)
                      }
                    >
                      {categoryName}
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <motion.div
                  className="flex items-center cursor-pointer"
                  whileHover={{ x: 2 }}
                  onClick={handleDestinationClick}
                >
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
                      className="text-xs sm:text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      Destination
                    </div>
                    <div
                      className="text-base sm:text-lg font-semibold"
                      style={{ color: theme.text }}
                    >
                      {destinationName}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* All Categories Section */}
              {categories.length > 1 && (
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <Target
                      className="w-4 h-4 mr-2"
                      style={{ color: theme.accent }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      All Categories ({categories.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <motion.span
                        key={category.id}
                        variants={categoryBadgeVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="px-2 py-1 rounded-lg text-xs cursor-pointer transition-all duration-200"
                        style={{
                          background: hexToRgba(theme.primary, 0.1),
                          color: theme.primary,
                        }}
                        onClick={(e) =>
                          handleCategoryClick(e, category.id, category.name)
                        }
                      >
                        {category.name}
                        {category.is_primary && (
                          <span className="ml-1 text-[10px] opacity-75">
                            (Primary)
                          </span>
                        )}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mb-6 leading-relaxed pl-4 py-2 rounded-r-lg line-clamp-3 text-sm"
              style={{
                color: theme.textSecondary,
                borderLeft: `4px solid ${hexToRgba(theme.primary, 0.3)}`,
                background: `linear-gradient(90deg, ${hexToRgba(theme.primary, 0.05)}, transparent)`,
              }}
            >
              {description}
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 mb-6"
              style={{
                borderTop: `1px solid ${theme.border}`,
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              {[
                {
                  icon: Clock,
                  label: "Duration",
                  value: `${duration}h`,
                  color: theme.accent,
                },
                {
                  icon: Users,
                  label: "Group Size",
                  value: `${minParticipate}-${maxParticipate}`,
                  color: theme.warning,
                },
                {
                  icon: Calendar,
                  label: "Seasons",
                  value: seasons.length,
                  color: theme.success,
                },
                {
                  icon: Target,
                  label: "Schedules",
                  value: schedulesCount,
                  color: theme.error,
                },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  variants={statCardVariants}
                  whileHover="hover"
                  className="flex items-center"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(stat.color, 0.1)}, ${hexToRgba(stat.color, 0.05)})`,
                    }}
                  >
                    <stat.icon
                      className="w-5 h-5"
                      style={{ color: stat.color }}
                    />
                  </div>
                  <div>
                    <div
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      {stat.label}
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: theme.text }}
                    >
                      {stat.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Seasons and Requirements */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Seasons */}
              {seasons.length > 0 && (
                <motion.div variants={itemVariants} className="flex-1">
                  <div className="flex items-center mb-3">
                    <Calendar
                      className="w-4 h-4 mr-2"
                      style={{ color: theme.textSecondary }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: theme.textSecondary }}
                    >
                      Best Seasons:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {seasons.slice(0, 4).map((season, index) => (
                      <motion.span
                        key={index}
                        variants={seasonVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="px-2 py-1 text-xs rounded-lg cursor-pointer transition-all duration-200"
                        style={{
                          background: hexToRgba(theme.primary, 0.1),
                          color: theme.primary,
                          border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                        }}
                        onClick={(e) => handleSeasonClick(e, season)}
                      >
                        {season}
                      </motion.span>
                    ))}
                    {seasons.length > 4 && (
                      <span
                        className="px-2 py-1 text-xs rounded-lg"
                        style={{
                          background: hexToRgba(theme.textSecondary, 0.08),
                          color: theme.textSecondary,
                        }}
                      >
                        +{seasons.length - 4} more
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Requirements with Expand/Collapse */}
              {requirements.length > 0 && (
                <motion.div variants={itemVariants} className="flex-1">
                  <div className="flex items-center mb-3 flex-wrap gap-2">
                    <AlertCircle
                      className="w-4 h-4"
                      style={{ color: theme.textSecondary }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: theme.textSecondary }}
                    >
                      Requirements:
                    </span>
                    {hasMoreRequirements && (
                      <motion.button
                        onClick={toggleRequirements}
                        className="flex items-center gap-1 text-xs transition-all duration-200 cursor-pointer"
                        style={{ color: theme.primary }}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {showAllRequirements ? (
                          <>
                            Show less <ChevronUp className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            Show all ({requirements.length}){" "}
                            <ChevronDown className="w-3 h-3" />
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showAllRequirements ? "all" : "limited"}
                      variants={requirementsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex flex-wrap gap-2"
                    >
                      {visibleRequirements.map(
                        (req: Requirement, index: number) => {
                          const reqName = req?.name;
                          const reqValue = req?.value;
                          const reqColor = req?.color || theme.error;

                          return (
                            <motion.span
                              key={req?.id || index}
                              variants={requirementItemVariants}
                              className="px-2 py-1 text-xs rounded-lg transition-all duration-200"
                              style={{
                                background: hexToRgba(theme.error, 0.1),
                                color: theme.error,
                                border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
                                borderLeftColor: reqColor,
                                borderLeftWidth: "4px",
                              }}
                            >
                              {reqName}: {reqValue}
                            </motion.span>
                          );
                        },
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Availability and View Button */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Clock
                    className="w-4 h-4 mr-2"
                    style={{ color: theme.textSecondary }}
                  />
                  <div>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: theme.textSecondary }}
                    >
                      Available:{" "}
                    </span>
                    <span className="text-xs" style={{ color: theme.text }}>
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
              <motion.button
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleViewDetails}
                className="relative cursor-pointer font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap w-full sm:w-auto"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent || theme.primary} 100%)`,
                  color: "#fff",
                  boxShadow: `0 4px 15px -3px ${theme.primary}55`,
                }}
              >
                <motion.span
                  variants={shineVariants}
                  initial="rest"
                  animate={isHovered ? "hover" : "rest"}
                  className="absolute inset-0"
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
                <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

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
