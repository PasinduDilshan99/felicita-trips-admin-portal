// components/common-components/CommonButton.tsx
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/functions";

export type ButtonVariant = "primary" | "success" | "error" | "warning" | "info" | "outline" | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

interface CommonButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
}

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  loading = false,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  title,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          color: "#fff",
          border: "none",
          hoverBg: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          hoverBorder: "none",
        };
      case "success":
        return {
          background: `linear-gradient(135deg, ${theme.success}, ${theme.success}CC)`,
          color: "#fff",
          border: "none",
          hoverBg: `linear-gradient(135deg, ${theme.success}, ${theme.success})`,
          hoverBorder: "none",
        };
      case "error":
        return {
          background: `linear-gradient(135deg, ${theme.error}, ${theme.error}CC)`,
          color: "#fff",
          border: "none",
          hoverBg: `linear-gradient(135deg, ${theme.error}, ${theme.error})`,
          hoverBorder: "none",
        };
      case "warning":
        return {
          background: `linear-gradient(135deg, ${theme.warning}, ${theme.warning}CC)`,
          color: "#fff",
          border: "none",
          hoverBg: `linear-gradient(135deg, ${theme.warning}, ${theme.warning})`,
          hoverBorder: "none",
        };
      case "info":
        return {
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}CC)`,
          color: "#fff",
          border: "none",
          hoverBg: `linear-gradient(135deg, ${theme.accent}, ${theme.accent})`,
          hoverBorder: "none",
        };
      case "outline":
        return {
          background: "transparent",
          color: theme.primary,
          border: `1px solid ${hexToRgba(theme.primary, 0.25)}`,
          hoverBg: hexToRgba(theme.primary, 0.1),
          hoverBorder: `1px solid ${hexToRgba(theme.primary, 0.4)}`,
        };
      case "ghost":
        return {
          background: "transparent",
          color: theme.textSecondary,
          border: "none",
          hoverBg: hexToRgba(theme.textSecondary, 0.1),
          hoverBorder: "none",
        };
      default:
        return {
          background: theme.primary,
          color: "#fff",
          border: "none",
          hoverBg: theme.primary,
          hoverBorder: "none",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "xs":
        return {
          padding: "px-2 py-1",
          fontSize: "text-xs",
          gap: "gap-1",
          iconSize: "w-3 h-3",
        };
      case "sm":
        return {
          padding: "px-3 py-1.5",
          fontSize: "text-xs",
          gap: "gap-1.5",
          iconSize: "w-3.5 h-3.5",
        };
      case "md":
        return {
          padding: "px-4 py-2",
          fontSize: "text-sm",
          gap: "gap-2",
          iconSize: "w-4 h-4",
        };
      case "lg":
        return {
          padding: "px-5 py-2.5",
          fontSize: "text-base",
          gap: "gap-2",
          iconSize: "w-5 h-5",
        };
      default:
        return {
          padding: "px-4 py-2",
          fontSize: "text-sm",
          gap: "gap-2",
          iconSize: "w-4 h-4",
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const buttonContent = (
    <>
      {loading ? (
        <svg
          className={`animate-spin ${sizeStyles.iconSize}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        iconPosition === "left" && icon && <span className={sizeStyles.iconSize}>{icon}</span>
      )}
      <span>{children}</span>
      {!loading && iconPosition === "right" && icon && <span className={sizeStyles.iconSize}>{icon}</span>}
    </>
  );

  return (
    <motion.button
      variants={buttonVariants}
      initial="rest"
      whileHover={!disabled && !loading ? "hover" : "rest"}
      whileTap={!disabled && !loading ? "tap" : "rest"}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      title={title}
      className={`
        ${sizeStyles.padding}
        ${sizeStyles.fontSize}
        ${sizeStyles.gap}
        ${fullWidth ? "w-full" : ""}
        rounded-xl font-medium transition-all duration-200
        flex items-center justify-center
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        background: variantStyles.background,
        color: variantStyles.color,
        border: variantStyles.border,
        boxShadow: !disabled && !loading && variant === "primary" ? `0 4px 12px ${hexToRgba(theme.primary, 0.3)}` : "none",
      }}
      onMouseEnter={(e) => {
        if (disabled || loading) return;
        (e.currentTarget as HTMLButtonElement).style.background = variantStyles.hoverBg;
        if (variantStyles.hoverBorder) {
          (e.currentTarget as HTMLButtonElement).style.border = variantStyles.hoverBorder;
        }
      }}
      onMouseLeave={(e) => {
        if (disabled || loading) return;
        (e.currentTarget as HTMLButtonElement).style.background = variantStyles.background;
        if (variantStyles.border) {
          (e.currentTarget as HTMLButtonElement).style.border = variantStyles.border;
        }
      }}
    >
      {buttonContent}
    </motion.button>
  );
};

export default CommonButton;