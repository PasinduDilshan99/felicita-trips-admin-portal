"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ImageIcon,
  Plus,
  X,
  Upload,
  Loader2,
  Trash2,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Image as ImageType, NewImageRequest } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";

interface ImagesManagementProps {
  images: ImageType[];
  removedImages: number[];
  newImages: NewImageRequest[];
  uploadingImages: boolean;
  onRemoveImage: (imageId: number) => void;
  onAddNewImage: (
    file: File,
    name: string,
    description: string,
  ) => Promise<void>;
  error?: string;
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

const bodyVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.32, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

const formVariants: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: { duration: 0.24, ease: "easeIn" },
  },
};

const imageGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const imageCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.28, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.2, ease: "easeIn" },
  },
  hover: {
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const chevronVariants: Variants = {
  open: { rotate: 180, transition: { duration: 0.28, ease: EASE_OUT } },
  closed: { rotate: 0, transition: { duration: 0.28, ease: EASE_OUT } },
};

const errorVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.22, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.16, ease: "easeIn" },
  },
};

const uploadIndicatorVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const pillVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

/* ─── Component ──────────────────────────────────────────────────────────── */

export const ImagesManagement: React.FC<ImagesManagementProps> = ({
  images,
  removedImages,
  newImages,
  uploadingImages,
  onRemoveImage,
  onAddNewImage,
  error,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNewImageForm, setShowNewImageForm] = useState(false);
  const [uploadingLocalImage, setUploadingLocalImage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [newImageData, setNewImageData] = useState({
    name: "",
    description: "",
    file: null as File | null,
  });

  const isImageRemoved = (imageId: number): boolean => {
    return removedImages.includes(imageId);
  };

  const getAllImagesForModal = (): ImageModalImage[] => {
    const allImages: ImageModalImage[] = [];

    images.forEach((image) => {
      if (!isImageRemoved(image.imageId)) {
        allImages.push({
          url: image.imageUrl,
          name: image.imageName,
          description: image.imageDescription,
          id: image.imageId,
        });
      }
    });

    newImages.forEach((image, index) => {
      allImages.push({
        url: image.imageUrl,
        name: image.name,
        description: image.description,
        id: `new-${index}`,
      });
    });

    return allImages;
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      setNewImageData({ ...newImageData, file });
    }
  };

  const handleAddImage = async () => {
    if (!newImageData.name.trim()) {
      alert("Image name is required");
      return;
    }
    if (!newImageData.file) {
      alert("Please select an image file");
      return;
    }

    setUploadingLocalImage(true);
    try {
      await onAddNewImage(
        newImageData.file,
        newImageData.name,
        newImageData.description,
      );
      setNewImageData({ name: "", description: "", file: null });
      setShowNewImageForm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingLocalImage(false);
    }
  };

  const handleShowForm = () => {
    setShowNewImageForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const existingImagesCount = images.filter(
    (img) => !isImageRemoved(img.imageId),
  ).length;
  const totalImagesCount = existingImagesCount + newImages.length;

  // Focus handlers for form inputs
  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  return (
    <>
      <style>{`
        input[type="file"]::-webkit-file-upload-button {
          cursor: pointer;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.3);
        }
      `}</style>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-2xl overflow-hidden w-full"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${error ? theme.error : theme.border}`,
          boxShadow: error
            ? `0 0 0 3px ${theme.error}18`
            : "0 2px 16px rgba(0,0,0,0.07)",
        }}
      >
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between px-4 sm:px-6 py-4 cursor-pointer select-none"
          style={{ borderBottom: `1px solid ${theme.border}` }}
          onClick={() => setIsExpanded((prev) => !prev)}
          whileHover={{ backgroundColor: `${theme.border}30` }}
          whileTap={{ backgroundColor: `${theme.border}50` }}
          transition={{ duration: 0.15 }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
              style={{
                backgroundColor: `${theme.error}18`,
                color: theme.error,
              }}
            >
              <ImageIcon className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h2
                className="text-sm sm:text-base font-semibold leading-tight truncate"
                style={{ color: theme.text }}
              >
                Images Management
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                {totalImagesCount} total images ({existingImagesCount} existing,{" "}
                {newImages.length} new)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleShowForm();
              }}
              disabled={uploadingImages || uploadingLocalImage}
              variants={pillVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: `${theme.success}15`,
                border: `1px solid ${theme.success}30`,
                color: theme.success,
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Add Image</span>
              <span className="xs:hidden">Add</span>
            </motion.button>
            <motion.div
              variants={chevronVariants}
              animate={isExpanded ? "open" : "closed"}
              className="flex-shrink-0"
            >
              <ChevronDown
                className="w-4 h-4"
                style={{ color: theme.textSecondary }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Body */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="body"
              variants={bodyVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ overflow: "hidden" }}
            >
              {/* New Image Form */}
              <AnimatePresence>
                {showNewImageForm && (
                  <motion.div
                    ref={formRef}
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="px-4 sm:px-6 pt-6"
                  >
                    <div
                      className="rounded-xl overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${theme.background}, ${theme.surface})`,
                        border: `2px solid ${theme.primary}`,
                        boxShadow: `0 0 0 3px ${theme.primary}18`,
                      }}
                    >
                      <div
                        className="flex items-center justify-between px-4 sm:px-5 py-3"
                        style={{
                          borderBottom: `1px solid ${theme.border}`,
                          backgroundColor: `${theme.primary}08`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Upload
                            className="w-4 h-4"
                            style={{ color: theme.primary }}
                          />
                          <h3
                            className="text-sm font-semibold"
                            style={{ color: theme.text }}
                          >
                            Add New Image
                          </h3>
                        </div>
                        <motion.button
                          onClick={() => {
                            setShowNewImageForm(false);
                            setNewImageData({
                              name: "",
                              description: "",
                              file: null,
                            });
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 rounded transition-colors hover:bg-black/10"
                          style={{ color: theme.textSecondary }}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <div className="p-4 sm:p-5 space-y-4">
                        {/* File Upload */}
                        <div>
                          <label
                            className="block text-xs font-medium mb-1.5"
                            style={{ color: theme.textSecondary }}
                          >
                            Image File{" "}
                            <span style={{ color: theme.error }}>*</span>{" "}
                            <span className="text-xs">(Max 5MB)</span>
                          </label>
                          <motion.div
                            className="border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer"
                            style={{ borderColor: theme.border }}
                            whileHover={{ borderColor: theme.primary }}
                            transition={{ duration: 0.18 }}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                              id="image-file-input"
                            />
                            <label
                              htmlFor="image-file-input"
                              className="cursor-pointer block"
                            >
                              <Upload
                                className="w-8 h-8 mx-auto mb-2"
                                style={{ color: theme.textSecondary }}
                              />
                              <p
                                className="text-sm"
                                style={{ color: theme.textSecondary }}
                              >
                                {newImageData.file
                                  ? newImageData.file.name
                                  : "Click or drag to select image"}
                              </p>
                              <p
                                className="text-xs mt-1"
                                style={{ color: theme.textSecondary }}
                              >
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </label>
                          </motion.div>
                        </div>

                        {/* Image Preview */}
                        <AnimatePresence>
                          {newImageData.file && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="relative rounded-lg overflow-hidden"
                            >
                              <img
                                src={URL.createObjectURL(newImageData.file)}
                                alt="Preview"
                                className="w-full h-40 object-cover"
                              />
                              <div
                                className="absolute bottom-0 left-0 right-0 px-3 py-1.5 text-xs"
                                style={{
                                  background:
                                    "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                                  color: "#fff",
                                }}
                              >
                                Preview
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              className="block text-xs font-medium mb-1.5"
                              style={{ color: theme.textSecondary }}
                            >
                              Image Name{" "}
                              <span style={{ color: theme.error }}>*</span>
                            </label>
                            <input
                              type="text"
                              value={newImageData.name}
                              onChange={(e) =>
                                setNewImageData({
                                  ...newImageData,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-all text-sm"
                              style={{
                                backgroundColor: theme.background,
                                borderColor: theme.border,
                                color: theme.text,
                              }}
                              {...focusHandlers}
                              placeholder="e.g., Main Entrance"
                            />
                          </div>

                          <div>
                            <label
                              className="block text-xs font-medium mb-1.5"
                              style={{ color: theme.textSecondary }}
                            >
                              Description
                            </label>
                            <input
                              type="text"
                              value={newImageData.description}
                              onChange={(e) =>
                                setNewImageData({
                                  ...newImageData,
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-all text-sm"
                              style={{
                                backgroundColor: theme.background,
                                borderColor: theme.border,
                                color: theme.text,
                              }}
                              {...focusHandlers}
                              placeholder="Optional description"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <motion.button
                            onClick={() => {
                              setShowNewImageForm(false);
                              setNewImageData({
                                name: "",
                                description: "",
                                file: null,
                              });
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                            style={{
                              backgroundColor: theme.background,
                              border: `2px solid ${theme.border}`,
                              color: theme.textSecondary,
                            }}
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            onClick={handleAddImage}
                            disabled={uploadingLocalImage || !newImageData.file}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            style={{
                              background: `linear-gradient(135deg, ${theme.success}, ${theme.success}90)`,
                              color: "#fff",
                            }}
                          >
                            {uploadingLocalImage ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                Upload Image
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Existing Images Section */}
              <div className="px-4 sm:px-6 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: theme.textSecondary }}
                    >
                      Existing Images
                    </span>
                    <motion.span
                      key="existing-count"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${theme.border}60`,
                        color: theme.textSecondary,
                      }}
                    >
                      {existingImagesCount}
                    </motion.span>
                  </div>
                </div>

                {existingImagesCount === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 rounded-xl"
                    style={{
                      backgroundColor: `${theme.border}20`,
                      border: `1px dashed ${theme.border}`,
                    }}
                  >
                    <ImageIcon
                      className="w-10 h-10 mx-auto mb-2"
                      style={{ color: theme.textSecondary }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      No existing images
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={imageGridVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
                  >
                    <AnimatePresence mode="popLayout">
                      {images.map(
                        (image) =>
                          !isImageRemoved(image.imageId) && (
                            <motion.div
                              key={image.imageId}
                              layout
                              variants={imageCardVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              whileHover="hover"
                              className="relative group rounded-xl overflow-hidden cursor-pointer"
                              style={{
                                border: `1px solid ${theme.border}`,
                                backgroundColor: theme.background,
                              }}
                              onClick={() => {
                                const allImages = getAllImagesForModal();
                                const index = allImages.findIndex(
                                  (img) => img.id === image.imageId,
                                );
                                openImageModal(index);
                              }}
                            >
                              <img
                                src={image.imageUrl}
                                alt={image.imageName}
                                className="w-full h-40 object-cover"
                              />
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <p className="text-white text-sm font-medium truncate">
                                    {image.imageName}
                                  </p>
                                  {image.imageDescription && (
                                    <p className="text-white/70 text-xs truncate mt-0.5">
                                      {image.imageDescription}
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveImage(image.imageId);
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ opacity: 1, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white shadow-lg"
                                title="Remove image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </motion.button>
                            </motion.div>
                          ),
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>

              {/* New Images Section */}
              <AnimatePresence>
                {newImages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-4 sm:px-6 pt-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="text-xs font-medium uppercase tracking-wide"
                        style={{ color: theme.textSecondary }}
                      >
                        New Images to Add
                      </span>
                      <motion.span
                        key="new-count"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${theme.success}20`,
                          color: theme.success,
                        }}
                      >
                        {newImages.length}
                      </motion.span>
                    </div>

                    <motion.div
                      variants={imageGridVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
                    >
                      {newImages.map((image, index) => {
                        const existingCount = images.filter(
                          (img) => !isImageRemoved(img.imageId),
                        ).length;
                        return (
                          <motion.div
                            key={`new-${index}`}
                            variants={imageCardVariants}
                            whileHover="hover"
                            className="relative rounded-xl overflow-hidden cursor-pointer"
                            style={{
                              border: `2px solid ${theme.success}`,
                              backgroundColor: `${theme.success}05`,
                            }}
                            onClick={() =>
                              openImageModal(existingCount + index)
                            }
                          >
                            <img
                              src={image.imageUrl}
                              alt={image.name}
                              className="w-full h-40 object-cover"
                            />
                            <div className="p-2.5">
                              <p
                                className="text-sm font-medium truncate"
                                style={{ color: theme.text }}
                              >
                                {image.name}
                              </p>
                              {image.description && (
                                <p
                                  className="text-xs truncate mt-0.5"
                                  style={{ color: theme.textSecondary }}
                                >
                                  {image.description}
                                </p>
                              )}
                            </div>
                            <motion.div
                              className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: theme.success }}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              New
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Uploading Indicator */}
              <AnimatePresence>
                {(uploadingImages || uploadingLocalImage) && (
                  <motion.div
                    variants={uploadIndicatorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="px-4 sm:px-6 pt-4 pb-2"
                  >
                    <div
                      className="p-3 rounded-lg flex items-center gap-2"
                      style={{ backgroundColor: `${theme.primary}10` }}
                    >
                      <Loader2
                        className="w-4 h-4 animate-spin"
                        style={{ color: theme.primary }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: theme.primary }}
                      >
                        {uploadingLocalImage
                          ? "Uploading image to Cloudinary..."
                          : "Processing images..."}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Spacing at bottom */}
              <div className="h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="px-4 sm:px-6 py-3 flex items-center gap-2 text-sm overflow-hidden"
              style={{
                borderTop: `1px solid ${theme.error}30`,
                backgroundColor: `${theme.error}08`,
                color: theme.error,
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        images={getAllImagesForModal()}
        initialIndex={selectedImageIndex}
        onClose={() => setModalOpen(false)}
        showNavigation={true}
        showDownload={true}
        showZoom={true}
        allowKeyboardNavigation={true}
      />
    </>
  );
};
