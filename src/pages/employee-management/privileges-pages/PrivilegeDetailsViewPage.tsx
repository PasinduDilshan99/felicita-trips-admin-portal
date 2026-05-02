// app/user-management/privileges/view/[privilegeId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { PrivilegeService } from "@/services/privilegeService";
import { PrivilegeDetails, RoleInPrivilege } from "@/types/privilege-types";
import { useTheme } from "@/contexts/ThemeContext";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import { WEB_MANAGEMENT_PATH } from "@/utils/constant";
import { hexToRgba } from "@/utils/functions";
import CommonButton from "@/components/common-components/buttons/CommonButton";

const breadcrumbItems = (privilegeName?: string, privilegeId?: number) => [
  { label: "Dashboard", href: "/" },
  { label: "User Management", href: `${WEB_MANAGEMENT_PATH}/user-management` },
  { label: "Privileges", href: `${WEB_MANAGEMENT_PATH}/user-management/privileges` },
  { label: privilegeName || "Details", href: `${WEB_MANAGEMENT_PATH}/user-management/privileges/view/${privilegeId}` },
];

const PrivilegeDetailsViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const privilegeId = parseInt(params?.privilegeId as string);

  const [privilege, setPrivilege] = useState<PrivilegeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (privilegeId && !isNaN(privilegeId)) {
      fetchPrivilegeDetails();
    } else {
      setError("Invalid privilege ID");
      setLoading(false);
    }
  }, [privilegeId]);

  const fetchPrivilegeDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await PrivilegeService.getPrivilegeDetailsById(privilegeId);
      setPrivilege(response.data);
    } catch (err: any) {
      console.error("Error fetching privilege details:", err);
      setError(err.message || "Failed to load privilege details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => router.push(`${WEB_MANAGEMENT_PATH}/user-management/privileges`);
  const handleEdit = () => router.push(`${WEB_MANAGEMENT_PATH}/user-management/privileges/edit/${privilegeId}`);
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete privilege "${privilege?.privilegeName}"?`)) {
      // TODO: Implement delete API call
      console.log("Delete privilege:", privilegeId);
      router.push(`${WEB_MANAGEMENT_PATH}/user-management/privileges`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <CommonLoading
        message={`Loading privilege details...`}
        subMessage="Please wait while we fetch privilege information"
        size="lg"
      />
    );
  }

  if (error || !privilege) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Privilege"
        message="The privilege couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchPrivilegeDetails}
        backButtonText="Back to Privileges"
        retryButtonText="Try Again"
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Topbar */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={privilege.privilegeName}
            description={`Privilege ID: ${privilege.privilegeId}`}
            breadcrumbItems={breadcrumbItems(privilege.privilegeName, privilege.privilegeId)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActionButtons
          title={privilege.privilegeName}
          showEdit={true}
          showDelete={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            {/* Basic Information Card */}
            <div
              className="rounded-2xl shadow-lg overflow-hidden"
            >
              <div
                className="flex items-center gap-3 px-6 py-4"
                style={{
                  backgroundColor: hexToRgba(theme.primary, 0.05),
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{
                    backgroundColor: hexToRgba(theme.primary, 0.15),
                    color: theme.primary,
                  }}
                >
                  🔑
                </span>
                <h2
                  className="text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  Basic Information
                </h2>
              </div>

              <div className="px-6 py-6 space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Privilege Name
                  </label>
                  <div
                    className="px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.05),
                      border: `1px solid ${hexToRgba(theme.primary, 0.15)}`,
                    }}
                  >
                    <span className="text-base font-medium" style={{ color: theme.text }}>
                      {privilege.privilegeName}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                      privilege.privilegeStatus === "ACTIVE"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        privilege.privilegeStatus === "ACTIVE" ? "bg-green-500 animate-pulse" : "bg-red-500"
                      }`}
                    />
                    {privilege.privilegeStatus === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Description
                  </label>
                  <div
                    className="px-3 py-3 rounded-lg"
                    style={{
                      backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                      {privilege.privilegeDescription || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Roles Associated */}
          <div className="space-y-6">
            {/* Roles Card */}
            <div
              className="rounded-2xl shadow-lg overflow-hidden"
            >
              <div
                className="flex items-center gap-3 px-6 py-4"
                style={{
                  backgroundColor: hexToRgba(theme.accent, 0.05),
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{
                    backgroundColor: hexToRgba(theme.accent, 0.15),
                    color: theme.accent,
                  }}
                >
                  👥
                </span>
                <h2
                  className="text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  Roles Associated
                </h2>
                <span
                  className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: hexToRgba(theme.accent, 0.1),
                    color: theme.accent,
                  }}
                >
                  {privilege.roles.length} role{privilege.roles.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="px-6 py-6">
                {privilege.roles.length === 0 ? (
                  <div
                    className="text-center py-8 rounded-xl"
                    style={{
                      backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                      border: `1px dashed ${theme.border}`,
                    }}
                  >
                    <span className="text-4xl mb-2 block">👥</span>
                    <p className="text-sm" style={{ color: theme.textSecondary }}>
                      No roles associated with this privilege
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {privilege.roles.map((role) => (
                      <div
                        key={role.roleId}
                        className="rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                        style={{
                          backgroundColor: hexToRgba(theme.textSecondary, 0.03),
                          border: `1px solid ${hexToRgba(theme.border, 0.8)}`,
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className="text-base font-semibold cursor-pointer transition-colors duration-200"
                                style={{ color: theme.text }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = theme.primary;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = theme.text;
                                }}
                                onClick={() => router.push(`${WEB_MANAGEMENT_PATH}/user-management/roles/view/${role.roleId}`)}
                              >
                                {role.roleName}
                              </h3>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                  role.roleStatus === "ACTIVE"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                              >
                                <span
                                  className={`w-1 h-1 rounded-full ${
                                    role.roleStatus === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                                  }`}
                                />
                                {role.roleStatus === "ACTIVE" ? "Active" : "Inactive"}
                              </span>
                            </div>
                            {role.roleDescription && (
                              <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                                {role.roleDescription}
                              </p>
                            )}
                          </div>
                          <CommonButton
                            variant="outline"
                            size="xs"
                            onClick={() => router.push(`${WEB_MANAGEMENT_PATH}/user-management/roles/view/${role.roleId}`)}
                          >
                            View Role →
                          </CommonButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <div className="mt-6">
          <div
            className="rounded-2xl shadow-lg overflow-hidden"
          >
            <div
              className="flex items-center gap-3 px-6 py-4"
              style={{
                backgroundColor: hexToRgba(theme.warning, 0.05),
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{
                  backgroundColor: hexToRgba(theme.warning, 0.15),
                  color: theme.warning,
                }}
              >
                ℹ️
              </span>
              <h2
                className="text-base font-semibold"
                style={{ color: theme.text }}
              >
                Additional Information
              </h2>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{
                    backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                  }}
                >
                  <span className="text-2xl">🆔</span>
                  <div>
                    <div className="text-xs" style={{ color: theme.textSecondary }}>
                      Privilege ID
                    </div>
                    <div className="text-sm font-semibold font-mono" style={{ color: theme.text }}>
                      #{privilege.privilegeId}
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{
                    backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                  }}
                >
                  <span className="text-2xl">🔢</span>
                  <div>
                    <div className="text-xs" style={{ color: theme.textSecondary }}>
                      Total Associated Roles
                    </div>
                    <div className="text-sm font-semibold" style={{ color: theme.text }}>
                      {privilege.roles.length} role{privilege.roles.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivilegeDetailsViewPage;