// components/common-components/UpdateConfirmationModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  X, 
  CheckCircle, 
  Info, 
  AlertCircle,
  ArrowRight,
  Edit,
  Database
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export type UpdateConfirmationModalType = "update" | "warning" | "danger" | "info";

export interface ChangedField {
  field: string;
  oldValue: any;
  newValue: any;
}

interface UpdateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  changedFields: ChangedField[];
  confirmText?: string;
  cancelText?: string;
  type?: UpdateConfirmationModalType;
  isLoading?: boolean;
  confirmButtonColor?: string;
  itemName?: string;
  showFieldComparisons?: boolean;
}

export const UpdateConfirmationModal: React.FC<UpdateConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  changedFields,
  confirmText = "Confirm Update",
  cancelText = "Cancel",
  type = "update",
  isLoading = false,
  confirmButtonColor,
  itemName,
  showFieldComparisons = true,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Get icon and default colors based on type
  const getTypeConfig = () => {
    switch (type) {
      case "danger":
        return {
          icon: AlertTriangle,
          iconColor: theme.error || "#ef4444",
          defaultButtonColor: theme.error || "#ef4444",
          bgGlow: `${theme.error}20`,
          headerBg: `${theme.error}08`,
        };
      case "warning":
        return {
          icon: AlertCircle,
          iconColor: theme.warning || "#f59e0b",
          defaultButtonColor: theme.warning || "#f59e0b",
          bgGlow: `${theme.warning}20`,
          headerBg: `${theme.warning}08`,
        };
      case "info":
        return {
          icon: Info,
          iconColor: theme.primary || "#3b82f6",
          defaultButtonColor: theme.primary || "#3b82f6",
          bgGlow: `${theme.primary}20`,
          headerBg: `${theme.primary}08`,
        };
      default: // update
        return {
          icon: Edit,
          iconColor: theme.primary || "#3b82f6",
          defaultButtonColor: theme.primary || "#3b82f6",
          bgGlow: `${theme.primary}20`,
          headerBg: `${theme.primary}08`,
        };
    }
  };

  const typeConfig = getTypeConfig();
  const Icon = typeConfig.icon;
  const buttonColor = confirmButtonColor || typeConfig.defaultButtonColor;

  const finalTitle = title || "Confirm Update";
  const finalMessage = message || `Are you sure you want to update ${itemName ? `"${itemName}"` : "this item"}?`;

  // Group changes by category
  const groupedChanges = React.useMemo(() => {
    const groups: Record<string, ChangedField[]> = {
      "Basic Information": [],
      "Status": [],
      "Relationships": [],
      "Other": []
    };

    changedFields.forEach(field => {
      const fieldLower = field.field.toLowerCase();
      if (fieldLower.includes("name") || fieldLower.includes("description") || fieldLower.includes("title")) {
        groups["Basic Information"].push(field);
      } else if (fieldLower.includes("status")) {
        groups["Status"].push(field);
      } else if (fieldLower.includes("category") || fieldLower.includes("privilege") || fieldLower.includes("role")) {
        groups["Relationships"].push(field);
      } else {
        groups["Other"].push(field);
      }
    });

    // Remove empty groups
    return Object.fromEntries(Object.entries(groups).filter(([_, fields]) => fields.length > 0));
  }, [changedFields]);

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Format value for display
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) {
      if (value.length === 0) return "None";
      if (value.length > 3) return `${value.length} items`;
      return value.join(", ");
    }
    if (typeof value === "object") return JSON.stringify(value);
    if (value === "") return "(empty)";
    return String(value);
  };

  // Truncate long values
  const truncateValue = (value: string, maxLength: number = 50): string => {
    if (value.length <= maxLength) return value;
    return value.substring(0, maxLength) + "...";
  };

  // Handle animation and portal rendering
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "";
      }, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, isLoading, onClose]);

  if (!shouldRender) return null;

  return (
    <>
      <style jsx>{`
        @keyframes modalBackdropFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(4px); }
        }
        @keyframes modalBackdropFadeOut {
          from { opacity: 1; backdrop-filter: blur(4px); }
          to { opacity: 0; backdrop-filter: blur(0px); }
        }
        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes modalSlideOut {
          from { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
          }
          to { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.95);
          }
        }
        @keyframes iconPop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes highlightPulse {
          0%, 100% { background-color: transparent; }
          50% { background-color: ${typeConfig.bgGlow}; }
        }
        
        .backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(0px);
          z-index: 9998;
        }
        
        .backdrop-enter {
          animation: modalBackdropFadeIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .backdrop-exit {
          animation: modalBackdropFadeOut 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .modal-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          width: 90%;
          max-width: 550px;
        }
        
        .modal-enter {
          animation: modalSlideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .modal-exit {
          animation: modalSlideOut 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        .icon-animation {
          animation: iconPop 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
        }
        
        .section-enter {
          animation: slideDown 0.25s ease-out forwards;
        }
        
        .highlight-row {
          animation: highlightPulse 0.6s ease-in-out;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className={`backdrop ${isVisible ? "backdrop-enter" : "backdrop-exit"}`}
        onClick={!isLoading ? onClose : undefined}
        style={{
          backgroundColor: `rgba(0, 0, 0, 0.6)`,
        }}
      />

      {/* Modal */}
      <div className={`modal-container ${isVisible ? "modal-enter" : "modal-exit"}`}>
        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header with Icon */}
          <div
            className="p-6 border-b"
            style={{
              borderColor: theme.border,
              backgroundColor: typeConfig.headerBg,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="icon-animation w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${typeConfig.iconColor}15`,
                }}
              >
                <Icon
                  className="w-6 h-6"
                  style={{ color: typeConfig.iconColor }}
                />
              </div>
              <div className="flex-1">
                <h2
                  className="text-xl font-semibold mb-1"
                  style={{ color: theme.text }}
                >
                  {finalTitle}
                </h2>
                <p
                  className="text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  {finalMessage}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="cursor-pointer p-1 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 flex-shrink-0"
                style={{ color: theme.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.border}40`;
                  e.currentTarget.style.color = theme.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.textSecondary;
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Changes Summary */}
          <div
            className="p-4 border-b"
            style={{
              borderColor: theme.border,
              backgroundColor: `${theme.background}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" style={{ color: theme.textSecondary }} />
                <span className="text-sm font-medium" style={{ color: theme.text }}>
                  Changes Summary
                </span>
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: typeConfig.bgGlow,
                  color: typeConfig.iconColor,
                }}
              >
                {changedFields.length} field{changedFields.length !== 1 ? "s" : ""} changed
              </span>
            </div>
          </div>

          {/* Changes List - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "400px" }}>
            {showFieldComparisons && Object.keys(groupedChanges).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(groupedChanges).map(([section, fields]) => (
                  <div
                    key={section}
                    className="rounded-xl overflow-hidden border"
                    style={{
                      borderColor: theme.border,
                      backgroundColor: theme.surface,
                    }}
                  >
                    {/* Section Header */}
                    <button
                      type="button"
                      onClick={() => toggleSection(section)}
                      className="w-full flex items-center justify-between p-3 cursor-pointer transition-colors duration-200"
                      style={{
                        backgroundColor: `${theme.border}20`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme.border}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${theme.border}20`;
                      }}
                    >
                      <span className="text-sm font-semibold" style={{ color: theme.text }}>
                        {section}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: typeConfig.bgGlow,
                          color: typeConfig.iconColor,
                        }}
                      >
                        {fields.length}
                      </span>
                    </button>

                    {/* Section Content */}
                    {expandedSections.has(section) && (
                      <div className="section-enter divide-y" style={{ borderColor: theme.border }}>
                        {fields.map((change, idx) => (
                          <div
                            key={idx}
                            className="p-3 hover:bg-opacity-50 transition-colors duration-150"
                            style={{
                              backgroundColor: `${theme.border}10`,
                            }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <ArrowRight className="w-3 h-3" style={{ color: typeConfig.iconColor }} />
                              <span
                                className="text-sm font-medium"
                                style={{ color: theme.text }}
                              >
                                {change.field}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 ml-5">
                              {/* Old Value */}
                              <div
                                className="rounded-lg p-2"
                                style={{
                                  backgroundColor: `${theme.error}08`,
                                  borderLeft: `3px solid ${theme.error}`,
                                }}
                              >
                                <p
                                  className="text-xs font-medium mb-1"
                                  style={{ color: theme.error }}
                                >
                                  Previous
                                </p>
                                <p
                                  className="text-sm break-words"
                                  style={{ color: theme.textSecondary }}
                                >
                                  {truncateValue(formatValue(change.oldValue))}
                                </p>
                              </div>
                              
                              {/* New Value */}
                              <div
                                className="rounded-lg p-2"
                                style={{
                                  backgroundColor: `${theme.success}08`,
                                  borderLeft: `3px solid ${theme.success}`,
                                }}
                              >
                                <p
                                  className="text-xs font-medium mb-1"
                                  style={{ color: theme.success }}
                                >
                                  New
                                </p>
                                <p
                                  className="text-sm break-words font-medium"
                                  style={{ color: theme.success }}
                                >
                                  {truncateValue(formatValue(change.newValue))}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
                  style={{ color: theme.textSecondary }}
                />
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  No field changes to display
                </p>
              </div>
            )}
          </div>

          {/* Warning Message for Critical Changes */}
          {changedFields.some(f => 
            f.field.toLowerCase().includes("status") || 
            f.field.toLowerCase().includes("delete") ||
            f.field.toLowerCase().includes("remove")
          ) && (
            <div
              className="mx-4 mb-2 p-3 rounded-xl flex items-start gap-2"
              style={{
                backgroundColor: `${theme.warning}10`,
                border: `1px solid ${theme.warning}30`,
              }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: theme.warning }} />
              <p className="text-xs" style={{ color: theme.warning }}>
                Warning: This update includes status or structural changes that may affect system behavior.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div
            className="p-6 border-t"
            style={{
              borderColor: theme.border,
              backgroundColor: theme.surface,
            }}
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.background,
                  border: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.border}30`;
                  e.currentTarget.style.borderColor = theme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.background;
                  e.currentTarget.style.borderColor = theme.border;
                }}
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-0 disabled:hover:translate-y-0"
                style={{
                  background: `linear-gradient(135deg, ${buttonColor}, ${buttonColor}dd)`,
                  boxShadow: `0 2px 8px ${hexToRgba(buttonColor, 0.3)}`,
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                      style={{ animation: "spin 0.8s linear infinite" }}
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {confirmText}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </>
  );
};

// Helper function for hex to rgba (needed for the component)
const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0, 0, 0, ${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};