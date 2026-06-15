"use client";

import React, { useState } from "react";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import { CreateConfirmModal } from "@/components/common-components/CreateConfirmModal";
import { PrivilegeService } from "@/services/privilegeService";
import { useTheme } from "@/contexts/ThemeContext";
import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { CreatePrivilegeRequest } from "@/types/privilege-types";
import { ToastState } from "@/types/common-components-types";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { PRIVILEGE_CREATE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { PRIVILEGE_CREATE_STATUS_OPTIONS } from "@/data/status-options-data";
import {
  PRIVILEGE_CREATE_NAME_MAX_CHARACTERS,
  PRIVILEGE_CREATE_DESCRIPTION_MAX_CHARACTERS,
} from "@/data/constnat-data";

const AddNewPrivilegePage = () => {
  const { theme } = useTheme();

  const [formData, setFormData] = useState<CreatePrivilegeRequest>({
    name: "",
    description: "",
    status: "ACTIVE",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle status selection
  const handleStatusChange = (status: string) => {
    setFormData((prev) => ({ ...prev, status }));
    if (errors.status) {
      setErrors((prev) => ({ ...prev, status: "" }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Privilege name is required";
    } else if (formData.name.length > PRIVILEGE_CREATE_NAME_MAX_CHARACTERS) {
      newErrors.name = `Name must be less than ${PRIVILEGE_CREATE_NAME_MAX_CHARACTERS} characters`;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (
      formData.description.length > PRIVILEGE_CREATE_DESCRIPTION_MAX_CHARACTERS
    ) {
      newErrors.description = `Description must be less than ${PRIVILEGE_CREATE_DESCRIPTION_MAX_CHARACTERS} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with confirmation
  const handleSubmitWithConfirmation = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate first
    if (!validateForm()) {
      const firstError = document.querySelector('[class*="border-red"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  // Actual submission function
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      const submissionData: CreatePrivilegeRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
      };

      const response = await PrivilegeService.createPrivilege(submissionData);

      if (response.code === 200) {
        // Show success toast
        setToast({
          show: true,
          type: "success",
          title: "Privilege Created Successfully!",
          message: `${formData.name} has been added to your privileges.`,
        });

        // Reset form after successful creation
        handleReset();
      } else {
        throw new Error(response.message || "Failed to create privilege");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      setToast({
        show: true,
        type: "error",
        title: "Submission Failed",
        message:
          error.message || "Failed to create privilege. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      status: "ACTIVE",
    });
    setErrors({});
  };

  // Close toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Focus handlers for inputs
  const focusHandlers = (hasError: boolean) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = hasError
        ? theme.error
        : theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${
        hasError ? theme.error : theme.primary
      }18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = hasError ? theme.error : theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  });

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notification */}
      {toast.show && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={handleCloseToast}
          actionLink={toast.type === "success" ? "/privileges" : undefined}
          actionText="View Privileges"
        />
      )}

      {/* Create Confirm Modal */}
      <CreateConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Create New Privilege"
        message={`Are you sure you want to create the privilege "{itemName}"? This action can be undone later by changing the status to inactive.`}
        itemName={formData.name || "this privilege"}
        confirmText="Create Privilege"
        cancelText="Cancel"
        type="create"
        isLoading={loading}
      />

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Add New Privilege"
            description="Create a new privilege with access controls"
            breadcrumbItems={PRIVILEGE_CREATE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className=" mx-auto">
          <form onSubmit={handleSubmitWithConfirmation} className="space-y-8">
            {/* Main Form Card */}
            <div
              className="rounded-2xl overflow-hidden"
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
                    backgroundColor: `${theme.primary}18`,
                    color: theme.primary,
                  }}
                >
                  <Shield className="w-4 h-4" />
                </span>
                <div>
                  <h2
                    className="text-base font-semibold leading-tight"
                    style={{ color: theme.text }}
                  >
                    Privilege Details
                  </h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    Define the privilege name and description
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="px-6 py-6 space-y-6">
                {/* Name Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="privilege-name"
                      className="text-sm font-medium"
                      style={{ color: theme.textSecondary }}
                    >
                      Privilege Name
                      <span style={{ color: theme.error }}> *</span>
                    </label>
                    <span
                      className="text-xs tabular-nums"
                      style={{
                        color:
                          formData.name.length >
                          PRIVILEGE_CREATE_NAME_MAX_CHARACTERS * 0.9
                            ? theme.error
                            : theme.textSecondary,
                      }}
                    >
                      {formData.name.length}/
                      {PRIVILEGE_CREATE_NAME_MAX_CHARACTERS}
                    </span>
                  </div>
                  <input
                    id="privilege-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Manage Users, View Reports, Edit Settings"
                    maxLength={PRIVILEGE_CREATE_NAME_MAX_CHARACTERS}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm ${
                      errors.name ? "field-error" : ""
                    }`}
                    style={{
                      ...fieldBase,
                      borderColor: errors.name ? theme.error : theme.border,
                    }}
                    {...focusHandlers(!!errors.name)}
                  />
                  {errors.name && (
                    <p
                      className="mt-1.5 text-xs flex items-center gap-1"
                      style={{ color: theme.error }}
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="privilege-description"
                      className="text-sm font-medium"
                      style={{ color: theme.textSecondary }}
                    >
                      Description
                      <span style={{ color: theme.error }}> *</span>
                    </label>
                    <span
                      className="text-xs tabular-nums"
                      style={{
                        color:
                          formData.description.length >
                          PRIVILEGE_CREATE_DESCRIPTION_MAX_CHARACTERS * 0.9
                            ? theme.error
                            : theme.textSecondary,
                      }}
                    >
                      {formData.description.length}/
                      {PRIVILEGE_CREATE_DESCRIPTION_MAX_CHARACTERS}
                    </span>
                  </div>
                  <textarea
                    id="privilege-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Describe what this privilege allows users to do..."
                    maxLength={PRIVILEGE_CREATE_DESCRIPTION_MAX_CHARACTERS}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none ${
                      errors.description ? "field-error" : ""
                    }`}
                    style={{
                      ...fieldBase,
                      borderColor: errors.description
                        ? theme.error
                        : theme.border,
                    }}
                    {...focusHandlers(!!errors.description)}
                  />
                  {errors.description && (
                    <p
                      className="mt-1.5 text-xs flex items-center gap-1"
                      style={{ color: theme.error }}
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Status Field */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.textSecondary }}
                  >
                    Status
                    <span style={{ color: theme.error }}> *</span>
                  </label>

                  <div className="flex gap-3">
                    {PRIVILEGE_CREATE_STATUS_OPTIONS.map((opt) => {
                      const isSelected = formData.status === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleStatusChange(opt.value)}
                          className="cursor-pointer flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0"
                          style={{
                            backgroundColor: isSelected
                              ? `${opt.color}10`
                              : theme.background,
                            borderColor: isSelected ? opt.color : theme.border,
                            boxShadow: isSelected
                              ? `0 0 0 3px ${opt.color}18`
                              : "none",
                          }}
                        >
                          <span
                            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: isSelected
                                ? `${opt.color}20`
                                : `${theme.border}60`,
                            }}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{
                                backgroundColor: isSelected
                                  ? opt.color
                                  : theme.textSecondary,
                              }}
                            />
                          </span>
                          <span className="min-w-0">
                            <span
                              className="block text-sm font-semibold leading-tight"
                              style={{
                                color: isSelected ? opt.color : theme.text,
                              }}
                            >
                              {opt.label}
                            </span>
                            <span
                              className="block text-xs mt-0.5"
                              style={{ color: theme.textSecondary }}
                            >
                              {opt.description}
                            </span>
                          </span>
                          {isSelected && (
                            <CheckCircle2
                              className="w-4 h-4 ml-auto flex-shrink-0"
                              style={{ color: opt.color }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div className="px-6 py-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Reset Button */}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="cursor-pointer flex-1 px-6 py-3 rounded-xl border-2 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-0"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      color: theme.textSecondary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = theme.primary;
                      e.currentTarget.style.backgroundColor = `${theme.primary}05`;
                      e.currentTarget.style.color = theme.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.backgroundColor = theme.background;
                      e.currentTarget.style.color = theme.textSecondary;
                    }}
                  >
                    Clear Form
                  </button>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer flex-1 px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-0 disabled:hover:translate-y-0"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent || theme.primary})`,
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    Create Privilege
                  </button>
                </div>

                {/* Helper text */}
                <p
                  className="text-xs text-center mt-4"
                  style={{ color: theme.textSecondary }}
                >
                  All fields marked with{" "}
                  <span style={{ color: theme.error }}>*</span> are required
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes errorShake {
          0%,
          100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-4px);
          }
          40% {
            transform: translateX(4px);
          }
          60% {
            transform: translateX(-3px);
          }
          80% {
            transform: translateX(3px);
          }
        }
        .field-error {
          animation: errorShake 0.35s ease;
        }
      `}</style>
    </div>
  );
};

export default AddNewPrivilegePage;
