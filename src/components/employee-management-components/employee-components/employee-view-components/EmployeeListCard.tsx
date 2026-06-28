"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { EmployeeListCardProps } from "@/types/employee-types";
import {
  EMPLOYEE_UPDATE_PAGE_URL,
  EMPLOYEES_DETAILS_VIEW_PAGE_URL,
} from "@/utils/urls";
import CommonButton from "@/components/common-components/buttons/CommonButton";

const EmployeeListCard: React.FC<EmployeeListCardProps> = ({ employee }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleViewDetails = () => {
    router.push(
      `${EMPLOYEES_DETAILS_VIEW_PAGE_URL}/${employee.employeeId}?name=${employee.username}`,
    );
  };

  const handleEdit = () => {
    router.push(
      `${EMPLOYEE_UPDATE_PAGE_URL}/${employee.employeeId}?name=${employee.username}`,
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-700 dark:text-green-400",
          dot: "bg-green-500",
        };
      case "INACTIVE":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          text: "text-yellow-700 dark:text-yellow-400",
          dot: "bg-yellow-500",
        };
      case "TERMINATED":
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-700 dark:text-red-400",
          dot: "bg-red-500",
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-900/30",
          text: "text-gray-700 dark:text-gray-400",
          dot: "bg-gray-500",
        };
    }
  };

  const statusStyle = getStatusStyle(employee.status);

  const initials = employee.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const fields = [
    { label: "Email", value: employee.email, truncate: true },
    { label: "Mobile", value: employee.mobileNumber },
    { label: "Department", value: employee.departmentName },
    { label: "Designation", value: employee.designationName },
  ];

  const chips = [
    employee.employeeType,
    employee.employmentType,
    employee.workLocation,
  ].filter(Boolean);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = theme.primary)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = theme.border)
      }
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 overflow-hidden"
            style={{
              background: hexToRgba(theme.primary, 0.12),
              color: theme.primary,
            }}
          >
            {employee.imageUrl ? (
              <img
                src={employee.imageUrl}
                alt={employee.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              initials
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3
                  className="text-[15px] font-semibold cursor-pointer transition-colors duration-200"
                  style={{ color: theme.text }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.primary)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = theme.text)
                  }
                  onClick={handleViewDetails}
                >
                  {employee.fullName}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span
                    className="text-xs font-mono"
                    style={{ color: theme.textSecondary }}
                  >
                    {employee.employeeCode}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                    />
                    {employee.status}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <CommonButton
                  variant="outline"
                  size="sm"
                  onClick={handleViewDetails}
                >
                  View
                </CommonButton>
                <CommonButton
                  variant="primary"
                  size="sm"
                  onClick={handleEdit}
                >
                  Edit
                </CommonButton>
              </div>
            </div>

            {/* Divider */}
            <div
              className="my-4"
              style={{ borderTop: `1px solid ${theme.border}` }}
            />

            {/* Info fields */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
              {fields.map(({ label, value, truncate }) => (
                <div key={label}>
                  <p
                    className="text-[11px] uppercase tracking-wider mb-0.5"
                    style={{ color: theme.textSecondary }}
                  >
                    {label}
                  </p>
                  <p
                    className={`text-[13px] ${truncate ? "truncate" : ""}`}
                    style={{ color: theme.text }}
                  >
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>

            {/* Meta chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.07),
                      color: theme.textSecondary,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListCard;