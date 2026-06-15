"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { EmployeeCardProps } from "@/types/employee-types";
import {
  EMPLOYEE_UPDATE_PAGE_URL,
  EMPLOYEES_DETAILS_VIEW_PAGE_URL,
} from "@/utils/urls";
import CommonButton from "@/components/common-components/buttons/CommonButton";

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          bg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          dot: "bg-green-500",
        };
      case "INACTIVE":
        return {
          bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
          dot: "bg-yellow-500",
        };
      case "TERMINATED":
        return {
          bg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          dot: "bg-red-500",
        };
      default:
        return {
          bg: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
          dot: "bg-gray-500",
        };
    }
  };

  const statusStyle = getStatusColor(employee.status);

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
              className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`,
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
                <span className="text-lg">👤</span>
              )}
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
                {employee.fullName}
              </h3>
              <div
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                {employee.employeeCode}
              </div>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} animate-pulse`}
            />
            {employee.status}
          </span>
        </div>

        {/* Email */}
        <div className="mb-2">
          <div className="text-xs" style={{ color: theme.textSecondary }}>
            Email
          </div>
          <div className="text-sm truncate" style={{ color: theme.text }}>
            {employee.email}
          </div>
        </div>

        {/* Department & Designation */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <div className="text-xs" style={{ color: theme.textSecondary }}>
              Department
            </div>
            <div
              className="text-sm font-medium truncate"
              style={{ color: theme.text }}
            >
              {employee.departmentName}
            </div>
          </div>
          <div>
            <div className="text-xs" style={{ color: theme.textSecondary }}>
              Designation
            </div>
            <div
              className="text-sm font-medium truncate"
              style={{ color: theme.text }}
            >
              {employee.designationName}
            </div>
          </div>
        </div>

        {/* Employee Type & Work Location */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div className="text-xs" style={{ color: theme.textSecondary }}>
              Employee Type
            </div>
            <div className="text-sm truncate" style={{ color: theme.text }}>
              {employee.employeeType}
            </div>
          </div>
          <div>
            <div className="text-xs" style={{ color: theme.textSecondary }}>
              Work Location
            </div>
            <div className="text-sm truncate" style={{ color: theme.text }}>
              {employee.workLocation}
            </div>
          </div>
        </div>

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

export default EmployeeCard;
