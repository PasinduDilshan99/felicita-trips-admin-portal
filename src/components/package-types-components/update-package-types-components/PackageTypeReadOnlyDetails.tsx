"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ImageIcon,
  Plus,
  X,
  Star,
  ChevronDown,
  Loader2,
  Upload,
  Trash2,
  Edit2,
  Camera,
  Calendar,
} from "lucide-react";
import ImageModal from "@/components/common-components/ImageModal";
import { PackageTypeReadOnlyDetailsProps } from "@/types/package-type-types";
import { ImageModalImage } from "@/types/common-components-types";
import { cardVariants, sectionVariants } from "@/app/animations/variants";

export const PackageTypeReadOnlyDetails: React.FC<
  PackageTypeReadOnlyDetailsProps
> = ({
  type,
  expandedSections,
  onToggleSection,
  onRemoveImage,
  onAddNewImage,
  onUpdateImage,
  uploadingImages,
  theme,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showNewImageForm, setShowNewImageForm] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [uploadingLocalImage, setUploadingLocalImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [newImageData, setNewImageData] = useState({
    name: "",
    description: "",
    file: null as File | null,
  });

  const [editImageData, setEditImageData] = useState({
    name: "",
    description: "",
  });

  const modalImages: ImageModalImage[] = type.images.map((img) => ({
    url: img.imageUrl,
    name: img.name,
    description: img.description || undefined,
    id: img.imageId,
  }));

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

  const handleUpdateImage = () => {
    if (!editingImage) return;
    if (!editImageData.name.trim()) {
      alert("Image name is required");
      return;
    }
    onUpdateImage(
      editingImage.imageId,
      editImageData.name,
      editImageData.description,
    );
    setEditingImage(null);
    setEditImageData({ name: "", description: "" });
  };

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

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const primaryPackage = type.packageBasicDetails.find((p) => p.primaryType);
  const otherPackages = type.packageBasicDetails.filter((p) => !p.primaryType);

  return (
    <div className="space-y-6">
      {/* Associated Packages Section */}
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
          onClick={() => onToggleSection("packages")}
          className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
          style={{
            backgroundColor: expandedSections.has("packages")
              ? `${theme.primary}05`
              : "transparent",
            borderBottom: expandedSections.has("packages")
              ? `1px solid ${theme.border}`
              : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                backgroundColor: `${theme.primary}18`,
                color: theme.primary,
              }}
            >
              <Package className="w-4 h-4" />
            </span>
            <div>
              <h2
                className="text-sm sm:text-base font-semibold"
                style={{ color: theme.text }}
              >
                Associated Packages
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                Read-only package list ({type.totalPackages} total)
              </p>
            </div>
          </div>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{
              transform: expandedSections.has("packages")
                ? "rotate(180deg)"
                : "none",
              color: theme.textSecondary,
            }}
          />
        </button>

        <AnimatePresence>
          {expandedSections.has("packages") && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-6"
            >
              {/* Primary Package */}
              {primaryPackage && (
                <div className="mb-4">
                  <h3
                    className="text-sm font-semibold mb-2 flex items-center gap-1"
                    style={{ color: theme.text }}
                  >
                    <Star
                      className="w-3.5 h-3.5"
                      style={{ color: theme.warning }}
                    />
                    Primary Package
                  </h3>
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: `${theme.warning}10`,
                      border: `1px solid ${theme.warning}30`,
                    }}
                  >
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: theme.text }}
                      >
                        {primaryPackage.packageName}
                      </p>
                      <div
                        className="flex items-center gap-2 mt-1 text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        {primaryPackage.startDate && (
                          <>
                            <Calendar className="w-3 h-3" />
                            <span>
                              {primaryPackage.startDate?.split("T")[0]} →{" "}
                              {primaryPackage.endDate?.split("T")[0]}
                            </span>
                          </>
                        )}
                      </div>
                      {primaryPackage.description && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: theme.textSecondary }}
                        >
                          {primaryPackage.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Other Packages */}
              {otherPackages.length > 0 && (
                <div className="mb-4">
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: theme.textSecondary }}
                  >
                    Other Packages ({otherPackages.length})
                  </h3>
                  <div className="space-y-2">
                    {otherPackages.map((pkg) => (
                      <div
                        key={pkg.packageId}
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: `${theme.border}10`,
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        <p
                          className="text-sm font-medium"
                          style={{ color: theme.text }}
                        >
                          {pkg.packageName}
                        </p>
                        <div
                          className="flex items-center gap-2 mt-1 text-xs"
                          style={{ color: theme.textSecondary }}
                        >
                          {pkg.startDate && (
                            <>
                              <Calendar className="w-3 h-3" />
                              <span>
                                {pkg.startDate?.split("T")[0]} →{" "}
                                {pkg.endDate?.split("T")[0]}
                              </span>
                            </>
                          )}
                          {pkg.color && (
                            <>
                              <span
                                className="w-2 h-2 rounded-full ml-2"
                                style={{ backgroundColor: pkg.color }}
                              />
                              <span>Color: {pkg.color}</span>
                            </>
                          )}
                        </div>
                        {pkg.description && (
                          <p
                            className="text-xs mt-1"
                            style={{ color: theme.textSecondary }}
                          >
                            {pkg.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Images Section */}
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
                Package Type Images
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                Manage images for this package type
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
              {/* Edit Image Modal */}
              <AnimatePresence>
                {editingImage && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setEditingImage(null)}
                  >
                    <div
                      className="rounded-2xl p-6 max-w-md w-full mx-4"
                      style={{ backgroundColor: theme.surface }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3
                        className="text-lg font-semibold mb-4"
                        style={{ color: theme.text }}
                      >
                        Edit Image
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: theme.textSecondary }}
                          >
                            Image Name
                          </label>
                          <input
                            type="text"
                            value={editImageData.name}
                            onChange={(e) =>
                              setEditImageData({
                                ...editImageData,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border-2"
                            style={{ ...fieldBase, borderColor: theme.border }}
                            {...focusHandlers}
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: theme.textSecondary }}
                          >
                            Description
                          </label>
                          <input
                            type="text"
                            value={editImageData.description}
                            onChange={(e) =>
                              setEditImageData({
                                ...editImageData,
                                description: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border-2"
                            style={{ ...fieldBase, borderColor: theme.border }}
                            {...focusHandlers}
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => setEditingImage(null)}
                            className="flex-1 px-4 py-2 rounded-lg"
                            style={{
                              backgroundColor: theme.background,
                              border: `1px solid ${theme.border}`,
                              color: theme.textSecondary,
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdateImage}
                            className="flex-1 px-4 py-2 rounded-lg text-white"
                            style={{ backgroundColor: theme.primary }}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add Image Form */}
              <AnimatePresence>
                {showNewImageForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-xl"
                    style={{
                      backgroundColor: `${theme.primary}08`,
                      border: `2px solid ${theme.primary}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4
                        className="text-sm font-semibold"
                        style={{ color: theme.text }}
                      >
                        Add New Image
                      </h4>
                      <button
                        onClick={() => {
                          setShowNewImageForm(false);
                          setNewImageData({
                            name: "",
                            description: "",
                            file: null,
                          });
                        }}
                        className="p-1 rounded hover:bg-black/10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Image File{" "}
                          <span style={{ color: theme.error }}>*</span>
                        </label>
                        <div
                          className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all"
                          style={{ borderColor: theme.border }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <Upload
                            className="w-6 h-6 mx-auto mb-2"
                            style={{ color: theme.textSecondary }}
                          />
                          <p
                            className="text-sm"
                            style={{ color: theme.textSecondary }}
                          >
                            {newImageData.file
                              ? newImageData.file.name
                              : "Click to select image"}
                          </p>
                        </div>
                      </div>

                      {newImageData.file && (
                        <div className="relative rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(newImageData.file)}
                            alt="Preview"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
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
                          className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          placeholder="e.g., Package Type Image"
                          {...focusHandlers}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
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
                          className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          placeholder="Optional description"
                          {...focusHandlers}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowNewImageForm(false);
                            setNewImageData({
                              name: "",
                              description: "",
                              file: null,
                            });
                          }}
                          className="flex-1 px-3 py-2 rounded-lg text-sm"
                          style={{
                            backgroundColor: theme.background,
                            border: `1px solid ${theme.border}`,
                            color: theme.textSecondary,
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddImage}
                          disabled={uploadingLocalImage || !newImageData.file}
                          className="flex-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                          style={{
                            backgroundColor: theme.success,
                            color: "#fff",
                          }}
                        >
                          {uploadingLocalImage ? (
                            <>
                              <Loader2 className="w-4 h-4 inline animate-spin mr-1" />
                              Uploading...
                            </>
                          ) : (
                            "Upload Image"
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Images Grid */}
              {type.images.length === 0 && (
                <div
                  className="text-center py-8 rounded-xl"
                  style={{
                    backgroundColor: `${theme.border}20`,
                    border: `1px dashed ${theme.border}`,
                  }}
                >
                  <Camera
                    className="w-12 h-12 mx-auto mb-3 opacity-30"
                    style={{ color: theme.textSecondary }}
                  />
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    No images added yet
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {type.images.map((image, index) => (
                  <div
                    key={image.imageId}
                    className="relative group rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
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
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingImage(image);
                          setEditImageData({
                            name: image.name,
                            description: image.description || "",
                          });
                        }}
                        className="p-1.5 rounded-full bg-blue-500 text-white shadow-lg hover:scale-110 transition-transform"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveImage(image.imageId);
                        }}
                        className="p-1.5 rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowNewImageForm(true)}
                className="mt-4 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: `${theme.success}10`,
                  color: theme.success,
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Image
              </button>

              {/* Uploading Indicator */}
              {(uploadingImages || uploadingLocalImage) && (
                <div
                  className="mt-4 p-3 rounded-lg flex items-center gap-2"
                  style={{ backgroundColor: `${theme.primary}10` }}
                >
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    style={{ color: theme.primary }}
                  />
                  <span className="text-sm" style={{ color: theme.primary }}>
                    {uploadingLocalImage
                      ? "Uploading image to Cloudinary..."
                      : "Processing images..."}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Image Modal */}
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
    </div>
  );
};
