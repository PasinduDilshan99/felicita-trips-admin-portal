"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { TrendingDestination } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import ImageModal from "@/components/common-components/ImageModal";
import NavigationButton from "@/components/common-components/NavigationButton";
import CommonButton from "@/components/common-components/buttons/CommonButton";
import { DESTINATION_DETAILS_VIEW_PAGE_URL } from "@/utils/urls";
import { ImageModalImage } from "@/types/common-components-types";
import ConfirmDialog from "./ConfirmDialog";

interface TrendingDestinationsListProps {
  destinations: TrendingDestination[];
  onTerminate: (destinationId: number, destinationName: string) => void;
  terminatingId: number | null;
}

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_SMOOTH: [number, number, number, number] = [0.4, 0, 0.2, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

const imageVariants: Variants = {
  hidden: { scale: 1.08, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.12 },
  },
};

const contentItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT },
  },
};

const badgeVariants: Variants = {
  hidden: { scale: 0.75, opacity: 0, y: -6 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 18 },
  },
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE_OUT },
  },
  hover: {
    y: -3,
    transition: { duration: 0.18 },
  },
};

const categoryChipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: EASE_OUT, delay: i * 0.04 },
  }),
  hover: {
    scale: 1.06,
    y: -2,
    transition: { duration: 0.15 },
  },
  tap: { scale: 0.96, transition: { duration: 0.1 } },
};

const thumbnailVariants: Variants = {
  rest: { scale: 1, opacity: 0.65 },
  active: { scale: 1.08, opacity: 1 },
  hover: { scale: 1.04, opacity: 0.9, transition: { duration: 0.15 } },
};

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.15, ease: EASE_OUT } },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
};

const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: { duration: 0.75, repeat: Infinity, ease: "linear" },
  },
};

const expandVariants: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.35, ease: EASE_SMOOTH },
  },
};

/* ─── Component ──────────────────────────────────────────────────────────── */

