// components/tour-categories-components/view-tour-category-components/TourCategoryCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Eye,
  ArrowRight,
  Star,
  Check,
  Calendar,
  Tag,
  Hash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import NavigationButton from "@/components/common-components/NavigationButton";
import ImageModal, { ImageModalImage } from "@/components/common-components/ImageModal";
import { TourCategoryListItem, TourCategoryImage } from "@/types/tour-category-types";
import { hexToRgba } from "@/utils/functions";
import { TOUR_CATEGORIES_PAGE_URL } from "@/utils/urls";

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

// Helper functions
const getSafeString = (value: any, fallback: string = ""): string => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  return fallback;
};

interface TourCategoryCardProps {
  category: TourCategoryListItem;
  onImageClick?: (imageIndex: number) => void;
}

const TourCategoryCard: React.FC<TourCategoryCardProps> = ({ category, onImageClick }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const images = category?.images || [];
  const categoryName = getSafeString(category?.categoryName, "Unnamed Category");
  const description = getSafeString(category?.description, "");
  const status = category?.status || "INACTIVE";
  const color = category?.color || theme.primary;
  const hoverColor = category?.hoverColor || theme.accent;

  const handleViewDetails = () => {
    router.push(`${TOUR_CATEGORIES_PAGE_URL}/${category.categoryId}?name=${encodeURIComponent(categoryName)}`);
  };

  const getModalImages = (): ImageModalImage[] => {
    if (!images.length) return [];
    return images.map((img: TourCategoryImage, idx: number) => ({
      url: img?.imageUrl || "",
      name: img?.name || `Image ${idx + 1}`,
      description: img?.description || "",
      id: img?.imageId || idx,
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

  const currentImage = images[currentImageIndex]?.imageUrl || PLACE_HOLDER_IMAGE;
  const isActive = status === "ACTIVE";

  if (!category || !category.categoryId) return null;

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
        }}
      >
        {/* Image Section */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <div className="relative w-full h-full">
            <motion.img
              src={currentImage}
              alt={categoryName}
              className="w-full h-full object-cover cursor-pointer"
              variants={imageVariants}
              initial="rest"
              animate={isHovered ? "hover" : "rest"}
              onClick={() => handleImageClick(currentImageIndex)}
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
              }}
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
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                }`}
              >
                {isActive ? (
                  <>
                    <motion.div
                      className="w-1.5 h-1.5 bg-white rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    Active
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
              onClick={handleViewDetails}
              className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              whileHover={{ scale: 1.05, backgroundColor: "white", color: "#1f2937" }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </motion.button>

            {/* Primary Image Indicator */}
            {primaryImageIndex === currentImageIndex && images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-20 right-4"
              >
                <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3" />
                  Primary
                </span>
              </motion.div>
            )}

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
        {images.length > 1 && (
          <div className="px-4 pt-4 pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image: TourCategoryImage, index: number) => (
                <motion.div
                  key={image?.imageId || index}
                  variants={thumbnailVariants}
                  initial="rest"
                  animate={currentImageIndex === index ? "active" : "rest"}
                  whileHover="hover"
                  className="relative flex-shrink-0"
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={image?.imageUrl || PLACE_HOLDER_IMAGE}
                    alt={image?.name || `Thumbnail ${index + 1}`}
                    className={`w-14 h-14 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                      currentImageIndex === index ? "scale-105" : ""
                    }`}
                    style={{
                      borderColor: currentImageIndex === index ? color : theme.border,
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                    }}
                  />
                  <motion.button
                    onClick={(e) => handleSelectPrimary(index, e)}
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                      primaryImageIndex === index
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                        : "bg-white/90 backdrop-blur-sm text-gray-600 opacity-0 group-hover/thumb:opacity-100 hover:bg-blue-500 hover:text-white"
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
          </div>
        )}

        {/* Content Section */}
        <motion.div variants={contentVariants} initial="hidden" animate="visible" className="p-5 flex-grow flex flex-col">
          <motion.div variants={itemVariants} className="mb-3">
            <motion.h3
              className="text-lg sm:text-xl font-bold mb-2 transition-colors duration-200 cursor-pointer"
              style={{ color: theme.text }}
              whileHover={{ color }}
              onClick={handleViewDetails}
            >
              {categoryName}
            </motion.h3>
            <div className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5" style={{ color: theme.textSecondary }} />
              <span className="text-xs" style={{ color: theme.textSecondary }}>
                ID: {category.categoryId}
              </span>
            </div>
          </motion.div>

          {/* Description */}
          {description && (
            <motion.p
              variants={itemVariants}
              className="text-sm leading-relaxed mb-4 line-clamp-2"
              style={{ color: theme.textSecondary }}
            >
              {description}
            </motion.p>
          )}

          {/* Color Info */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 py-3 px-3 rounded-xl mb-4"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(color, 0.08)}, ${hexToRgba(hoverColor, 0.05)})`,
              borderTop: `1px solid ${theme.border}`,
              marginTop: "auto",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: theme.textSecondary }}>Color:</span>
              <div
                className="w-6 h-6 rounded-full border-2"
                style={{ backgroundColor: color, borderColor: theme.border }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: theme.textSecondary }}>Hover:</span>
              <div
                className="w-6 h-6 rounded-full border-2"
                style={{ backgroundColor: hoverColor, borderColor: theme.border }}
              />
            </div>
          </motion.div>

          {/* View Details Button */}
          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={handleViewDetails}
            className="relative w-full mt-auto font-semibold py-3 px-5 rounded-xl flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${color} 0%, ${hoverColor} 100%)`,
              color: "#fff",
              boxShadow: `0 4px 15px -3px ${color}55`,
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

export default TourCategoryCard;