"use client";

import React, { useState, useRef, useEffect } from "react";
import { ImageIcon, Plus, X, Upload, Loader2, Trash2, ChevronDown, AlertCircle } from "lucide-react";
import { Image as ImageType, NewImageRequest } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";

interface ImagesManagementProps {
  images: ImageType[];
  removedImages: number[];
  newImages: NewImageRequest[];
  uploadingImages: boolean;
  onRemoveImage: (imageId: number) => void;
  onAddNewImage: (file: File, name: string, description: string) => Promise<void>;
  error?: string;
}

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
      await onAddNewImage(newImageData.file, newImageData.name, newImageData.description);
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

  const existingImagesCount = images.filter(img => !isImageRemoved(img.imageId)).length;
  const totalImagesCount = existingImagesCount + newImages.length;

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes imagePop {
          0%   { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .image-card {
          animation: imagePop 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .new-image-form {
          animation: slideDown 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .panel-body {
          animation: fadeSlideIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .image-overlay {
          transition: opacity 0.2s ease;
        }
      `}</style>

      <div
        className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${error ? theme.error : theme.border}`,
          boxShadow: error
            ? `0 0 0 3px ${theme.error}18`
            : "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
          style={{ borderBottom: `1px solid ${theme.border}` }}
          onClick={() => setIsExpanded((prev) => !prev)}
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
                className="text-base font-semibold leading-tight"
                style={{ color: theme.text }}
              >
                Images Management
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                {totalImagesCount} total images ({existingImagesCount} existing, {newImages.length} new)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShowForm();
              }}
              disabled={uploadingImages || uploadingLocalImage}
              className="px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: `${theme.success}15`,
                border: `1px solid ${theme.success}30`,
                color: theme.success,
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Image
            </button>
            <ChevronDown
              className="w-4 h-4 transition-transform duration-300"
              style={{
                color: theme.textSecondary,
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        </div>

        {/* Body */}
        {isExpanded && (
          <div className="panel-body">
            {/* New Image Form - Appears at top when shown */}
            {showNewImageForm && (
              <div ref={formRef} className="new-image-form px-6 pt-6">
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${theme.background}, ${theme.surface})`,
                    border: `2px solid ${theme.primary}`,
                    boxShadow: `0 0 0 3px ${theme.primary}18`,
                  }}
                >
                  <div
                    className="flex items-center justify-between px-5 py-3"
                    style={{
                      borderBottom: `1px solid ${theme.border}`,
                      backgroundColor: `${theme.primary}08`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" style={{ color: theme.primary }} />
                      <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
                        Add New Image
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setShowNewImageForm(false);
                        setNewImageData({ name: "", description: "", file: null });
                      }}
                      className="p-1 rounded transition-colors hover:bg-black/10"
                      style={{ color: theme.textSecondary }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* File Upload */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                        Image File <span style={{ color: theme.error }}>*</span> <span className="text-xs">(Max 5MB)</span>
                      </label>
                      <div
                        className="border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer"
                        style={{ borderColor: theme.border }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = theme.primary;
                          e.currentTarget.style.backgroundColor = `${theme.primary}05`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = theme.border;
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="image-file-input"
                        />
                        <label htmlFor="image-file-input" className="cursor-pointer block">
                          <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: theme.textSecondary }} />
                          <p className="text-sm" style={{ color: theme.textSecondary }}>
                            {newImageData.file ? newImageData.file.name : "Click or drag to select image"}
                          </p>
                          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </label>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {newImageData.file && (
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(newImageData.file)}
                          alt="Preview"
                          className="w-full h-40 object-cover"
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 px-3 py-1.5 text-xs"
                          style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                            color: "#fff",
                          }}
                        >
                          Preview
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                          Image Name <span style={{ color: theme.error }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={newImageData.name}
                          onChange={(e) => setNewImageData({ ...newImageData, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border focus:outline-none transition-all text-sm"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.text,
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = theme.primary;
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.primary}20`;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = theme.border;
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          placeholder="e.g., Main Entrance"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                          Description
                        </label>
                        <input
                          type="text"
                          value={newImageData.description}
                          onChange={(e) => setNewImageData({ ...newImageData, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border focus:outline-none transition-all text-sm"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.text,
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = theme.primary;
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.primary}20`;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = theme.border;
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          placeholder="Optional description"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          setShowNewImageForm(false);
                          setNewImageData({ name: "", description: "", file: null });
                        }}
                        className="flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
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
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Images Section */}
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: theme.textSecondary }}
                  >
                    Existing Images
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${theme.border}60`,
                      color: theme.textSecondary,
                    }}
                  >
                    {existingImagesCount}
                  </span>
                </div>
              </div>

              {existingImagesCount === 0 ? (
                <div
                  className="text-center py-8 rounded-xl"
                  style={{
                    backgroundColor: `${theme.border}20`,
                    border: `1px dashed ${theme.border}`,
                  }}
                >
                  <ImageIcon className="w-10 h-10 mx-auto mb-2" style={{ color: theme.textSecondary }} />
                  <p className="text-sm" style={{ color: theme.textSecondary }}>No existing images</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    !isImageRemoved(image.imageId) && (
                      <div
                        key={image.imageId}
                        className="image-card relative group rounded-xl overflow-hidden transition-all duration-200"
                        style={{
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.background,
                        }}
                      >
                        <img
                          src={image.imageUrl}
                          alt={image.imageName}
                          className="w-full h-40 object-cover"
                        />
                        <div className="image-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                        </div>
                        <button
                          onClick={() => onRemoveImage(image.imageId)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* New Images Section */}
            {newImages.length > 0 && (
              <div className="px-6 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: theme.textSecondary }}
                  >
                    New Images to Add
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${theme.success}20`,
                      color: theme.success,
                    }}
                  >
                    {newImages.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newImages.map((image, index) => (
                    <div
                      key={index}
                      className="image-card relative rounded-xl overflow-hidden transition-all duration-200"
                      style={{
                        border: `2px solid ${theme.success}`,
                        backgroundColor: `${theme.success}05`,
                      }}
                    >
                      <img
                        src={image.imageUrl}
                        alt={image.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-2.5">
                        <p className="text-sm font-medium truncate" style={{ color: theme.text }}>
                          {image.name}
                        </p>
                        {image.description && (
                          <p className="text-xs truncate mt-0.5" style={{ color: theme.textSecondary }}>
                            {image.description}
                          </p>
                        )}
                      </div>
                      <div
                        className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: theme.success }}
                      >
                        New
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Uploading Indicator */}
            {(uploadingImages || uploadingLocalImage) && (
              <div className="px-6 pt-4 pb-2">
                <div
                  className="p-3 rounded-lg flex items-center gap-2"
                  style={{ backgroundColor: `${theme.primary}10` }}
                >
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: theme.primary }} />
                  <span className="text-sm" style={{ color: theme.primary }}>
                    {uploadingLocalImage ? "Uploading image to Cloudinary..." : "Processing images..."}
                  </span>
                </div>
              </div>
            )}

            {/* Spacing at bottom */}
            <div className="h-6" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="px-6 py-3 flex items-center gap-2 text-sm"
            style={{
              borderTop: `1px solid ${theme.error}30`,
              backgroundColor: `${theme.error}08`,
              color: theme.error,
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>
    </>
  );
};