// components/destinations-components/UpdateConfirmationModal.tsx
import React, { useState } from "react";
import { SingleDestinationResponse } from "@/types/destination-types";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Confirm Destination Update
                </h3>
                <p className="text-gray-600">
                  Review all changes before confirming
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Changes Made</div>
                  <div className="text-lg font-bold text-gray-900">
                    {changedFields.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Images to Remove</div>
                  <div className="text-lg font-bold text-gray-900">
                    {removedImages.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">New Images</div>
                  <div className="text-lg font-bold text-gray-900">
                    {newImages.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">New Activities</div>
                  <div className="text-lg font-bold text-gray-900">
                    {newActivities.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Changed Fields */}
            {changedFields.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("fields")}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                >
                  <h4 className="text-lg font-semibold text-gray-800">
                    Field Changes ({changedFields.length})
                  </h4>
                  {expandedSections.includes("fields") ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.includes("fields") && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 text-sm font-medium text-gray-700">
                              Field
                            </th>
                            <th className="text-left py-2 text-sm font-medium text-gray-700">
                              Old Value
                            </th>
                            <th className="text-left py-2 text-sm font-medium text-gray-700">
                              New Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {changedFields.map((change, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-100 last:border-b-0"
                            >
                              <td className="py-3 text-sm font-medium text-gray-900">
                                {change.field}
                              </td>
                              <td className="py-3 text-sm text-gray-600">
                                {typeof change.oldValue === "string"
                                  ? change.oldValue
                                  : JSON.stringify(change.oldValue)}
                              </td>
                              <td className="py-3 text-sm text-blue-600 font-medium">
                                {typeof change.newValue === "string"
                                  ? change.newValue
                                  : JSON.stringify(change.newValue)}
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

            {/* Images Summary */}
            {(removedImages.length > 0 || newImages.length > 0) && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("images")}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl hover:from-rose-100 hover:to-pink-100 transition-all duration-200"
                >
                  <h4 className="text-lg font-semibold text-gray-800">
                    Images Changes
                  </h4>
                  {expandedSections.includes("images") ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.includes("images") && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {removedImages.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-red-700 mb-2">
                            Images to Remove ({removedImages.length})
                          </h5>
                          <div className="text-sm text-gray-600">
                            {removedImages.join(", ")}
                          </div>
                        </div>
                      )}
                      {newImages.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-green-700 mb-2">
                            New Images ({newImages.length})
                          </h5>
                          <div className="space-y-2">
                            {newImages.map((image, index) => (
                              <div
                                key={index}
                                className="text-sm text-gray-600"
                              >
                                {image.name}
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

            {/* Activities Summary */}
            {(removedActivities.length > 0 || newActivities.length > 0) && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection("activities")}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl hover:from-purple-100 hover:to-violet-100 transition-all duration-200"
                >
                  <h4 className="text-lg font-semibold text-gray-800">
                    Activities Changes
                  </h4>
                  {expandedSections.includes("activities") ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.includes("activities") && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {removedActivities.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-red-700 mb-2">
                            Activities to Remove ({removedActivities.length})
                          </h5>
                          <div className="text-sm text-gray-600">
                            {removedActivities.join(", ")}
                          </div>
                        </div>
                      )}
                      {newActivities.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-green-700 mb-2">
                            New Activities ({newActivities.length})
                          </h5>
                          <div className="space-y-2">
                            {newActivities.map((activity, index) => (
                              <div
                                key={index}
                                className="text-sm text-gray-600"
                              >
                                {activity.name}
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
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Please review all changes carefully. Once confirmed, these
                  changes will be permanent and cannot be undone.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Confirm Update"
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