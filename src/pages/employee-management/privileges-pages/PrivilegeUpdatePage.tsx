// app/privileges/update/page.tsx (Updated with getPrivilegeDetailsById)
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import { PrivilegeService } from "@/services/privilegeService";
import { useTheme } from "@/contexts/ThemeContext";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import CommonSearch from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import {
  Shield,
  FileText,
  AlertCircle,
  Save,
  RefreshCw,
  CheckCircle2,
  Edit,
  Users,
  ChevronRight,
} from "lucide-react";
import {
  PrivilegeNameAndId,
  UpdatePrivilegeRequest,
  PrivilegeDetails,
  RoleInPrivilege,
} from "@/types/privilege-types";
import { UpdateConfirmationModal } from "@/components/common-components/UpdateConfirmationModal";

// Status options for privileges
const PRIVILEGE_STATUS_OPTIONS = [
  {
    value: "ACTIVE" as const,
    label: "Active",
    description: "Privilege is available for use",
    color: "#10b981",
  },
  {
    value: "INACTIVE" as const,
    label: "Inactive",
    description: "Privilege is temporarily disabled",
    color: "#6b7280",
  },
];

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0, 0, 0, ${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const PrivilegeUpdatePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const initialPrivilegeId = searchParams?.get("id") || "";
  const initialPrivilegeName = searchParams?.get("name") || "";

  // State for privileges list
  const [privileges, setPrivileges] = useState<PrivilegeNameAndId[]>([]);

  // State for selected privilege
  const [selectedPrivilege, setSelectedPrivilege] =
    useState<PrivilegeNameAndId | null>(
      initialPrivilegeId && initialPrivilegeName
        ? {
            id: parseInt(initialPrivilegeId),
            name: initialPrivilegeName,
          }
        : null,
    );

  // State for original and edited privilege details
  const [originalPrivilege, setOriginalPrivilege] =
    useState<PrivilegeDetails | null>(null);
  const [editedPrivilege, setEditedPrivilege] =
    useState<PrivilegeDetails | null>(null);

  // State for associated roles (read-only display)
  const [associatedRoles, setAssociatedRoles] = useState<RoleInPrivilege[]>([]);
  const [expandedRoles, setExpandedRoles] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Privileges", href: "/privileges" },
    { label: "Update", href: "/privileges/update" },
  ];

  // Character limits
  const NAME_MAX = 100;
  const DESCRIPTION_MAX = 500;

  // Fetch privileges list on initial load
  useEffect(() => {
    if (!selectedPrivilege) {
      fetchPrivileges();
    }
  }, []);

  // If initialPrivilegeId is provided, fetch details
  useEffect(() => {
    if (initialPrivilegeId && !originalPrivilege) {
      handleSelectPrivilege(parseInt(initialPrivilegeId), initialPrivilegeName);
    }
  }, [initialPrivilegeId, initialPrivilegeName]);

  const fetchPrivileges = async () => {
    setLoading(true);
    setError(null);
    setSearchError(null);
    try {
      const response = await PrivilegeService.getPrivilegesNamesAndIds();
      if (response.code === 200 && response.data) {
        setPrivileges(response.data);
      } else {
        throw new Error(response.message || "Failed to load privileges");
      }
    } catch (err: any) {
      const errorMsg = err.message || "Failed to load privileges";
      setSearchError(errorMsg);
      setToast({
        type: "error",
        title: "Error",
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle privilege selection
  const handleSelectPrivilege = async (id: number, name: string) => {
    setSelectedPrivilege({ id, name });
    await fetchPrivilegeDetails(id);
  };

  // Fetch privilege details using the dedicated API
  const fetchPrivilegeDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalPrivilege(null);
    setEditedPrivilege(null);
    setAssociatedRoles([]);

    try {
      const response = await PrivilegeService.getPrivilegeDetailsById(id);
      if (response.code === 200 && response.data) {
        const privilegeData = response.data;
        
        // Map the response to our PrivilegeDetails interface
        const details: PrivilegeDetails = {
          privilegeId: privilegeData.privilegeId,
          privilegeName: privilegeData.privilegeName,
          privilegeDescription: privilegeData.privilegeDescription || "",
          privilegeStatus: privilegeData.privilegeStatus,
          roles: privilegeData.roles || [],
        };
        
        setOriginalPrivilege(details);
        setEditedPrivilege(details);
        setAssociatedRoles(details.roles || []);
      } else {
        throw new Error(response.message || "Failed to load privilege details");
      }
    } catch (err: any) {
      const errorMsg = err.message || "Failed to load privilege details";
      setError(errorMsg);
      setToast({
        type: "error",
        title: "Load Failed",
        message: errorMsg,
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle field changes
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (!editedPrivilege) return;

    setEditedPrivilege({
      ...editedPrivilege,
      [name]: value,
    });
  };

  // Handle status selection
  const handleStatusChange = (status: "ACTIVE" | "INACTIVE") => {
    if (!editedPrivilege) return;
    setEditedPrivilege({
      ...editedPrivilege,
      privilegeStatus: status,
    });
  };

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    if (!originalPrivilege || !editedPrivilege) return false;

    return (
      originalPrivilege.privilegeName !== editedPrivilege.privilegeName ||
      originalPrivilege.privilegeDescription !== editedPrivilege.privilegeDescription ||
      originalPrivilege.privilegeStatus !== editedPrivilege.privilegeStatus
    );
  }, [originalPrivilege, editedPrivilege]);

  // Prepare update data
  const prepareUpdateData = (): UpdatePrivilegeRequest | null => {
    if (!editedPrivilege || !selectedPrivilege) return null;

    return {
      id: selectedPrivilege.id,
      name: editedPrivilege.privilegeName.trim(),
      status: editedPrivilege.privilegeStatus,
      description: editedPrivilege.privilegeDescription?.trim() || "",
    };
  };

  // Handle update submission
  const handleUpdateSubmit = async () => {
    const updateData = prepareUpdateData();
    if (!updateData) return;

    setLoadingUpdate(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await PrivilegeService.updatePrivilege(updateData);

      const successMsg = `Privilege "${editedPrivilege?.privilegeName}" updated successfully!`;
      setSuccess(successMsg);

      // Show success toast with navigation link
      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedPrivilege?.privilegeName} has been updated successfully.`,
        actionLink: `/privileges/view?id=${selectedPrivilege?.id}`,
      });

      setShowConfirmModal(false);

      // Refresh the privilege details to get updated data
      if (selectedPrivilege) {
        await fetchPrivilegeDetails(selectedPrivilege.id);
      }

      // Refresh the privileges list
      await fetchPrivileges();
    } catch (err: any) {
      const errorMsg = err.message || "Failed to update privilege";
      setError(errorMsg);
      setToast({
        type: "error",
        title: "Update Failed",
        message: errorMsg,
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Reset all changes
  const handleResetChanges = () => {
    if (originalPrivilege) {
      setEditedPrivilege({ ...originalPrivilege });
      setError(null);
      setSuccess(null);

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearPrivilegeSelection = () => {
    setSelectedPrivilege(null);
    setOriginalPrivilege(null);
    setEditedPrivilege(null);
    setAssociatedRoles([]);
    setToast(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    url.searchParams.delete("name");
    router.replace(url.toString(), { scroll: false });
  };

  // Get changed fields for confirmation modal
  const getChangedFields = () => {
    if (!originalPrivilege || !editedPrivilege) return [];

    const changes: Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }> = [];

    if (originalPrivilege.privilegeName !== editedPrivilege.privilegeName) {
      changes.push({
        field: "Privilege Name",
        oldValue: originalPrivilege.privilegeName,
        newValue: editedPrivilege.privilegeName,
      });
    }

    if (originalPrivilege.privilegeDescription !== editedPrivilege.privilegeDescription) {
      changes.push({
        field: "Description",
        oldValue: originalPrivilege.privilegeDescription || "(empty)",
        newValue: editedPrivilege.privilegeDescription || "(empty)",
      });
    }

    if (originalPrivilege.privilegeStatus !== editedPrivilege.privilegeStatus) {
      changes.push({
        field: "Status",
        oldValue: originalPrivilege.privilegeStatus,
        newValue: editedPrivilege.privilegeStatus,
      });
    }

    return changes;
  };

  // Get status color for role status badge
  const getRoleStatusColor = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return theme.success || "#10b981";
      case "INACTIVE":
        return theme.error || "#ef4444";
      default:
        return theme.textSecondary;
    }
  };

  // Convert privileges to search items format
  const searchItems = privileges.map((priv) => ({
    id: priv.id,
    name: priv.name,
  }));

  const selectedSearchItem = selectedPrivilege
    ? {
        id: selectedPrivilege.id,
        name: selectedPrivilege.name,
      }
    : null;

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
      {/* Toast Notifications */}
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
          actionLink={toast.actionLink}
          actionText="View Privilege"
        />
      )}

      {/* Header with Breadcrumb */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Update Privilege"
            description="Edit and update existing privilege information"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no privilege is selected */}
        {!selectedPrivilege && (
          <div
            className="rounded-2xl shadow-lg p-8 mb-8 transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-3"
              style={{ color: theme.text }}
            >
              <Shield className="w-6 h-6" style={{ color: theme.primary }} />
              Select Privilege to Update
            </h2>

            {searchError ? (
              <CommonErrorState
                error={searchError}
                title="Failed to Load Privileges"
                message="Unable to load privileges. Please try again."
                variant="error"
                showBackButton={false}
                showRetryButton={true}
                onRetry={fetchPrivileges}
                retryButtonText="Retry"
                fullScreen={false}
              />
            ) : (
              <CommonSearch
                items={searchItems}
                loading={loading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) =>
                  handleSelectPrivilege(item.id as number, item.name)
                }
                onClearSelection={handleClearPrivilegeSelection}
                initialSearchTerm={initialPrivilegeName}
                placeholder="Search privileges..."
                title="Privileges"
                variant="primary"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            )}
          </div>
        )}

        {/* Selected Privilege Info Bar */}
        {selectedPrivilege && (
          <SelectedItemBar
            item={selectedPrivilege}
            onClear={handleClearPrivilegeSelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Privilege"
            size="md"
          />
        )}

        {/* Loading Details State */}
        {loadingDetails && (
          <CommonLoading
            message="Loading privilege details..."
            subMessage="Please wait while we fetch the privilege information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Privilege Details Form */}
        {editedPrivilege && selectedPrivilege && (
          <>
            {/* Main Information Card */}
            <div
              className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 mb-6"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
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
                    Privilege Information
                  </h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    Edit the privilege details below
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
                          editedPrivilege.privilegeName.length > NAME_MAX * 0.9
                            ? theme.error
                            : theme.textSecondary,
                      }}
                    >
                      {editedPrivilege.privilegeName.length}/{NAME_MAX}
                    </span>
                  </div>
                  <input
                    id="privilege-name"
                    type="text"
                    name="privilegeName"
                    value={editedPrivilege.privilegeName}
                    onChange={handleFieldChange}
                    placeholder="e.g. Manage Users, View Reports, Edit Settings"
                    maxLength={NAME_MAX}
                    className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                    style={{
                      ...fieldBase,
                      borderColor: theme.border,
                    }}
                    {...focusHandlers(false)}
                  />
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
                          (editedPrivilege.privilegeDescription?.length || 0) >
                          DESCRIPTION_MAX * 0.9
                            ? theme.error
                            : theme.textSecondary,
                      }}
                    >
                      {editedPrivilege.privilegeDescription?.length || 0}/{DESCRIPTION_MAX}
                    </span>
                  </div>
                  <textarea
                    id="privilege-description"
                    name="privilegeDescription"
                    value={editedPrivilege.privilegeDescription || ""}
                    onChange={handleFieldChange}
                    rows={5}
                    placeholder="Describe what this privilege allows users to do..."
                    maxLength={DESCRIPTION_MAX}
                    className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm resize-none"
                    style={{
                      ...fieldBase,
                      borderColor: theme.border,
                    }}
                    {...focusHandlers(false)}
                  />
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
                    {PRIVILEGE_STATUS_OPTIONS.map((opt) => {
                      const isSelected = editedPrivilege.privilegeStatus === opt.value;
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

            {/* Associated Roles Card - Read-only display */}
            {associatedRoles.length > 0 && (
              <div
                className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 mb-6"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <button
                  onClick={() => setExpandedRoles(!expandedRoles)}
                  className="w-full flex items-center justify-between px-6 py-4 cursor-pointer transition-colors duration-200"
                  style={{
                    borderBottom: expandedRoles ? `1px solid ${theme.border}` : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.border}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <Users className="w-4 h-4" />
                    </span>
                    <div className="text-left">
                      <h2
                        className="text-base font-semibold leading-tight"
                        style={{ color: theme.text }}
                      >
                        Associated Roles
                      </h2>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Roles that have this privilege assigned
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${theme.primary}15`,
                        color: theme.primary,
                      }}
                    >
                      {associatedRoles.length} role{associatedRoles.length !== 1 ? "s" : ""}
                    </span>
                    <ChevronRight
                      className="w-5 h-5 transition-transform duration-200"
                      style={{
                        color: theme.textSecondary,
                        transform: expandedRoles ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    />
                  </div>
                </button>

                {expandedRoles && (
                  <div className="px-6 py-4 space-y-3">
                    {associatedRoles.map((role) => (
                      <div
                        key={role.roleId}
                        className="p-3 rounded-xl transition-all duration-200"
                        style={{
                          backgroundColor: `${theme.border}10`,
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" style={{ color: theme.primary }} />
                            <span className="font-medium text-sm" style={{ color: theme.text }}>
                              {role.roleName}
                            </span>
                          </div>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${getRoleStatusColor(role.roleStatus)}20`,
                              color: getRoleStatusColor(role.roleStatus),
                              border: `1px solid ${getRoleStatusColor(role.roleStatus)}40`,
                            }}
                          >
                            {role.roleStatus}
                          </span>
                        </div>
                        {role.roleDescription && (
                          <p className="text-xs ml-6" style={{ color: theme.textSecondary }}>
                            {role.roleDescription}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        {editedPrivilege && originalPrivilege && (
          <div
            className="rounded-2xl shadow-lg p-8 mt-8 transition-colors duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleResetChanges}
                disabled={!hasChanges() || loadingUpdate}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.textSecondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.backgroundColor = hexToRgba(
                    theme.primary,
                    0.05,
                  );
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.backgroundColor = theme.background;
                }}
              >
                <RefreshCw className="w-5 h-5" />
                Reset Changes
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!hasChanges() || loadingUpdate}
                className="cursor-pointer flex-1 px-6 py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent || theme.primary})`,
                }}
              >
                <Save className="w-5 h-5" />
                {loadingUpdate ? "Updating..." : "Update Privilege"}
              </button>
            </div>

            {/* Change Indicator */}
            {hasChanges() && (
              <div
                className="mt-6 p-4 rounded-xl transition-colors duration-300"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.1),
                  border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5" style={{ color: theme.primary }} />
                  <div>
                    <p className="font-medium" style={{ color: theme.primary }}>
                      You have unsaved changes
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Click "Update Privilege" to save your changes
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalPrivilege && editedPrivilege && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            changedFields={getChangedFields()}
            itemName={editedPrivilege.privilegeName}
            confirmText="Update Privilege"
            cancelText="Cancel"
            type="update"
            isLoading={loadingUpdate}
            showFieldComparisons={true}
          />
        )}
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

export default PrivilegeUpdatePage;