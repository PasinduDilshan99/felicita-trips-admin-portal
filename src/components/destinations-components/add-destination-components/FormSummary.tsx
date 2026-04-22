"use client";

import React from "react";
import { Eye, Shield, MapPin, Tag, DollarSign, Image, CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface FormSummaryProps {
  formData: any;
  categories: any[];
  getCategoryName: (id: number) => string;
  getCategoryColor: (id: number) => string;
}

export const FormSummary: React.FC<FormSummaryProps> = ({
  formData,
  categories,
  getCategoryName,
  getCategoryColor,
}) => {
  const { theme } = useTheme();

  const hasCoordinates = formData.latitude && formData.longitude;
  const hasPricing = formData.extraPrice || formData.extraPriceNote;
  const hasImages = formData.images && formData.images.length > 0;

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .summary-card {
          animation: fadeSlideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      <div className="space-y-6">
        {/* Form Preview Card */}
        <div
          className="summary-card rounded-2xl overflow-hidden"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                backgroundColor: `${theme.warning}18`,
                color: theme.warning,
              }}
            >
              <Eye className="w-4 h-4" />
            </span>
            <div>
              <h2
                className="text-base font-semibold leading-tight"
                style={{ color: theme.text }}
              >
                Form Summary
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                Review your destination information
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-3">
            {/* Destination Name */}
            <div
              className="flex justify-between items-start p-3 rounded-xl"
              style={{ backgroundColor: `${theme.primary}08` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: theme.primary }}>
                  Destination
                </span>
              </div>
              <span
                className="font-medium text-sm text-right max-w-[60%] truncate"
                style={{ color: formData.name ? theme.text : theme.textSecondary }}
              >
                {formData.name || "Not set"}
              </span>
            </div>

            {/* Categories */}
            <div
              className="flex justify-between items-start p-3 rounded-xl"
              style={{ backgroundColor: `${theme.success}08` }}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" style={{ color: theme.success }} />
                <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                  Categories
                </span>
              </div>
              <div className="text-right max-w-[60%]">
                {formData.destinationCategoriesIdList?.length > 0 ? (
                  <div className="flex flex-wrap gap-1 justify-end">
                    {formData.destinationCategoriesIdList.map((id: number) => (
                      <span
                        key={id}
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${getCategoryColor(id)}20`,
                          color: getCategoryColor(id)
                        }}
                      >
                        {getCategoryName(id)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs" style={{ color: theme.textSecondary }}>
                    Not set
                  </span>
                )}
              </div>
            </div>

            {/* Location */}
            <div
              className="flex justify-between items-start p-3 rounded-xl"
              style={{ backgroundColor: `${theme.accent}08` }}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                  Location
                </span>
              </div>
              <div className="text-right">
                <span
                  className="font-medium text-sm max-w-[60%] truncate block"
                  style={{ color: formData.location ? theme.text : theme.textSecondary }}
                >
                  {formData.location || "Not set"}
                </span>
                {hasCoordinates && (
                  <span className="text-xs mt-0.5 block" style={{ color: theme.textSecondary }}>
                    {Number(formData.latitude).toFixed(4)}°, {Number(formData.longitude).toFixed(4)}°
                  </span>
                )}
              </div>
            </div>

            {/* Status */}
            <div
              className="flex justify-between items-center p-3 rounded-xl"
              style={{ backgroundColor: `${theme.warning}08` }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" style={{ color: theme.warning }} />
                <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                  Status
                </span>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: formData.status === "ACTIVE" 
                    ? `${theme.success}20`
                    : `${theme.textSecondary}20`,
                  color: formData.status === "ACTIVE" 
                    ? theme.success
                    : theme.textSecondary,
                }}
              >
                {formData.status || "Not set"}
              </span>
            </div>

            {/* Pricing */}
            {hasPricing && (
              <div
                className="flex justify-between items-start p-3 rounded-xl"
                style={{ backgroundColor: `${theme.success}08` }}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5" style={{ color: theme.success }} />
                  <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                    Pricing
                  </span>
                </div>
                <div className="text-right">
                  {formData.extraPrice && (
                    <div className="font-semibold text-sm" style={{ color: theme.success }}>
                      ${Number(formData.extraPrice).toFixed(2)}
                    </div>
                  )}
                  {formData.extraPriceNote && (
                    <div className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                      {formData.extraPriceNote}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Images */}
            <div
              className="flex justify-between items-center p-3 rounded-xl"
              style={{ backgroundColor: `${theme.error}08` }}
            >
              <div className="flex items-center gap-2">
                <Image className="w-3.5 h-3.5" style={{ color: theme.error }} />
                <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                  Images
                </span>
              </div>
              <span
                className="font-semibold text-sm"
                style={{ color: hasImages ? theme.text : theme.textSecondary }}
              >
                {hasImages ? `${formData.images.length} image(s)` : "No images"}
              </span>
            </div>
          </div>
        </div>

        {/* Tips & Guidelines */}
        <div
          className="summary-card rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}08, ${theme.accent}08)`,
            border: `1px solid ${theme.primary}20`,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ borderBottom: `1px solid ${theme.primary}20` }}
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                backgroundColor: `${theme.success}18`,
                color: theme.success,
              }}
            >
              <Shield className="w-4 h-4" />
            </span>
            <div>
              <h2
                className="text-base font-semibold leading-tight"
                style={{ color: theme.text }}
              >
                Tips & Guidelines
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                Best practices for destination creation
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="space-y-3">
              {[
                {
                  text: "Images are automatically uploaded to Cloudinary for optimal performance",
                  icon: "upload"
                },
                {
                  text: "Use descriptive names and detailed descriptions (max 1000 characters)",
                  icon: "text"
                },
                {
                  text: "Add high-quality images (max 5MB each) for better presentation",
                  icon: "image"
                },
                {
                  text: "You can select multiple categories for better discoverability",
                  icon: "tag"
                },
                {
                  text: "Verify coordinates for accurate location mapping",
                  icon: "map"
                }
              ].map((tip, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 group"
                  style={{
                    animation: `fadeSlideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.05}s both`
                  }}
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 transition-all duration-200 group-hover:scale-125"
                    style={{ backgroundColor: theme.success }}
                  />
                  <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};