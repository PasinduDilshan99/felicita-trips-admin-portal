// app/roles/update/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import {
  UpdateConfirmationModal,
  ChangedField,
} from "@/components/common-components/UpdateConfirmationModal";
import { RoleService } from "@/services/roleService";
import {
  RoleNameAndId,
  RoleDetails,
  PrivilegeInRole,
  UpdateRoleRequest,
  UpdatePrivilegeInRole,
} from "@/types/role-types";
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
  Key,
  X,
  Search,
  ChevronDown,
  Check,
  Plus,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { PrivilegeNameAndId } from "@/types/privilege-types";

// Status options for roles
const ROLE_STATUS_OPTIONS = [
  {
    value: "ACTIVE" as const,
    label: "Active",
    description: "Role is available for assignment",
    color: "#10b981",
  },
  {
    value: "INACTIVE" as const,
    label: "Inactive",
    description: "Role is temporarily disabled",
    color: "#6b7280",
  },
];

// Privilege status options for within role
const PRIVILEGE_STATUS_IN_ROLE_OPTIONS = [
  {
    value: "ACTIVE" as const,
    label: "Active",
    description: "Privilege is granted in this role",
    color: "#10b981",
  },
  {
    value: "INACTIVE" as const,
    label: "Inactive",
    description: "Privilege is revoked in this role",
    color: "#ef4444",
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

const RoleUpdatePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const initialRoleId = searchParams?.get("id") || "";
  const initialRoleName = searchParams?.get("name") || "";

  // State for roles list
  const [roles, setRoles] = useState<RoleNameAndId[]>([]);

  // State for selected role
  const [selectedRole, setSelectedRole] = useState<RoleNameAndId | null>(
    initialRoleId && initialRoleName
      ? {
          id: parseInt(initialRoleId),
          name: initialRoleName,
        }
      : null,
  );

  // State for role details
  const [originalRole, setOriginalRole] = useState<RoleDetails | null>(null);
  const [editedRole, setEditedRole] = useState<RoleDetails | null>(null);

  // State for available privileges
  const [availablePrivileges, setAvailablePrivileges] = useState<
    PrivilegeNameAndId[]
  >([]);
  const [loadingPrivileges, setLoadingPrivileges] = useState(false);

  // State for privilege changes tracking
  const [addedPrivileges, setAddedPrivileges] = useState<number[]>([]);
  const [removedPrivileges, setRemovedPrivileges] = useState<number[]>([]);
  const [updatedPrivileges, setUpdatedPrivileges] = useState<
    UpdatePrivilegeInRole[]
  >([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isPrivilegesDropdownOpen, setIsPrivilegesDropdownOpen] =
    useState(false);
  const [privilegeSearchQuery, setPrivilegeSearchQuery] = useState("");

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Roles", href: "/roles" },
    { label: "Update", href: "/roles/update" },
  ];

  // Character limits
  const NAME_MAX = 100;
  const DESCRIPTION_MAX = 500;

  // Fetch roles list on initial load
  useEffect(() => {
    if (!selectedRole) {
      fetchRoles();
    }
  }, []);

  // Fetch available privileges
  useEffect(() => {
    fetchAvailablePrivileges();
  }, []);

  // If initialRoleId is provided, fetch details
  useEffect(() => {
    if (initialRoleId && !originalRole) {
      handleSelectRole(parseInt(initialRoleId), initialRoleName);
    }
  }, [initialRoleId, initialRoleName]);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    setSearchError(null);
    try {
      const response = await RoleService.getRoleNamesAndIds();
      if (response.code === 200 && response.data) {
        setRoles(response.data);
      } else {
        throw new Error(response.message || "Failed to load roles");
      }
    } catch (err: any) {
      const errorMsg = err.message || "Failed to load roles";
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

  const fetchAvailablePrivileges = async () => {
    setLoadingPrivileges(true);
    try {
      const response = await PrivilegeService.getPrivilegesNamesAndIds();
      if (response.code === 200 && response.data) {
        setAvailablePrivileges(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching privileges:", err);
    } finally {
      setLoadingPrivileges(false);
    }
  };

  // Handle role selection
  const handleSelectRole = async (id: number, name: string) => {
    setSelectedRole({ id, name });
    await fetchRoleDetails(id);
  };

  // Fetch role details
  const fetchRoleDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setOriginalRole(null);
    setEditedRole(null);
    setAddedPrivileges([]);
    setRemovedPrivileges([]);
    setUpdatedPrivileges([]);

    try {
      const response = await RoleService.getRoleDetailsById(id);
      if (response.code === 200 && response.data) {
        setOriginalRole(response.data);
        setEditedRole(response.data);
      } else {
        throw new Error(response.message || "Failed to load role details");
      }
    } catch (err: any) {
      const errorMsg = err.message || "Failed to load role details";
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
    if (!editedRole) return;

    setEditedRole({
      ...editedRole,
      [name]: value,
    });
  };

  // Handle status selection
  const handleStatusChange = (status: "ACTIVE" | "INACTIVE") => {
    if (!editedRole) return;
    setEditedRole({
      ...editedRole,
      roleStatus: status,
    });
  };

  // Handle privilege status update within role
  const handlePrivilegeStatusUpdate = (
    privilegeId: number,
    newStatus: "ACTIVE" | "INACTIVE",
  ) => {
    if (!editedRole) return;

    const privilege = editedRole.privileges.find(
      (p) => p.privilegeId === privilegeId,
    );
    if (!privilege) return;

    const oldStatus = privilege.privilegeStatus as "ACTIVE" | "INACTIVE";

    if (oldStatus === newStatus) return;

    // Update local state
    setEditedRole({
      ...editedRole,
      privileges: editedRole.privileges.map((p) =>
        p.privilegeId === privilegeId
          ? { ...p, privilegeStatus: newStatus }
          : p,
      ),
    });

    // Track update
    setUpdatedPrivileges((prev) => {
      const existing = prev.find((u) => u.privilegeId === privilegeId);
      if (existing) {
        return prev.map((u) =>
          u.privilegeId === privilegeId ? { ...u, status: newStatus } : u,
        );
      }
      return [
        ...prev,
        { roleId: selectedRole!.id, privilegeId, status: newStatus },
      ];
    });
  };

  // Handle add new privilege to role
  const handleAddPrivilege = (privilegeId: number) => {
    if (!editedRole) return;

    const privilegeToAdd = availablePrivileges.find(
      (p) => p.id === privilegeId,
    );
    if (!privilegeToAdd) return;

    // Check if already in role
    if (editedRole.privileges.some((p) => p.privilegeId === privilegeId))
      return;

    // Add to local state
    const newPrivilege: PrivilegeInRole = {
      privilegeId: privilegeToAdd.id,
      privilegeName: privilegeToAdd.name,
      privilegeDescription: null,
      privilegeStatus: "ACTIVE",
    };

    setEditedRole({
      ...editedRole,
      privileges: [...editedRole.privileges, newPrivilege],
    });

    // Track addition
    setAddedPrivileges((prev) => [...prev, privilegeId]);

    // Remove from removed if it was previously removed
    setRemovedPrivileges((prev) => prev.filter((id) => id !== privilegeId));
  };

  // Handle remove privilege from role
  const handleRemovePrivilege = (privilegeId: number) => {
    if (!editedRole) return;

    const privilegeToRemove = editedRole.privileges.find(
      (p) => p.privilegeId === privilegeId,
    );
    if (!privilegeToRemove) return;

    // Remove from local state
    setEditedRole({
      ...editedRole,
      privileges: editedRole.privileges.filter(
        (p) => p.privilegeId !== privilegeId,
      ),
    });

    // Track removal
    setRemovedPrivileges((prev) => [...prev, privilegeId]);

    // Remove from added if it was previously added
    setAddedPrivileges((prev) => prev.filter((id) => id !== privilegeId));

    // Remove from updated if it exists
    setUpdatedPrivileges((prev) =>
      prev.filter((u) => u.privilegeId !== privilegeId),
    );
  };

  // Get available privileges not already in role
  const getAvailablePrivilegesToAdd = () => {
    if (!editedRole) return availablePrivileges;
    const existingIds = editedRole.privileges.map((p) => p.privilegeId);
    return availablePrivileges.filter((p) => !existingIds.includes(p.id));
  };

  const availableToAdd = getAvailablePrivilegesToAdd();
  const filteredAvailablePrivileges = availableToAdd.filter((p) =>
    p.name.toLowerCase().includes(privilegeSearchQuery.toLowerCase()),
  );

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    if (!originalRole || !editedRole) return false;

    const basicFieldsChanged =
      originalRole.roleName !== editedRole.roleName ||
      originalRole.roleDescription !== editedRole.roleDescription ||
      originalRole.roleStatus !== editedRole.roleStatus;

    const privilegesChanged =
      addedPrivileges.length > 0 ||
      removedPrivileges.length > 0 ||
      updatedPrivileges.length > 0;

    return basicFieldsChanged || privilegesChanged;
  }, [
    originalRole,
    editedRole,
    addedPrivileges,
    removedPrivileges,
    updatedPrivileges,
  ]);

  // Prepare update data
  const prepareUpdateData = (): UpdateRoleRequest | null => {
    if (!editedRole || !selectedRole) return null;

    return {
      id: selectedRole.id,
      name: editedRole.roleName.trim(),
      status: editedRole.roleStatus,
      description: editedRole.roleDescription?.trim() || "",
      addPrivilegesIds: addedPrivileges,
      removePrivilegesIds: removedPrivileges,
      updatePrivileges: updatedPrivileges,
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
      const response = await RoleService.updateRole(updateData);

      const successMsg = `Role "${editedRole?.roleName}" updated successfully!`;
      setSuccess(successMsg);

      setToast({
        type: "success",
        title: "Update Successful!",
        message: `${editedRole?.roleName} has been updated successfully.`,
        actionLink: `/roles/view?id=${selectedRole?.id}`,
      });

      setShowConfirmModal(false);

      // Refresh role details
      if (selectedRole) {
        await fetchRoleDetails(selectedRole.id);
      }

      // Refresh roles list
      await fetchRoles();
    } catch (err: any) {
      const errorMsg = err.message || "Failed to update role";
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
    if (originalRole) {
      setEditedRole({ ...originalRole });
      setAddedPrivileges([]);
      setRemovedPrivileges([]);
      setUpdatedPrivileges([]);
      setError(null);
      setSuccess(null);

      setToast({
        type: "success",
        title: "Changes Reset",
        message: "All unsaved changes have been discarded.",
      });
    }
  };

  const handleClearRoleSelection = () => {
    setSelectedRole(null);
    setOriginalRole(null);
    setEditedRole(null);
    setAddedPrivileges([]);
    setRemovedPrivileges([]);
    setUpdatedPrivileges([]);
    setToast(null);

    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    url.searchParams.delete("name");
    router.replace(url.toString(), { scroll: false });
  };

  // Get changed fields for confirmation modal
  const getChangedFields = (): ChangedField[] => {
    if (!originalRole || !editedRole) return [];

    const changes: ChangedField[] = [];

    if (originalRole.roleName !== editedRole.roleName) {
      changes.push({
        field: "Role Name",
        oldValue: originalRole.roleName,
        newValue: editedRole.roleName,
      });
    }

    if (originalRole.roleDescription !== editedRole.roleDescription) {
      changes.push({
        field: "Description",
        oldValue: originalRole.roleDescription || "(empty)",
        newValue: editedRole.roleDescription || "(empty)",
      });
    }

    if (originalRole.roleStatus !== editedRole.roleStatus) {
      changes.push({
        field: "Status",
        oldValue: originalRole.roleStatus,
        newValue: editedRole.roleStatus,
      });
    }

    if (addedPrivileges.length > 0) {
      const addedNames = addedPrivileges
        .map((id) => {
          const priv = availablePrivileges.find((p) => p.id === id);
          return priv?.name || `ID: ${id}`;
        })
        .join(", ");
      changes.push({
        field: "Privileges Added",
        oldValue: "None",
        newValue: addedNames,
      });
    }

    if (removedPrivileges.length > 0) {
      const removedNames = removedPrivileges
        .map((id) => {
          const priv = originalRole.privileges.find(
            (p) => p.privilegeId === id,
          );
          return priv?.privilegeName || `ID: ${id}`;
        })
        .join(", ");
      changes.push({
        field: "Privileges Removed",
        oldValue:
          originalRole.privileges.find((p) =>
            removedPrivileges.includes(p.privilegeId),
          )?.privilegeName || "Some",
        newValue: "Removed",
      });
    }

    if (updatedPrivileges.length > 0) {
      updatedPrivileges.forEach((update) => {
        const privilege = originalRole.privileges.find(
          (p) => p.privilegeId === update.privilegeId,
        );
        if (privilege) {
          changes.push({
            field: `Privilege Status (${privilege.privilegeName})`,
            oldValue: privilege.privilegeStatus,
            newValue: update.status,
          });
        }
      });
    }

    return changes;
  };

  // Convert roles to search items format
  const searchItems = roles.map((role) => ({
    id: role.id,
    name: role.name,
  }));

  const selectedSearchItem = selectedRole
    ? {
        id: selectedRole.id,
        name: selectedRole.name,
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
          actionText="View Role"
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
            title="Update Role"
            description="Edit and update existing role information and privileges"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 relative" style={{ overflow: "visible" }}>
        {/* Search Section */}
        {!selectedRole && (
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
              Select Role to Update
            </h2>

            {searchError ? (
              <CommonErrorState
                error={searchError}
                title="Failed to Load Roles"
                message="Unable to load roles. Please try again."
                variant="error"
                showBackButton={false}
                showRetryButton={true}
                onRetry={fetchRoles}
                retryButtonText="Retry"
                fullScreen={false}
              />
            ) : (
              <CommonSearch
                items={searchItems}
                loading={loading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) =>
                  handleSelectRole(item.id as number, item.name)
                }
                onClearSelection={handleClearRoleSelection}
                initialSearchTerm={initialRoleName}
                placeholder="Search roles..."
                title="Roles"
                variant="primary"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            )}
          </div>
        )}

        {/* Selected Role Info Bar */}
        {selectedRole && (
          <SelectedItemBar
            item={selectedRole}
            onClear={handleClearRoleSelection}
            variant="primary"
            title="Currently Editing"
            showId={true}
            clearButtonText="Change Role"
            size="md"
          />
        )}

        {/* Loading Details State */}
        {loadingDetails && (
          <CommonLoading
            message="Loading role details..."
            subMessage="Please wait while we fetch the role information"
            size="lg"
            fullScreen={false}
            className="rounded-2xl shadow-lg border"
          />
        )}

        {/* Role Details Form */}
        {editedRole && selectedRole && (
          <>
            {/* Basic Information Card */}
            <div
              className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 mb-6"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
              }}
            >
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
                    Role Information
                  </h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    Edit the role details below
                  </p>
                </div>
              </div>

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
                          editedRole.roleName.length > NAME_MAX * 0.9
                            ? theme.error
                            : theme.textSecondary,
                      }}
                    >
                      {editedRole.roleName.length}/{NAME_MAX}
                    </span>
                  </div>
                  <input
                    id="role-name"
                    type="text"
                    name="roleName"
                    value={editedRole.roleName}
                    onChange={handleFieldChange}
                    placeholder="e.g. Administrator, Content Manager, Viewer"
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
                          (editedRole.roleDescription?.length || 0) >
                          DESCRIPTION_MAX * 0.9
                            ? theme.error
                            : theme.textSecondary,
                      }}
                    >
                      {editedRole.roleDescription?.length || 0}/
                      {DESCRIPTION_MAX}
                    </span>
                  </div>
                  <textarea
                    id="role-description"
                    name="roleDescription"
                    value={editedRole.roleDescription || ""}
                    onChange={handleFieldChange}
                    rows={4}
                    placeholder="Describe what this role can do and its responsibilities..."
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
                    {ROLE_STATUS_OPTIONS.map((opt) => {
                      const isSelected = editedRole.roleStatus === opt.value;
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
                            {isSelected ? (
                              <Power
                                className="w-4 h-4"
                                style={{ color: opt.color }}
                              />
                            ) : (
                              <PowerOff
                                className="w-4 h-4"
                                style={{ color: theme.textSecondary }}
                              />
                            )}
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

            {/* Privileges Management Card - FIXED DROPDOWN */}
            <div
              className="rounded-2xl shadow-lg transition-all duration-300 mb-6"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
                overflow: "visible",
              }}
            >
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: `1px solid ${theme.border}` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      backgroundColor: `${theme.primary}18`,
                      color: theme.primary,
                    }}
                  >
                    <Key className="w-4 h-4" />
                  </span>
                  <div>
                    <h2
                      className="text-base font-semibold leading-tight"
                      style={{ color: theme.text }}
                    >
                      Role Privileges
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Manage privileges assigned to this role
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${theme.primary}15`,
                    color: theme.primary,
                  }}
                >
                  {editedRole.privileges.length} privileges
                </span>
              </div>

              <div className="p-6">
                {/* Current Privileges List */}
                {editedRole.privileges.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.textSecondary }}
                    >
                      Current Privileges
                    </p>
                    <div className="space-y-2">
                      {editedRole.privileges.map((privilege) => (
                        <div
                          key={privilege.privilegeId}
                          className="flex items-center justify-between p-3 rounded-xl border transition-all duration-200"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Key
                                className="w-4 h-4"
                                style={{ color: theme.primary }}
                              />
                              <span
                                className="font-medium text-sm"
                                style={{ color: theme.text }}
                              >
                                {privilege.privilegeName}
                              </span>
                            </div>
                            {privilege.privilegeDescription && (
                              <p
                                className="text-xs mt-1 ml-6"
                                style={{ color: theme.textSecondary }}
                              >
                                {privilege.privilegeDescription}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Privilege Status Toggle */}
                            <select
                              value={privilege.privilegeStatus}
                              onChange={(e) =>
                                handlePrivilegeStatusUpdate(
                                  privilege.privilegeId,
                                  e.target.value as "ACTIVE" | "INACTIVE",
                                )
                              }
                              className="text-xs rounded-lg px-2 py-1 border focus:outline-none"
                              style={{
                                backgroundColor: theme.background,
                                borderColor: theme.border,
                                color: theme.text,
                              }}
                            >
                              {PRIVILEGE_STATUS_IN_ROLE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemovePrivilege(privilege.privilegeId)
                              }
                              className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                              style={{ color: theme.error }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${theme.error}15`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className="text-center py-8 mb-6 rounded-xl"
                    style={{
                      backgroundColor: `${theme.border}20`,
                    }}
                  >
                    <Key
                      className="w-12 h-12 mx-auto mb-2 opacity-30"
                      style={{ color: theme.textSecondary }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      No privileges assigned to this role
                    </p>
                  </div>
                )}

                {/* Add New Privileges Section - FIXED DROPDOWN */}
                <div className="relative" style={{ zIndex: 50 }}>
                  <p
                    className="text-sm font-medium mb-3"
                    style={{ color: theme.textSecondary }}
                  >
                    Add New Privileges
                  </p>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                        style={{ color: theme.textSecondary }}
                      />
                      <input
                        type="text"
                        placeholder="Search and add privileges..."
                        value={privilegeSearchQuery}
                        onChange={(e) =>
                          setPrivilegeSearchQuery(e.target.value)
                        }
                        onFocus={() => setIsPrivilegesDropdownOpen(true)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border-2 focus:outline-none text-sm"
                        style={{
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                          color: theme.text,
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setIsPrivilegesDropdownOpen(!isPrivilegesDropdownOpen)
                      }
                      className="px-3 py-2 rounded-xl border-2 transition-all duration-200"
                      style={{
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        color: theme.textSecondary,
                      }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dropdown for available privileges - FIXED POSITIONING */}
                  {isPrivilegesDropdownOpen && (
                    <>
                      {/* Backdrop for closing dropdown when clicking outside */}
                      <div
                        className="fixed inset-0"
                        style={{ zIndex: 9999 }}
                        onClick={() => setIsPrivilegesDropdownOpen(false)}
                      />
                      
                      {/* Dropdown Content */}
                      <div
                        className="absolute left-0 right-0 mt-2 rounded-xl border shadow-2xl overflow-hidden"
                        style={{
                          backgroundColor: theme.surface,
                          borderColor: theme.border,
                          maxHeight: "350px",
                          display: "flex",
                          flexDirection: "column",
                          zIndex: 10000,
                          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                        }}
                      >
                        {/* Header */}
                        <div
                          className="px-4 py-3 border-b flex-shrink-0"
                          style={{ borderColor: theme.border, backgroundColor: theme.surface }}
                        >
                          <p
                            className="text-sm font-medium"
                            style={{ color: theme.text }}
                          >
                            Available Privileges
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: theme.textSecondary }}
                          >
                            {filteredAvailablePrivileges.length} privileges available to add
                          </p>
                        </div>
                        
                        {/* Scrollable List */}
                        <div className="overflow-y-auto flex-1" style={{ maxHeight: "250px" }}>
                          {loadingPrivileges ? (
                            <div className="p-8 text-center">
                              <div
                                className="w-6 h-6 border-2 rounded-full animate-spin mx-auto"
                                style={{
                                  borderColor: theme.primary,
                                  borderTopColor: "transparent",
                                }}
                              />
                              <p className="text-sm mt-2" style={{ color: theme.textSecondary }}>
                                Loading privileges...
                              </p>
                            </div>
                          ) : filteredAvailablePrivileges.length === 0 ? (
                            <div className="p-8 text-center">
                              <Key
                                className="w-8 h-8 mx-auto mb-2 opacity-30"
                                style={{ color: theme.textSecondary }}
                              />
                              <p className="text-sm" style={{ color: theme.textSecondary }}>
                                {privilegeSearchQuery
                                  ? "No matching privileges found"
                                  : "All privileges are already assigned to this role"}
                              </p>
                            </div>
                          ) : (
                            filteredAvailablePrivileges.map((privilege, index) => (
                              <button
                                key={privilege.id}
                                type="button"
                                onClick={() => {
                                  handleAddPrivilege(privilege.id);
                                  setIsPrivilegesDropdownOpen(false);
                                  setPrivilegeSearchQuery("");
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 hover:bg-opacity-50 cursor-pointer group"
                                style={{
                                  borderBottom: index !== filteredAvailablePrivileges.length - 1 
                                    ? `1px solid ${theme.border}` 
                                    : "none",
                                  backgroundColor: "transparent",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = `${theme.primary}08`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                }}
                              >
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                                  style={{
                                    backgroundColor: `${theme.primary}15`,
                                  }}
                                >
                                  <Plus
                                    className="w-4 h-4"
                                    style={{ color: theme.primary }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="text-sm font-medium truncate"
                                    style={{ color: theme.text }}
                                  >
                                    {privilege.name}
                                  </p>
                                  <p
                                    className="text-xs truncate"
                                    style={{ color: theme.textSecondary }}
                                  >
                                    Click to add this privilege
                                  </p>
                                </div>
                                <ChevronDown
                                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
                                  style={{ color: theme.primary }}
                                />
                              </button>
                            ))
                          )}
                        </div>
                        
                        {/* Footer */}
                        <div
                          className="px-4 py-3 border-t flex-shrink-0"
                          style={{ borderColor: theme.border, backgroundColor: theme.surface }}
                        >
                          <button
                            type="button"
                            onClick={() => setIsPrivilegesDropdownOpen(false)}
                            className="w-full text-sm px-3 py-2 rounded-lg transition-all duration-200 font-medium"
                            style={{
                              backgroundColor: theme.primary,
                              color: "#fff",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = "0.9";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "1";
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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
                  {loadingUpdate ? "Updating..." : "Update Role"}
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
                    <Edit
                      className="w-5 h-5"
                      style={{ color: theme.primary }}
                    />
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: theme.primary }}
                      >
                        You have unsaved changes
                      </p>
                      <p
                        className="text-sm mt-1"
                        style={{ color: theme.textSecondary }}
                      >
                        {addedPrivileges.length > 0 &&
                          `${addedPrivileges.length} privilege(s) to add, `}
                        {removedPrivileges.length > 0 &&
                          `${removedPrivileges.length} privilege(s) to remove, `}
                        {updatedPrivileges.length > 0 &&
                          `${updatedPrivileges.length} privilege status update(s), `}
                        Click "Update Role" to save your changes
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && originalRole && editedRole && (
          <UpdateConfirmationModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleUpdateSubmit}
            changedFields={getChangedFields()}
            itemName={editedRole.roleName}
            confirmText="Update Role"
            cancelText="Cancel"
            type="update"
            isLoading={loadingUpdate}
            showFieldComparisons={true}
          />
        )}
      </div>

      <style jsx>{`
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

export default RoleUpdatePage;