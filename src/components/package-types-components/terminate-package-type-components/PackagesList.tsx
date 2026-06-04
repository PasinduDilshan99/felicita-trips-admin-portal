"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Star,
  Calendar,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import {
  PackageBasicDetail,
  PackagesListProps,
} from "@/types/package-type-types";
import { useTheme } from "@/contexts/ThemeContext";
import {
  cardVariants,
  chevronVariants,
  contentVariants,
  detailVariants,
  EASE_OUT,
  emptyVariants,
  headerVariants,
  packageCardVariants,
} from "@/app/animations/variants";
import { hexToRgba } from "@/utils/functions";

export const PackagesList: React.FC<PackagesListProps> = ({ packages }) => {
  const { theme } = useTheme();
  const [expandedPackages, setExpandedPackages] = useState<number[]>([]);

  const togglePackage = (packageId: number) => {
    setExpandedPackages((prev) =>
      prev.includes(packageId)
        ? prev.filter((id) => id !== packageId)
        : [...prev, packageId],
    );
  };

  const formatDate = (date: string | null): string => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  if (packages.length === 0) {
    return (
      <motion.div
        variants={emptyVariants}
        initial="hidden"
        animate="visible"
        className="rounded-xl overflow-hidden w-full"
        style={{
          background: hexToRgba(theme.border, 0.1),
          border: `1.5px dashed ${hexToRgba(theme.border, 0.5)}`,
        }}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <Package className="w-4 h-4" style={{ color: theme.textSecondary }} />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Associated Packages
          </h3>
        </div>
        <div className="px-4 py-4 text-center">
          <AlertCircle
            size={24}
            className="mx-auto mb-2 opacity-30"
            style={{ color: theme.textSecondary }}
          />
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            No packages associated with this type
          </p>
        </div>
      </motion.div>
    );
  }

  // Separate primary and secondary packages
  const primaryPackages = packages.filter((pkg) => pkg.primaryType);
  const secondaryPackages = packages.filter((pkg) => !pkg.primaryType);

  const renderPackageSection = (
    title: string,
    pkgList: PackageBasicDetail[],
    isPrimary: boolean,
  ) => {
    if (pkgList.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          {isPrimary ? (
            <Star size={12} style={{ color: theme.warning || "#f59e0b" }} />
          ) : (
            <Package size={12} style={{ color: theme.accent }} />
          )}
          <h4
            className="text-xs font-semibold"
            style={{ color: theme.textSecondary }}
          >
            {title} ({pkgList.length})
          </h4>
        </div>
        {pkgList.map((pkg) => {
          const isExpanded = expandedPackages.includes(pkg.packageId);

          return (
            <motion.div
              key={pkg.packageId}
              variants={packageCardVariants}
              layout
              className="rounded-lg overflow-hidden"
              style={{
                border: `1px solid ${hexToRgba(isPrimary ? theme.warning || "#f59e0b" : theme.accent, 0.25)}`,
                background: theme.surface,
              }}
            >
              {/* Header - Clickable */}
              <motion.button
                onClick={() => togglePackage(pkg.packageId)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-left cursor-pointer"
                whileHover={{
                  backgroundColor: hexToRgba(
                    isPrimary ? theme.warning || "#f59e0b" : theme.accent,
                    0.05,
                  ),
                }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {isPrimary && (
                      <Star
                        size={12}
                        style={{ color: theme.warning || "#f59e0b" }}
                      />
                    )}
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: theme.text }}
                    >
                      {pkg.packageName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {pkg.startDate && pkg.endDate && (
                      <>
                        <span
                          className="text-xs flex items-center gap-1"
                          style={{ color: theme.textSecondary }}
                        >
                          <Calendar size={10} />
                          {formatDate(pkg.startDate)} –{" "}
                          {formatDate(pkg.endDate)}
                        </span>
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: theme.border }}
                        />
                      </>
                    )}
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        background: hexToRgba(
                          pkg.status === "ACTIVE" ? theme.success : theme.error,
                          0.1,
                        ),
                        color:
                          pkg.status === "ACTIVE" ? theme.success : theme.error,
                      }}
                    >
                      {pkg.status}
                    </span>
                  </div>
                </div>
                <motion.div
                  variants={chevronVariants}
                  animate={isExpanded ? "open" : "closed"}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  style={{
                    color: isPrimary
                      ? theme.warning || "#f59e0b"
                      : theme.accent,
                  }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </motion.button>

              {/* Expanded Details */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    variants={detailVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="px-3 pb-3"
                    style={{
                      borderTop: `1px solid ${hexToRgba(isPrimary ? theme.warning || "#f59e0b" : theme.accent, 0.15)}`,
                    }}
                  >
                    <div className="grid gap-2 mt-2">
                      {pkg.description && (
                        <div className="flex items-start gap-2">
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            {pkg.description}
                          </p>
                        </div>
                      )}
                      <div
                        className="grid grid-cols-2 gap-2 pt-1 border-t"
                        style={{ borderColor: hexToRgba(theme.border, 0.5) }}
                      >
                        <div>
                          <p
                            className="text-[10px]"
                            style={{ color: theme.textSecondary }}
                          >
                            Package ID
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            #{pkg.packageId}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[10px]"
                            style={{ color: theme.textSecondary }}
                          >
                            Package Type
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: theme.textSecondary }}
                          >
                            {pkg.primaryType ? "Primary" : "Secondary"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p
                            className="text-[10px]"
                            style={{ color: theme.textSecondary }}
                          >
                            Color
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{
                                backgroundColor: pkg.color || theme.primary,
                              }}
                            />
                            <span
                              className="text-[10px]"
                              style={{ color: theme.textSecondary }}
                            >
                              {pkg.color || "Default"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p
                            className="text-[10px]"
                            style={{ color: theme.textSecondary }}
                          >
                            Hover Color
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{
                                backgroundColor: pkg.hoverColor || theme.accent,
                              }}
                            />
                            <span
                              className="text-[10px]"
                              style={{ color: theme.textSecondary }}
                            >
                              {pkg.hoverColor || "Default"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: hexToRgba(theme.warning || theme.accent, 0.05),
        border: `1.5px solid ${hexToRgba(theme.border, 0.8)}`,
      }}
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${hexToRgba(theme.border, 0.8)}` }}
      >
        <div className="flex items-center gap-2">
          <Package
            className="w-4 h-4"
            style={{ color: theme.warning || theme.accent }}
          />
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Associated Packages ({packages.length})
          </h3>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: hexToRgba(theme.warning || theme.accent, 0.1),
            color: theme.warning || theme.accent,
            border: `1px solid ${hexToRgba(theme.warning || theme.accent, 0.2)}`,
          }}
        >
          Will lose association
        </span>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-4"
      >
        {renderPackageSection("Primary Packages", primaryPackages, true)}
        {renderPackageSection("Secondary Packages", secondaryPackages, false)}
      </motion.div>
    </motion.div>
  );
};
