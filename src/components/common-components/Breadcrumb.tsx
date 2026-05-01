"use client";
import React from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";
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

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const breadcrumbVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -5 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

const separatorVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.1, duration: 0.35, ease: EASE_OUT },
  },
};

const descriptionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.2, duration: 0.3, ease: EASE_OUT },
  },
};

const actionVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.15, duration: 0.3, ease: EASE_OUT },
  },
};

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
    <motion.nav
      variants={breadcrumbVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm mb-3 sm:mb-4"
      aria-label="Breadcrumb"
    >
      <motion.div variants={itemVariants} whileHover="hover">
        <Link
          href="/"
          className="flex items-center gap-1 transition-all duration-200 rounded-md p-1"
          style={{ color: theme.textSecondary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.primary;
            e.currentTarget.style.backgroundColor = hexToRgba(
              theme.primary,
              0.08,
            );
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.textSecondary;
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="sr-only">Home</span>
        </Link>
      </motion.div>

      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.href}>
          <motion.div
            variants={separatorVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center"
          >
            <ChevronRight
              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
              style={{ color: theme.textSecondary }}
            />
          </motion.div>

          {index === breadcrumbs.length - 1 ? (
            <motion.span
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="font-semibold px-2 py-1 rounded-md"
              style={{
                color: theme.primary,
                backgroundColor: hexToRgba(theme.primary, 0.08),
              }}
            >
              {crumb.label}
            </motion.span>
          ) : (
            <motion.div variants={itemVariants} whileHover="hover">
              <Link
                href={crumb.href}
                className="px-2 py-1 rounded-md transition-all duration-200"
                style={{ color: theme.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.primary;
                  e.currentTarget.style.backgroundColor = hexToRgba(
                    theme.primary,
                    0.05,
                  );
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.textSecondary;
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {crumb.label}
              </Link>
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </motion.nav>
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
  icon?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbItems,
  action,
  icon,
}) => {
  const { theme } = useTheme();

  return (
    <div className="sm:mb-2">
      <Breadcrumb customItems={breadcrumbItems} />

      {/* Animated Divider */}
      <motion.hr
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="h-0.5 transition-colors duration-300 origin-left"
        style={{
          backgroundColor: theme.primary,
          boxShadow: `0 0 8px ${hexToRgba(theme.primary, 0.5)}`,
        }}
      />

      {/* Title and Description Section */}
      {(title || description || action) && (
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="mt-2 sm:mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex-1">
            {title && (
              <motion.div
                variants={titleVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2 sm:gap-3"
              >
                {icon && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.1),
                      color: theme.primary,
                    }}
                  >
                    {icon}
                  </motion.span>
                )}
                <h1
                  className="text-xl sm:text-2xl md:text-3xl font-bold transition-colors duration-300"
                  style={{ color: theme.text }}
                >
                  {title}
                </h1>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PageHeader;
