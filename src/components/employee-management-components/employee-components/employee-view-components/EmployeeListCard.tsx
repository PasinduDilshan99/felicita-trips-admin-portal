// components/employee-management-components/employee-components/employee-view-components/EmployeeListCard.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";
import { EmployeeBasic } from "@/types/employee-types";
import { EMPLOYEES_VIEW_PAGE_URL } from "@/utils/urls";
import CommonButton from "@/components/common-components/buttons/CommonButton";

interface EmployeeListCardProps {
  employee: EmployeeBasic;
}

const EmployeeListCard: React.FC<EmployeeListCardProps> = ({ employee }) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleViewDetails = () => {
    router.push(`${EMPLOYEES_VIEW_PAGE_URL}/view/${employee.employeeId}`);
  };

  const handleEdit = () => {
    router.push(`${EMPLOYEES_VIEW_PAGE_URL}/edit/${employee.employeeId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { bg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", dot: "bg-green-500" };
      case "INACTIVE":
        return { bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", dot: "bg-yellow-500" };
      case "TERMINATED":
        return { bg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", dot: "bg-red-500" };
      default:
        return { bg: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", dot: "bg-gray-500" };
    }
  };

  const statusStyle = getStatusColor(employee.status);

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
                <span className="text-lg">👤</span>
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
                  {employee.fullName}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-mono" style={{ color: theme.textSecondary }}>
                    {employee.employeeCode}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Email</div>
                <div className="text-sm truncate" style={{ color: theme.text }}>
                  {employee.email}
                </div>
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Mobile</div>
                <div className="text-sm" style={{ color: theme.text }}>
                  {employee.mobileNumber}
                </div>
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Department</div>
                <div className="text-sm" style={{ color: theme.text }}>
                  {employee.departmentName}
                </div>
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Designation</div>
                <div className="text-sm" style={{ color: theme.text }}>
                  {employee.designationName}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Employee Type</div>
                <div className="text-sm" style={{ color: theme.text }}>
                  {employee.employeeType}
                </div>
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Employment Type</div>
                <div className="text-sm" style={{ color: theme.text }}>
                  {employee.employmentType}
                </div>
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Work Location</div>
                <div className="text-sm" style={{ color: theme.text }}>
                  {employee.workLocation}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <CommonButton variant="outline" size="sm" onClick={handleViewDetails}>
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

export default EmployeeListCard;