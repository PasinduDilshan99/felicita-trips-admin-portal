// components/employee-management-components/role-components/role-view-components/RoleListCard.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { Role } from "@/types/role-types";
import { ROLES_UPDATE_PAGE_URL, ROLES_VIEW_PAGE_URL } from "@/utils/urls";
import CommonButton from "@/components/common-components/buttons/CommonButton";

interface RoleListCardProps {
  role: Role;
}

const RoleListCard: React.FC<RoleListCardProps> = ({ role }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleViewDetails = () => {
    router.push(`${ROLES_VIEW_PAGE_URL}/${role.roleId}?name=${role.roleName}`);
  };

  const handleEdit = () => {
    router.push(
      `${ROLES_UPDATE_PAGE_URL}?roleId=${role.roleId}&name${role.roleName}`,
    );
  };
  return (
    <div
      className="rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
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
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`,
                }}
              >
                <span className="text-lg">👥</span>
              </div>
              <div>
                <h3
                  className="text-lg font-bold cursor-pointer transition-colors duration-200"
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
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className="text-xs font-mono"
                    style={{ color: theme.textSecondary }}
                  >
                    ID: {role.roleId}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
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
              </div>
            </div>

            {/* Description */}
            <p
              className="text-sm mt-3 leading-relaxed"
              style={{ color: theme.textSecondary }}
            >
              {role.roleDescription || "No description provided."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <CommonButton
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
            >
              View Details
            </CommonButton>
            <CommonButton variant="primary" size="sm" onClick={handleEdit}>
              Edit
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleListCard;
