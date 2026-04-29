// components/destination-categories-components/add-category-components/CategoryImagesUpload.tsx
"use client";

import React, { useRef } from "react";
import { ImageIcon, Upload, Trash2, Move } from "lucide-react";
import { PLACE_HOLDER_IMAGE } from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";

interface CategoryImage {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
  imageFile?: File;
  uploadProgress?: number;
  previewUrl?: string;
}

interface CategoryImagesUploadProps {
  images: CategoryImage[];
  errors: Record<string, string>;
  onAddImages: (images: CategoryImage[]) => void;
  onRemoveImage: (index: number) => void;
  onUpdateImageName: (index: number, name: string) => void;
  onUpdateImageDescription: (index: number, description: string) => void;
  onUpdateImageStatus: (index: number, status: "ACTIVE" | "INACTIVE") => void;
  onUpdateImageProgress: (index: number, progress: number) => void;
}

const CategoryImagesUpload: React.FC<CategoryImagesUploadProps> = ({
  images,
  errors,
  onAddImages,
  onRemoveImage,
  onUpdateImageName,
  onUpdateImageDescription,
  onUpdateImageStatus,
  onUpdateImageProgress,
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    const newImages: CategoryImage[] = [];

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
    const target = e.currentTarget as HTMLDivElement;
    target.style.borderColor = theme.primary;
    target.style.backgroundColor = hexToRgba(theme.primary, 0.05);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLDivElement;
    target.style.borderColor = errors.images ? theme.error : theme.border;
    target.style.backgroundColor = hexToRgba(theme.background, 0.5);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    if (images.length + files.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    const processFiles = async () => {
      const newImages: CategoryImage[] = [];

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

    processFiles();
  };

  return (
    <div
      className="rounded-2xl shadow-lg p-6"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
    >
      <h2
        className="text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ color: theme.text }}
      >
        <ImageIcon className="w-5 h-5" style={{ color: theme.primary }} />
        Category Images
        <span
          className="text-sm px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.1),
            color: theme.primary,
          }}
        >
          {images.length}/10
        </span>
      </h2>

      {/* Image Upload Area */}
      <div
        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 mb-4"
        style={{
          borderColor: errors.images ? theme.error : theme.border,
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
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload
            className="w-12 h-12"
            style={{ color: theme.textSecondary }}
          />
          <span style={{ color: theme.textSecondary }}>
            Click or drag images here to upload
          </span>
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            Maximum 10 images, up to 5MB each
          </span>
        </label>
      </div>
      {errors.images && (
        <p className="text-sm mt-1 mb-2" style={{ color: theme.error }}>
          {errors.images}
        </p>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 p-3 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                border: `1px solid ${theme.border}`,
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={image.previewUrl || image.imageUrl || PLACE_HOLDER_IMAGE}
                  alt={image.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={image.name}
                    onChange={(e) => onUpdateImageName(index, e.target.value)}
                    className="w-full px-2 py-1 rounded text-sm focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: theme.background,
                      color: theme.text,
                      border: `1px solid ${errors[`image_${index}_name`] ? theme.error : theme.border}`,
                    }}
                    placeholder="Image name *"
                  />
                  <input
                    type="text"
                    value={image.description}
                    onChange={(e) =>
                      onUpdateImageDescription(index, e.target.value)
                    }
                    className="w-full px-2 py-1 rounded text-xs focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: theme.background,
                      color: theme.textSecondary,
                      border: `1px solid ${theme.border}`,
                    }}
                    placeholder="Image description (optional)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="p-2 rounded-lg transition-all duration-200 hover:opacity-70"
                  style={{ color: theme.error }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Move
                  className="w-4 h-4"
                  style={{ color: theme.textSecondary }}
                />
              </div>

              {/* Image Status */}
              <div className="flex gap-2 ml-[72px]">
                <button
                  type="button"
                  onClick={() => onUpdateImageStatus(index, "ACTIVE")}
                  className={`px-3 py-1 rounded-lg text-xs transition-all duration-200 ${
                    image.status === "ACTIVE"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateImageStatus(index, "INACTIVE")}
                  className={`px-3 py-1 rounded-lg text-xs transition-all duration-200 ${
                    image.status === "INACTIVE"
                      ? "bg-gray-500 text-white"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  Inactive
                </button>
              </div>

              {errors[`image_${index}_name`] && (
                <p className="text-xs ml-[72px]" style={{ color: theme.error }}>
                  {errors[`image_${index}_name`]}
                </p>
              )}

              {image.uploadProgress !== undefined &&
                image.uploadProgress < 100 && (
                  <div
                    className="ml-[72px] w-full h-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: hexToRgba(theme.primary, 0.2) }}
                  >
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${image.uploadProgress}%`,
                        backgroundColor: theme.primary,
                      }}
                    />
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryImagesUpload;
