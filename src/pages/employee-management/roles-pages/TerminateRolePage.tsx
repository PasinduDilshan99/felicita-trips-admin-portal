"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import { TerminateConfirmModal } from "@/components/common-components/TerminateConfirmModal";
import { RoleService } from "@/services/roleService";
import { useTheme } from "@/contexts/ThemeContext";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import CommonSearch from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import {
  AlertTriangle,
  Shield,
  Key,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { RoleDetails, RoleNameAndId, RoleSearchItem } from "@/types/role-types";
import { hexToRgba } from "@/utils/functions";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { ROLE_TERMINATE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";

const TerminateRolePage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRoleName = searchParams?.get("role-name") || "";
  const initialRoleId = searchParams?.get("role-id") || "";
  const [roles, setRoles] = useState<RoleNameAndId[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleNameAndId | null>(
    initialRoleId && initialRoleName
      ? {
          id: parseInt(initialRoleId),
          name: initialRoleName,
        }
      : null,
  );
  const [roleDetails, setRoleDetails] = useState<RoleDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingTerminate, setLoadingTerminate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await RoleService.getRoleNamesAndIds();
      if (response.code === 200 && response.data) {
        setRoles(response.data);
      } else {
        throw new Error(response.message || "Failed to load roles");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load roles");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load roles",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setRoleDetails(null);
    try {
      const response = await RoleService.getRoleDetailsById(id);
      if (response.code === 200 && response.data) {
        setRoleDetails(response.data);
      } else {
        throw new Error(response.message || "Failed to load role details");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load role details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load role details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectRole = async (id: number, name: string) => {
    setSelectedRole({ id, name });
    await fetchRoleDetails(id);

    const url = new URL(window.location.href);
    url.searchParams.set("role-id", id.toString());
    url.searchParams.set("role-name", name);
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearRoleSelection = () => {
    setSelectedRole(null);
    setRoleDetails(null);
    setError(null);
    setSuccess(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("role-id");
    url.searchParams.delete("role-name");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminateClick = () => {
    if (!selectedRole) return;
    setShowConfirmModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedRole) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await RoleService.terminateRole(selectedRole.id);

      setSuccess("Role terminated successfully!");
      setToast({
        type: "success",
        title: "Termination Successful!",
        message: `"${selectedRole.name}" has been permanently removed from the system.`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        handleClearRoleSelection();
        fetchRoles();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate role");
      setToast({
        type: "error",
        title: "Termination Failed",
        message: err.message || "Failed to terminate role. Please try again.",
      });
    } finally {
      setLoadingTerminate(false);
    }
  };

  // Get status badge color and icon
  const getStatusConfig = (status: string) => {
    if (status === "ACTIVE") {
      return {
        color: "#10b981",
        bg: hexToRgba("#10b981", 0.1),
        icon: CheckCircle,
        text: "Active",
      };
    }
    return {
      color: "#ef4444",
      bg: hexToRgba("#ef4444", 0.1),
      icon: XCircle,
      text: "Inactive",
    };
  };

  // Get privilege status color
  const getPrivilegeStatusConfig = (status: string) => {
    if (status === "ACTIVE") {
      return {
        color: "#10b981",
        bg: hexToRgba("#10b981", 0.1),
        text: "Active",
      };
    }
    return {
      color: "#ef4444",
      bg: hexToRgba("#ef4444", 0.1),
      text: "Inactive",
    };
  };

  // Convert roles to search items format
  const searchItems: RoleSearchItem[] = roles.map((role) => ({
    id: role.id,
    name: role.name,
  }));

  const selectedSearchItem: RoleSearchItem | null = selectedRole
    ? {
        id: selectedRole.id,
        name: selectedRole.name,
      }
    : null;

  useEffect(() => {
    if (!selectedRole) {
      fetchRoles();
    }
  }, []);

  useEffect(() => {
    if (initialRoleId && !roleDetails) {
      handleSelectRole(parseInt(initialRoleId), initialRoleName);
    }
  }, [initialRoleId, initialRoleName]);

  if (loading && !selectedRole) {
    return (
      <CommonLoading
        message="Loading roles..."
        subMessage="Please wait while we fetch available roles"
        size="lg"
        fullScreen={true}
      />
    );
  }

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
          actionText="View Details"
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-all duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Terminate Role"
            description="Permanently remove a role from the system"
            breadcrumbItems={ROLE_TERMINATE_BREADCRUMB_DATA}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no role is selected */}
        {!selectedRole && (
          <div
            className="rounded-2xl shadow-lg mb-8 transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              className="px-5 sm:px-6 py-4 flex items-center gap-3 border-b"
              style={{ borderColor: theme.border }}
            >
              <span
                className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{
                  background: hexToRgba(theme.error, 0.1),
                  color: theme.error,
                }}
              >
                <Shield className="w-4 h-4" />
              </span>
              <div>
                <h2
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  Select Role to Terminate
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a role to review its data before termination
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<RoleSearchItem>
                items={searchItems}
                loading={loading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) => handleSelectRole(item.id, item.name)}
                onClearSelection={handleClearRoleSelection}
                initialSearchTerm={initialRoleName}
                placeholder="Search roles..."
                title="Roles"
                variant="error"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        {/* Selected Role Info Bar */}
        <SelectedItemBar
          item={
            selectedRole
              ? {
                  id: selectedRole.id,
                  name: selectedRole.name,
                }
              : null
          }
          onClear={handleClearRoleSelection}
          variant="error"
          title="Selected for Termination"
          showId={true}
          clearButtonText="Change Selection"
          size="md"
        />

        {/* Role Details Section */}
        {selectedRole && (
          <div
            className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1.5px solid ${hexToRgba(theme.error, 0.5)}`,
              boxShadow: `0 4px 32px ${hexToRgba(theme.error, 0.07)}`,
            }}
          >
            {/* Warning Header */}
            <div
              className="px-5 sm:px-6 py-4 flex flex-wrap items-center gap-4"
              style={{
                background: `linear-gradient(90deg, ${hexToRgba(theme.error, 0.08)}, ${hexToRgba(theme.error, 0.03)})`,
                borderBottom: `1.5px solid ${hexToRgba(theme.error, 0.3)}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.error}, ${theme.error})`,
                  color: "#fff",
                }}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  className="text-base font-bold"
                  style={{ color: theme.error }}
                >
                  Role Termination Review
                </h2>
                <p className="text-xs mt-0.5" style={{ color: theme.error }}>
                  Review all data carefully. This action is permanent and cannot
                  be undone.
                </p>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl flex-shrink-0"
                style={{
                  background: hexToRgba(theme.error, 0.08),
                  border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
                }}
              >
                <span className="text-xs" style={{ color: theme.error }}>
                  ID
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: theme.error }}
                >
                  #{selectedRole.id}
                </span>
              </div>
            </div>

            {/* Loading Details */}
            {loadingDetails && (
              <CommonLoading
                message="Loading role details..."
                subMessage="Please wait while we fetch the role information"
                size="lg"
                fullScreen={false}
              />
            )}

            {/* Role Details Content */}
            {!loadingDetails && roleDetails && (
              <div className="p-5 sm:p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Card */}
                  <div
                    className="rounded-xl p-4 transition-all duration-200"
                    style={{
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Shield
                        className="w-5 h-5"
                        style={{ color: theme.primary }}
                      />
                      <span
                        className="text-xs font-medium uppercase tracking-wide"
                        style={{ color: theme.textSecondary }}
                      >
                        Status
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const config = getStatusConfig(roleDetails.roleStatus);
                        const IconComponent = config.icon;
                        return (
                          <>
                            <IconComponent
                              className="w-5 h-5"
                              style={{ color: config.color }}
                            />
                            <span
                              className="text-sm font-semibold"
                              style={{ color: config.color }}
                            >
                              {config.text}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Privileges Count Card */}
                  <div
                    className="rounded-xl p-4 transition-all duration-200"
                    style={{
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Key
                        className="w-5 h-5"
                        style={{ color: theme.warning }}
                      />
                      <span
                        className="text-xs font-medium uppercase tracking-wide"
                        style={{ color: theme.textSecondary }}
                      >
                        Associated Privileges
                      </span>
                    </div>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: theme.warning }}
                    >
                      {roleDetails.privileges.length}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: theme.textSecondary }}
                    >
                      {roleDetails.privileges.length === 1
                        ? "privilege assigned to this role"
                        : "privileges assigned to this role"}
                    </p>
                  </div>
                </div>

                {/* Role Info */}
                <div
                  className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    backgroundColor: theme.background,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div
                    className="flex items-center gap-2 px-4 py-3"
                    style={{
                      borderBottom: `1px solid ${theme.border}`,
                      backgroundColor: `${theme.border}20`,
                    }}
                  >
                    <Shield
                      className="w-4 h-4"
                      style={{ color: theme.primary }}
                    />
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: theme.text }}
                    >
                      Role Information
                    </h3>
                  </div>
                  <div className="px-4 py-4 space-y-3">
                    <div>
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Role Name
                      </p>
                      <p
                        className="text-base font-semibold"
                        style={{ color: theme.text }}
                      >
                        {roleDetails.roleName}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: theme.textSecondary }}
                      >
                        Description
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: theme.textSecondary }}
                      >
                        {roleDetails.roleDescription ||
                          "No description provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Associated Privileges List */}
                <div
                  className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    backgroundColor: theme.background,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{
                      borderBottom: `1px solid ${theme.border}`,
                      backgroundColor: `${theme.border}20`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Key
                        className="w-4 h-4"
                        style={{ color: theme.warning }}
                      />
                      <h3
                        className="text-sm font-semibold"
                        style={{ color: theme.text }}
                      >
                        Assigned Privileges ({roleDetails.privileges.length})
                      </h3>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: hexToRgba(theme.warning, 0.1),
                        color: theme.warning,
                        border: `1px solid ${hexToRgba(theme.warning, 0.2)}`,
                      }}
                    >
                      Will be removed
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    {roleDetails.privileges.length > 0 ? (
                      <div className="space-y-2">
                        {roleDetails.privileges.map((privilege) => {
                          const statusConfig = getPrivilegeStatusConfig(
                            privilege.privilegeStatus,
                          );
                          return (
                            <div
                              key={privilege.privilegeId}
                              className="flex items-center justify-between p-3 rounded-lg transition-all duration-200"
                              style={{
                                backgroundColor: `${theme.border}20`,
                                border: `1px solid ${theme.border}`,
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
                                <span
                                  className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                  style={{
                                    backgroundColor: statusConfig.bg,
                                    color: statusConfig.color,
                                  }}
                                >
                                  {statusConfig.text}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Key
                          className="w-8 h-8 mx-auto mb-2 opacity-30"
                          style={{ color: theme.textSecondary }}
                        />
                        <p
                          className="text-sm"
                          style={{ color: theme.textSecondary }}
                        >
                          No privileges are currently assigned to this role
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Impact Warning */}
                <div
                  className="rounded-xl p-4 transition-all duration-200"
                  style={{
                    backgroundColor: `${theme.error}08`,
                    border: `1.5px solid ${theme.error}30`,
                  }}
                >
                  <div className="flex gap-3">
                    <AlertCircle
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: theme.error }}
                    />
                    <div>
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: theme.error }}
                      >
                        Termination Impact
                      </p>
                      <ul
                        className="text-xs space-y-1"
                        style={{ color: theme.textSecondary }}
                      >
                        <li>
                          • This role will be permanently removed from the
                          system
                        </li>
                        <li>
                          • All {roleDetails.privileges.length} privilege
                          assignment(s) will be removed
                        </li>
                        <li>
                          • Users assigned to this role will lose all associated
                          permissions
                        </li>
                        <li>• Any user-role mappings will be deleted</li>
                        <li>• This action cannot be undone</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Termination Button */}
                <div
                  className="flex justify-center pt-4"
                  style={{
                    borderTop: `1.5px solid ${hexToRgba(theme.error, 0.2)}`,
                  }}
                >
                  <button
                    onClick={handleTerminateClick}
                    disabled={loadingTerminate}
                    className="cursor-pointer flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:hover:scale-100"
                    style={{
                      background: loadingTerminate
                        ? `linear-gradient(135deg, ${theme.error}, ${theme.error}dd)`
                        : `linear-gradient(135deg, ${theme.error}, ${hexToRgba(theme.error, 0.8)})`,
                      color: "#fff",
                      opacity: loadingTerminate ? 0.6 : 1,
                      boxShadow: `0 4px 16px ${hexToRgba(theme.error, 0.3)}`,
                    }}
                  >
                    {loadingTerminate ? (
                      <>
                        <div className="relative w-4 h-4">
                          <div className="absolute inset-0 border-2 border-white/30 rounded-full" />
                          <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                        <span className="animate-pulse">Processing…</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                        Terminate Role Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loadingDetails && !roleDetails && error && (
              <CommonErrorState
                error={error}
                title="Failed to Load Role"
                message="The role couldn't be loaded. Please try again."
                variant="error"
                showBackButton={true}
                showRetryButton={true}
                onBack={handleClearRoleSelection}
                onRetry={() =>
                  selectedRole && fetchRoleDetails(selectedRole.id)
                }
                backButtonText="Change Selection"
                retryButtonText="Try Again"
                fullScreen={false}
              />
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <TerminateConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmTerminate}
        itemName={selectedRole?.name || ""}
        itemId={selectedRole?.id}
        itemType="role"
        additionalInfo={
          roleDetails
            ? [
                { label: "Status", value: roleDetails.roleStatus },
                {
                  label: "Assigned Privileges",
                  value: roleDetails.privileges.length,
                },
              ]
            : []
        }
        warningMessage={`This role has ${roleDetails?.privileges.length || 0} privilege(s) assigned and may be assigned to users. Terminating it will remove all privilege assignments and user associations.`}
        confirmText="Permanently Terminate Role"
        cancelText="Cancel"
        isLoading={loadingTerminate}
      />
    </div>
  );
};

export default TerminateRolePage;
