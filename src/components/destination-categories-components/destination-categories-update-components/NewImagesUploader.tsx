"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ImageIcon,
  Upload,
  Trash2,
  Move,
  Loader2,
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

interface NewImage {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
  imageFile?: File;
  uploadProgress?: number;
  previewUrl?: string;
}

interface NewImagesUploaderProps {
  images: NewImage[];
  errors: Record<string, string>;
  onAddImages: (images: NewImage[]) => void;
  onRemoveImage: (index: number) => void;
  onUpdateImage: (
    index: number,
    updates: {
      name?: string;
      description?: string;
      status?: "ACTIVE" | "INACTIVE";
    },
  ) => void;
  onUpdateImageProgress: (index: number, progress: number) => void;
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

const uploadAreaVariants: Variants = {
  rest: { borderColor: "#e5e7eb", backgroundColor: "rgba(0,0,0,0.02)" },
  dragOver: {
    borderColor: "#3b82f6",
    backgroundColor: "rgba(59,130,246,0.05)",
    scale: 1.01,
    transition: { duration: 0.15 },
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

const progressVariants: Variants = {
  hidden: { width: 0 },
  visible: (width: number) => ({
    width: `${width}%`,
    transition: { duration: 0.3, ease: EASE_OUT },
  }),
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

const NewImagesUploader: React.FC<NewImagesUploaderProps> = ({
  images,
  errors,
  onAddImages,
  onRemoveImage,
  onUpdateImage,
  onUpdateImageProgress,
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    const newImages: NewImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        continue;
      }

      const reader = new FileReader();
      const previewUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      newImages.push({
        name: file.name.replace(/\.[^/.]+$/, ""),
        description: "",
        imageUrl: "",
        status: "ACTIVE",
        imageFile: file,
        uploadProgress: 0,
        previewUrl,
      });
    }

    onAddImages(newImages);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    if (images.length + files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    const newImages: NewImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        continue;
      }

      const reader = new FileReader();
      const previewUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      newImages.push({
        name: file.name.replace(/\.[^/.]+$/, ""),
        description: "",
        imageUrl: "",
        status: "ACTIVE",
        imageFile: file,
        uploadProgress: 0,
        previewUrl,
      });
    }

    onAddImages(newImages);
  };

  const getModalImages = (): ImageModalImage[] => {
    return images.map((img) => ({
      url: img.previewUrl || img.imageUrl || PLACE_HOLDER_IMAGE,
      name: img.name,
      description: img.description,
      id: `new-${Date.now()}-${Math.random()}`,
    }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
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
            Add New Images
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Upload and manage new images
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
            {images.length}/10
          </span>
          <Sparkles
            className="w-3.5 h-3.5"
            style={{ color: theme.primary, opacity: 0.6 }}
          />
        </motion.div>
      </motion.div>

      <div className="px-4 sm:px-6 py-5 sm:py-6">
        {/* Upload Area */}
        <motion.div
          variants={uploadAreaVariants}
          animate={isDragOver ? "dragOver" : "rest"}
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 mb-6"
          style={{
            borderColor: theme.border,
            backgroundColor: hexToRgba(theme.background, 0.5),
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="new-image-upload"
          />
          <label
            htmlFor="new-image-upload"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <motion.div
              animate={isDragOver ? { y: -5, scale: 1.05 } : { y: 0, scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              <Upload
                className="w-12 h-12"
                style={{
                  color: isDragOver ? theme.primary : theme.textSecondary,
                }}
              />
            </motion.div>
            <div>
              <span
                style={{
                  color: isDragOver ? theme.primary : theme.textSecondary,
                }}
              >
                {isDragOver
                  ? "Drop images here"
                  : "Click or drag images here to upload"}
              </span>
              <span
                className="block text-xs mt-1"
                style={{ color: theme.textSecondary }}
              >
                Maximum 10 images total, up to 5MB each
              </span>
            </div>
          </label>
        </motion.div>

        {/* Images List */}
        {images.length > 0 && (
          <motion.div
            variants={imageGridVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar"
          >
            <AnimatePresence mode="popLayout">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  variants={imageCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover="hover"
                  layout
                  className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    backgroundColor: hexToRgba(theme.success, 0.05),
                    border: `1px solid ${theme.success}40`,
                  }}
                  onMouseEnter={() => setHoveredImageId(index)}
                  onMouseLeave={() => setHoveredImageId(null)}
                >
                  <div className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Image Preview */}
                      <motion.div
                        variants={buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="relative cursor-pointer group/img flex-shrink-0 self-center sm:self-start"
                        onClick={() => handleImageClick(index)}
                      >
                        <motion.img
                          src={
                            image.previewUrl ||
                            image.imageUrl ||
                            PLACE_HOLDER_IMAGE
                          }
                          alt={image.name}
                          className="w-20 h-20 sm:w-16 sm:h-16 rounded-lg object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        />
                        <motion.div
                          variants={imageOverlayVariants}
                          initial="hidden"
                          animate={
                            hoveredImageId === index ? "visible" : "hidden"
                          }
                          className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </motion.div>
                        {/* Uploading indicator */}
                        {image.uploadProgress !== undefined &&
                          image.uploadProgress < 100 && (
                            <div className="absolute -top-1 -right-1">
                              <Loader2 className="w-3 h-3 animate-spin text-white" />
                            </div>
                          )}
                      </motion.div>

                      {/* Image Details */}
                      <div className="flex-1 space-y-2 min-w-0">
                        <motion.div
                          animate={
                            focusedInput === `name-${index}`
                              ? "focused"
                              : undefined
                          }
                          variants={inputVariants}
                        >
                          <input
                            type="text"
                            value={image.name}
                            onChange={(e) =>
                              onUpdateImage(index, { name: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all duration-200"
                            style={{
                              ...fieldBase,
                              border: `1.5px solid ${errors[`new_image_${index}_name`] ? theme.error : theme.border}`,
                            }}
                            {...focusHandlers(`name-${index}`)}
                            placeholder="Image name *"
                          />
                        </motion.div>

                        <motion.div
                          animate={
                            focusedInput === `desc-${index}`
                              ? "focused"
                              : undefined
                          }
                          variants={inputVariants}
                        >
                          <input
                            type="text"
                            value={image.description}
                            onChange={(e) =>
                              onUpdateImage(index, {
                                description: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none transition-all duration-200"
                            style={{
                              ...fieldBase,
                              border: `1.5px solid ${theme.border}`,
                            }}
                            {...focusHandlers(`desc-${index}`)}
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
                        onClick={() => onRemoveImage(index)}
                        className="p-2 rounded-lg transition-all duration-200 self-start sm:self-center"
                        style={{
                          color: theme.error,
                          backgroundColor: hexToRgba(theme.error, 0.08),
                        }}
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>

                      {/* Drag Handle */}
                      <motion.div
                        className="hidden sm:flex items-center self-center cursor-move"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Move
                          className="w-4 h-4"
                          style={{ color: theme.textSecondary }}
                        />
                      </motion.div>
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
                          onUpdateImage(index, { status: "ACTIVE" })
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
                        animate={
                          image.status === "INACTIVE" ? "active" : "rest"
                        }
                        type="button"
                        onClick={() =>
                          onUpdateImage(index, { status: "INACTIVE" })
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
                        {image.status === "INACTIVE" && (
                          <X className="w-3 h-3" />
                        )}
                        Inactive
                      </motion.button>
                    </div>

                    {/* Error Message */}
                    {errors[`new_image_${index}_name`] && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs mt-2 ml-0 sm:ml-[72px]"
                        style={{ color: theme.error }}
                      >
                        {errors[`new_image_${index}_name`]}
                      </motion.p>
                    )}

                    {/* Upload Progress */}
                    {image.uploadProgress !== undefined &&
                      image.uploadProgress < 100 &&
                      image.uploadProgress > 0 && (
                        <div className="ml-0 sm:ml-[72px] mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className="text-[10px]"
                              style={{ color: theme.textSecondary }}
                            >
                              Uploading...
                            </span>
                            <span
                              className="text-[10px]"
                              style={{ color: theme.primary }}
                            >
                              {image.uploadProgress}%
                            </span>
                          </div>
                          <div
                            className="w-full h-1.5 rounded-full overflow-hidden"
                            style={{
                              backgroundColor: hexToRgba(theme.primary, 0.2),
                            }}
                          >
                            <motion.div
                              variants={progressVariants}
                              initial="hidden"
                              animate="visible"
                              custom={image.uploadProgress}
                              className="h-full rounded-full"
                              style={{ backgroundColor: theme.primary }}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        images={getModalImages()}
        initialIndex={selectedImageIndex}
        onClose={() => setIsModalOpen(false)}
        showNavigation={true}
        showDownload={true}
        showZoom={true}
        allowKeyboardNavigation={true}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          border-radius: 99px;
          background: rgba(128, 128, 128, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 128, 128, 0.4);
        }
      `}</style>
    </motion.div>
  );
};

export default NewImagesUploader;
