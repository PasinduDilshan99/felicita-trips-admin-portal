// components/employee-details/EmployeeHeroHeader.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import ActionButtons from "@/components/common-components/ActionButtons";
import { EmployeeFullDetails } from "@/types/employee-types";
import { hexToRgba } from "@/utils/functions";
import { EMPLOYEE_MANAGEMENT_URL, EMPLOYEES_VIEW_PAGE_URL } from "@/utils/urls";
import { formatDate, getStatusStyle } from "@/utils/utils";

interface EmployeeHeroHeaderProps {
  employee: EmployeeFullDetails;
  onEdit: () => void;
  onDelete: () => void;
}

const breadcrumbItems = (name?: string, id?: number) => [
  { label: "Dashboard", href: "/" },
  { label: "Employee Management", href: EMPLOYEE_MANAGEMENT_URL },
  { label: "Employees", href: EMPLOYEES_VIEW_PAGE_URL },
  { label: name || "Details", href: `${EMPLOYEES_VIEW_PAGE_URL}/view/${id}` },
];

const getInitials = (name: string): string =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export const EmployeeHeroHeader: React.FC<EmployeeHeroHeaderProps> = ({
  employee,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();
  const statusStyle = getStatusStyle(employee.status);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Sticky breadcrumb bar */}
      <div
        className="sticky top-0 z-20 backdrop-blur-xl border-b transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}E6`,
          borderColor: theme.border,
          boxShadow: `0 1px 0 ${hexToRgba(theme.border, 0.6)}`,
        }}
      >
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-3">
          <PageHeader
            title={employee.fullName}
            description={`${employee.employeeCode} · ${employee.username}`}
            breadcrumbItems={breadcrumbItems(employee.fullName, employee.employeeId)}
          />
        </div>
      </div>

      {/* Hero Profile Section */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.08)} 0%, ${hexToRgba(theme.primary, 0.03)} 50%, ${theme.background} 100%)`,
          borderBottom: `1px solid ${hexToRgba(theme.border, 0.5)}`,
        }}
      >
        {/* Decorative background rings */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${hexToRgba(theme.primary, 0.06)} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${hexToRgba(theme.primary, 0.04)} 0%, transparent 70%)`,
          }}
        />

        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Action Buttons */}
          <div
            className="flex justify-end mb-6"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(-8px)",
              transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
            }}
          >
            <ActionButtons
              title={employee.fullName}
              showEdit
              showDelete
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>

          {/* Profile Hero */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s",
            }}
          >
            {/* Avatar */}
            <div
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold flex-shrink-0 select-none"
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.2)}, ${hexToRgba(theme.primary, 0.1)})`,
                border: `2px solid ${hexToRgba(theme.primary, 0.25)}`,
                color: theme.primary,
                boxShadow: `0 8px 24px ${hexToRgba(theme.primary, 0.15)}`,
              }}
            >
              {getInitials(employee.fullName)}
              {/* Online pulse indicator */}
              {employee.status === "ACTIVE" && (
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  style={{
                    backgroundColor: "#10b981",
                    borderColor: theme.surface,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"
                    style={{ animationDuration: "2s" }}
                  />
                </span>
              )}
            </div>

            {/* Identity block */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1
                  className="text-xl sm:text-2xl font-bold tracking-tight truncate"
                  style={{ color: theme.text }}
                >
                  {employee.fullName}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${statusStyle.bg} ${statusStyle.ring}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} animate-pulse`} />
                  {employee.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" style={{ color: theme.textSecondary }}>
                <span className="flex items-center gap-1.5">
                  <span>🏢</span>
                  {employee.designationName || "—"} · {employee.departmentName || "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <span>🪪</span>
                  {employee.employeeCode}
                </span>
                <span className="flex items-center gap-1.5">
                  <span>📅</span>
                  Hired {formatDate(employee.hireDate)}
                </span>
              </div>

              {/* Quick chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { icon: "📍", label: employee.workLocation },
                  { icon: "⚙️", label: employee.employmentType },
                  { icon: "🏅", label: employee.employeeGrade },
                ]
                  .filter((c) => c.label)
                  .map((chip) => (
                    <span
                      key={chip.label}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium"
                      style={{
                        backgroundColor: hexToRgba(theme.primary, 0.08),
                        color: theme.text,
                        border: `1px solid ${hexToRgba(theme.primary, 0.15)}`,
                      }}
                    >
                      {chip.icon} {chip.label}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};