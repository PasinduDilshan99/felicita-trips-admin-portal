"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { SingleDestinationResponse } from "@/types/destination-types";
import { DestinationCategory } from "@/types/common-types";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Tag,
  Image as ImageIcon,
  Activity,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN: [number, number, number, number] = [0.42, 0, 1, 1];

const overlayVariants: Variants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(8px)",
    transition: { duration: 0.2, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.18, ease: EASE_IN },
  },
};

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: EASE_IN,
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 16,
    transition: {
      duration: 0.28,
      ease: EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      duration: 0.22,
      ease: EASE_IN,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -5 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
  hover: {
    y: -2,
    transition: { duration: 0.15 },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

const loadingIconVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

interface UpdateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  changedFields: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  originalDestination: SingleDestinationResponse;
  editedDestination: SingleDestinationResponse;
  removedImages: number[];
  newImages: any[];
  removedActivities: number[];
  newActivities: any[];
  removedCategoryIds: number[];
  addedCategoryIds: number[];
  availableCategories?: DestinationCategory[];
}

const UpdateConfirmationModal: React.FC<UpdateConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  changedFields,
  originalDestination,
  editedDestination,
  removedImages,
  newImages,
  removedActivities,
  newActivities,
  removedCategoryIds,
  addedCategoryIds,
  availableCategories = [],
}) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "fields",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const isSectionExpanded = (section: string) =>
    expandedSections.includes(section);

  // Helper to get category name by ID
  const getCategoryName = (categoryId: number): string => {
    const category = availableCategories.find(
      (cat) => cat.destinationCategoryId === categoryId,
    );
    return category
      ? category.destinationCategoryName
      : `Category ID: ${categoryId}`;
  };

  // Helper to get category color by ID
  const getCategoryColor = (categoryId: number): string => {
    const category = availableCategories.find(
      (cat) => cat.destinationCategoryId === categoryId,
    );
    return category?.destinationCategoryColor || theme.primary;
  };

  // Helper to format value for display
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "Not set";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") {
      // Check if it might be a price field
      if (value > 0 && value < 1000000) {
        return formatPrice(value);
      }
      return value.toString();
    }
    if (typeof value === "string") return value;
    if (Array.isArray(value))
      return value.length > 0 ? value.join(", ") : "None";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const totalChanges =
    changedFields.length +
    removedCategoryIds.length +
    addedCategoryIds.length +
    removedImages.length +
    newImages.length +
    removedActivities.length +
    newActivities.length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Only blur */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 cursor-pointer"
            style={{
              backdropFilter: "blur(0px)",
              backgroundColor: "transparent",
            }}
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div className="p-4 sm:p-6 md:p-8">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="flex items-center gap-3 sm:gap-4 mb-6"
                >
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                      boxShadow: `0 4px 14px ${hexToRgba(theme.primary, 0.3)}`,
                    }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: theme.text }}
                    >
                      Confirm Destination Update
                    </h3>
                    <p
                      className="text-xs sm:text-sm mt-0.5 sm:mt-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Review all changes before confirming
                    </p>
                  </div>
                </motion.div>

                {/* Summary Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                  className="mb-6 p-4 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.08)}, ${hexToRgba(theme.accent, 0.08)})`,
                    border: `1px solid ${hexToRgba(theme.primary, 0.15)}`,
                  }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    <motion.div
                      variants={statCardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <div
                        className="text-xs sm:text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        Total Changes
                      </div>
                      <div
                        className="text-lg sm:text-xl font-bold"
                        style={{ color: theme.text }}
                      >
                        {totalChanges}
                      </div>
                    </motion.div>
                    <motion.div
                      variants={statCardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <div
                        className="text-xs sm:text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        Field Changes
                      </div>
                      <div
                        className="text-lg sm:text-xl font-bold"
                        style={{ color: theme.primary }}
                      >
                        {changedFields.length}
                      </div>
                    </motion.div>
                    <motion.div
                      variants={statCardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <div
                        className="text-xs sm:text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        Category Changes
                      </div>
                      <div
                        className="text-lg sm:text-xl font-bold"
                        style={{ color: theme.success }}
                      >
                        {removedCategoryIds.length + addedCategoryIds.length}
                      </div>
                    </motion.div>
                    <motion.div
                      variants={statCardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <div
                        className="text-xs sm:text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        Images to Remove
                      </div>
                      <div
                        className="text-lg sm:text-xl font-bold"
                        style={{ color: theme.error }}
                      >
                        {removedImages.length}
                      </div>
                    </motion.div>
                    <motion.div
                      variants={statCardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                    >
                      <div
                        className="text-xs sm:text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        New Items
                      </div>
                      <div
                        className="text-lg sm:text-xl font-bold"
                        style={{ color: theme.accent }}
                      >
                        {newImages.length + newActivities.length}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Field Changes */}
                {changedFields.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <motion.button
                      onClick={() => toggleSection("fields")}
                      className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${hexToRgba(theme.textSecondary, 0.05)}, ${hexToRgba(theme.textSecondary, 0.1)})`,
                      }}
                      whileHover={{ opacity: 0.85 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-2">
                        <Tag
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: theme.textSecondary }}
                        />
                        <h4
                          className="text-base sm:text-lg font-semibold"
                          style={{ color: theme.text }}
                        >
                          Field Changes ({changedFields.length})
                        </h4>
                      </div>
                      <motion.div
                        animate={{
                          rotate: isSectionExpanded("fields") ? 180 : 0,
                        }}
                        transition={{ duration: 0.25 }}
                      >
                        <ChevronDown
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: theme.textSecondary }}
                        />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {isSectionExpanded("fields") && (
                        <motion.div
                          variants={sectionVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl overflow-hidden"
                          style={{ border: `1px solid ${theme.border}` }}
                        >
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px]">
                              <thead>
                                <tr
                                  className="border-b"
                                  style={{ borderColor: theme.border }}
                                >
                                  <th
                                    className="text-left py-2 text-xs sm:text-sm font-medium"
                                    style={{ color: theme.textSecondary }}
                                  >
                                    Field
                                  </th>
                                  <th
                                    className="text-left py-2 text-xs sm:text-sm font-medium"
                                    style={{ color: theme.textSecondary }}
                                  >
                                    Old Value
                                  </th>
                                  <th
                                    className="text-left py-2 text-xs sm:text-sm font-medium"
                                    style={{ color: theme.textSecondary }}
                                  >
                                    New Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {changedFields.map((change, index) => (
                                  <motion.tr
                                    key={index}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.02 }}
                                    className="border-b last:border-b-0"
                                    style={{ borderColor: theme.border }}
                                  >
                                    <td
                                      className="py-2 sm:py-3 text-xs sm:text-sm font-medium"
                                      style={{ color: theme.text }}
                                    >
                                      {change.field}
                                    </td>
                                    <td
                                      className="py-2 sm:py-3 text-xs sm:text-sm"
                                      style={{ color: theme.textSecondary }}
                                    >
                                      {formatValue(change.oldValue)}
                                    </td>
                                    <td
                                      className="py-2 sm:py-3 text-xs sm:text-sm font-medium"
                                      style={{ color: theme.primary }}
                                    >
                                      {formatValue(change.newValue)}
                                    </td>
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Category Changes */}
                {(removedCategoryIds.length > 0 ||
                  addedCategoryIds.length > 0) && (
                  <div className="mb-4 sm:mb-6">
                    <motion.button
                      onClick={() => toggleSection("categories")}
                      className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})`,
                      }}
                      whileHover={{ opacity: 0.85 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-2">
                        <Tag
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: theme.success }}
                        />
                        <h4
                          className="text-base sm:text-lg font-semibold"
                          style={{ color: theme.text }}
                        >
                          Category Changes
                        </h4>
                      </div>
                      <motion.div
                        animate={{
                          rotate: isSectionExpanded("categories") ? 180 : 0,
                        }}
                        transition={{ duration: 0.25 }}
                      >
                        <ChevronDown
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: theme.textSecondary }}
                        />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {isSectionExpanded("categories") && (
                        <motion.div
                          variants={sectionVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl"
                          style={{ border: `1px solid ${theme.border}` }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {removedCategoryIds.length > 0 && (
                              <motion.div
                                variants={itemVariants}
                                className="p-3 rounded-lg"
                                style={{
                                  backgroundColor: hexToRgba(theme.error, 0.1),
                                }}
                              >
                                <h5
                                  className="text-xs sm:text-sm font-medium mb-2 flex items-center gap-1"
                                  style={{ color: theme.error }}
                                >
                                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                  Categories to Remove (
                                  {removedCategoryIds.length})
                                </h5>
                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                  {removedCategoryIds.map((categoryId, idx) => {
                                    const color = getCategoryColor(categoryId);
                                    return (
                                      <div
                                        key={idx}
                                        className="text-xs sm:text-sm flex items-start gap-2"
                                      >
                                        <span
                                          className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                          style={{ backgroundColor: color }}
                                        />
                                        <div>
                                          <span
                                            className="font-medium"
                                            style={{ color }}
                                          >
                                            {getCategoryName(categoryId)}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                            {addedCategoryIds.length > 0 && (
                              <motion.div
                                variants={itemVariants}
                                className="p-3 rounded-lg"
                                style={{
                                  backgroundColor: hexToRgba(
                                    theme.success,
                                    0.1,
                                  ),
                                }}
                              >
                                <h5
                                  className="text-xs sm:text-sm font-medium mb-2 flex items-center gap-1"
                                  style={{ color: theme.success }}
                                >
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                  Categories to Add ({addedCategoryIds.length})
                                </h5>
                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                  {addedCategoryIds.map((categoryId, idx) => {
                                    const color = getCategoryColor(categoryId);
                                    return (
                                      <div
                                        key={idx}
                                        className="text-xs sm:text-sm flex items-start gap-2"
                                      >
                                        <span
                                          className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                          style={{ backgroundColor: color }}
                                        />
                                        <div>
                                          <span
                                            className="font-medium"
                                            style={{ color }}
                                          >
                                            {getCategoryName(categoryId)}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Images Changes */}
                {(removedImages.length > 0 || newImages.length > 0) && (
                  <div className="mb-4 sm:mb-6">
                    <motion.button
                      onClick={() => toggleSection("images")}
                      className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${hexToRgba(theme.error, 0.1)}, ${hexToRgba(theme.error, 0.05)})`,
                      }}
                      whileHover={{ opacity: 0.85 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-2">
                        <ImageIcon
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: theme.error }}
                        />
                        <h4
                          className="text-base sm:text-lg font-semibold"
                          style={{ color: theme.text }}
                        >
                          Images Changes
                        </h4>
                      </div>
                      <motion.div
                        animate={{
                          rotate: isSectionExpanded("images") ? 180 : 0,
                        }}
                        transition={{ duration: 0.25 }}
                      >
                        <ChevronDown
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: theme.textSecondary }}
                        />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {isSectionExpanded("images") && (
                        <motion.div
                          variants={sectionVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl"
                          style={{ border: `1px solid ${theme.border}` }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {removedImages.length > 0 && (
                              <motion.div
                                variants={itemVariants}
                                className="p-3 rounded-lg"
                                style={{
                                  backgroundColor: hexToRgba(theme.error, 0.1),
                                }}
                              >
                                <h5
                                  className="text-xs sm:text-sm font-medium mb-2"
                                  style={{ color: theme.error }}
                                >
                                  Images to Remove ({removedImages.length})
                                </h5>
                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                  {removedImages.map((imageId, index) => {
                                    const image =
                                      originalDestination.images.find(
                                        (img) => img.imageId === imageId,
                                      );
                                    return (
                                      <div
                                        key={index}
                                        className="text-xs sm:text-sm"
                                        style={{ color: theme.error }}
                                      >
                                        •{" "}
                                        {image?.imageName ||
                                          `Image ID: ${imageId}`}
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                            {newImages.length > 0 && (
                              <motion.div
                                variants={itemVariants}
                                className="p-3 rounded-lg"
                                style={{
                                  backgroundColor: hexToRgba(
                                    theme.success,
                                    0.1,
                                  ),
                                }}
                              >
                                <h5
                                  className="text-xs sm:text-sm font-medium mb-2"
                                  style={{ color: theme.success }}
                                >
                                  New Images ({newImages.length})
                                </h5>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {newImages.map((image, index) => (
                                    <div
                                      key={index}
                                      className="text-xs sm:text-sm"
                                      style={{ color: theme.success }}
                                    >
                                      <div className="font-medium">
                                        {image.name}
                                      </div>
                                      <div
                                        className="text-xs truncate"
                                        style={{ color: theme.textSecondary }}
                                      >
                                        {image.imageUrl}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Activities Changes */}
                {(removedActivities.length > 0 || newActivities.length > 0) && (
                  <div className="mb-4 sm:mb-6">
                    <motion.button
                      onClick={() => toggleSection("activities")}
                      className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${hexToRgba(theme.accent, 0.1)}, ${hexToRgba(theme.accent, 0.05)})`,
                      }}
                      whileHover={{ opacity: 0.85 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-2">
                        <Activity
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: theme.accent }}
                        />
                        <h4
                          className="text-base sm:text-lg font-semibold"
                          style={{ color: theme.text }}
                        >
                          Activities Changes
                        </h4>
                      </div>
                      <motion.div
                        animate={{
                          rotate: isSectionExpanded("activities") ? 180 : 0,
                        }}
                        transition={{ duration: 0.25 }}
                      >
                        <ChevronDown
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: theme.textSecondary }}
                        />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {isSectionExpanded("activities") && (
                        <motion.div
                          variants={sectionVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl"
                          style={{ border: `1px solid ${theme.border}` }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {removedActivities.length > 0 && (
                              <motion.div
                                variants={itemVariants}
                                className="p-3 rounded-lg"
                                style={{
                                  backgroundColor: hexToRgba(theme.error, 0.1),
                                }}
                              >
                                <h5
                                  className="text-xs sm:text-sm font-medium mb-2"
                                  style={{ color: theme.error }}
                                >
                                  Activities to Remove (
                                  {removedActivities.length})
                                </h5>
                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                  {removedActivities.map(
                                    (activityId, index) => {
                                      const activity =
                                        originalDestination.activities.find(
                                          (act) =>
                                            act.activityId === activityId,
                                        );
                                      return (
                                        <div
                                          key={index}
                                          className="text-xs sm:text-sm"
                                          style={{ color: theme.error }}
                                        >
                                          •{" "}
                                          {activity?.activityName ||
                                            `Activity ID: ${activityId}`}
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              </motion.div>
                            )}
                            {newActivities.length > 0 && (
                              <motion.div
                                variants={itemVariants}
                                className="p-3 rounded-lg"
                                style={{
                                  backgroundColor: hexToRgba(
                                    theme.success,
                                    0.1,
                                  ),
                                }}
                              >
                                <h5
                                  className="text-xs sm:text-sm font-medium mb-2"
                                  style={{ color: theme.success }}
                                >
                                  New Activities ({newActivities.length})
                                </h5>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                  {newActivities.map((activity, index) => (
                                    <div
                                      key={index}
                                      className="text-xs sm:text-sm border-b last:border-0 pb-2 last:pb-0"
                                      style={{ borderColor: theme.border }}
                                    >
                                      <div
                                        className="font-medium"
                                        style={{ color: theme.success }}
                                      >
                                        {activity.name}
                                      </div>
                                      <div
                                        className="text-xs mt-1"
                                        style={{ color: theme.textSecondary }}
                                      >
                                        Duration: {activity.durationHover} hours
                                        | Local:{" "}
                                        {formatPrice(activity.priceLocal)} |
                                        Foreign:{" "}
                                        {formatPrice(activity.priceForeigners)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Warning */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mb-6 p-4 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.warning, 0.1)}, ${hexToRgba(theme.warning, 0.05)})`,
                    border: `1px solid ${hexToRgba(theme.warning, 0.3)}`,
                  }}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertTriangle
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5"
                      style={{ color: theme.warning }}
                    />
                    <div
                      className="text-xs sm:text-sm"
                      style={{ color: theme.warning }}
                    >
                      <p className="font-medium mb-1">
                        Please review all changes carefully!
                      </p>
                      <p className="opacity-80">
                        Once confirmed, these changes will be permanent and
                        cannot be undone. Make sure all information is correct
                        before proceeding.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                  <motion.button
                    onClick={onClose}
                    disabled={loading}
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.textSecondary,
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={onConfirm}
                    disabled={loading}
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                    }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          variants={loadingIconVariants}
                          animate="animate"
                          className="flex items-center justify-center"
                        >
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.div>
                        <span>Updating Destination...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Confirm Update</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpdateConfirmationModal;
