// components/packages-components/update-package-components/BasicInfoForm.tsx
"use client";

import React, { useId } from "react";
import { Edit, Calendar, Users, DollarSign, Palette, Percent, Tag } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { PackageAllDetails } from "@/types/package-types";
import { PackageCategory } from "@/types/common-types";
import { TourNameId } from "@/types/tour-types";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";

interface BasicInfoFormProps {
  packageData: PackageAllDetails;
  hasChanged: (field: string) => boolean;
  onFieldChange: (field: string, value: any) => void;
  availablePackageTypes: PackageCategory[];
  availableTours: TourNameId[];
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE_OUT } },
};

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active", description: "Available for booking", color: "#059669" },
  { value: "INACTIVE", label: "Inactive", description: "Temporarily unavailable", color: "#6b7280" },
];

const PRESET_COLORS = [
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  packageData,
  hasChanged,
  onFieldChange,
  availablePackageTypes,
  availableTours,
}) => {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const uid = useId();

  const focusHandlers = (isChanged: boolean) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = isChanged ? theme.primary : theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  });

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  const formatDateForInput = (date: string): string => {
    if (!date) return "";
    return date.split("T")[0];
  };

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
      <div
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
          <Edit className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
            Basic Information
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Core details about the package
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-5 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Package Name */}
          <motion.div variants={fieldVariants} className="lg:col-span-2">
            <label
              htmlFor={`${uid}-name`}
              className="block text-sm font-medium mb-1.5"
              style={{ color: theme.textSecondary }}
            >
              Package Name <span style={{ color: theme.error }}>*</span>
            </label>
            <input
              id={`${uid}-name`}
              type="text"
              value={packageData.packageName}
              onChange={(e) => onFieldChange("packageName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("packageName") ? theme.primary : theme.border,
                backgroundColor: hasChanged("packageName") ? `${theme.primary}10` : theme.background,
              }}
              placeholder="e.g., Luxury Sri Lanka Tour"
              {...focusHandlers(hasChanged("packageName"))}
            />
            <AnimatePresence>
              {hasChanged("packageName") && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs mt-1"
                  style={{ color: theme.primary }}
                >
                  This field has been modified
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Description */}
          <motion.div variants={fieldVariants} className="lg:col-span-2">
            <label
              htmlFor={`${uid}-description`}
              className="block text-sm font-medium mb-1.5"
              style={{ color: theme.textSecondary }}
            >
              Description <span style={{ color: theme.error }}>*</span>
            </label>
            <textarea
              id={`${uid}-description`}
              value={packageData.packageDescription}
              onChange={(e) => onFieldChange("packageDescription", e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
              style={{
                ...fieldBase,
                borderColor: hasChanged("packageDescription") ? theme.primary : theme.border,
                backgroundColor: hasChanged("packageDescription") ? `${theme.primary}10` : theme.background,
              }}
              placeholder="Describe the package in detail..."
              {...focusHandlers(hasChanged("packageDescription"))}
            />
          </motion.div>

          {/* Package Type & Tour Selection */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
              <Tag className="w-3.5 h-3.5" />
              Package Type <span style={{ color: theme.error }}>*</span>
            </label>
            <select
              value={packageData.packageTypeName}
              onChange={(e) => onFieldChange("packageTypeName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm cursor-pointer"
              style={{
                ...fieldBase,
                borderColor: hasChanged("packageTypeName") ? theme.primary : theme.border,
              }}
              {...focusHandlers(hasChanged("packageTypeName"))}
            >
              <option value="">Select package type...</option>
              {availablePackageTypes.map((type) => (
                <option key={type.packageCategoryId} value={type.packageCategoryName}>
                  {type.packageCategoryName}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium mb-1.5" style={{ color: theme.textSecondary }}>
              Tour <span style={{ color: theme.error }}>*</span>
            </label>
            <select
              value={packageData.tourId}
              onChange={(e) => onFieldChange("tourId", parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm cursor-pointer"
              style={{
                ...fieldBase,
                borderColor: hasChanged("tourId") ? theme.primary : theme.border,
              }}
              {...focusHandlers(hasChanged("tourId"))}
            >
              <option value={0}>Select tour...</option>
              {availableTours.map((tour) => (
                <option key={tour.tourId} value={tour.tourId}>
                  {tour.tourName}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Date Range */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
              <Calendar className="w-3.5 h-3.5" />
              Start Date <span style={{ color: theme.error }}>*</span>
            </label>
            <input
              type="date"
              value={formatDateForInput(packageData.startDate)}
              onChange={(e) => onFieldChange("startDate", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("startDate") ? theme.primary : theme.border,
              }}
              {...focusHandlers(hasChanged("startDate"))}
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
              <Calendar className="w-3.5 h-3.5" />
              End Date <span style={{ color: theme.error }}>*</span>
            </label>
            <input
              type="date"
              value={formatDateForInput(packageData.endDate)}
              onChange={(e) => onFieldChange("endDate", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("endDate") ? theme.primary : theme.border,
              }}
              {...focusHandlers(hasChanged("endDate"))}
            />
          </motion.div>

          {/* Pricing */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
              <DollarSign className="w-3.5 h-3.5" />
              Total Price (USD) <span style={{ color: theme.error }}>*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: theme.textSecondary }}>$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={packageData.totalPrice}
                onChange={(e) => onFieldChange("totalPrice", parseFloat(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("totalPrice") ? theme.primary : theme.border,
                }}
                {...focusHandlers(hasChanged("totalPrice"))}
              />
            </div>
            {packageData.totalPrice > 0 && (
              <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                ≈ {formatPrice(packageData.totalPrice)}
              </p>
            )}
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
              <Percent className="w-3.5 h-3.5" />
              Discount Percentage
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={packageData.discountPercentage}
                onChange={(e) => onFieldChange("discountPercentage", parseFloat(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm pr-8"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("discountPercentage") ? theme.primary : theme.border,
                }}
                {...focusHandlers(hasChanged("discountPercentage"))}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: theme.textSecondary }}>%</span>
            </div>
            {packageData.discountPercentage > 0 && (
              <p className="text-xs mt-1" style={{ color: theme.success }}>
                Discount: ${((packageData.totalPrice * packageData.discountPercentage) / 100).toFixed(2)}
              </p>
            )}
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
              <DollarSign className="w-3.5 h-3.5" />
              Price Per Person (USD) <span style={{ color: theme.error }}>*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: theme.textSecondary }}>$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={packageData.pricePerPerson}
                onChange={(e) => onFieldChange("pricePerPerson", parseFloat(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("pricePerPerson") ? theme.primary : theme.border,
                }}
                {...focusHandlers(hasChanged("pricePerPerson"))}
              />
            </div>
            {packageData.pricePerPerson > 0 && (
              <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                ≈ {formatPrice(packageData.pricePerPerson)} per person
              </p>
            )}
          </motion.div>

          {/* Person Count */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
              <Users className="w-3.5 h-3.5" />
              Min Persons <span style={{ color: theme.error }}>*</span>
            </label>
            <input
              type="number"
              min="1"
              value={packageData.minPersonCount}
              onChange={(e) => onFieldChange("minPersonCount", parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("minPersonCount") ? theme.primary : theme.border,
              }}
              {...focusHandlers(hasChanged("minPersonCount"))}
            />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
              <Users className="w-3.5 h-3.5" />
              Max Persons <span style={{ color: theme.error }}>*</span>
            </label>
            <input
              type="number"
              min="1"
              value={packageData.maxPersonCount}
              onChange={(e) => onFieldChange("maxPersonCount", parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
              style={{
                ...fieldBase,
                borderColor: hasChanged("maxPersonCount") ? theme.primary : theme.border,
              }}
              {...focusHandlers(hasChanged("maxPersonCount"))}
            />
          </motion.div>

          {/* Colors */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
              <Palette className="w-3.5 h-3.5" />
              Theme Color
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onFieldChange("color", color)}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: packageData.color === color ? theme.text : "transparent",
                    boxShadow: packageData.color === color ? `0 0 0 2px ${theme.background}, 0 0 0 4px ${color}` : "none",
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={packageData.color}
                onChange={(e) => onFieldChange("color", e.target.value)}
                className="w-12 h-10 rounded border cursor-pointer"
                style={{ borderColor: theme.border }}
              />
              <input
                type="text"
                value={packageData.color}
                onChange={(e) => onFieldChange("color", e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("color") ? theme.primary : theme.border,
                }}
                placeholder="#000000"
                {...focusHandlers(hasChanged("color"))}
              />
            </div>
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
              <Palette className="w-3.5 h-3.5" />
              Hover Color
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onFieldChange("hoverColor", color)}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: packageData.hoverColor === color ? theme.text : "transparent",
                    boxShadow: packageData.hoverColor === color ? `0 0 0 2px ${theme.background}, 0 0 0 4px ${color}` : "none",
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={packageData.hoverColor}
                onChange={(e) => onFieldChange("hoverColor", e.target.value)}
                className="w-12 h-10 rounded border cursor-pointer"
                style={{ borderColor: theme.border }}
              />
              <input
                type="text"
                value={packageData.hoverColor}
                onChange={(e) => onFieldChange("hoverColor", e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 text-sm"
                style={{
                  ...fieldBase,
                  borderColor: hasChanged("hoverColor") ? theme.primary : theme.border,
                }}
                placeholder="#000000"
                {...focusHandlers(hasChanged("hoverColor"))}
              />
            </div>
          </motion.div>

          {/* Status */}
          <motion.div variants={fieldVariants} className="lg:col-span-2">
            <label className="block text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>
              Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = packageData.packageStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFieldChange("packageStatus", opt.value)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left cursor-pointer transition-all"
                    style={{
                      backgroundColor: isSelected ? `${opt.color}10` : theme.background,
                      borderColor: isSelected ? opt.color : theme.border,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: opt.color }}
                    />
                    <span className="flex-1 text-sm font-medium" style={{ color: isSelected ? opt.color : theme.text }}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <svg className="w-4 h-4" style={{ color: opt.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};