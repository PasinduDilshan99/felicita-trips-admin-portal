"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import CommonSearch, {
  SearchItem,
} from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import CommonLoading from "@/components/common-components/CommonLoading";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import { SingleDestinationResponse } from "@/types/destination-types";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import {
  DESTINATION_CATEGORY_VIEW_DETAILS_URL,
  ACTIVITY_DETAILS_VIEW_PAGE_URL,
  SEASON_DETAILS_VIEW_PAGE_URL,
  SEASONS_VIEW_PAGE_URL,
} from "@/utils/urls";
import CommonButton from "@/components/common-components/buttons/CommonButton";

interface DestinationSearchItem extends SearchItem {
  id: number;
  name: string;
}

interface AddTrendingDestinationFormProps {
  searchItems: DestinationSearchItem[];
  loadingDestinations: boolean;
  selectedSearchItem: DestinationSearchItem | null;
  selectedDestinationDetails: SingleDestinationResponse | null;
  loadingDetails: boolean;
  adding: boolean;
  onSelectDestination: (item: DestinationSearchItem) => void;
  onClearSelection: () => void;
  onAdd: () => void;
  onCancel: () => void;
  renderDestinationItem: (
    item: DestinationSearchItem,
    searchTerm: string,
    isActive: boolean,
  ) => React.ReactNode;
}

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.1, duration: 0.3, ease: EASE_OUT },
  },
};

const previewVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const imageVariants: Variants = {
  hidden: { scale: 1.05, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

const detailVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const detailItemVariants: Variants = {
  hidden: { opacity: 0, x: -5 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.15, ease: EASE_OUT },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/* ─── Helper: format duration ─────────────────────────────────────────────── */
const formatDuration = (hours: number) => {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours % 1 === 0) return `${hours}h`;
  return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
};

/* ─── Sub-component: Image Gallery ───────────────────────────────────────── */
const ImageGallery: React.FC<{
  images: SingleDestinationResponse["images"];
  altBase: string;
  theme: ReturnType<typeof useTheme>["theme"];
  onImageClick: (index: number) => void;
}> = ({ images, altBase, theme, onImageClick }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) return null;

  const handleMainImageClick = () => {
    onImageClick(activeIdx);
  };

  const handleThumbnailClick = (idx: number) => {
    setActiveIdx(idx);
    onImageClick(idx);
  };

  return (
    <div>
      {/* Main image */}
      <div
        className="relative h-48 sm:h-56 overflow-hidden cursor-pointer"
        onClick={handleMainImageClick}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.2 } }}
            src={images[activeIdx]?.imageUrl || PLACE_HOLDER_IMAGE}
            alt={images[activeIdx]?.imageName || altBase}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Image counter */}
        {images.length > 1 && (
          <div
            className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#fff" }}
          >
            {activeIdx + 1} / {images.length}
          </div>
        )}

        {/* Image description overlay */}
        {images[activeIdx]?.imageDescription && (
          <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
            <p className="text-white text-xs line-clamp-1 opacity-80">
              {images[activeIdx].imageDescription}
            </p>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex gap-1.5 p-2 overflow-x-auto"
          style={{ backgroundColor: hexToRgba(theme.background, 0.5) }}
        >
          {images.map((img, idx) => (
            <button
              key={img.imageId}
              onClick={() => handleThumbnailClick(idx)}
              className="flex-shrink-0 w-12 h-9 rounded overflow-hidden transition-all duration-200 cursor-pointer"
              style={{
                outline:
                  idx === activeIdx
                    ? `2px solid ${theme.primary}`
                    : "2px solid transparent",
                opacity: idx === activeIdx ? 1 : 0.6,
              }}
            >
              <img
                src={img.imageUrl || PLACE_HOLDER_IMAGE}
                alt={img.imageName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Sub-component: Activity Card ───────────────────────────────────────── */
const ActivityCard: React.FC<{
  activity: SingleDestinationResponse["activities"][number];
  theme: ReturnType<typeof useTheme>["theme"];
}> = ({ activity, theme }) => {
  const router = useRouter();
  const formatTime = (time?: string) => {
    if (!time) return "";
    return time.split(".")[0].slice(0, 5);
  };

  const handleViewDetails = () => {
    router.push(
      `${ACTIVITY_DETAILS_VIEW_PAGE_URL}/${activity.activityId}?name=${encodeURIComponent(activity.activityName)}`,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg p-3 space-y-2"
      style={{
        backgroundColor: hexToRgba(theme.primary, 0.04),
        border: `1px solid ${hexToRgba(theme.primary, 0.12)}`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className="text-sm font-semibold leading-tight"
          style={{ color: theme.text }}
        >
          {activity.activityName}
        </p>
        <div className="flex gap-3 justify-center items-center">
          <span
            className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.12),
              color: theme.primary,
            }}
          >
            {formatDuration(activity.durationHours)}
          </span>
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
            onClick={handleViewDetails}
          >
            View
          </CommonButton>
        </div>
      </div>{" "}
      <div
        className="flex gap-3 pt-1 border-t"
        style={{ borderColor: hexToRgba(theme.border, 0.5) }}
      ></div>
      {activity.activityDescription && (
        <p
          className="text-xs line-clamp-2 leading-relaxed"
          style={{ color: theme.textSecondary }}
        >
          {activity.activityDescription}
        </p>
      )}
      <div
        className="flex flex-wrap gap-2 text-xs"
        style={{ color: theme.textSecondary }}
      >
        <span className="flex items-center gap-1">
          <span>👥</span>
          {!activity.maxParticipate || activity.maxParticipate === 0 ? (
            <span>Any pax</span>
          ) : (
            <span>
              {activity.minParticipate}–{activity.maxParticipate} pax
            </span>
          )}
        </span>
        {activity.season && (
          <button
            type="button"
            onClick={() =>
              router.push(`${SEASONS_VIEW_PAGE_URL}?name=${activity.season}`)
            }
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer hover:scale-105"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.12),
              color: theme.primary,
              border: `1px solid ${hexToRgba(theme.primary, 0.25)}`,
            }}
          >
            <span>🌤</span>
            {activity.season}
          </button>
        )}
        {activity.availableFrom && activity.availableTo && (
          <span className="flex items-center gap-1">
            <span>🕐</span>
            {formatTime(activity.availableFrom)} –{" "}
            {formatTime(activity.availableTo)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────────────── */

const AddTrendingDestinationForm: React.FC<AddTrendingDestinationFormProps> = ({
  searchItems,
  loadingDestinations,
  selectedSearchItem,
  selectedDestinationDetails,
  loadingDetails,
  adding,
  onSelectDestination,
  onClearSelection,
  onAdd,
  onCancel,
  renderDestinationItem,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const det = selectedDestinationDetails;
  const visibleActivities = det
    ? showAllActivities
      ? det.activities
      : det.activities.slice(0, 2)
    : [];

  const primaryCategories = det?.destinationCategoryDetailsDtos.filter(
    (c) => c.isPrimary,
  );
  const otherCategories = det?.destinationCategoryDetailsDtos.filter(
    (c) => !c.isPrimary,
  );

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!det) return [];
    return det.images.map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription || undefined,
      id: img.imageId,
    }));
  };

  const handleImageClick = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    router.push(
      `${DESTINATION_CATEGORY_VIEW_DETAILS_URL}/${categoryId}?name=${encodeURIComponent(categoryName)}`,
    );
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-2xl w-full mb-8"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }}
      >
        {/* Color accent bar */}
        <div className="rounded-t-2xl overflow-hidden">
          <motion.div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent}, transparent)`,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          />
        </div>

        <div className="p-5 sm:p-6">
          {/* Header */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-3 mb-5"
          >
            <span
              className="text-2xl sm:text-3xl"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
            >
              ➕
            </span>
            <div>
              <h2
                className="text-lg sm:text-xl font-semibold"
                style={{ color: theme.text }}
              >
                Add New Trending Destination
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                Search and select a destination to feature
              </p>
            </div>
          </motion.div>

          {/* Search Section */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: theme.textSecondary }}
            >
              Search Destination
            </label>
            <CommonSearch<DestinationSearchItem>
              items={searchItems}
              loading={loadingDestinations}
              selectedItem={selectedSearchItem}
              onSelectItem={onSelectDestination}
              onClearSelection={onClearSelection}
              placeholder="Search destinations..."
              title="Destinations"
              variant="primary"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
              renderItem={renderDestinationItem}
            />
          </div>

          {/* Selected Destination Bar */}
          <AnimatePresence>
            {selectedSearchItem && (
              <motion.div
                variants={previewVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <SelectedItemBar
                  item={
                    selectedSearchItem
                      ? {
                          id: selectedSearchItem.id,
                          name: selectedSearchItem.name,
                        }
                      : null
                  }
                  onClear={onClearSelection}
                  variant="primary"
                  title="Selected Destination"
                  showId={true}
                  clearButtonText="Change"
                  size="md"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          <AnimatePresence>
            {loadingDetails && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6"
              >
                <CommonLoading
                  message="Loading destination details..."
                  size="sm"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Destination Details Preview ─────────────────────────────── */}
          <AnimatePresence>
            {det && !loadingDetails && (
              <motion.div
                variants={previewVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-6 rounded-xl overflow-hidden"
                style={{
                  border: `1px solid ${theme.border}`,
                  backgroundColor: hexToRgba(theme.background, 0.3),
                }}
              >
                {/* ── Image Gallery ── */}
                <div className="relative">
                  <ImageGallery
                    images={det.images}
                    altBase={det.destinationName}
                    theme={theme}
                    onImageClick={handleImageClick}
                  />

                  {/* Status badge */}
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                    className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg z-10"
                    style={{
                      backgroundColor:
                        det.statusName === "ACTIVE"
                          ? theme.success
                          : theme.error,
                      color: "#fff",
                    }}
                  >
                    {det.statusName === "ACTIVE" ? "Active" : "Inactive"}
                  </motion.span>
                </div>

                {/* ── Core Details ── */}
                <motion.div
                  variants={detailVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-4 sm:p-5 space-y-4"
                >
                  {/* Name & location */}
                  <div>
                    <motion.h3
                      variants={detailItemVariants}
                      className="text-lg sm:text-xl font-bold mb-1"
                      style={{ color: theme.text }}
                    >
                      {det.destinationName}
                    </motion.h3>

                    <motion.div
                      variants={detailItemVariants}
                      className="flex items-center gap-1.5 text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      <span>📍</span>
                      <span>{det.location}</span>
                    </motion.div>
                  </div>

                  {/* Description */}
                  <motion.p
                    variants={detailItemVariants}
                    className="text-sm leading-relaxed"
                    style={{ color: theme.textSecondary }}
                  >
                    {det.destinationDescription}
                  </motion.p>

                  {/* ── Quick stats row ── */}
                  <motion.div
                    variants={detailItemVariants}
                    className="grid grid-cols-3 gap-2"
                  >
                    {[
                      { icon: "📷", label: "Images", value: det.images.length },
                      {
                        icon: "🎯",
                        label: "Activities",
                        value: det.activities.length,
                      },
                      {
                        icon: "🏷",
                        label: "Categories",
                        value: det.destinationCategoryDetailsDtos.length,
                      },
                    ].map(({ icon, label, value }) => (
                      <div
                        key={label}
                        className="rounded-lg p-2.5 text-center"
                        style={{
                          backgroundColor: hexToRgba(theme.primary, 0.06),
                          border: `1px solid ${hexToRgba(theme.primary, 0.1)}`,
                        }}
                      >
                        <p className="text-base">{icon}</p>
                        <p
                          className="text-lg font-bold leading-none mt-0.5"
                          style={{ color: theme.text }}
                        >
                          {value}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: theme.textSecondary }}
                        >
                          {label}
                        </p>
                      </div>
                    ))}
                  </motion.div>

                  {/* ── Coordinates ── */}
                  <motion.div
                    variants={detailItemVariants}
                    className="flex gap-3"
                  >
                    {[
                      { label: "Latitude", value: det.latitude.toFixed(5) },
                      { label: "Longitude", value: det.longitude.toFixed(5) },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex-1 rounded-lg px-3 py-2"
                        style={{
                          backgroundColor: hexToRgba(theme.border, 0.4),
                          border: `1px solid ${hexToRgba(theme.border, 0.6)}`,
                        }}
                      >
                        <p
                          className="text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          {label}
                        </p>
                        <p
                          className="text-sm font-mono font-medium mt-0.5"
                          style={{ color: theme.text }}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </motion.div>

                  {/* ── Extra pricing ── */}
                  {(det.extraPrice !== undefined || det.extraPriceNote) && (
                    <motion.div
                      variants={detailItemVariants}
                      className="rounded-lg px-4 py-3 flex items-start gap-3"
                      style={{
                        backgroundColor: hexToRgba(theme.accent, 0.08),
                        border: `1px solid ${hexToRgba(theme.accent, 0.2)}`,
                      }}
                    >
                      <span className="text-lg">💰</span>
                      <div>
                        {det.extraPrice !== undefined && (
                          <p
                            className="text-sm font-semibold"
                            style={{ color: theme.text }}
                          >
                            Extra Price: ${det.extraPrice}
                          </p>
                        )}
                        {det.extraPriceNote && (
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: theme.textSecondary }}
                          >
                            {det.extraPriceNote}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Categories (Clickable) ── */}
                  {det.destinationCategoryDetailsDtos.length > 0 && (
                    <motion.div variants={detailItemVariants}>
                      <p
                        className="text-xs font-semibold uppercase tracking-wide mb-2"
                        style={{ color: theme.textSecondary }}
                      >
                        Categories
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {primaryCategories &&
                          primaryCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() =>
                                handleCategoryClick(cat.id, cat.name)
                              }
                              title={cat.description}
                              className="text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-all duration-200 hover:scale-105"
                              style={{
                                backgroundColor: hexToRgba(theme.primary, 0.14),
                                color: theme.primary,
                                border: `1px solid ${hexToRgba(theme.primary, 0.25)}`,
                              }}
                            >
                              ★ {cat.name}
                            </button>
                          ))}
                        {otherCategories &&
                          otherCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() =>
                                handleCategoryClick(cat.id, cat.name)
                              }
                              title={cat.description}
                              className="text-xs px-2.5 py-1 rounded-full cursor-pointer transition-all duration-200 hover:scale-105"
                              style={{
                                backgroundColor: hexToRgba(theme.border, 0.5),
                                color: theme.textSecondary,
                              }}
                            >
                              {cat.name}
                            </button>
                          ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── Activities ── */}
                  {det.activities.length > 0 && (
                    <motion.div variants={detailItemVariants}>
                      <p
                        className="text-xs font-semibold uppercase tracking-wide mb-2"
                        style={{ color: theme.textSecondary }}
                      >
                        Activities
                      </p>
                      <div className="space-y-2">
                        <AnimatePresence initial={false}>
                          {visibleActivities.map((activity) => (
                            <ActivityCard
                              key={activity.activityId}
                              activity={activity}
                              theme={theme}
                            />
                          ))}
                        </AnimatePresence>
                      </div>

                      {det.activities.length > 2 && (
                        <button
                          onClick={() => setShowAllActivities((p) => !p)}
                          className="mt-2 w-full text-xs py-2 rounded-lg font-medium transition-colors duration-150 cursor-pointer"
                          style={{
                            color: theme.primary,
                            backgroundColor: hexToRgba(theme.primary, 0.06),
                            border: `1px solid ${hexToRgba(theme.primary, 0.12)}`,
                          }}
                        >
                          {showAllActivities
                            ? "Show less"
                            : `Show ${det.activities.length - 2} more activities`}
                        </button>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Action Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex gap-3 mt-6 pt-4 border-t"
            style={{ borderColor: theme.border }}
          >
            <button
              onClick={onCancel}
              disabled={adding}
              className="flex-1 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                border: `1.5px solid ${theme.border}`,
                color: theme.textSecondary,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                if (!adding) {
                  e.currentTarget.style.backgroundColor = hexToRgba(
                    theme.primary,
                    0.05,
                  );
                  e.currentTarget.style.borderColor = theme.primary;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = theme.border;
              }}
            >
              Cancel
            </button>

            <button
              onClick={onAdd}
              disabled={!det || adding}
              className="flex-1 px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                color: "#fff",
                boxShadow:
                  det && !adding
                    ? `0 4px 12px ${hexToRgba(theme.primary, 0.3)}`
                    : "none",
              }}
            >
              {adding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <span className="text-base">➕</span>
                  <span>Add to Trending</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Image Modal */}
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
    </>
  );
};

export default AddTrendingDestinationForm;
