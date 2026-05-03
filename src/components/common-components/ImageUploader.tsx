"use client";

import React, { useId, useState, useRef, useEffect } from "react";
import { ImageIcon, CloudUpload, Loader, Plus, X, AlertCircle, Camera, Trash2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { OtherService } from "@/services/otherService";

interface ImageData {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
}

interface ImagePreview {
  url: string;
  file?: File;
  uploading?: boolean;
  uploadError?: string;
}

interface ImageUploaderProps {
  images: ImageData[];
  imagePreviews: ImagePreview[];
  onImagePreviewsChange: (previews: ImagePreview[]) => void;
  onImagesChange: (images: ImageData[]) => void;
  onUploadingChange: (uploading: boolean) => void;
  errors?: Record<string, string>;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  imagePreviews,
  onImagePreviewsChange,
  onImagesChange,
  onUploadingChange,
  errors = {},
  maxImages = 20,
}) => {
  const { theme } = useTheme();
  const uid = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newImage, setNewImage] = useState<ImageData>({
    name: "",
    description: "",
    imageUrl: "",
    status: "ACTIVE",
  });
  const [isExpanded, setIsExpanded] = useState(true);
  const [localUploading, setLocalUploading] = useState(false);

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
      const response = await OtherService.uploadImage(file);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > maxImages) {
      // Show error or toast
      console.error(`Maximum ${maxImages} images allowed`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setLocalUploading(true);
    onUploadingChange(true);

    const newPreviews: ImagePreview[] = [];
    const newImages: ImageData[] = [];

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        console.error(`File ${file.name} exceeds 5MB limit`);
        continue;
      }
      if (!file.type.startsWith("image/")) {
        console.error(`File ${file.name} is not an image`);
        continue;
      }

      // Add temporary preview with uploading state
      const tempPreview: ImagePreview = {
        url: URL.createObjectURL(file),
        file: file,
        uploading: true,
      };
      newPreviews.push(tempPreview);
      onImagePreviewsChange([...imagePreviews, ...newPreviews]);

      try {
        const cloudinaryUrl = await uploadImageToCloudinary(file);
        
        // Update the preview with the cloudinary URL
        const updatedPreviews = [...imagePreviews, ...newPreviews].map(preview =>
          preview.file === file
            ? { ...preview, url: cloudinaryUrl, uploading: false }
            : preview
        );
        onImagePreviewsChange(updatedPreviews);

        const newImageData: ImageData = {
          name: file.name.split(".")[0],
          description: `Uploaded image: ${file.name}`,
          imageUrl: cloudinaryUrl,
          status: "ACTIVE",
        };
        newImages.push(newImageData);
        onImagesChange([...images, ...newImages]);
        
        // Remove from newPreviews array
        const index = newPreviews.findIndex(p => p.file === file);
        if (index !== -1) newPreviews.splice(index, 1);
      } catch (error: any) {
        // Remove the failed preview
        const failedPreviews = [...imagePreviews, ...newPreviews].filter(
          preview => preview.file !== file
        );
        onImagePreviewsChange(failedPreviews);
        console.error(`Failed to upload ${file.name}:`, error.message);
      }
    }

    setLocalUploading(false);
    onUploadingChange(false);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddImageByUrl = () => {
    if (!newImage.name.trim() || !newImage.imageUrl.trim()) {
      return;
    }
    try {
      new URL(newImage.imageUrl);
    } catch {
      return;
    }

    // Check if we've reached max images
    if (images.length + 1 > maxImages) {
      console.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    onImagePreviewsChange([...imagePreviews, { url: newImage.imageUrl, uploading: false }]);
    onImagesChange([...images, { ...newImage }]);
    setNewImage({ name: "", description: "", imageUrl: "", status: "ACTIVE" });
  };

  const handleRemoveImage = (index: number) => {
    const previewToRemove = imagePreviews[index];
    if (previewToRemove?.url && previewToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(previewToRemove.url);
    }
    onImagesChange(images.filter((_, i) => i !== index));
    onImagePreviewsChange(imagePreviews.filter((_, i) => i !== index));
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.url && preview.url.startsWith("blob:")) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner { animation: spin 0.8s linear infinite; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .image-card { animation: fadeIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .panel-body { animation: fadeSlideIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      <div className="space-y-6">
        {/* Image Upload Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
            style={{ borderBottom: `1px solid ${theme.border}` }}
            onClick={() => setIsExpanded(!isExpanded)}
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
                <h2 className="text-base font-semibold leading-tight" style={{ color: theme.text }}>
                  Images
                </h2>
                <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                  Upload images or add by URL
                </p>
              </div>
            </div>
            {images.length > 0 && (
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${theme.primary}12`,
                  color: theme.primary,
                }}
              >
                {images.length}/{maxImages}
              </span>
            )}
          </div>

          {isExpanded && (
            <div className="panel-body px-6 py-6 space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textSecondary }}>
                  Upload Image Files
                </label>
                <div
                  className="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group"
                  style={{ borderColor: theme.border }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.primary;
                    e.currentTarget.style.backgroundColor = `${theme.primary}04`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id={`${uid}-image-upload`}
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={localUploading}
                  />
                  <label htmlFor={`${uid}-image-upload`} className="cursor-pointer block">
                    {localUploading ? (
                      <>
                        <Loader className="w-12 h-12 mx-auto mb-4 spinner" style={{ color: theme.primary }} />
                        <p className="font-medium mb-1" style={{ color: theme.text }}>
                          Uploading to Cloudinary...
                        </p>
                        <p className="text-xs" style={{ color: theme.textSecondary }}>
                          Please wait for upload to complete
                        </p>
                      </>
                    ) : (
                      <>
                        <CloudUpload
                          className="w-12 h-12 mx-auto mb-4 transition-all duration-200 group-hover:scale-110"
                          style={{ color: theme.textSecondary }}
                        />
                        <p className="font-medium mb-1" style={{ color: theme.text }}>
                          Click to upload images
                        </p>
                        <p className="text-xs" style={{ color: theme.textSecondary }}>
                          PNG, JPG, GIF up to 5MB each (Max {maxImages} images)
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Manual Image URL Section */}
              <div className="space-y-4">
                <div className="pt-2">
                  <label className="block text-sm font-medium mb-3" style={{ color: theme.textSecondary }}>
                    Or Add by URL
                  </label>
                  
                  <div className="mb-3">
                    <input
                      type="text"
                      value={newImage.imageUrl}
                      onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border-2 text-sm"
                      style={{
                        ...fieldBase,
                        borderColor: theme.border,
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <input
                      type="text"
                      value={newImage.name}
                      onChange={(e) => setNewImage({ ...newImage, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border-2 text-sm"
                      style={{
                        ...fieldBase,
                        borderColor: theme.border,
                      }}
                      placeholder="Image Name"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <textarea
                      value={newImage.description}
                      onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border-2 text-sm resize-none"
                      style={{
                        ...fieldBase,
                        borderColor: theme.border,
                      }}
                      placeholder="Image Description (Optional)"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddImageByUrl}
                    disabled={!newImage.imageUrl || images.length >= maxImages}
                    className="cursor-pointer w-full px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: `${theme.success}10`,
                      border: `1px solid ${theme.success}30`,
                      color: theme.success,
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Image by URL
                  </button>
                </div>
              </div>

              {errors.images && (
                <p className="text-xs flex items-center gap-1" style={{ color: theme.error }}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.images}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Image Gallery */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                backgroundColor: `${theme.accent}18`,
                color: theme.accent,
              }}
            >
              <Camera className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold leading-tight" style={{ color: theme.text }}>
                Image Gallery
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                Preview and manage uploaded images
              </p>
            </div>
            {imagePreviews.length > 0 && (
              <span
                className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${theme.accent}12`,
                  color: theme.accent,
                }}
              >
                {imagePreviews.length} / {maxImages}
              </span>
            )}
          </div>

          <div className="px-6 py-6">
            {imagePreviews.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: theme.textSecondary }} />
                <p className="text-sm font-medium mb-1" style={{ color: theme.text }}>
                  No images added yet
                </p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Upload images or add by URL to preview
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="image-card group relative rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg"
                    style={{ border: `1px solid ${theme.border}` }}
                  >
                    <img
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                    
                    {preview.uploading && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <Loader className="w-8 h-8 text-white spinner mx-auto mb-2" />
                          <p className="text-white text-xs">Uploading...</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-sm font-medium truncate">
                          {images[index]?.name || `Image ${index + 1}`}
                        </p>
                        <p className="text-white/70 text-xs truncate">
                          {images[index]?.description || "No description"}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      disabled={preview.uploading}
                      className="cursor-pointer absolute top-3 right-3 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 disabled:opacity-0"
                      style={{
                        backgroundColor: theme.error,
                        color: "white",
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};