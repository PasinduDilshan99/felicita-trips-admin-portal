"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import ActionButtons from "@/components/common-components/ActionButtons";
import { EmployeeHeroHeaderProps } from "@/types/employee-types";
import { hexToRgba } from "@/utils/functions";
import { EMPLOYEES_DETAILS_VIEW_PAGE_URL } from "@/utils/urls";
import { formatDate, getStatusStyle } from "@/utils/utils";
import PageHeader from "@/components/common-components/static-components/PageHeader";
import { EMPLOYEE_MANAGEMENT_DETAILS_VIEW_PAGE_BREADCRUMB_DATA } from "@/data/breadcrumb-data";
import { getInitials } from "@/utils/commonFunctions";

const breadcrumbItems = (name?: string, id?: number) => [
  ...EMPLOYEE_MANAGEMENT_DETAILS_VIEW_PAGE_BREADCRUMB_DATA,
  {
    label: name || "Details",
    href: `${EMPLOYEES_DETAILS_VIEW_PAGE_URL}/${id}`,
  },
];

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
      <div
        className="sticky top-0 z-20 backdrop-blur-xl border-b transition-colors duration-300"
        style={{
          backgroundColor: hexToRgba(theme.surface, 0.92),
          borderColor: hexToRgba(theme.border, 0.7),
          boxShadow: `0 1px 12px ${hexToRgba(theme.primary, 0.04)}`,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <PageHeader
            title={employee.fullName}
            description={`${employee.employeeCode} · ${employee.username}`}
            breadcrumbItems={breadcrumbItems(
              employee.fullName,
              employee.employeeId,
            )}
          />
        </div>
      </div>

      {/* ── Hero Profile Section ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg,
            ${hexToRgba(theme.primary, 0.07)} 0%,
            ${hexToRgba(theme.primary, 0.03)} 40%,
            ${theme.background} 100%)`,
          borderBottom: `1px solid ${hexToRgba(theme.border, 0.45)}`,
        }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at center,
              ${hexToRgba(theme.primary, 0.07)} 0%,
              transparent 65%)`,
          }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at center,
              ${hexToRgba(theme.primary, 0.04)} 0%,
              transparent 65%)`,
          }}
        />

        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(14px)",
              transition:
                "opacity 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s",
            }}
          >
            {/* ── Avatar ── */}
            <div className="relative flex-shrink-0">
              <div
                className="w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold select-none overflow-hidden"
                style={{
                  background: `linear-gradient(145deg,
                    ${hexToRgba(theme.primary, 0.22)},
                    ${hexToRgba(theme.primary, 0.1)})`,
                  border: `1.5px solid ${hexToRgba(theme.primary, 0.22)}`,
                  color: theme.primary,
                  boxShadow: `0 4px 16px ${hexToRgba(theme.primary, 0.14)},
                               inset 0 1px 0 ${hexToRgba("#ffffff", 0.12)}`,
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
                  getInitials(employee.fullName)
                )}
              </div>

              {/* Active pulse dot */}
              {employee.status === "ACTIVE" && (
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
                  style={{
                    backgroundColor: "#10b981",
                    borderColor: theme.surface,
                    boxShadow: `0 0 0 2px ${hexToRgba("#10b981", 0.2)}`,
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"
                    style={{ animationDuration: "2.2s" }}
                  />
                </span>
              )}
            </div>

            {/* ── Identity block ── */}
            <div className="flex-1 min-w-0">

              {/* Name + status badge + action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-2">
                <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                  <h1
                    className="text-xl sm:text-2xl font-bold tracking-tight leading-none truncate"
                    style={{ color: theme.text }}
                  >
                    {employee.fullName}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${statusStyle.bg} ${statusStyle.ring}`}
                    style={{ letterSpacing: "0.04em" }}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} animate-pulse`}
                    />
                    {employee.status}
                  </span>
                </div>

                <ActionButtons
                  showEdit
                  showDelete
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>

              {/* Subtitle row */}
              <div
                className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm mb-3"
                style={{ color: theme.textSecondary }}
              >
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">🏢</span>
                  <span>
                    {employee.designationName || "—"}
                    <span className="mx-1.5 opacity-40">·</span>
                    {employee.departmentName || "—"}
                  </span>
                </span>
                <span
                  className="hidden sm:block w-px h-3 opacity-30 rounded-full"
                  style={{ backgroundColor: theme.textSecondary }}
                />
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">🪪</span>
                  {employee.employeeCode}
                </span>
                <span
                  className="hidden sm:block w-px h-3 opacity-30 rounded-full"
                  style={{ backgroundColor: theme.textSecondary }}
                />
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">📅</span>
                  Hired {formatDate(employee.hireDate)}
                </span>
              </div>

              {/* Quick-info chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: "📍", label: employee.workLocation },
                  { icon: "⚙️", label: employee.employmentType },
                  { icon: "🏅", label: employee.employeeGrade },
                ]
                  .filter((c) => c.label)
                  .map((chip) => (
                    <span
                      key={chip.label}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg font-medium tracking-wide"
                      style={{
                        backgroundColor: hexToRgba(theme.primary, 0.07),
                        color: theme.text,
                        border: `1px solid ${hexToRgba(theme.primary, 0.14)}`,
                        boxShadow: `inset 0 1px 0 ${hexToRgba("#ffffff", 0.06)}`,
                      }}
                    >
                      <span className="opacity-75">{chip.icon}</span>
                      {chip.label}
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