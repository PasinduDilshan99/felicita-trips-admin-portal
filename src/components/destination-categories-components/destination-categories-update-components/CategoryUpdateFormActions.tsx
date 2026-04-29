// components/destination-categories-components/destination-categories-update-components/CategoryUpdateFormActions.tsx
"use client";

import React, { useState } from "react";
import { Save, RotateCcw, X, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ConfirmDialog } from "./ConfirmDialog";

interface CategoryUpdateFormActionsProps {
  loading: boolean;
  uploadingImages: boolean;
  onSave: () => void;
  onReset: () => void;
  errors?: Record<string, string>;
}

export const CategoryUpdateFormActions: React.FC<
  CategoryUpdateFormActionsProps
> = ({ loading, uploadingImages, onSave, onReset, errors = {} }) => {
  const { theme } = useTheme();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const hasErrors = Object.keys(errors).length > 0;
  const isProcessing = loading || uploadingImages;

  const handleSaveClick = () => {
    // If there are errors, don't show confirm dialog
    if (hasErrors) {
      return;
    }
    // Show confirm dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmDialog(false);
    onSave();
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner-white { 
          animation: spin 0.8s linear infinite; 
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .error-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSave}
        title="Update Category"
        message="Are you sure you want to update this category? This action will modify the category details and images."
        confirmText="Yes, Update Category"
        cancelText="Cancel"
        type="warning"
        isLoading={isProcessing}
      />

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Error Summary (if any errors exist) */}
        {hasErrors && (
          <div
            className="px-6 py-4 border-b"
            style={{
              backgroundColor: `${theme.error}08`,
              borderColor: theme.border,
            }}
          >
            <div className="flex items-start gap-2">
              <AlertCircle
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: theme.error }}
              />
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: theme.error }}
                >
                  Please fix the following errors before updating:
                </p>
                <ul
                  className="text-xs space-y-0.5"
                  style={{ color: theme.error }}
                >
                  {Object.entries(errors)
                    .slice(0, 5)
                    .map(([field, message]) => (
                      <li key={field} className="flex items-center gap-1">
                        <span>•</span>
                        <span className="capitalize">
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/_/g, " ")
                            .trim()}
                        </span>
                        <span>: {message}</span>
                      </li>
                    ))}
                  {Object.keys(errors).length > 5 && (
                    <li className="mt-1">
                      • And {Object.keys(errors).length - 5} more error(s)
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Reset Button */}
            <button
              type="button"
              onClick={onReset}
              disabled={isProcessing}
              className="cursor-pointer flex-1 px-6 py-3 rounded-xl border-2 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.textSecondary,
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.backgroundColor = `${theme.primary}05`;
                  e.currentTarget.style.color = theme.primary;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.backgroundColor = theme.background;
                e.currentTarget.style.color = theme.textSecondary;
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Reset Changes
            </button>

            {/* Update Button */}
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isProcessing || hasErrors}
              className="cursor-pointer flex-1 px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-0 disabled:hover:translate-y-0"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent || theme.primary})`,
                boxShadow: hasErrors ? `0 0 0 2px ${theme.error}40` : "none",
              }}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner-white" />
                  <span>
                    {uploadingImages
                      ? "Uploading Images..."
                      : loading
                        ? "Updating Category..."
                        : "Processing..."}
                  </span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Category
                </>
              )}
            </button>
          </div>

          {/* Helper text */}
          <p
            className="text-xs text-center mt-4"
            style={{ color: theme.textSecondary }}
          >
            All fields marked with <span style={{ color: theme.error }}>*</span>{" "}
            are required
          </p>
        </div>
      </div>
    </>
  );
};
