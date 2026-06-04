"use client";

import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/static-components/Breadcrumb";
import { RoleService } from "@/services/roleService";
import { RoleDetails, PrivilegeInRole } from "@/types/role-types";
import { useTheme } from "@/contexts/ThemeContext";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import ActionButtons from "@/components/common-components/ActionButtons";
import { WEB_MANAGEMENT_PATH } from "@/utils/constant";
import { hexToRgba } from "@/utils/functions";
import CommonButton from "@/components/common-components/buttons/CommonButton";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { ConfirmDialog } from "@/components/destination-categories-components/destination-categories-update-components/ConfirmDialog";

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

const privilegeCardVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
  hover: {
    x: 4,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const statusBadgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

const breadcrumbItems = (roleName?: string, roleId?: number) => [
  { label: "Dashboard", href: "/" },
  { label: "User Management", href: `${WEB_MANAGEMENT_PATH}/user-management` },
  { label: "Roles", href: `${WEB_MANAGEMENT_PATH}/user-management/roles` },
  {
    label: roleName || "Details",
    href: `${WEB_MANAGEMENT_PATH}/user-management/roles/view/${roleId}`,
  },
];

const PRIVILEGES_PER_PAGE = 5;

const RoleDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const roleId = parseInt(params?.roleId as string);

  const [role, setRole] = useState<RoleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [visiblePrivileges, setVisiblePrivileges] = useState<PrivilegeInRole[]>(
    [],
  );
  const [privilegesToShow, setPrivilegesToShow] = useState(PRIVILEGES_PER_PAGE);

  useEffect(() => {
    if (roleId && !isNaN(roleId)) {
      fetchRoleDetails();
    } else {
      setError("Invalid role ID");
      setLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    if (role?.privileges) {
      setVisiblePrivileges(role.privileges.slice(0, privilegesToShow));
    }
  }, [role, privilegesToShow]);

  const fetchRoleDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await RoleService.getRoleDetailsById(roleId);
      setRole(response.data);
      setPrivilegesToShow(PRIVILEGES_PER_PAGE);
    } catch (err: any) {
      console.error("Error fetching role details:", err);
      setError(err.message || "Failed to load role details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () =>
    router.push(`${WEB_MANAGEMENT_PATH}/user-management/roles`);
  const handleEdit = () =>
    router.push(`${WEB_MANAGEMENT_PATH}/user-management/roles/edit/${roleId}`);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    // TODO: Implement delete API call
    console.log("Delete role:", roleId);
    setTimeout(() => {
      router.push(`${WEB_MANAGEMENT_PATH}/user-management/roles`);
    }, 500);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handlePrivilegeClick = (privilegeId: number, privilegeName: string) => {
    router.push(
      `${WEB_MANAGEMENT_PATH}/user-management/privileges/view/${privilegeId}?name=${encodeURIComponent(privilegeName)}`,
    );
  };

  const handleShowMore = () => {
    setPrivilegesToShow((prev) =>
      Math.min(prev + PRIVILEGES_PER_PAGE, role?.privileges.length || 0),
    );
  };

  const handleShowLess = () => {
    setPrivilegesToShow(PRIVILEGES_PER_PAGE);
  };

  const hasMorePrivileges = role && privilegesToShow < role.privileges.length;
  const hasVisiblePrivileges = visiblePrivileges.length > 0;
  const totalPrivileges = role?.privileges.length || 0;
  const remainingPrivileges = totalPrivileges - privilegesToShow;

  const isActive = role?.roleStatus === "ACTIVE";

  if (loading) {
    return (
      <CommonLoading
        message="Loading role details..."
        subMessage="Please wait while we fetch role information"
        size="lg"
      />
    );
  }

  if (error || !role) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Role"
        message="The role couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchRoleDetails}
        backButtonText="Back to Roles"
        retryButtonText="Try Again"
        fullScreen={true}
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Topbar */}
      <motion.div
        variants={headerVariants}
        className="sticky top-0 z-10 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={role.roleName}
            description={`Role ID: ${role.roleId}`}
            breadcrumbItems={breadcrumbItems(role.roleName, role.roleId)}
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActionButtons
          title={role.roleName}
          showEdit={true}
          showDelete={true}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            <motion.div
              variants={cardVariants}
              className="rounded-2xl shadow-lg overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
              }}
            >
              {/* Color accent bar */}
              <motion.div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent}, transparent)`,
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              />

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
                  👥
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
                    Role Name
                  </label>
                  <div
                    className="px-3 py-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.05),
                      border: `1px solid ${hexToRgba(theme.primary, 0.15)}`,
                    }}
                  >
                    <span
                      className="text-base font-medium"
                      style={{ color: theme.text }}
                    >
                      {role.roleName}
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
                  <motion.span
                    variants={statusBadgeVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: isActive
                        ? hexToRgba(theme.success, 0.12)
                        : hexToRgba(theme.error, 0.12),
                      color: isActive ? theme.success : theme.error,
                      border: `1px solid ${
                        isActive
                          ? hexToRgba(theme.success, 0.25)
                          : hexToRgba(theme.error, 0.25)
                      }`,
                    }}
                  >
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: isActive ? theme.success : theme.error,
                      }}
                      animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    {isActive ? "Active" : "Inactive"}
                  </motion.span>
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
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: theme.textSecondary }}
                    >
                      {role.roleDescription || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Privileges Associated */}
          <div className="space-y-6">
            <motion.div
              variants={cardVariants}
              className="rounded-2xl shadow-lg overflow-hidden"
              style={{
                backgroundColor: theme.surface,
                border: `1px solid ${theme.border}`,
              }}
            >
              {/* Color accent bar */}
              <motion.div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, ${theme.accent}, ${theme.primary}, transparent)`,
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              />

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
                  🔑
                </span>
                <h2
                  className="text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  Privileges Associated
                </h2>
                <span
                  className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: hexToRgba(theme.accent, 0.1),
                    color: theme.accent,
                  }}
                >
                  {totalPrivileges} privilege{totalPrivileges !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="px-6 py-6">
                {totalPrivileges === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 rounded-xl"
                    style={{
                      backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                      border: `1px dashed ${theme.border}`,
                    }}
                  >
                    <span className="text-5xl mb-3 block">🔑</span>
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.textSecondary }}
                    >
                      No privileges associated
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: theme.textSecondary }}
                    >
                      This role has no privileges assigned yet
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {visiblePrivileges.map((privilege, index) => (
                        <motion.div
                          key={privilege.privilegeId}
                          variants={privilegeCardVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          custom={index}
                          className="rounded-xl p-4 transition-all duration-200 cursor-pointer"
                          style={{
                            backgroundColor: hexToRgba(
                              theme.textSecondary,
                              0.03,
                            ),
                            border: `1px solid ${hexToRgba(theme.border, 0.8)}`,
                          }}
                          onClick={() =>
                            handlePrivilegeClick(
                              privilege.privilegeId,
                              privilege.privilegeName,
                            )
                          }
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                                  style={{
                                    backgroundColor: hexToRgba(
                                      theme.primary,
                                      0.1,
                                    ),
                                  }}
                                >
                                  <span className="text-sm">🔑</span>
                                </div>
                                <h3
                                  className="text-base font-semibold cursor-pointer transition-colors duration-200"
                                  style={{ color: theme.text }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = theme.primary;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = theme.text;
                                  }}
                                >
                                  {privilege.privilegeName}
                                </h3>
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                    privilege.privilegeStatus === "ACTIVE"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  }`}
                                >
                                  <span
                                    className={`w-1 h-1 rounded-full ${
                                      privilege.privilegeStatus === "ACTIVE"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                  />
                                  {privilege.privilegeStatus === "ACTIVE"
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </div>
                              {privilege.privilegeDescription && (
                                <p
                                  className="text-sm mt-1 line-clamp-2"
                                  style={{ color: theme.textSecondary }}
                                >
                                  {privilege.privilegeDescription}
                                </p>
                              )}
                            </div>
                            <CommonButton
                              variant="outline"
                              size="xs"
                              onClick={() => {
                                handlePrivilegeClick(
                                  privilege.privilegeId,
                                  privilege.privilegeName,
                                );
                              }}
                            >
                              View Details →
                            </CommonButton>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Show More / Show Less Controls */}
                    {totalPrivileges > PRIVILEGES_PER_PAGE && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-5 pt-3 border-t flex justify-center"
                        style={{ borderColor: theme.border }}
                      >
                        {hasMorePrivileges ? (
                          <motion.button
                            variants={buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handleShowMore}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200"
                            style={{
                              backgroundColor: hexToRgba(theme.primary, 0.1),
                              color: theme.primary,
                              border: `1px solid ${hexToRgba(theme.primary, 0.2)}`,
                            }}
                          >
                            <ChevronDown className="w-4 h-4" />
                            Show More ({remainingPrivileges} more)
                          </motion.button>
                        ) : (
                          <motion.button
                            variants={buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handleShowLess}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200"
                            style={{
                              backgroundColor: hexToRgba(theme.primary, 0.08),
                              color: theme.primary,
                              border: `1px solid ${hexToRgba(theme.primary, 0.15)}`,
                            }}
                          >
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                          </motion.button>
                        )}
                      </motion.div>
                    )}

                    {/* Loading indicator for remaining privileges */}
                    {hasMorePrivileges && (
                      <p
                        className="text-center text-xs mt-3"
                        style={{ color: theme.textSecondary }}
                      >
                        Showing {visiblePrivileges.length} of {totalPrivileges}{" "}
                        privileges
                      </p>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Additional Information Card */}
        <motion.div variants={cardVariants} className="mt-6">
          <div
            className="rounded-2xl shadow-lg overflow-hidden"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            {/* Color accent bar */}
            <motion.div
              className="h-1 w-full"
              style={{
                background: `linear-gradient(90deg, ${theme.warning}, ${theme.primary}, transparent)`,
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            />

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  variants={cardVariants}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                  }}
                >
                  <span className="text-2xl">🆔</span>
                  <div>
                    <div
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Role ID
                    </div>
                    <div
                      className="text-sm font-semibold font-mono"
                      style={{ color: theme.text }}
                    >
                      #{role.roleId}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                  }}
                >
                  <span className="text-2xl">🔑</span>
                  <div>
                    <div
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Total Privileges
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: theme.text }}
                    >
                      {totalPrivileges} privilege
                      {totalPrivileges !== 1 ? "s" : ""}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                  }}
                >
                  <span className="text-2xl">📅</span>
                  <div>
                    <div
                      className="text-xs"
                      style={{ color: theme.textSecondary }}
                    >
                      Status
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: isActive ? theme.success : theme.error }}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${role.roleName}"? This action cannot be undone and will remove all associated privileges from this role.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </motion.div>
  );
};

export default RoleDetailsPage;
