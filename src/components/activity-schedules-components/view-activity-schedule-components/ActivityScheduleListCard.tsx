// components/activity-schedule-components/ActivityScheduleListCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Clock,
  Calendar,
  Eye,
  ArrowRight,
  Star,
  Check,
  Users,
  DollarSign,
  MapPin,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import NavigationButton from "@/components/common-components/NavigationButton";
import ImageModal, { ImageModalImage } from "@/components/common-components/ImageModal";
import { ActivityScheduleListItem, ActivityScheduleImage, ActivityCategoryDto } from "@/types/activity-schedule-types";
import { hexToRgba } from "@/utils/functions";
import { ACTIVITY_CATEGORIES_PAGE_URL } from "@/utils/urls";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
  hover: { y: -4, transition: { duration: 0.2, ease: "easeOut" } },
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
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
};

const buttonVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: "0 8px 25px -4px rgba(0,0,0,0.2)",
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  tap: { scale: 0.98, y: 0, transition: { duration: 0.1 } },
};

const shineVariants: Variants = {
  rest: { x: "-100%" },
  hover: { x: "100%", transition: { duration: 0.6, ease: "easeInOut" } },
};

const getSafeString = (value: any, fallback: string = ""): string => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  return fallback;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const formatTime = (timeString: string): string => {
  if (!timeString) return "N/A";
  if (timeString.match(/^\d{2}:\d{2}$/)) return timeString;
  if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
    return timeString.substring(0, 5);
  }
  return timeString;
};

interface ActivityScheduleListCardProps {
  schedule: ActivityScheduleListItem;
  onImageClick?: (imageIndex: number) => void;
}

