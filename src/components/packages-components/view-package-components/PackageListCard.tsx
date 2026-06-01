"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Calendar,
  Eye,
  ArrowRight,
  Star,
  Check,
  Users,
  Percent,
  Gift,
  Tag,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import NavigationButton from "@/components/common-components/NavigationButton";
import ImageModal from "@/components/common-components/ImageModal";
import {
  PackageImage,
  Feature,
  PackageListCardProps,
} from "@/types/package-types";
import { hexToRgba } from "@/utils/functions";
import { PACKAGE_TYPES_PAGE_URL } from "@/utils/urls";
import {
  formatDate,
  formatPrice,
  getSafeString,
} from "@/utils/commonFunctions";
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

const PackageListCard: React.FC<PackageListCardProps> = ({
  packageData,
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

  const images = packageData?.images || [];
  const features = packageData?.features || [];
  const packageId = packageData?.packageId;
  const packageName = getSafeString(
    packageData?.packageName,
    "Unnamed Package",
  );
  const description = getSafeString(
    packageData?.packageDescription,
    "No description available",
  );
  const packageTypeName = getSafeString(
    packageData?.packageTypeName,
    "Uncategorized",
  );
  const packageStatus = packageData?.packageStatus || "INACTIVE";
  const totalPrice = packageData?.totalPrice || 0;
  const pricePerPerson = packageData?.pricePerPerson || 0;
  const discountPercentage = packageData?.discountPercentage || 0;
  const minPersonCount = packageData?.minPersonCount || 1;
  const maxPersonCount = packageData?.maxPersonCount || 10;
  const duration = packageData?.duration || 0;
  const startLocation = getSafeString(packageData?.startLocation, "N/A");
  const endLocation = getSafeString(packageData?.endLocation, "N/A");
  const startDate = packageData?.startDate;
  const endDate = packageData?.endDate;
  const tourName = getSafeString(packageData?.tourName, "");
  const color = packageData?.color || theme.primary;

  const handleTypeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(
      `${PACKAGE_TYPES_PAGE_URL}?name=${encodeURIComponent(packageTypeName)}`,
    );
  };

  const getModalImages = (): ImageModalImage[] => {
    if (!images.length) return [];
    return images.map((img: PackageImage, idx: number) => ({
      url: img?.imageUrl || "",
      name: img?.imageName || `Image ${idx + 1}`,
      description: img?.imageDescription || "",
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

  const handleViewDetails = () => {
    router.push(
      `${PACKAGE_TYPES_PAGE_URL}/${packageId}?name=${encodeURIComponent(packageName)}`,
    );
  };

  const currentImage =
    images[currentImageIndex]?.imageUrl || PLACE_HOLDER_IMAGE;
  const hasDiscount = discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? totalPrice * (1 - discountPercentage / 100)
    : totalPrice;

  if (!packageData || !packageData.packageId) return null;

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
                alt={packageName}
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
                    packageStatus === "ACTIVE"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                  }`}
                >
                  {packageStatus === "ACTIVE" ? (
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

              {/* Discount Badge */}
              {hasDiscount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-4"
                >
                  <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                    <Percent className="w-3 h-3" />
                    {discountPercentage}% OFF
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
                  {images.map((image: PackageImage, index: number) => (
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
                        alt={image?.imageName || `Thumbnail ${index + 1}`}
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
                  {packageName}
                </motion.h3>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" style={{ color: theme.success }} />
                  <span
                    className="text-sm font-medium cursor-pointer"
                    style={{ color: theme.success }}
                    onClick={handleTypeClick}
                  >
                    {packageTypeName}
                  </span>
                </div>
              </div>
              {tourName && (
                <div className="flex items-center gap-2 mt-2">
                  <Gift
                    className="w-4 h-4"
                    style={{ color: theme.textSecondary }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    Tour: {tourName}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mb-6 leading-relaxed pl-4 py-2 rounded-r-lg line-clamp-2 text-sm"
              style={{
                color: theme.textSecondary,
                borderLeft: `4px solid ${color}`,
                background: `linear-gradient(90deg, ${hexToRgba(color, 0.05)}, transparent)`,
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
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ background: hexToRgba(theme.accent, 0.1) }}
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
                    {duration} days
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ background: hexToRgba(theme.primary, 0.1) }}
                >
                  <Users className="w-5 h-5" style={{ color: theme.primary }} />
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
                    {minPersonCount}-{maxPersonCount}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ background: hexToRgba(theme.success, 0.1) }}
                >
                  <CreditCard
                    className="w-5 h-5"
                    style={{ color: theme.success }}
                  />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Per Person
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.success }}
                  >
                    {formatPrice(pricePerPerson)}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ background: hexToRgba(theme.warning, 0.1) }}
                >
                  <Calendar
                    className="w-5 h-5"
                    style={{ color: theme.warning }}
                  />
                </div>
                <div>
                  <div
                    className="text-xs"
                    style={{ color: theme.textSecondary }}
                  >
                    Valid
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: theme.text }}
                  >
                    {startDate && endDate ? `${formatDate(startDate)}` : "N/A"}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div variants={itemVariants} className="mb-4">
              <div className="flex items-center gap-2">
                <MapPin
                  className="w-4 h-4"
                  style={{ color: theme.textSecondary }}
                />
                <span className="text-sm" style={{ color: theme.text }}>
                  {startLocation} → {endLocation}
                </span>
              </div>
            </motion.div>

            {/* Features */}
            {features.length > 0 && (
              <motion.div variants={itemVariants} className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {features.slice(0, 4).map((feature: Feature) => (
                    <span
                      key={feature.featureId}
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{
                        background: hexToRgba(
                          feature.color || theme.primary,
                          0.1,
                        ),
                        color: feature.color || theme.primary,
                        border: `1px solid ${hexToRgba(feature.color || theme.primary, 0.2)}`,
                      }}
                    >
                      {feature.featureName}: {feature.featureValue}
                    </span>
                  ))}
                  {features.length > 4 && (
                    <span
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      +{features.length - 4} more
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Price and View Button */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4"
            >
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>
                  Total Package Price
                </div>
                {hasDiscount ? (
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xl line-through"
                      style={{ color: theme.textSecondary }}
                    >
                      {formatPrice(totalPrice)}
                    </span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: theme.success }}
                    >
                      {formatPrice(discountedPrice)}
                    </span>
                  </div>
                ) : (
                  <div
                    className="text-2xl font-bold"
                    style={{ color: theme.success }}
                  >
                    {formatPrice(totalPrice)}
                  </div>
                )}
              </div>

              <motion.button
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleViewDetails}
                className="relative cursor-pointer font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap w-full sm:w-auto"
                style={{
                  background: `linear-gradient(135deg, ${color} 0%, ${theme.accent || color} 100%)`,
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

export default PackageListCard;
