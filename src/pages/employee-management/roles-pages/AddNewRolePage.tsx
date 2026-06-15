"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import { CreateConfirmModal } from "@/components/common-components/CreateConfirmModal";
import { RoleService } from "@/services/roleService";
import { PrivilegeService } from "@/services/privilegeService";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Shield,
  AlertCircle,
  CheckCircle2,
  Key,
  Search,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { PrivilegeNameAndId } from "@/types/privilege-types";
import { CreateRoleRequest } from "@/types/role-types";
import { ToastState } from "@/types/common-components-types";
import {
  ROLE_CREATE_DESCRIPTION_MAX_CHARACTERS,
  ROLE_CREATE_NAME_MAX_CHARACTERS,
} from "@/data/constnat-data";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { ROLE_CREATE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { ROLE_CREATE_STATUS_OPTIONS } from "@/data/status-options-data";

const AddNewRolePage = () => {
  const { theme } = useTheme();
  const privilegesDropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<CreateRoleRequest>({
    name: "",
    description: "",
    status: "ACTIVE",
    privilegesIds: [],
  });

  const [privileges, setPrivileges] = useState<PrivilegeNameAndId[]>([]);
  const [loadingPrivileges, setLoadingPrivileges] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPrivilegesDropdownOpen, setIsPrivilegesDropdownOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        privilegesDropdownRef.current &&
        !privilegesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPrivilegesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when dropdown is open
  useEffect(() => {
    if (isPrivilegesDropdownOpen) {
      // Don't prevent body scroll, just handle the dropdown
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsPrivilegesDropdownOpen(false);
        }
      };
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isPrivilegesDropdownOpen]);

  // Fetch privileges on mount
  useEffect(() => {
    fetchPrivileges();
  }, []);

  const fetchPrivileges = async () => {
    try {
      setLoadingPrivileges(true);
      const response = await PrivilegeService.getPrivilegesNamesAndIds();
      if (response.code === 200 && response.data) {
        setPrivileges(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch privileges");
      }
    } catch (error: any) {
      console.error("Error fetching privileges:", error);
      setToast({
        show: true,
        type: "error",
        title: "Failed to Load Privileges",
        message:
          error.message ||
          "Unable to load privileges. Please refresh the page.",
      });
    } finally {
      setLoadingPrivileges(false);
    }
  };

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

  // Handle privilege selection
  const handlePrivilegeToggle = (privilegeId: number) => {
    setFormData((prev) => {
      const isSelected = prev.privilegesIds.includes(privilegeId);
      const newPrivilegesIds = isSelected
        ? prev.privilegesIds.filter((id) => id !== privilegeId)
        : [...prev.privilegesIds, privilegeId];

      return {
        ...prev,
        privilegesIds: newPrivilegesIds,
      };
    });

    if (errors.privilegesIds) {
      setErrors((prev) => ({ ...prev, privilegesIds: "" }));
    }
  };

  // Handle select all privileges
  const handleSelectAllPrivileges = () => {
    if (filteredPrivileges.length === 0) return;

    const allPrivilegeIds = filteredPrivileges.map((p) => p.id);
    const allSelected = allPrivilegeIds.every((id) =>
      formData.privilegesIds.includes(id),
    );

    if (allSelected) {
      // Deselect all filtered privileges
      setFormData((prev) => ({
        ...prev,
        privilegesIds: prev.privilegesIds.filter(
          (id) => !allPrivilegeIds.includes(id),
        ),
      }));
    } else {
      // Select all filtered privileges
      const newIds = [
        ...new Set([...formData.privilegesIds, ...allPrivilegeIds]),
      ];
      setFormData((prev) => ({
        ...prev,
        privilegesIds: newIds,
      }));
    }
  };

  // Remove a single privilege from selected list
  const handleRemovePrivilege = (privilegeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      privilegesIds: prev.privilegesIds.filter((id) => id !== privilegeId),
    }));
  };

  // Get privilege name by ID
  const getPrivilegeName = (privilegeId: number): string => {
    const privilege = privileges.find((p) => p.id === privilegeId);
    return privilege?.name || `Privilege ${privilegeId}`;
  };

  // Filter privileges based on search query
  const filteredPrivileges = privileges.filter((privilege) =>
    privilege.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Check if all filtered privileges are selected
  const areAllFilteredSelected =
    filteredPrivileges.length > 0 &&
    filteredPrivileges.every((p) => formData.privilegesIds.includes(p.id));

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required";
    } else if (formData.name.length > ROLE_CREATE_NAME_MAX_CHARACTERS) {
      newErrors.name = `Name must be less than ${ROLE_CREATE_NAME_MAX_CHARACTERS} characters`;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (
      formData.description.length > ROLE_CREATE_DESCRIPTION_MAX_CHARACTERS
    ) {
      newErrors.description = `Description must be less than ${ROLE_CREATE_DESCRIPTION_MAX_CHARACTERS} characters`;
    }

    if (formData.privilegesIds.length === 0) {
      newErrors.privilegesIds = "At least one privilege must be selected";
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
      const submissionData: CreateRoleRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        privilegesIds: formData.privilegesIds,
      };

      const response = await RoleService.createRole(submissionData);

      if (response.code === 200) {
        // Show success toast
        setToast({
          show: true,
          type: "success",
          title: "Role Created Successfully!",
          message: `${formData.name} has been added to your roles.`,
        });

        // Reset form after successful creation
        handleReset();
      } else {
        throw new Error(response.message || "Failed to create role");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      setToast({
        show: true,
        type: "error",
        title: "Submission Failed",
        message: error.message || "Failed to create role. Please try again.",
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
      privilegesIds: [],
    });
    setSearchQuery("");
    setErrors({});
    setIsPrivilegesDropdownOpen(false);
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
          actionLink={toast.type === "success" ? "/roles" : undefined}
          actionText="View Roles"
        />
      )}

      {/* Create Confirm Modal */}
      <CreateConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Create New Role"
        message={`Are you sure you want to create the role "{itemName}" with ${formData.privilegesIds.length} selected privilege(s)?`}
        itemName={formData.name || "this role"}
        confirmText="Create Role"
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
            title="Add New Role"
            description="Create a new role with specific privileges"
            breadcrumbItems={ROLE_CREATE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto">
          <form onSubmit={handleSubmitWithConfirmation} className="space-y-8">
            {/* Main Form Card */}
            <div
              className="rounded-2xl overflow-visible"
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
                    Role Details
                  </h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    Define the role name, description, and assigned privileges
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="px-6 py-6 space-y-6">
                {/* Name Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="role-name"
                      className="text-sm font-medium"
                      style={{ color: theme.textSecondary }}
                    >
                      Role Name
                      <span style={{ color: theme.error }}> *</span>
                    </label>
                    <span
                      className="text-xs tabular-nums"
                      style={{
                        color:
                          formData.name.length >
                          ROLE_CREATE_NAME_MAX_CHARACTERS * 0.9
                            ? theme.error
                            : theme.textSecondary,
                      }}
                    >
                      {formData.name.length}/{ROLE_CREATE_NAME_MAX_CHARACTERS}
                    </span>
                  </div>
                  <input
                    id="role-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Administrator, Content Manager, Viewer"
                    maxLength={ROLE_CREATE_NAME_MAX_CHARACTERS}
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
                      htmlFor="role-description"
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
                          ROLE_CREATE_DESCRIPTION_MAX_CHARACTERS * 0.9
                            ? theme.error
                            : theme.textSecondary,
                      }}
                    >
                      {formData.description.length}/
                      {ROLE_CREATE_DESCRIPTION_MAX_CHARACTERS}
                    </span>
                  </div>
                  <textarea
                    id="role-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe what this role can do and its responsibilities..."
                    maxLength={ROLE_CREATE_DESCRIPTION_MAX_CHARACTERS}
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
                    {ROLE_CREATE_STATUS_OPTIONS.map((opt) => {
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

                {/* Privileges Selection Field - FIXED DROPDOWN */}
                <div className="relative" ref={privilegesDropdownRef}>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.textSecondary }}
                  >
                    Assign Privileges
                    <span style={{ color: theme.error }}> *</span>
                  </label>

                  {/* Selected Privileges Tags */}
                  {formData.privilegesIds.length > 0 && (
                    <div
                      className="mb-3 p-3 rounded-xl"
                      style={{
                        backgroundColor: `${theme.primary}08`,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <p
                        className="text-xs font-medium mb-2"
                        style={{ color: theme.textSecondary }}
                      >
                        Selected Privileges ({formData.privilegesIds.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.privilegesIds.map((privilegeId) => (
                          <span
                            key={privilegeId}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${theme.primary}15`,
                              color: theme.primary,
                              border: `1px solid ${theme.primary}30`,
                            }}
                          >
                            <Key className="w-3 h-3" />
                            {getPrivilegeName(privilegeId)}
                            <button
                              type="button"
                              onClick={(e) =>
                                handleRemovePrivilege(privilegeId, e)
                              }
                              className="ml-1 hover:scale-110 transition-transform"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dropdown Trigger Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setIsPrivilegesDropdownOpen(!isPrivilegesDropdownOpen)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 text-left flex items-center justify-between transition-all duration-200"
                    style={{
                      backgroundColor: theme.background,
                      borderColor: errors.privilegesIds
                        ? theme.error
                        : theme.border,
                      color: theme.text,
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Key
                        className="w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <span>
                        {loadingPrivileges
                          ? "Loading privileges..."
                          : `Select privileges (${formData.privilegesIds.length} selected)`}
                      </span>
                    </span>
                    <ChevronDown
                      className="w-4 h-4 transition-transform duration-200"
                      style={{
                        transform: isPrivilegesDropdownOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        color: theme.textSecondary,
                      }}
                    />
                  </button>

                  {/* Dropdown Menu - Fixed with higher z-index and proper positioning */}
                  {isPrivilegesDropdownOpen && (
                    <>
                      {/* Backdrop for closing dropdown when clicking outside */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsPrivilegesDropdownOpen(false)}
                      />

                      {/* Dropdown Content */}
                      <div
                        className="absolute left-0 right-0 mt-2 rounded-xl border shadow-2xl z-50 overflow-hidden"
                        style={{
                          backgroundColor: theme.surface,
                          borderColor: theme.border,
                          boxShadow:
                            "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                          maxHeight: "400px",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {/* Search Bar */}
                        <div
                          className="p-3 border-b flex-shrink-0"
                          style={{ borderColor: theme.border }}
                        >
                          <div className="relative">
                            <Search
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                              style={{ color: theme.textSecondary }}
                            />
                            <input
                              type="text"
                              placeholder="Search privileges..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none"
                              style={{
                                backgroundColor: theme.background,
                                border: `1px solid ${theme.border}`,
                                color: theme.text,
                              }}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Select All Button */}
                        {filteredPrivileges.length > 0 && (
                          <div
                            className="px-3 py-2 border-b cursor-pointer hover:bg-opacity-50 transition-colors flex-shrink-0"
                            style={{
                              borderColor: theme.border,
                              backgroundColor: `${theme.primary}05`,
                            }}
                            onClick={handleSelectAllPrivileges}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded flex items-center justify-center transition-colors"
                                style={{
                                  backgroundColor: areAllFilteredSelected
                                    ? theme.primary
                                    : "transparent",
                                  border: `2px solid ${areAllFilteredSelected ? theme.primary : theme.border}`,
                                }}
                              >
                                {areAllFilteredSelected && (
                                  <Check
                                    className="w-3 h-3"
                                    style={{ color: "#fff" }}
                                  />
                                )}
                              </div>
                              <span
                                className="text-sm font-medium"
                                style={{ color: theme.text }}
                              >
                                {areAllFilteredSelected
                                  ? "Deselect All"
                                  : "Select All"}
                              </span>
                              <span
                                className="text-xs ml-auto"
                                style={{ color: theme.textSecondary }}
                              >
                                {filteredPrivileges.length} privileges
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Privileges List - Scrollable */}
                        <div
                          className="overflow-y-auto flex-1"
                          style={{ maxHeight: "280px" }}
                        >
                          {loadingPrivileges ? (
                            <div className="p-8 text-center">
                              <div
                                className="w-6 h-6 border-2 rounded-full animate-spin mx-auto mb-2"
                                style={{
                                  borderColor: theme.primary,
                                  borderTopColor: "transparent",
                                }}
                              />
                              <p
                                className="text-sm"
                                style={{ color: theme.textSecondary }}
                              >
                                Loading privileges...
                              </p>
                            </div>
                          ) : filteredPrivileges.length === 0 ? (
                            <div className="p-8 text-center">
                              <p
                                className="text-sm"
                                style={{ color: theme.textSecondary }}
                              >
                                {searchQuery
                                  ? "No privileges match your search"
                                  : "No privileges available"}
                              </p>
                            </div>
                          ) : (
                            filteredPrivileges.map((privilege) => {
                              const isSelected =
                                formData.privilegesIds.includes(privilege.id);
                              return (
                                <label
                                  key={privilege.id}
                                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-opacity-50"
                                  style={{
                                    backgroundColor: isSelected
                                      ? `${theme.primary}08`
                                      : "transparent",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor = `${theme.border}30`;
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.backgroundColor =
                                        "transparent";
                                    }
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      handlePrivilegeToggle(privilege.id)
                                    }
                                    className="sr-only"
                                  />
                                  <div
                                    className="w-4 h-4 rounded flex items-center justify-center transition-colors flex-shrink-0"
                                    style={{
                                      backgroundColor: isSelected
                                        ? theme.primary
                                        : "transparent",
                                      border: `2px solid ${isSelected ? theme.primary : theme.border}`,
                                    }}
                                  >
                                    {isSelected && (
                                      <Check
                                        className="w-3 h-3"
                                        style={{ color: "#fff" }}
                                      />
                                    )}
                                  </div>
                                  <Key
                                    className="w-4 h-4 flex-shrink-0"
                                    style={{ color: theme.textSecondary }}
                                  />
                                  <span
                                    className="text-sm flex-1"
                                    style={{
                                      color: isSelected
                                        ? theme.primary
                                        : theme.text,
                                    }}
                                  >
                                    {privilege.name}
                                  </span>
                                </label>
                              );
                            })
                          )}
                        </div>

                        {/* Footer */}
                        <div
                          className="p-3 border-t flex justify-between items-center flex-shrink-0"
                          style={{ borderColor: theme.border }}
                        >
                          <span
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            {formData.privilegesIds.length} privilege(s)
                            selected
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsPrivilegesDropdownOpen(false)}
                            className="text-sm px-3 py-1 rounded-lg transition-colors"
                            style={{
                              backgroundColor: theme.primary,
                              color: "#fff",
                            }}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {errors.privilegesIds && (
                    <p
                      className="mt-1.5 text-xs flex items-center gap-1"
                      style={{ color: theme.error }}
                    >
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.privilegesIds}
                    </p>
                  )}
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
                    disabled={loading || loadingPrivileges}
                    className="cursor-pointer flex-1 px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-0 disabled:hover:translate-y-0"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent || theme.primary})`,
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    Create Role
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
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AddNewRolePage;