const ActivityScheduleListCard: React.FC<ActivityScheduleListCardProps> = ({ schedule, onImageClick }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const images = schedule?.images || [];
  const categories = schedule?.activityCategoryDtos || [];
  const primaryCategory = categories.find((cat) => cat.is_primary);
  const displayCategory = primaryCategory || categories[0];

  const scheduleName = getSafeString(schedule?.activityScheduleName, "Unnamed Schedule");
  const activityName = getSafeString(schedule?.activityName, "");
  const description = getSafeString(schedule?.description || schedule?.scheduleDescription, "No description available");
  const status = schedule?.status || "INACTIVE";
  const scheduleStatus = schedule?.scheduleStatus || "INACTIVE";
  const duration = schedule?.durationHours || 0;
  const minParticipate = schedule?.minParticipate || 1;
  const maxParticipate = schedule?.maxParticipate || 10;
  const priceLocal = schedule?.priceLocal || 0;
  const priceForeigners = schedule?.priceForeigners || 0;
  const destinationName = getSafeString(schedule?.destinationName, "N/A");
  const season = getSafeString(schedule?.season, "N/A");
  const availableFrom = formatTime(schedule?.availableFrom || "00:00");
  const availableTo = formatTime(schedule?.availableTo || "23:59");
  const scheduleStartDate = schedule?.scheduleAssumeStartDate;
  const scheduleEndDate = schedule?.scheduleAssumeEndDate;
  const scheduleSpecialNote = getSafeString(schedule?.scheduleSpecialNote, "");

  const handleViewDetails = () => {
    router.push(`${ACTIVITY_CATEGORIES_PAGE_URL}/${schedule.activityId}/${schedule.scheduleId}`);
  };

  const getModalImages = (): ImageModalImage[] => {
    if (!images.length) return [];
    return images.map((img: ActivityScheduleImage, idx: number) => ({
      url: img?.image_url || "",
      name: img?.name || `Image ${idx + 1}`,
      description: img?.description || "",
      id: img?.id || idx,
    }));
  };

  useEffect(() => {
    if (!isAutoRotating || !images.length || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoRotating, images.length]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
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
    if (onImageClick) {
      onImageClick(index);
    } else {
      setModalImageIndex(index);
      setIsModalOpen(true);
    }
  };

  const currentImage = images[currentImageIndex]?.image_url || PLACE_HOLDER_IMAGE;
  const isActive = status === "ACTIVE" && scheduleStatus === "ACTIVE";

  if (!schedule || !schedule.activityId) return null;

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
        style={{ backgroundColor: theme.surface, border: `1px solid ${theme.border}` }}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery Section */}
          <div className="lg:w-2/5 xl:w-1/3 relative h-64 lg:h-auto overflow-hidden">
            <div className="relative w-full h-full">
              <motion.img
                src={currentImage}
                alt={scheduleName}
                className="w-full h-full object-cover cursor-pointer"
                variants={imageVariants}
                initial="rest"
                animate={isHovered ? "hover" : "rest"}
                onClick={() => handleImageClick(currentImageIndex)}
                onError={(e) => { (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE; }}
              />

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
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                }`}>
                  {isActive ? (
                    <>
                      <motion.div
                        className="w-1.5 h-1.5 bg-white rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      Active
                    </>
                  ) : ("Inactive")}
                </span>
              </motion.div>

              {/* Quick View Button */}
              <motion.button
                variants={quickViewVariants}
                initial="hidden"
                animate={isHovered ? "visible" : "hidden"}
                onClick={handleViewDetails}
                className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                whileHover={{ scale: 1.05, backgroundColor: "white", color: "#1f2937" }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick View</span>
              </motion.button>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <NavigationButton direction="left" onClick={handlePrevImage} size="sm" />
                  <NavigationButton direction="right" onClick={handleNextImage} size="sm" />
                </>
              )}

              {/* Image Counter */}
              {images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4"
                >
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-1.5">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3"
              >
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image: ActivityScheduleImage, index: number) => (
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
                        className={`w-12 h-12 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                          currentImageIndex === index ? "border-white scale-110" : "border-transparent"
                        }`}
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE; }}
                      />
                      <motion.button
                        onClick={(e) => handleSelectPrimary(index, e)}
                        className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                          primaryImageIndex === index
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                            : "bg-gray-800/80 backdrop-blur-sm text-gray-300 opacity-0 group-hover/thumb:opacity-100"
                        }`}
                        title={primaryImageIndex === index ? "Primary Image" : "Set as Primary"}
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
              </motion.div>
            )}
          </div>

          {/* Content Section */}
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="lg:w-3/5 xl:w-2/3 p-5 sm:p-6">
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-4">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <motion.h3
                  className="text-xl sm:text-2xl font-bold transition-colors duration-200 cursor-pointer"
                  style={{ color: theme.text }}
                  whileHover={{ color: theme.primary }}
                  onClick={handleViewDetails}
                >
                  {scheduleName}
                </motion.h3>
                {displayCategory && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" style={{ color: theme.success }} />
                    <span className="text-sm font-medium" style={{ color: theme.success }}>
                      {displayCategory.name}
                      {displayCategory.is_primary && " (Primary)"}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" style={{ color: theme.textSecondary }} />
                  <span className="text-sm" style={{ color: theme.textSecondary }}>{destinationName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" style={{ color: theme.textSecondary }} />
                  <span className="text-sm" style={{ color: theme.textSecondary }}>{activityName}</span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mb-6 leading-relaxed pl-4 py-2 rounded-r-lg line-clamp-2 text-sm"
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
              style={{ borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ background: hexToRgba(theme.accent, 0.1) }}>
                  <Clock className="w-5 h-5" style={{ color: theme.accent }} />
                </div>
                <div>
                  <div className="text-xs" style={{ color: theme.textSecondary }}>Duration</div>
                  <div className="text-sm font-semibold" style={{ color: theme.text }}>{duration} hours</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ background: hexToRgba(theme.primary, 0.1) }}>
                  <Users className="w-5 h-5" style={{ color: theme.primary }} />
                </div>
                <div>
                  <div className="text-xs" style={{ color: theme.textSecondary }}>Group Size</div>
                  <div className="text-sm font-semibold" style={{ color: theme.text }}>{minParticipate}-{maxParticipate}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ background: hexToRgba(theme.primary, 0.1) }}>
                  <DollarSign className="w-5 h-5" style={{ color: theme.primary }} />
                </div>
                <div>
                  <div className="text-xs" style={{ color: theme.textSecondary }}>Local Price</div>
                  <div className="text-sm font-semibold" style={{ color: theme.primary }}>{formatPrice(priceLocal)}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ background: hexToRgba(theme.success, 0.1) }}>
                  <DollarSign className="w-5 h-5" style={{ color: theme.success }} />
                </div>
                <div>
                  <div className="text-xs" style={{ color: theme.textSecondary }}>Foreigner Price</div>
                  <div className="text-sm font-semibold" style={{ color: theme.success }}>{formatPrice(priceForeigners)}</div>
                </div>
              </div>
            </motion.div>

            {/* Schedule Details */}
            <motion.div variants={itemVariants} className="mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: theme.textSecondary }} />
                  <span className="text-sm" style={{ color: theme.text }}>
                    {scheduleStartDate && scheduleEndDate 
                      ? `${formatDate(scheduleStartDate)} - ${formatDate(scheduleEndDate)}`
                      : "Dates TBD"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: theme.textSecondary }} />
                  <span className="text-sm" style={{ color: theme.text }}>
                    Available: {availableFrom} - {availableTo}
                  </span>
                </div>
              </div>
              {season && season !== "N/A" && (
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4" style={{ color: theme.textSecondary }} />
                  <span className="text-sm" style={{ color: theme.text }}>Season: {season}</span>
                </div>
              )}
              {scheduleSpecialNote && (
                <div className="mt-3 p-2 rounded-lg" style={{ background: hexToRgba(theme.warning, 0.08) }}>
                  <span className="text-xs" style={{ color: theme.warning }}>Note: {scheduleSpecialNote}</span>
                </div>
              )}
            </motion.div>

            {/* All Categories */}
            {categories.length > 1 && (
              <motion.div variants={itemVariants} className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category: ActivityCategoryDto) => (
                    <span
                      key={category.id}
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{
                        background: hexToRgba(theme.primary, 0.1),
                        color: theme.primary,
                      }}
                    >
                      {category.name}
                      {category.is_primary && " (Primary)"}
                    </span>
                  ))}
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
              className="relative cursor-pointer font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap w-full sm:w-auto mt-2"
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
                style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)" }}
              />
              <span className="absolute inset-x-0 top-0 h-px" style={{ background: "rgba(255,255,255,0.35)" }} />
              <Eye className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
              <span className="relative tracking-wide text-sm">View Details</span>
              <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Image Modal */}
      {!onImageClick && getModalImages().length > 0 && (
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
      )}
    </>
  );
};

export default ActivityScheduleListCard;