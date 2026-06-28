"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  ArrowRight,
  Star,
  Check,
  Calendar,
  TrendingUp,
  Hash,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import NavigationButton from "@/components/common-components/NavigationButton";
import ImageModal from "@/components/common-components/ImageModal";
import { SEASON_DETAILS_VIEW_PAGE_URL } from "@/utils/urls";
import { SeasonImage, SeasonListCardProps } from "@/types/season-types";
import { hexToRgba } from "@/utils/functions";
import { ImageModalImage } from "@/types/common-components-types";
import {
  buttonVariants,
  cardVariants,
  contentVariants,
  imageVariants,
  itemVariants,
  overlayVariants,
  quickViewVariants,
  shineVariants,
  thumbnailVariants,
} from "@/app/animations/variants";
import { getMonthName, getSafeString } from "@/utils/commonFunctions";

const SeasonListCard: React.FC<SeasonListCardProps> = ({
  season,
  onImageClick,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const images = season?.seasonImages || [];
  const seasonName = getSafeString(season?.name, "Unnamed Season");
  const standardName = getSafeString(season?.standardName, "");
  const localName = getSafeString(season?.localName, "");
  const startMonth = season?.startMonth || 1;
  const endMonth = season?.endMonth || 12;
  const isPeak = season?.isPeak || false;
  const displayOrder = season?.displayOrder || 0;

  const handleViewDetails = () => {
    router.push(
      `${SEASON_DETAILS_VIEW_PAGE_URL}/${season.id}?name=${encodeURIComponent(seasonName)}`,
    );
  };

  const getModalImages = (): ImageModalImage[] => {
    if (!images.length) return [];
    return images.map((img: SeasonImage, idx: number) => ({
      url: img?.imageUrl || "",
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
    if (onImageClick) {
      onImageClick(index);
    } else {
      setModalImageIndex(index);
      setIsModalOpen(true);
    }
  };

  const currentImage =
    images[currentImageIndex]?.imageUrl || PLACE_HOLDER_IMAGE;
  const startMonthName = getMonthName(startMonth);
  const endMonthName = getMonthName(endMonth);

  if (!season || !season.id) return null;

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
                alt={seasonName}
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

              {/* Peak Season Badge */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute top-4 left-4"
              >
                {isPeak && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                    <TrendingUp className="w-3 h-3" />
                    Peak Season
                  </span>
                )}
              </motion.div>

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
                  {images.map((image: SeasonImage, index: number) => (
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
                        src={image?.imageUrl || PLACE_HOLDER_IMAGE}
                        alt={image?.name || `Thumbnail ${index + 1}`}
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
                  ))}
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
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-4">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <motion.h3
                  className="text-xl sm:text-2xl font-bold transition-colors duration-200 cursor-pointer"
                  style={{ color: theme.text }}
                  whileHover={{ color: theme.primary }}
                  onClick={handleViewDetails}
                >
                  {seasonName}
                </motion.h3>
                <div className="flex items-center gap-2">
                  <Hash
                    className="w-4 h-4"
                    style={{ color: theme.textSecondary }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    ID: {season.id}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Names Section */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 mb-6"
            >
              {standardName && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" style={{ color: theme.accent }} />
                  <div>
                    <div
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Standard Name
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      {standardName}
                    </div>
                  </div>
                </div>
              )}
              {localName && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" style={{ color: theme.success }} />
                  <div>
                    <div
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Local Name
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: theme.text }}
                    >
                      {localName}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Season Period */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between py-4 mb-6"
              style={{
                borderTop: `1px solid ${theme.border}`,
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: hexToRgba(theme.primary, 0.1) }}
                >
                  <Calendar
                    className="w-5 h-5"
                    style={{ color: theme.primary }}
                  />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Season Period
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    {startMonthName} - {endMonthName}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                  Display Order
                </div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  {displayOrder}
                </div>
              </div>
            </motion.div>

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

export default SeasonListCard;