const TrendingDestinationsList: React.FC<TrendingDestinationsListProps> = ({
  destinations,
  onTerminate,
  terminatingId,
}) => {
  const { theme } = useTheme();
  const router = useRouter();

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageModalImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<number, number>
  >({});
  const [expandedCategories, setExpandedCategories] = useState<
    Record<number, boolean>
  >({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<{
    id: number;
    name: string;
  } | null>(null);

  /* ── Helpers ── */

  const getModalImages = (
    destination: TrendingDestination,
  ): ImageModalImage[] =>
    destination.images.map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription || undefined,
      id: img.imageId,
    }));

  const handleImageClick = (
    destination: TrendingDestination,
    index: number,
  ) => {
    setSelectedImages(getModalImages(destination));
    setSelectedImageIndex(index);
    setImageModalOpen(true);
  };

  const handlePrevImage = (destinationId: number, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [destinationId]:
        prev[destinationId] === 0
          ? totalImages - 1
          : (prev[destinationId] || 0) - 1,
    }));
  };

  const handleNextImage = (destinationId: number, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [destinationId]: ((prev[destinationId] || 0) + 1) % totalImages,
    }));
  };

  const handleRemoveClick = (
    destinationId: number,
    destinationName: string,
  ) => {
    setPendingRemoval({ id: destinationId, name: destinationName });
    setConfirmDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    if (pendingRemoval) {
      onTerminate(pendingRemoval.id, pendingRemoval.name);
      setConfirmDialogOpen(false);
      setPendingRemoval(null);
    }
  };

  const handleCancelRemove = () => {
    setConfirmDialogOpen(false);
    setPendingRemoval(null);
  };

  const handleViewDestination = (destination: TrendingDestination) => {
    router.push(
      `${DESTINATION_DETAILS_VIEW_PAGE_URL}/${destination.destinationId}?name=${encodeURIComponent(destination.destinationName)}`,
    );
  };

  const handleViewCategory = (categoryId: number, categoryName: string) => {
    router.push(
      `${DESTINATION_DETAILS_VIEW_PAGE_URL}/${categoryId}?name=${categoryName}`,
    );
  };

  const toggleExpandedCategories = (destinationId: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [destinationId]: !prev[destinationId],
    }));
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <motion.span
            key={`full-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 320 }}
            className="text-amber-400 text-xs"
          >
            ★
          </motion.span>
        ))}
        {hasHalfStar && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-amber-400 text-xs"
          >
            ½
          </motion.span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-400 text-xs">
            ☆
          </span>
        ))}
      </div>
    );
  };

  /* ── Empty State ── */

  if (destinations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 rounded-2xl"
        style={{
          backgroundColor: hexToRgba(theme.border, 0.08),
          border: `1.5px dashed ${theme.border}`,
        }}
      >
        <motion.span
          className="text-5xl mb-4 block"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          🔥
        </motion.span>
        <h3
          className="text-lg font-semibold mb-1"
          style={{ color: theme.text }}
        >
          No Trending Destinations
        </h3>
        <p className="text-sm" style={{ color: theme.textSecondary }}>
          Add destinations to feature them here
        </p>
      </motion.div>
    );
  }

  /* ── Main Render ── */

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-5"
      >
        {destinations.map((destination) => {
          const currentIndex =
            currentImageIndex[destination.destinationId] || 0;
          const currentImage =
            destination.images[currentIndex]?.imageUrl || PLACE_HOLDER_IMAGE;
          const totalImages = destination.images.length;
          const isTerminating = terminatingId === destination.destinationId;
          const allCategories = destination.destinationCategoryDetailsDtos;
          const isExpanded = expandedCategories[destination.destinationId];
          const VISIBLE_CAT_COUNT = 4;
          const hasMoreCategories = allCategories.length > VISIBLE_CAT_COUNT;
          const visibleCategories = isExpanded
            ? allCategories
            : allCategories.slice(0, VISIBLE_CAT_COUNT);

          return (
            <motion.div
              key={destination.popularId}
              variants={cardVariants}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: `0 2px 12px -4px ${hexToRgba(theme.text, 0.06)}`,
              }}
              whileHover={{
                y: -3,
                boxShadow: `0 16px 40px -12px ${hexToRgba(theme.text, 0.12)}`,
                transition: { duration: 0.25, ease: EASE_OUT },
              }}
            >
              <div className="flex flex-col lg:flex-row">
                {/* ── Image Section ── */}
                <div className="lg:w-2/5 relative h-80 lg:h-auto overflow-hidden min-h-[280px]">
                  <motion.img
                    variants={imageVariants}
                    src={currentImage}
                    alt={destination.destinationName}
                    className="w-full h-full object-cover cursor-pointer absolute inset-0"
                    onClick={() => handleImageClick(destination, currentIndex)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                    }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
                    }}
                  />

                  {/* Popularity Badge */}
                  <motion.div
                    variants={badgeVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute top-3 left-3"
                  >
                    <div
                      className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-sm"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent || theme.primary})`,
                        color: "#fff",
                      }}
                    >
                      <motion.span
                        animate={{ rotate: [0, 12, -12, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                        className="text-sm"
                      >
                        🔥
                      </motion.span>
                      #{destination.popularity}
                    </div>
                  </motion.div>

                  {/* Rating Badge */}
                  <motion.div
                    variants={badgeVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.08 }}
                    className="absolute top-3 right-3"
                  >
                    <div className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-sm bg-black/60 text-white">
                      {getRatingStars(destination.rating)}
                      <span className="ml-0.5 font-bold">
                        {destination.rating}
                      </span>
                    </div>
                  </motion.div>

                  {/* Navigation Arrows */}
                  {totalImages > 1 && (
                    <>
                      <NavigationButton
                        direction="left"
                        onClick={() =>
                          handlePrevImage(
                            destination.destinationId,
                            totalImages,
                          )
                        }
                        size="sm"
                      />
                      <NavigationButton
                        direction="right"
                        onClick={() =>
                          handleNextImage(
                            destination.destinationId,
                            totalImages,
                          )
                        }
                        size="sm"
                      />
                    </>
                  )}

                  {/* Image Counter */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="absolute bottom-16 right-3"
                  >
                    <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white rounded-md text-xs font-medium">
                      {currentIndex + 1} / {totalImages}
                    </span>
                  </motion.div>

                  {/* Thumbnails */}
                  {totalImages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18 }}
                      className="absolute bottom-0 left-0 right-0 p-3 flex gap-1.5 overflow-x-auto justify-center"
                    >
                      {destination.images.slice(0, 5).map((img, idx) => (
                        <motion.button
                          key={img.imageId}
                          variants={thumbnailVariants}
                          initial="rest"
                          animate={currentIndex === idx ? "active" : "rest"}
                          whileHover="hover"
                          onClick={() =>
                            setCurrentImageIndex((prev) => ({
                              ...prev,
                              [destination.destinationId]: idx,
                            }))
                          }
                          className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
                          style={{
                            outline:
                              currentIndex === idx
                                ? `2px solid ${theme.primary}`
                                : "2px solid transparent",
                            outlineOffset: "2px",
                          }}
                        >
                          <img
                            src={img.imageUrl}
                            alt={img.imageName}
                            className="w-11 h-11 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                PLACE_HOLDER_IMAGE;
                            }}
                          />
                        </motion.button>
                      ))}
                      {totalImages > 5 && (
                        <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-black/50 flex items-center justify-center text-white text-xs font-semibold backdrop-blur-sm">
                          +{totalImages - 5}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* ── Content Section ── */}
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="lg:w-3/5 p-5 sm:p-6 flex flex-col justify-between"
                >
                  {/* Header row */}
                  <div>
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                      <div className="flex-1 min-w-0">
                        <motion.h3
                          variants={contentItemVariants}
                          className="text-lg sm:text-xl font-bold mb-1 truncate"
                          style={{ color: theme.text }}
                        >
                          {destination.destinationName}
                        </motion.h3>
                        <motion.div
                          variants={contentItemVariants}
                          className="flex items-center gap-1.5 text-sm"
                          style={{ color: theme.textSecondary }}
                        >
                          <span className="text-base">📍</span>
                          <span className="truncate">
                            {destination.location}
                          </span>
                        </motion.div>
                      </div>

                      {/* Action Buttons */}
                      <motion.div
                        variants={contentItemVariants}
                        className="flex items-center gap-2 flex-shrink-0 flex-wrap"
                      >
                        {/* View Details Button */}
                        <CommonButton
                          variant="outline"
                          size="sm"
                          icon={
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          }
                          onClick={() => handleViewDestination(destination)}
                        >
                          View
                        </CommonButton>

                        {/* Remove Button */}
                        <CommonButton
                          variant="error"
                          size="sm"
                          icon={
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          }
                          loading={isTerminating}
                          onClick={() =>
                            handleRemoveClick(
                              destination.destinationId,
                              destination.destinationName,
                            )
                          }
                        >
                          {isTerminating ? "Removing..." : "Remove"}
                        </CommonButton>
                      </motion.div>
                    </div>

                    {/* Description */}
                    <motion.p
                      variants={contentItemVariants}
                      className="text-sm mt-3 mb-4 leading-relaxed"
                      style={{ color: theme.textSecondary }}
                    >
                      {destination.destinationDescription}
                    </motion.p>
                  </div>

                  {/* Stats */}
                  <motion.div
                    variants={contentItemVariants}
                    className="grid grid-cols-3 gap-3 py-4 rounded-xl"
                    style={{
                      borderTop: `1px solid ${theme.border}`,
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    {[
                      {
                        icon: "📷",
                        label: "Images",
                        value: destination.images.length,
                      },
                      {
                        icon: "🎯",
                        label: "Activities",
                        value: destination.activities.length,
                      },
                      {
                        icon: "📅",
                        label: "Added",
                        value: formatDate(destination.popularCreatedAt),
                      },
                    ].map((stat) => (
                      <motion.div
                        key={stat.label}
                        variants={statCardVariants}
                        whileHover="hover"
                        className="text-center px-1"
                      >
                        <div className="text-xl mb-0.5">{stat.icon}</div>
                        <div
                          className="text-xs mb-0.5"
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
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Categories */}
                  {allCategories.length > 0 && (
                    <motion.div variants={contentItemVariants} className="mt-4">
                      {/* Always-visible chips */}
                      <div className="flex flex-wrap gap-2">
                        <AnimatePresence mode="popLayout">
                          {visibleCategories.map((cat, idx) => (
                            <motion.button
                              key={cat.id}
                              layout
                              variants={categoryChipVariants}
                              initial="hidden"
                              animate="visible"
                              exit={{
                                opacity: 0,
                                scale: 0.85,
                                y: 4,
                                transition: { duration: 0.15 },
                              }}
                              whileHover="hover"
                              whileTap="tap"
                              custom={idx}
                              onClick={() =>
                                handleViewCategory(cat.id, cat.name)
                              }
                              className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1"
                              style={{
                                backgroundColor: hexToRgba(theme.primary, 0.08),
                                color: theme.primary,
                                border: `1px solid ${hexToRgba(theme.primary, 0.18)}`,
                              }}
                            >
                              <svg
                                className="w-3 h-3 opacity-60"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                              {cat.name}
                            </motion.button>
                          ))}
                        </AnimatePresence>

                        {/* +N / Show less toggle */}
                        {hasMoreCategories && (
                          <motion.button
                            layout
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() =>
                              toggleExpandedCategories(
                                destination.destinationId,
                              )
                            }
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 transition-all duration-200"
                            style={{
                              backgroundColor: hexToRgba(
                                theme.textSecondary,
                                0.08,
                              ),
                              color: theme.textSecondary,
                              border: `1px solid ${hexToRgba(theme.textSecondary, 0.15)}`,
                            }}
                          >
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.25, ease: EASE_SMOOTH }}
                              className="inline-block"
                            >
                              {isExpanded ? (
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              )}
                            </motion.span>
                            {isExpanded
                              ? "Show less"
                              : `+${allCategories.length - VISIBLE_CAT_COUNT} more`}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        images={selectedImages}
        initialIndex={selectedImageIndex}
        onClose={() => setImageModalOpen(false)}
        showNavigation={true}
        showDownload={true}
        showZoom={true}
        allowKeyboardNavigation={true}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title="Remove Trending Destination"
        message={`Are you sure you want to remove "${pendingRemoval?.name}" from trending destinations? This action can be undone later.`}
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default TrendingDestinationsList;
