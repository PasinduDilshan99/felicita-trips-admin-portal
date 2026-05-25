// app/privileges/terminate/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import { PrivilegeService } from "@/services/privilegeService";
import { useTheme } from "@/contexts/ThemeContext";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import CommonSearch from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import {
  AlertTriangle,
  Shield,
  Key,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  Hash,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { PrivilegeDetails, PrivilegeNameAndId } from "@/types/privilege-types";
import { TerminateConfirmModal } from "@/components/common-components/TerminateConfirmModal";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0, 0, 0, ${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Type for search items
interface PrivilegeSearchItem {
  id: number;
  name: string;
}

const TerminatePrivilegePage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPrivilegeName = searchParams?.get("privilege-name") || "";
  const initialPrivilegeId = searchParams?.get("privilege-id") || "";

  const [privileges, setPrivileges] = useState<PrivilegeNameAndId[]>([]);
  const [selectedPrivilege, setSelectedPrivilege] = useState<PrivilegeNameAndId | null>(
    initialPrivilegeId && initialPrivilegeName
      ? {
          id: parseInt(initialPrivilegeId),
          name: initialPrivilegeName,
        }
      : null,
  );
  const [privilegeDetails, setPrivilegeDetails] = useState<PrivilegeDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingTerminate, setLoadingTerminate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    { label: "Terminate", href: "/privileges/terminate" },
  ];

  const fetchPrivileges = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await PrivilegeService.getPrivilegesNamesAndIds();
      if (response.code === 200 && response.data) {
        setPrivileges(response.data);
      } else {
        throw new Error(response.message || "Failed to load privileges");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load privileges");
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to load privileges",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPrivilegeDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setPrivilegeDetails(null);
    try {
      const response = await PrivilegeService.getPrivilegeDetailsById(id);
      if (response.code === 200 && response.data) {
        setPrivilegeDetails(response.data);
      } else {
        throw new Error(response.message || "Failed to load privilege details");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load privilege details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load privilege details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectPrivilege = async (id: number, name: string) => {
    setSelectedPrivilege({ id, name });
    await fetchPrivilegeDetails(id);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("privilege-id", id.toString());
    url.searchParams.set("privilege-name", name);
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearPrivilegeSelection = () => {
    setSelectedPrivilege(null);
    setPrivilegeDetails(null);
    setError(null);
    setSuccess(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("privilege-id");
    url.searchParams.delete("privilege-name");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminateClick = () => {
    if (!selectedPrivilege) return;
    setShowConfirmModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedPrivilege) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await PrivilegeService.terminatePrivilege(
        selectedPrivilege.id,
      );

      setSuccess("Privilege terminated successfully!");
      setToast({
        type: "success",
        title: "Termination Successful!",
        message: `"${selectedPrivilege.name}" has been permanently removed from the system.`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        handleClearPrivilegeSelection();
        fetchPrivileges();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate privilege");
      setToast({
        type: "error",
        title: "Termination Failed",
        message: err.message || "Failed to terminate privilege. Please try again.",
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

  // Convert privileges to search items format
  const searchItems: PrivilegeSearchItem[] = privileges.map((priv) => ({
    id: priv.id,
    name: priv.name,
  }));

  const selectedSearchItem: PrivilegeSearchItem | null = selectedPrivilege
    ? {
        id: selectedPrivilege.id,
        name: selectedPrivilege.name,
      }
    : null;

  useEffect(() => {
    if (!selectedPrivilege) {
      fetchPrivileges();
    }
  }, []);

  useEffect(() => {
    if (initialPrivilegeId && !privilegeDetails) {
      handleSelectPrivilege(
        parseInt(initialPrivilegeId),
        initialPrivilegeName,
      );
    }
  }, [initialPrivilegeId, initialPrivilegeName]);

  if (loading && !selectedPrivilege) {
    return (
      <CommonLoading
        message="Loading privileges..."
        subMessage="Please wait while we fetch available privileges"
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
            title="Terminate Privilege"
            description="Permanently remove a privilege from the system"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no privilege is selected */}
        {!selectedPrivilege && (
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
                <Key className="w-4 h-4" />
              </span>
              <div>
                <h2
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  Select Privilege to Terminate
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a privilege to review its data before termination
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<PrivilegeSearchItem>
                items={searchItems}
                loading={loading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) =>
                  handleSelectPrivilege(item.id, item.name)
                }
                onClearSelection={handleClearPrivilegeSelection}
                initialSearchTerm={initialPrivilegeName}
                placeholder="Search privileges..."
                title="Privileges"
                variant="error"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        {/* Selected Privilege Info Bar */}
        <SelectedItemBar
          item={
            selectedPrivilege
              ? {
                  id: selectedPrivilege.id,
                  name: selectedPrivilege.name,
                }
              : null
          }
          onClear={handleClearPrivilegeSelection}
          variant="error"
          title="Selected for Termination"
          showId={true}
          clearButtonText="Change Selection"
          size="md"
        />

        {/* Privilege Details Section */}
        {selectedPrivilege && (
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
                  Privilege Termination Review
                </h2>
                <p className="text-xs mt-0.5" style={{ color: theme.error }}>
                  Review all data carefully. This action is permanent and cannot be undone.
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
                  #{selectedPrivilege.id}
                </span>
              </div>
            </div>

            {/* Loading Details */}
            {loadingDetails && (
              <CommonLoading
                message="Loading privilege details..."
                subMessage="Please wait while we fetch the privilege information"
                size="lg"
                fullScreen={false}
              />
            )}

            {/* Privilege Details Content */}
            {!loadingDetails && privilegeDetails && (
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
                      <Shield className="w-5 h-5" style={{ color: theme.primary }} />
                      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                        Status
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const config = getStatusConfig(privilegeDetails.privilegeStatus);
                        const IconComponent = config.icon;
                        return (
                          <>
                            <IconComponent className="w-5 h-5" style={{ color: config.color }} />
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

                  {/* Roles Count Card */}
                  <div
                    className="rounded-xl p-4 transition-all duration-200"
                    style={{
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-5 h-5" style={{ color: theme.warning }} />
                      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                        Associated Roles
                      </span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: theme.warning }}>
                      {privilegeDetails.roles.length}
                    </p>
                    <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                      {privilegeDetails.roles.length === 1 ? "role uses this privilege" : "roles use this privilege"}
                    </p>
                  </div>
                </div>

                {/* Privilege Info */}
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
                    <Key className="w-4 h-4" style={{ color: theme.primary }} />
                    <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
                      Privilege Information
                    </h3>
                  </div>
                  <div className="px-4 py-4 space-y-3">
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Privilege Name
                      </p>
                      <p className="text-base font-semibold" style={{ color: theme.text }}>
                        {privilegeDetails.privilegeName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: theme.textSecondary }}>
                        Description
                      </p>
                      <p className="text-sm" style={{ color: theme.textSecondary }}>
                        {privilegeDetails.privilegeDescription || "No description provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Associated Roles List */}
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
                      <Users className="w-4 h-4" style={{ color: theme.warning }} />
                      <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
                        Associated Roles ({privilegeDetails.roles.length})
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
                      Will be affected
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    {privilegeDetails.roles.length > 0 ? (
                      <div className="space-y-2">
                        {privilegeDetails.roles.map((role) => {
                          const statusConfig = getStatusConfig(role.roleStatus);
                          const StatusIcon = statusConfig.icon;
                          return (
                            <div
                              key={role.roleId}
                              className="flex items-center justify-between p-3 rounded-lg transition-all duration-200"
                              style={{
                                backgroundColor: `${theme.border}20`,
                                border: `1px solid ${theme.border}`,
                              }}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4" style={{ color: theme.primary }} />
                                  <span className="font-medium text-sm" style={{ color: theme.text }}>
                                    {role.roleName}
                                  </span>
                                </div>
                                {role.roleDescription && (
                                  <p className="text-xs mt-1 ml-6" style={{ color: theme.textSecondary }}>
                                    {role.roleDescription}
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
                                  <StatusIcon className="w-3 h-3" />
                                  {statusConfig.text}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: theme.textSecondary }} />
                        <p className="text-sm" style={{ color: theme.textSecondary }}>
                          No roles are currently using this privilege
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
                    <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: theme.error }} />
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: theme.error }}>
                        Termination Impact
                      </p>
                      <ul className="text-xs space-y-1" style={{ color: theme.textSecondary }}>
                        <li>• This privilege will be permanently removed from the system</li>
                        <li>• Any roles using this privilege will have it revoked</li>
                        <li>• Users with roles containing this privilege will lose access</li>
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
                        Terminate Privilege Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loadingDetails && !privilegeDetails && error && (
              <CommonErrorState
                error={error}
                title="Failed to Load Privilege"
                message="The privilege couldn't be loaded. Please try again."
                variant="error"
                showBackButton={true}
                showRetryButton={true}
                onBack={handleClearPrivilegeSelection}
                onRetry={() =>
                  selectedPrivilege &&
                  fetchPrivilegeDetails(selectedPrivilege.id)
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
        itemName={selectedPrivilege?.name || ""}
        itemId={selectedPrivilege?.id}
        itemType="privilege"
        additionalInfo={
          privilegeDetails
            ? [
                { label: "Status", value: privilegeDetails.privilegeStatus },
                { label: "Associated Roles", value: privilegeDetails.roles.length },
              ]
            : []
        }
        warningMessage={`This privilege is currently used by ${privilegeDetails?.roles.length || 0} role(s). Terminating it will remove this privilege from all associated roles, potentially affecting user permissions.`}
        confirmText="Permanently Terminate"
        cancelText="Cancel"
        isLoading={loadingTerminate}
      />
    </div>
  );
};

export default TerminatePrivilegePage;