"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ImageIcon,
  Trash2,
  Edit2,
  Eye,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";

interface ExistingImage {
  imageId: number;
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

interface ExistingImagesManagerProps {
  images: ExistingImage[];
  onRemoveImage: (imageId: number) => void;
  onUpdateImage: (
    imageId: number,
    updates: {
      name?: string;
      description?: string;
      status?: "ACTIVE" | "INACTIVE";
    },
  ) => void;
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
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1, duration: 0.3 } },
};

const imageGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.15 },
  },
};

const imageCardVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
  hover: {
    y: -2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: { duration: 0.2 },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

const statusButtonVariants: Variants = {
  rest: { scale: 1, opacity: 0.8 },
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
  active: { opacity: 1, scale: 1 },
};

const imageOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const inputVariants: Variants = {
  focused: {
    scale: 1.01,
    transition: { duration: 0.15 },
  },
};

const ExistingImagesManager: React.FC<ExistingImagesManagerProps> = ({
  images,
  onRemoveImage,
  onUpdateImage,
}) => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  if (images.length === 0) return null;

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    return images.map((img) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || undefined,
      id: img.imageId,
    }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const focusHandlers = (fieldName: string) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      setFocusedInput(fieldName);
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      setFocusedInput(null);
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  });

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden w-full"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3 px-4 sm:px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
          style={{
            backgroundColor: `${theme.primary}18`,
            color: theme.primary,
          }}
        >
          <ImageIcon className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <h2
            className="text-sm sm:text-base font-semibold leading-tight truncate"
            style={{ color: theme.text }}
          >
            Existing Images
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Manage your uploaded images
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="ml-auto flex items-center gap-2"
        >
          <span
            className="text-sm px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(theme.primary, 0.1),
              color: theme.primary,
            }}
          >
            {images.length}
          </span>
          <Sparkles
            className="w-3.5 h-3.5"
            style={{ color: theme.primary, opacity: 0.6 }}
          />
        </motion.div>
      </motion.div>

      {/* Images List */}
      <motion.div
        variants={imageGridVariants}
        initial="hidden"
        animate="visible"
        className="px-4 sm:px-6 py-5 sm:py-6"
      >
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {images.map((image, idx) => (
              <motion.div
                key={image.imageId}
                variants={imageCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover="hover"
                layout
                className="rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  backgroundColor: hexToRgba(theme.textSecondary, 0.03),
                  border: `1px solid ${theme.border}`,
                }}
                onMouseEnter={() => setHoveredImageId(image.imageId)}
                onMouseLeave={() => setHoveredImageId(null)}
              >
                <div className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Clickable Image */}
                    <motion.div
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      className="relative cursor-pointer group/img flex-shrink-0 self-center sm:self-start"
                      onClick={() => handleImageClick(idx)}
                    >
                      <motion.img
                        src={image.imageUrl || PLACE_HOLDER_IMAGE}
                        alt={image.name}
                        className="w-20 h-20 sm:w-16 sm:h-16 rounded-lg object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.div
                        variants={imageOverlayVariants}
                        initial="hidden"
                        animate={
                          hoveredImageId === image.imageId
                            ? "visible"
                            : "hidden"
                        }
                        className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-white" />
                        <span className="text-white text-[10px] font-medium">
                          View
                        </span>
                      </motion.div>
                    </motion.div>

                    {/* Image Details */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <motion.div
                        animate={
                          focusedInput === `name-${image.imageId}`
                            ? "focused"
                            : undefined
                        }
                        variants={inputVariants}
                      >
                        <input
                          type="text"
                          value={image.name}
                          onChange={(e) =>
                            onUpdateImage(image.imageId, {
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all duration-200"
                          style={{
                            ...fieldBase,
                            border: `1.5px solid ${theme.border}`,
                          }}
                          {...focusHandlers(`name-${image.imageId}`)}
                          placeholder="Image name"
                        />
                      </motion.div>

                      <motion.div
                        animate={
                          focusedInput === `desc-${image.imageId}`
                            ? "focused"
                            : undefined
                        }
                        variants={inputVariants}
                      >
                        <input
                          type="text"
                          value={image.description}
                          onChange={(e) =>
                            onUpdateImage(image.imageId, {
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none transition-all duration-200"
                          style={{
                            ...fieldBase,
                            border: `1.5px solid ${theme.border}`,
                          }}
                          {...focusHandlers(`desc-${image.imageId}`)}
                          placeholder="Image description (optional)"
                        />
                      </motion.div>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      type="button"
                      onClick={() => onRemoveImage(image.imageId)}
                      className="p-2 rounded-lg transition-all duration-200 self-start sm:self-center"
                      style={{
                        color: theme.error,
                        backgroundColor: hexToRgba(theme.error, 0.08),
                      }}
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Status Buttons */}
                  <div className="flex gap-2 mt-3 ml-0 sm:ml-[72px]">
                    <motion.button
                      variants={statusButtonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      animate={image.status === "ACTIVE" ? "active" : "rest"}
                      type="button"
                      onClick={() =>
                        onUpdateImage(image.imageId, { status: "ACTIVE" })
                      }
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                      style={{
                        backgroundColor:
                          image.status === "ACTIVE"
                            ? theme.success
                            : hexToRgba(theme.border, 0.5),
                        color:
                          image.status === "ACTIVE"
                            ? "#fff"
                            : theme.textSecondary,
                      }}
                    >
                      {image.status === "ACTIVE" && (
                        <Check className="w-3 h-3" />
                      )}
                      Active
                    </motion.button>

                    <motion.button
                      variants={statusButtonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      animate={image.status === "INACTIVE" ? "active" : "rest"}
                      type="button"
                      onClick={() =>
                        onUpdateImage(image.imageId, { status: "INACTIVE" })
                      }
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                      style={{
                        backgroundColor:
                          image.status === "INACTIVE"
                            ? theme.textSecondary
                            : hexToRgba(theme.border, 0.5),
                        color:
                          image.status === "INACTIVE"
                            ? "#fff"
                            : theme.textSecondary,
                      }}
                    >
                      {image.status === "INACTIVE" && <X className="w-3 h-3" />}
                      Inactive
                    </motion.button>

                    {/* Edit indicator */}
                    {image.status === "ACTIVE" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="hidden sm:flex items-center gap-1 ml-auto"
                      >
                        <Edit2
                          className="w-3 h-3"
                          style={{ color: theme.textSecondary }}
                        />
                        <span
                          className="text-[10px]"
                          style={{ color: theme.textSecondary }}
                        >
                          Editable
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        images={getModalImages()}
        initialIndex={selectedImageIndex}
        onClose={handleModalClose}
        showNavigation={true}
        showDownload={true}
        showZoom={true}
        allowKeyboardNavigation={true}
      />
    </motion.div>
  );
};

export default ExistingImagesManager;
