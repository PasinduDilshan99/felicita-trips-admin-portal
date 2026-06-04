"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, ChevronDown } from "lucide-react";
import { TourImagesProps } from "@/types/tour-schedule-types";
import { useTheme } from "@/contexts/ThemeContext";
import ImageModal from "@/components/common-components/ImageModal";
import { ImageModalImage } from "@/types/common-components-types";
import { cardVariants, sectionVariants } from "@/app/animations/variants";

export const TourImages: React.FC<TourImagesProps> = ({
  images,
  expandedSections,
  onToggleSection,
}) => {
  const { theme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const modalImages: ImageModalImage[] = images.map((img) => ({
    url: img.imageUrl,
    name: img.name,
    description: img.description || undefined,
    id: img.imageId,
  }));

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }}
      >
        <button
          onClick={() => onToggleSection("images")}
          className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
          style={{
            backgroundColor: expandedSections.has("images")
              ? `${theme.error}05`
              : "transparent",
            borderBottom: expandedSections.has("images")
              ? `1px solid ${theme.border}`
              : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                backgroundColor: `${theme.error}18`,
                color: theme.error,
              }}
            >
              <ImageIcon className="w-4 h-4" />
            </span>
            <div>
              <h2
                className="text-sm sm:text-base font-semibold"
                style={{ color: theme.text }}
              >
                Tour Images
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                Read-only image list ({images.length} images)
              </p>
            </div>
          </div>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{
              transform: expandedSections.has("images")
                ? "rotate(180deg)"
                : "none",
              color: theme.textSecondary,
            }}
          />
        </button>

        <AnimatePresence>
          {expandedSections.has("images") && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={image.imageId}
                    className="rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                    style={{
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.background,
                    }}
                    onClick={() => openImageModal(index)}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <p
                        className="text-xs font-medium truncate"
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
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ImageModal
        isOpen={modalOpen}
        images={modalImages}
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
