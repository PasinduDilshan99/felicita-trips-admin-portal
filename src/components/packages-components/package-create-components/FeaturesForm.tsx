"use client";

import React, { useState } from "react";
import { Plus, X, AlertCircle, ChevronDown, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { AddFeatureRequest, FeaturesFormProps } from "@/types/package-types";

export const FeaturesForm: React.FC<FeaturesFormProps> = ({
  features,
  onFeaturesChange,
  error,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [newFeature, setNewFeature] = useState<Partial<AddFeatureRequest>>({
    featureName: "",
    featureValue: "",
    featureDescription: "",
    color: "#10b981",
    hoverColor: "#059669",
    specialNote: "",
    status: "ACTIVE",
  });

  const addFeature = () => {
    if (!newFeature.featureName?.trim() || !newFeature.featureValue?.trim())
      return;
    onFeaturesChange([
      ...features,
      {
        featureName: newFeature.featureName!,
        featureValue: newFeature.featureValue!,
        featureDescription: newFeature.featureDescription || "",
        color: newFeature.color || "#10b981",
        hoverColor: newFeature.hoverColor || "#059669",
        specialNote: newFeature.specialNote || "",
        status: "ACTIVE",
      },
    ]);
    setNewFeature({
      featureName: "",
      featureValue: "",
      featureDescription: "",
      color: "#10b981",
      hoverColor: "#059669",
      specialNote: "",
      status: "ACTIVE",
    });
  };

  const removeFeature = (index: number) => {
    onFeaturesChange(features.filter((_, i) => i !== index));
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
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
              backgroundColor: `${theme.success}18`,
              color: theme.success,
            }}
          >
            <Star className="w-4 h-4" />
          </span>
          <div>
            <h2
              className="text-base font-semibold"
              style={{ color: theme.text }}
            >
              Package Features
            </h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              Key features and highlights of this package
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {features.length > 0 && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${theme.primary}15`,
                color: theme.primary,
              }}
            >
              {features.length}
            </span>
          )}
          <ChevronDown
            className="w-4 h-4 transition-transform duration-300"
            style={{
              color: theme.textSecondary,
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </div>
      {isExpanded && (
        <div className="px-6 py-6 space-y-4">
          {features.length > 0 && (
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    backgroundColor: `${feature.color}10`,
                    border: `1px solid ${feature.color}30`,
                  }}
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: feature.color }}
                    >
                      {feature.featureName}: {feature.featureValue}
                    </p>
                    {feature.featureDescription && (
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        {feature.featureDescription}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-1 rounded hover:bg-opacity-20 transition-colors"
                    style={{ color: theme.error }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Feature name (e.g., Accommodation)"
              value={newFeature.featureName}
              onChange={(e) =>
                setNewFeature({ ...newFeature, featureName: e.target.value })
              }
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: theme.background,
                border: `1px solid ${theme.border}`,
                color: theme.text,
              }}
            />
            <input
              type="text"
              placeholder="Feature value (e.g., 5-star hotel)"
              value={newFeature.featureValue}
              onChange={(e) =>
                setNewFeature({ ...newFeature, featureValue: e.target.value })
              }
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: theme.background,
                border: `1px solid ${theme.border}`,
                color: theme.text,
              }}
            />
          </div>
          <input
            type="text"
            placeholder="Feature description (Optional)"
            value={newFeature.featureDescription}
            onChange={(e) =>
              setNewFeature({
                ...newFeature,
                featureDescription: e.target.value,
              })
            }
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.border}`,
              color: theme.text,
            }}
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <label
                className="text-xs mb-1 block"
                style={{ color: theme.textSecondary }}
              >
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newFeature.color}
                  onChange={(e) =>
                    setNewFeature({ ...newFeature, color: e.target.value })
                  }
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={newFeature.color}
                  onChange={(e) =>
                    setNewFeature({ ...newFeature, color: e.target.value })
                  }
                  className="flex-1 px-2 py-1 rounded text-sm"
                  style={{
                    backgroundColor: theme.background,
                    border: `1px solid ${theme.border}`,
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              <label
                className="text-xs mb-1 block"
                style={{ color: theme.textSecondary }}
              >
                Hover Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newFeature.hoverColor}
                  onChange={(e) =>
                    setNewFeature({ ...newFeature, hoverColor: e.target.value })
                  }
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={newFeature.hoverColor}
                  onChange={(e) =>
                    setNewFeature({ ...newFeature, hoverColor: e.target.value })
                  }
                  className="flex-1 px-2 py-1 rounded text-sm"
                  style={{
                    backgroundColor: theme.background,
                    border: `1px solid ${theme.border}`,
                  }}
                />
              </div>
            </div>
          </div>
          <input
            type="text"
            placeholder="Special note (Optional)"
            value={newFeature.specialNote}
            onChange={(e) =>
              setNewFeature({ ...newFeature, specialNote: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: theme.background,
              border: `1px solid ${theme.border}`,
              color: theme.text,
            }}
          />
          <button
            type="button"
            onClick={addFeature}
            disabled={
              !newFeature.featureName?.trim() ||
              !newFeature.featureValue?.trim()
            }
            className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            style={{
              backgroundColor: `${theme.success}10`,
              border: `1px solid ${theme.success}30`,
              color: theme.success,
            }}
          >
            <Plus className="w-4 h-4" />
            Add Feature
          </button>
          {error && (
            <p
              className="text-xs flex items-center gap-1"
              style={{ color: theme.error }}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
