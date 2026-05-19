// components/package-types-components/package-type-details-view-components/PackageTypePackagesList.tsx
"use client";

import React, { useState } from "react";
import {
  Package,
  ChevronRight,
  Calendar,
  Star,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { PackageBasicDetail } from "@/types/package-type-types";

interface PackageTypePackagesListProps {
  packages: PackageBasicDetail[];
  packageTypeColor: string;
  onViewPackage: (packageId: number) => void;
}

const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const PackageTypePackagesList: React.FC<PackageTypePackagesListProps> = ({
  packages,
  packageTypeColor,
  onViewPackage,
}) => {
  const { theme } = useTheme();
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [expandedPackageId, setExpandedPackageId] = useState<number | null>(null);

  const visiblePackages = showAllPackages ? packages : packages.slice(0, 5);
  const hasMorePackages = packages.length > 5;

  const toggleExpandPackage = (packageId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPackageId(expandedPackageId === packageId ? null : packageId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "#10b981";
      case "INACTIVE":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not specified";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (!packages.length) {
    return (
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="px-4 sm:px-6 py-3 sm:py-4"
          style={{ borderBottom: `1px solid ${theme.border}` }}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: packageTypeColor }} />
            <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
              Associated Packages
            </h2>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: theme.textSecondary }} />
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            No packages associated with this type.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: packageTypeColor }} />
          <h2 className="text-base sm:text-lg font-semibold" style={{ color: theme.text }}>
            Associated Packages
          </h2>
          <span
            className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: hexToRgba(packageTypeColor, 0.1),
              color: packageTypeColor,
            }}
          >
            {packages.length}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3">
        {visiblePackages.map((pkg) => {
          const isExpanded = expandedPackageId === pkg.packageId;
          const statusColor = getStatusColor(pkg.status);
          const pkgColor = pkg.color || packageTypeColor;

          return (
            <div
              key={pkg.packageId}
              className="rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: hexToRgba(pkgColor, 0.03),
                border: `1px solid ${hexToRgba(pkgColor, 0.15)}`,
              }}
              onClick={() => onViewPackage(pkg.packageId)}
            >
              {/* Package Header */}
              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {pkg.primaryType && (
                        <span
                          className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: hexToRgba(pkgColor, 0.15),
                            color: pkgColor,
                          }}
                        >
                          <Star className="w-2.5 h-2.5" />
                          Primary Type
                        </span>
                      )}
                      <span
                        className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: statusColor }}
                      >
                        {pkg.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base mt-1 hover:underline" style={{ color: theme.text }}>
                      {pkg.packageName}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: pkgColor }} />
                </div>

                {/* Basic Info */}
                <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: theme.textSecondary }}>
                  {pkg.startDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(pkg.startDate)} → {formatDate(pkg.endDate)}</span>
                    </div>
                  )}
                </div>

                {/* Color Preview */}
                {pkg.color && (
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: pkg.color }}
                    />
                    <span className="text-[10px] font-mono" style={{ color: theme.textSecondary }}>
                      {pkg.color}
                    </span>
                  </div>
                )}

                {/* Expand/Collapse Button */}
                {pkg.description && (
                  <button
                    onClick={(e) => toggleExpandPackage(pkg.packageId, e)}
                    className="flex items-center gap-1 text-xs mt-2 transition-colors hover:opacity-80"
                    style={{ color: pkgColor }}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Show Description
                      </>
                    )}
                  </button>
                )}

                {/* Expanded Description */}
                {isExpanded && pkg.description && (
                  <div
                    className="mt-3 p-2 rounded-lg text-xs sm:text-sm"
                    style={{
                      backgroundColor: hexToRgba(pkgColor, 0.05),
                      borderLeft: `2px solid ${pkgColor}`,
                    }}
                  >
                    <p style={{ color: theme.textSecondary }}>{pkg.description}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Show More / Show Less Button */}
        {hasMorePackages && (
          <button
            onClick={() => setShowAllPackages(!showAllPackages)}
            className="w-full flex items-center justify-center gap-1 text-xs font-medium py-2 rounded-lg transition-colors hover:opacity-80"
            style={{
              backgroundColor: hexToRgba(packageTypeColor, 0.08),
              color: packageTypeColor,
            }}
          >
            {showAllPackages ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Show All {packages.length} Packages
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};