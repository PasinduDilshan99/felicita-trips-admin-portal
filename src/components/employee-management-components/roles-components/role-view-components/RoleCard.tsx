"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { RoleCardProps } from "@/types/role-types";
import CommonButton from "@/components/common-components/buttons/CommonButton";
import { ROLES_DETAILS_VIEW_URL, ROLES_UPDATE_PAGE_URL } from "@/utils/urls";

const RoleCard: React.FC<RoleCardProps> = ({ role }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleViewDetails = () => {
    router.push(
      `${ROLES_DETAILS_VIEW_URL}/${role.roleId}?name=${role.roleName}`,
    );
  };

  const handleEdit = () => {
    router.push(
      `${ROLES_UPDATE_PAGE_URL}?roleId=${role.roleId}&name${role.roleName}`,
    );
  };

  return (
    <div
      className="rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.border;
      }}
    >
      <div className="p-5 flex-grow flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`,
              }}
            >
              <span className="text-lg">👥</span>
            </div>
            <div>
              <h3
                className="text-lg font-bold line-clamp-1 cursor-pointer transition-colors duration-200"
                style={{ color: theme.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.text;
                }}
                onClick={handleViewDetails}
              >
                {role.roleName}
              </h3>
              <div
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                ID: {role.roleId}
              </div>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              role.roleStatus === "ACTIVE"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                role.roleStatus === "ACTIVE"
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            {role.roleStatus === "ACTIVE" ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Description */}
        <p
          className="text-sm mb-4 line-clamp-3 flex-grow leading-relaxed"
          style={{ color: theme.textSecondary }}
        >
          {role.roleDescription || "No description provided."}
        </p>

        {/* Action Buttons */}
        <div
          className="flex gap-2 mt-auto pt-4 border-t"
          style={{ borderColor: theme.border }}
        >
          <CommonButton
            variant="outline"
            size="sm"
            fullWidth
            onClick={handleViewDetails}
          >
            View Details
          </CommonButton>
          <CommonButton
            variant="primary"
            size="sm"
            fullWidth
            onClick={handleEdit}
          >
            Edit
          </CommonButton>
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
