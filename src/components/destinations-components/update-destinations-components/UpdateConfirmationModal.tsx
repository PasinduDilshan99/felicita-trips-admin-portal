// components/destinations-components/UpdateConfirmationModal.tsx
"use client";

import React, { useState } from "react";
import { SingleDestinationResponse } from "@/types/destination-types";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Tag,
  Image as ImageIcon,
  Activity,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface UpdateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  changedFields: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  originalDestination: SingleDestinationResponse;
  editedDestination: SingleDestinationResponse;
  removedImages: number[];
  newImages: any[];
  removedActivities: number[];
  newActivities: any[];
  removedCategoryIds: number[];
  addedCategoryIds: number[];
}

const UpdateConfirmationModal: React.FC<UpdateConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  changedFields,
  originalDestination,
  editedDestination,
  removedImages,
  newImages,
  removedActivities,
  newActivities,
  removedCategoryIds,
  addedCategoryIds,
}) => {
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  // Helper to format value for display
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "Not set";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") return value.toString();
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "None";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-sm z-50 transition-all duration-300"
        style={{ backgroundColor: hexToRgba(theme.text, 0.5) }}
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 animate-in fade-in zoom-in-95"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`
          }}
        >
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                  boxShadow: `0 4px 14px ${hexToRgba(theme.primary, 0.3)}`
                }}
              >
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: theme.text }}>
                  Confirm Destination Update
                </h3>
                <p className="mt-1" style={{ color: theme.textSecondary }}>
                  Review all changes before confirming
                </p>
              </div>
            </div>

            {/* Summary Stats */}
            <div 
              className="mb-6 p-4 rounded-xl transition-colors duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`,
                border: `1px solid ${hexToRgba(theme.primary, 0.2)}`
              }}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <div className="text-sm" style={{ color: theme.textSecondary }}>Field Changes</div>
                  <div className="text-lg font-bold" style={{ color: theme.text }}>
                    {changedFields.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: theme.textSecondary }}>Category Changes</div>
                  <div className="text-lg font-bold" style={{ color: theme.text }}>
                    {removedCategoryIds.length + addedCategoryIds.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: theme.textSecondary }}>Images to Remove</div>
                  <div className="text-lg font-bold" style={{ color: theme.error }}>
                    {removedImages.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: theme.textSecondary }}>New Images</div>
                  <div className="text-lg font-bold" style={{ color: theme.success }}>
                    {newImages.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: theme.textSecondary }}>New Activities</div>
                  <div className="text-lg font-bold" style={{ color: theme.accent }}>
                    {newActivities.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Field Changes */}
            {changedFields.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("fields")}
                  className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:opacity-80"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.textSecondary, 0.05)}, ${hexToRgba(theme.textSecondary, 0.1)})`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5" style={{ color: theme.textSecondary }} />
                    <h4 className="text-lg font-semibold" style={{ color: theme.text }}>
                      Field Changes ({changedFields.length})
                    </h4>
                  </div>
                  {expandedSections.includes("fields") ? (
                    <ChevronUp className="w-5 h-5" style={{ color: theme.textSecondary }} />
                  ) : (
                    <ChevronDown className="w-5 h-5" style={{ color: theme.textSecondary }} />
                  )}
                </button>

                {expandedSections.includes("fields") && (
                  <div className="mt-4 p-4 rounded-xl transition-colors duration-300" style={{ border: `1px solid ${theme.border}` }}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b" style={{ borderColor: theme.border }}>
                            <th className="text-left py-2 text-sm font-medium" style={{ color: theme.textSecondary }}>
                              Field
                            </th>
                            <th className="text-left py-2 text-sm font-medium" style={{ color: theme.textSecondary }}>
                              Old Value
                            </th>
                            <th className="text-left py-2 text-sm font-medium" style={{ color: theme.textSecondary }}>
                              New Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {changedFields.map((change, index) => (
                            <tr
                              key={index}
                              className="border-b last:border-b-0"
                              style={{ borderColor: theme.border }}
                            >
                              <td className="py-3 text-sm font-medium" style={{ color: theme.text }}>
                                {change.field}
                               </td>
                              <td className="py-3 text-sm" style={{ color: theme.textSecondary }}>
                                {formatValue(change.oldValue)}
                               </td>
                              <td className="py-3 text-sm font-medium" style={{ color: theme.primary }}>
                                {formatValue(change.newValue)}
                               </td>
                             </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Category Changes */}
            {(removedCategoryIds.length > 0 || addedCategoryIds.length > 0) && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("categories")}
                  className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:opacity-80"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5" style={{ color: theme.success }} />
                    <h4 className="text-lg font-semibold" style={{ color: theme.text }}>
                      Category Changes
                    </h4>
                  </div>
                  {expandedSections.includes("categories") ? (
                    <ChevronUp className="w-5 h-5" style={{ color: theme.textSecondary }} />
                  ) : (
                    <ChevronDown className="w-5 h-5" style={{ color: theme.textSecondary }} />
                  )}
                </button>

                {expandedSections.includes("categories") && (
                  <div className="mt-4 p-4 rounded-xl transition-colors duration-300" style={{ border: `1px solid ${theme.border}` }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {removedCategoryIds.length > 0 && (
                        <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(theme.error, 0.1) }}>
                          <h5 className="text-sm font-medium mb-2 flex items-center gap-1" style={{ color: theme.error }}>
                            <XCircle className="w-4 h-4" />
                            Categories to Remove ({removedCategoryIds.length})
                          </h5>
                          <div className="space-y-1">
                            {removedCategoryIds.map((categoryId, idx) => (
                              <div key={idx} className="text-sm" style={{ color: theme.error }}>
                                • Category ID: {categoryId}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {addedCategoryIds.length > 0 && (
                        <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(theme.success, 0.1) }}>
                          <h5 className="text-sm font-medium mb-2 flex items-center gap-1" style={{ color: theme.success }}>
                            <CheckCircle className="w-4 h-4" />
                            Categories to Add ({addedCategoryIds.length})
                          </h5>
                          <div className="space-y-1">
                            {addedCategoryIds.map((categoryId, idx) => (
                              <div key={idx} className="text-sm" style={{ color: theme.success }}>
                                • Category ID: {categoryId}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Images Changes */}
            {(removedImages.length > 0 || newImages.length > 0) && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("images")}
                  className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:opacity-80"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.error, 0.1)}, ${hexToRgba(theme.error, 0.05)})`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" style={{ color: theme.error }} />
                    <h4 className="text-lg font-semibold" style={{ color: theme.text }}>
                      Images Changes
                    </h4>
                  </div>
                  {expandedSections.includes("images") ? (
                    <ChevronUp className="w-5 h-5" style={{ color: theme.textSecondary }} />
                  ) : (
                    <ChevronDown className="w-5 h-5" style={{ color: theme.textSecondary }} />
                  )}
                </button>

                {expandedSections.includes("images") && (
                  <div className="mt-4 p-4 rounded-xl transition-colors duration-300" style={{ border: `1px solid ${theme.border}` }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {removedImages.length > 0 && (
                        <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(theme.error, 0.1) }}>
                          <h5 className="text-sm font-medium mb-2" style={{ color: theme.error }}>
                            Images to Remove ({removedImages.length})
                          </h5>
                          <div className="space-y-1">
                            {removedImages.map((imageId, index) => (
                              <div key={index} className="text-sm" style={{ color: theme.error }}>
                                • Image ID: {imageId}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {newImages.length > 0 && (
                        <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(theme.success, 0.1) }}>
                          <h5 className="text-sm font-medium mb-2" style={{ color: theme.success }}>
                            New Images ({newImages.length})
                          </h5>
                          <div className="space-y-2">
                            {newImages.map((image, index) => (
                              <div key={index} className="text-sm" style={{ color: theme.success }}>
                                <div className="font-medium">{image.name}</div>
                                <div className="text-xs truncate" style={{ color: theme.textSecondary }}>
                                  {image.imageUrl}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Activities Changes */}
            {(removedActivities.length > 0 || newActivities.length > 0) && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("activities")}
                  className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:opacity-80"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(theme.accent, 0.1)}, ${hexToRgba(theme.accent, 0.05)})`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5" style={{ color: theme.accent }} />
                    <h4 className="text-lg font-semibold" style={{ color: theme.text }}>
                      Activities Changes
                    </h4>
                  </div>
                  {expandedSections.includes("activities") ? (
                    <ChevronUp className="w-5 h-5" style={{ color: theme.textSecondary }} />
                  ) : (
                    <ChevronDown className="w-5 h-5" style={{ color: theme.textSecondary }} />
                  )}
                </button>

                {expandedSections.includes("activities") && (
                  <div className="mt-4 p-4 rounded-xl transition-colors duration-300" style={{ border: `1px solid ${theme.border}` }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {removedActivities.length > 0 && (
                        <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(theme.error, 0.1) }}>
                          <h5 className="text-sm font-medium mb-2" style={{ color: theme.error }}>
                            Activities to Remove ({removedActivities.length})
                          </h5>
                          <div className="space-y-1">
                            {removedActivities.map((activityId, index) => (
                              <div key={index} className="text-sm" style={{ color: theme.error }}>
                                • Activity ID: {activityId}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {newActivities.length > 0 && (
                        <div className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(theme.success, 0.1) }}>
                          <h5 className="text-sm font-medium mb-2" style={{ color: theme.success }}>
                            New Activities ({newActivities.length})
                          </h5>
                          <div className="space-y-3">
                            {newActivities.map((activity, index) => (
                              <div key={index} className="text-sm border-b last:border-0 pb-2 last:pb-0" style={{ borderColor: theme.border }}>
                                <div className="font-medium" style={{ color: theme.success }}>
                                  {activity.name}
                                </div>
                                <div className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                                  Duration: {activity.durationHover} hours | 
                                  Price: LKR {activity.priceLocal.toLocaleString()} (Local) / 
                                  LKR {activity.priceForeigners.toLocaleString()} (Foreigners)
                                </div>
                                {activity.addActivityCategoriesId?.length > 0 && (
                                  <div className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                                    Categories: {activity.addActivityCategoriesId.join(", ")}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Warning */}
            <div 
              className="mb-6 p-4 rounded-xl transition-colors duration-300"
              style={{ 
                background: `linear-gradient(135deg, ${hexToRgba(theme.warning, 0.1)}, ${hexToRgba(theme.warning, 0.05)})`,
                border: `1px solid ${hexToRgba(theme.warning, 0.3)}`
              }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: theme.warning }} />
                <div className="text-sm" style={{ color: theme.warning }}>
                  <p className="font-medium mb-1">Please review all changes carefully!</p>
                  <p className="opacity-80">
                    Once confirmed, these changes will be permanent and cannot be undone.
                    Make sure all information is correct before proceeding.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl border-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.textSecondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.backgroundColor = hexToRgba(theme.primary, 0.05);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.backgroundColor = theme.background;
                }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating Destination...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Confirm Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateConfirmationModal;