"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Types
interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  customItems?: BreadcrumbItem[];
}

// =======================
// BREADCRUMB COMPONENT
// =======================
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  customItems,
}) => {
  const pathname = usePathname();
  const { theme } = useTheme();

  // Generate breadcrumbs from URL if no custom items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;
    if (items) return items;

    const paths = pathname?.split("/").filter((path) => path) || null;
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Dashboard", href: "/" }];

    let currentPath = "";
    paths?.forEach((path) => {
      currentPath += `/${path}`;
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm mb-2 transition-colors duration-300">
      <Link
        href="/"
        className="transition-all duration-200 hover:scale-105"
        style={{ color: theme.textSecondary }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = theme.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = theme.textSecondary;
        }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.href}>
          <svg
            className="w-4 h-4 transition-colors duration-300"
            style={{ color: theme.textSecondary }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          {index === breadcrumbs.length - 1 ? (
            <span
              className="font-semibold transition-colors duration-300"
              style={{ color: theme.text }}
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="transition-all duration-200 hover:scale-105"
              style={{ color: theme.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.textSecondary;
              }}
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// =======================
// PAGE HEADER COMPONENT (with integrated breadcrumb)
// =======================
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems?: BreadcrumbItem[];
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbItems,
  action,
}) => {
  const { theme } = useTheme();

  return (
    <div className="mb-2">
      <Breadcrumb customItems={breadcrumbItems} />
      <hr
        className="h-0.5 transition-colors duration-300"
        style={{
          backgroundColor: theme.primary,
          boxShadow: `0 0 8px ${hexToRgba(theme.primary, 0.5)}`,
        }}
      />

      {/* Optional: Add title and description section */}
      {/* {(title || description || action) && (
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            {title && (
              <h1
                className="text-2xl md:text-3xl font-bold transition-colors duration-300"
                style={{ color: theme.text }}
              >
                {title}
              </h1>
            )}
            {description && (
              <p
                className="mt-1 text-sm transition-colors duration-300"
                style={{ color: theme.textSecondary }}
              >
                {description}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )} */}
    </div>
  );
};
