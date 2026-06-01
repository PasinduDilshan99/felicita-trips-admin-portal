"use client";

import React from "react";
import {
  Package,
  Hotel,
  Utensils,
  Car,
  Building,
  Compass,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useCommon } from "@/contexts/CommonContext";
import { PackageTypeSelectorProps } from "@/types/package-types";

const getPackageIcon = (index: number) => {
  const icons = [
    <Package className="w-5 h-5" />,
    <Hotel className="w-5 h-5" />,
    <Building className="w-5 h-5" />,
    <Compass className="w-5 h-5" />,
    <Utensils className="w-5 h-5" />,
    <Car className="w-5 h-5" />,
  ];
  return icons[index % icons.length];
};

export const PackageTypeSelector: React.FC<PackageTypeSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const { theme } = useTheme();
  const { categories, loading: categoriesLoading } = useCommon();

  const packageCategories = categories?.packageCategoryList || [];

  if (categoriesLoading) {
    return (
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.textSecondary }}
        >
          Package Type <span style={{ color: theme.error }}>*</span>
        </label>
        <div className="flex items-center justify-center py-8">
          <Loader
            className="w-6 h-6 animate-spin"
            style={{ color: theme.primary }}
          />
          <span className="ml-2 text-sm" style={{ color: theme.textSecondary }}>
            Loading package types...
          </span>
        </div>
      </div>
    );
  }

  if (packageCategories.length === 0) {
    return (
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme.textSecondary }}
        >
          Package Type <span style={{ color: theme.error }}>*</span>
        </label>
        <div
          className="p-4 rounded-xl text-center"
          style={{
            backgroundColor: `${theme.warning}10`,
            border: `1px solid ${theme.warning}30`,
            color: theme.warning,
          }}
        >
          <AlertCircle className="w-5 h-5 mx-auto mb-2" />
          <p className="text-sm">
            No package types available. Please add package types first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: theme.textSecondary }}
      >
        Package Type <span style={{ color: theme.error }}>*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {packageCategories.map((category, index) => {
          const isSelected = value === category.packageCategoryId;
          const categoryColor = category.packageCategoryColor || theme.primary;
          const categoryHoverColor =
            category.packageCategoryHoverColor || categoryColor;

          return (
            <button
              key={category.packageCategoryId}
              type="button"
              onClick={() => onChange(category.packageCategoryId)}
              className="p-4 rounded-xl border-2 text-left transition-all duration-200 hover:translate-y-[-2px]"
              style={{
                backgroundColor: isSelected
                  ? `${categoryColor}10`
                  : theme.surface,
                borderColor: isSelected ? categoryColor : theme.border,
                boxShadow: isSelected ? `0 0 0 2px ${categoryColor}20` : "none",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = categoryColor;
                  e.currentTarget.style.backgroundColor = `${categoryColor}05`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.backgroundColor = theme.surface;
                }
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200"
                  style={{
                    backgroundColor: isSelected
                      ? `${categoryColor}20`
                      : `${theme.border}30`,
                    color: isSelected ? categoryColor : theme.textSecondary,
                  }}
                >
                  {getPackageIcon(index)}
                </span>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: isSelected ? categoryColor : theme.text }}
                  >
                    {category.packageCategoryName}
                  </p>
                </div>
              </div>
              {category.packageCategoryDescription && (
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  {category.packageCategoryDescription}
                </p>
              )}
              {category.packageCategoryImages &&
                category.packageCategoryImages.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {category.packageCategoryImages
                      .slice(0, 2)
                      .map((img, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="w-6 h-6 rounded-md bg-cover bg-center"
                          style={{ backgroundImage: `url(${img.imageUrl})` }}
                          title={img.imageName}
                        />
                      ))}
                    {category.packageCategoryImages.length > 2 && (
                      <span
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        +{category.packageCategoryImages.length - 2}
                      </span>
                    )}
                  </div>
                )}
            </button>
          );
        })}
      </div>
      {error && (
        <p
          className="mt-1.5 text-xs flex items-center gap-1"
          style={{ color: theme.error }}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
