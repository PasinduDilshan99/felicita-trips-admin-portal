"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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
import {
  ACTIVITY_DETAILS_VIEW_PAGE_URL,
  ACTIVITY_CATEGORY_VIEW_DETAILS_URL,
  SEASONS_VIEW_PAGE_URL,
  DESTINATION_DETAILS_VIEW_PAGE_URL,
} from "@/utils/urls";
import { hexToRgba } from "@/utils/functions";
import {
  ActivitiesCategory,
  Activity,
  ActivityImage,
} from "@/types/activity-types";

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
  hover: {
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const imageVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.4 } },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const quickViewVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.1 } },
};

const thumbnailVariants: Variants = {
  rest: { scale: 1, opacity: 0.7 },
  active: { scale: 1.05, opacity: 1 },
  hover: { scale: 1.02, transition: { duration: 0.15 } },
};

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

const descriptionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: "0 8px 25px -4px rgba(0,0,0,0.2)",
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: { duration: 0.1 },
  },
};

const shineVariants: Variants = {
  rest: { x: "-100%" },
  hover: { x: "100%", transition: { duration: 0.6, ease: "easeInOut" } },
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
  hover: {
    y: -2,
    transition: { duration: 0.15 },
  },
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
    if (value.name) return getSafeString(value.name, fallback);
    if (value.label) return getSafeString(value.label, fallback);
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
  activity: Activity;
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
  const [isHovered, setIsHovered] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Safely extract data with fallbacks
  const images = activity?.images || [];
  const activityId = activity?.id || "unknown";
  const activityName = getSafeString(activity?.name, "Unnamed Activity");
  const description = getSafeString(activity?.description, "");
  const fullDescription = description;
  const truncatedDesc = truncateDescription(fullDescription, 120);
  const needsTruncation = fullDescription.length > 120;
  const displayedDescription = isDescriptionExpanded
    ? fullDescription
    : truncatedDesc;

  // Handle season - parse comma-separated string
  let seasons: string[] = [];
  if (activity?.season) {
    if (typeof activity.season === "string") {
      seasons = activity.season.split(",").map((s: string) => s.trim());
    } else if (Array.isArray(activity.season)) {
      seasons = activity.season;
    }
  }

  // Handle categories - get all categories
  const categories = activity?.activities_category || [];

  // Get primary category for badge display
  const primaryCategory = categories.find((cat) => cat.is_primary);
  const displayCategory = primaryCategory || categories[0];
  const categoryName = displayCategory?.name || "Uncategorized";
  const categoryId = displayCategory?.id;

  // Handle status
  const status = activity?.status || "INACTIVE";

  // Handle destination ID
  const destinationId = activity?.destination_id || "N/A";
  const destinationName = activity?.destinationName || "N/A";

  // Handle duration
  const duration = activity?.duration_hours || 0;

  // Handle participants
  const minParticipate = activity?.min_participate || 1;
  const maxParticipate = activity?.max_participate || 10;

  // Handle prices
  const priceLocal = activity?.price_local || 0;

  // Handle availability times
  const availableFrom = activity?.available_from || "00:00";
  const availableTo = activity?.available_to || "23:59";

  // Navigation handlers
  const handleCategoryClick = (
    e: React.MouseEvent,
    categoryId: number,
    categoryName: string,
  ) => {
    e.stopPropagation();
    router.push(
      `${ACTIVITY_CATEGORY_VIEW_DETAILS_URL}/${categoryId}?name=${encodeURIComponent(categoryName)}`,
    );
  };

  const handleSeasonClick = (e: React.MouseEvent, season: string) => {
    e.stopPropagation();
    router.push(`${SEASONS_VIEW_PAGE_URL}?name=${encodeURIComponent(season)}`);
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

  // If activity is not valid, show nothing
  if (!activity || !activity.id) {
    return null;
  }

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        {/* Image Section */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <div className="relative w-full h-full">
            <motion.img
              src={currentImage}
              alt={activityName}
              className="w-full h-full object-cover cursor-pointer"
              variants={imageVariants}
              initial="rest"
              animate={isHovered ? "hover" : "rest"}
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
              }}
              onClick={() => handleImageClick(currentImageIndex)}
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
                      animate={isAvailableToday() ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    {isAvailableToday() ? "Available Now" : "Available"}
                  </>
                ) : (
                  "Inactive"
                )}
              </span>
            </motion.div>

            {/* Quick View Button */}
            <motion.button
              variants={quickViewVariants}
              initial="hidden"
              animate={isHovered ? "visible" : "hidden"}
              onClick={handleQuickView}
              className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              whileHover={{ scale: 1.05, backgroundColor: "white", color: "#1f2937" }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </motion.button>

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
                className="absolute bottom-4 right-4"
              >
                <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                  {currentImageIndex + 1} / {images.length}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {images && images.length > 1 && (
          <div
            className="px-4 pt-4 pb-2"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image: ActivityImage, index: number) => (
                <motion.div
                  key={image?.id || index}
                  variants={thumbnailVariants}
                  initial="rest"
                  animate={currentImageIndex === index ? "active" : "rest"}
                  whileHover="hover"
                  className="relative flex-shrink-0"
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={image?.image_url || PLACE_HOLDER_IMAGE}
                    alt={image?.name || `Thumbnail ${index + 1}`}
                    className={`w-14 h-14 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                      currentImageIndex === index ? "scale-105" : ""
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
                  <motion.button
                    onClick={(e) => handleSelectPrimary(index, e)}
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                      primaryImageIndex === index
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                        : "bg-white/90 backdrop-blur-sm text-gray-600 opacity-0 group-hover/thumb:opacity-100 hover:bg-blue-500 hover:text-white"
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
              ))}
            </div>
          </div>
        )}

        {/* Content Section */}
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="p-5 flex-grow flex flex-col"
        >
          {/* Title and Category */}
          <motion.div variants={itemVariants} className="mb-4">
            <motion.h3
              className="text-lg sm:text-xl font-bold mb-2 line-clamp-1 transition-colors duration-200 cursor-pointer"
              style={{ color: theme.text }}
              whileHover={{ color: theme.primary }}
              onClick={handleViewDetails}
            >
              {activityName}
            </motion.h3>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center">
                <motion.div
                  className="w-7 h-7 rounded-full flex items-center justify-center mr-2 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  onClick={(e) =>
                    categoryId &&
                    handleCategoryClick(e, categoryId, categoryName)
                  }
                >
                  <Tag className="w-3.5 h-3.5" style={{ color: theme.success }} />
                </motion.div>
                <span
                  className="text-xs sm:text-sm font-medium cursor-pointer"
                  style={{ color: theme.success }}
                  onClick={(e) =>
                    categoryId &&
                    handleCategoryClick(e, categoryId, categoryName)
                  }
                >
                  {categoryName}
                </span>
              </div>
              <div className="flex items-center">
                <motion.div
                  className="flex items-center cursor-pointer"
                  whileHover={{ x: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      `${DESTINATION_DETAILS_VIEW_PAGE_URL}/${destinationId}`,
                    );
                  }}
                >
                  <MapPin
                    className="w-3 h-3 mr-1"
                    style={{ color: theme.textSecondary }}
                  />
                  <span
                    className="text-xs truncate max-w-[120px] sm:max-w-[200px]"
                    style={{ color: theme.textSecondary }}
                  >
                    {destinationName}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* All Categories Section */}
          {categories.length > 1 && (
            <motion.div variants={itemVariants} className="mb-4">
              <div className="flex items-center mb-2">
                <Tag
                  className="w-3.5 h-3.5 mr-1.5"
                  style={{ color: theme.textSecondary }}
                />
                <span className="text-xs" style={{ color: theme.textSecondary }}>
                  All Categories:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, 3).map((category: ActivitiesCategory) => (
                  <motion.span
                    key={category.id}
                    className="px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200"
                    style={{
                      background: hexToRgba(theme.primary, 0.1),
                      color: theme.primary,
                    }}
                    whileHover={{ scale: 1.05, x: 1 }}
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
                {categories.length > 3 && (
                  <span
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background: hexToRgba(theme.textSecondary, 0.08),
                      color: theme.textSecondary,
                    }}
                  >
                    +{categories.length - 3} more
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Description with Read More */}
          {fullDescription && (
            <motion.div variants={itemVariants} className="mb-4">
              <p
                className="text-sm leading-relaxed"
                style={{ color: theme.textSecondary }}
              >
                {displayedDescription}
              </p>
              {needsTruncation && (
                <motion.button
                  onClick={toggleDescription}
                  className="cursor-pointer text-xs font-medium mt-1.5 inline-flex items-center gap-1 transition-all duration-200"
                  style={{ color: theme.primary }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
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
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-3 py-4 rounded-xl mb-4"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.05)}, ${hexToRgba(theme.accent, 0.05)})`,
              borderTop: `1px solid ${theme.border}`,
              marginTop: "auto",
            }}
          >
            {[
              { icon: Clock, label: "Duration", value: `${duration}h`, color: theme.accent },
              { icon: Users, label: "Group Size", value: `${minParticipate}-${maxParticipate}`, color: theme.warning },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                variants={statCardVariants}
                whileHover="hover"
                className="text-center"
              >
                <div className="flex items-center justify-center mb-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(stat.color, 0.1)}, ${hexToRgba(stat.color, 0.05)})`,
                    }}
                  >
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                  {stat.label}
                </div>
                <div className="text-sm font-bold" style={{ color: theme.text }}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Seasons */}
          {seasons.length > 0 && (
            <motion.div variants={itemVariants} className="mb-4">
              <div className="flex items-center mb-2">
                <Calendar
                  className="w-3.5 h-3.5 mr-1.5"
                  style={{ color: theme.textSecondary }}
                />
                <span className="text-xs" style={{ color: theme.textSecondary }}>
                  Best Seasons:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {seasons.slice(0, 3).map((season: string, index: number) => (
                  <motion.span
                    key={index}
                    className="px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200"
                    style={{
                      background: hexToRgba(theme.primary, 0.1),
                      color: theme.primary,
                    }}
                    whileHover={{ scale: 1.05, x: 1 }}
                    onClick={(e) => handleSeasonClick(e, season)}
                  >
                    {season}
                  </motion.span>
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
            </motion.div>
          )}

          {/* View Details Button */}
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={handleViewDetails}
            className="relative w-full mt-auto font-semibold py-3 px-5 rounded-xl flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
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
                background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)",
              }}
            />
            <span className="absolute inset-x-0 top-0 h-px" style={{ background: "rgba(255,255,255,0.35)" }} />
            <Eye className="relative w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="relative tracking-wide text-sm">View Details</span>
            <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </motion.button>
        </motion.div>
      </motion.div>

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