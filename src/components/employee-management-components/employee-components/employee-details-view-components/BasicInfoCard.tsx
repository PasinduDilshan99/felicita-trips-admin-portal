// components/employee-details/BasicInfoCard.tsx
"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { EmployeeFullDetails } from "@/types/employee-types";
import { hexToRgba } from "@/utils/functions";
import { InfoCard, InfoRow } from "./InfoCard";
import { formatDate, getStatusStyle } from "@/utils/utils";

interface Props {
  employee: EmployeeFullDetails;
  animationDelay?: number;
}

export const BasicInfoCard: React.FC<Props> = ({ employee, animationDelay = 0 }) => {
  const { theme } = useTheme();
  const statusStyle = getStatusStyle(employee.status);

  return (
    <InfoCard title="Basic Information" icon="👤" animationDelay={animationDelay}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        <InfoRow label="Employee Code" value={employee.employeeCode} />
        <InfoRow label="Username" value={employee.username} />
        <InfoRow label="Full Name" value={employee.fullName} />
        <InfoRow
          label="Email"
          value={
            <a
              href={`mailto:${employee.email}`}
              className="hover:underline transition-opacity"
              style={{ color: theme.primary }}
            >
              {employee.email || "—"}
            </a>
          }
        />
        <InfoRow label="Mobile" value={employee.mobileNumber} />
        <InfoRow label="NIC" value={employee.nic} />
        <InfoRow label="Hire Date" value={formatDate(employee.hireDate)} />
        <InfoRow
          label="Salary"
          value={
            employee.salary
              ? <span className="font-semibold" style={{ color: theme.primary }}>${employee.salary.toLocaleString()}</span>
              : "—"
          }
        />
        <InfoRow
          label="Status"
          value={
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${statusStyle.bg} ${statusStyle.ring}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              {employee.status}
            </span>
          }
        />
      </div>
    </InfoCard>
  );
};


// components/employee-details/EmploymentInfoCard.tsx
export const EmploymentInfoCard: React.FC<Props> = ({ employee, animationDelay = 0 }) => (
  <InfoCard title="Employment Information" icon="💼" animationDelay={animationDelay}>
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
      <InfoRow label="Employee Type" value={employee.employeeType} />
      <InfoRow label="Department" value={employee.departmentName} />
      <InfoRow label="Designation" value={employee.designationName} />
      <InfoRow label="Employment Type" value={employee.employmentType} />
      <InfoRow label="Work Location" value={employee.workLocation} />
      <InfoRow label="Grade" value={employee.employeeGrade} />
    </div>
  </InfoCard>
);


// components/employee-details/ManagementCard.tsx
export const ManagementCard: React.FC<Props> = ({ employee, animationDelay = 0 }) => (
  <InfoCard title="Management" icon="👔" animationDelay={animationDelay}>
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
      <InfoRow label="Supervisor" value={employee.supervisorName} />
      <InfoRow label="Reporting Manager" value={employee.reportingManagerName} />
    </div>
  </InfoCard>
);