"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export interface PrivilegedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  requiredPrivileges?: string[];
  requiredRoles?: string[];
  requireAll?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  showShineEffect?: boolean;
  showTopBorder?: boolean;
  elevation?: "none" | "sm" | "md" | "lg";
}

const PrivilegedButton: React.FC<PrivilegedButtonProps> = ({
  children,
  requiredPrivileges = [],
  requiredRoles = [],
  requireAll = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = "left",
  showShineEffect = true,
  showTopBorder = true,
  elevation = "md",
  onClick,
  disabled,
  className = "",
  style,
  ...restProps
}) => {
  const { hasPrivilege, hasRole, user } = useAuth();
  const { theme } = useTheme();

  const hasRequiredPrivileges = React.useMemo(() => {
    if (requiredPrivileges.length === 0) return true;

    if (requireAll) {
      return requiredPrivileges.every((priv) => hasPrivilege(priv));
    }
    return requiredPrivileges.some((priv) => hasPrivilege(priv));
  }, [requiredPrivileges, requireAll, hasPrivilege]);

  const hasRequiredRoles = React.useMemo(() => {
    if (requiredRoles.length === 0) return true;

    if (requireAll) {
      return requiredRoles.every((role) => hasRole(role));
    }
    return requiredRoles.some((role) => hasRole(role));
  }, [requiredRoles, requireAll, hasRole]);

  const isAuthenticated = !!user;

  const hasAccess =
    isAuthenticated && hasRequiredPrivileges && hasRequiredRoles;

  const shouldShow =
    requiredPrivileges.length === 0 && requiredRoles.length === 0
      ? true
      : hasAccess;

  if (!shouldShow) {
    return null;
  }

  const sizeClasses = {
    sm: "py-2 px-4 text-xs",
    md: "py-3 px-5 text-sm",
    lg: "py-4 px-6 text-base",
  };

  const variantStyles = {
    primary: {
      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
      textColor: "#fff",
      hoverShadow: `0 8px 25px -4px ${theme.primary}70, 0 4px 10px -3px ${theme.accent}50`,
      defaultShadow: `0 4px 15px -3px ${theme.primary}55, 0 2px 6px -2px ${theme.accent}33`,
    },
    secondary: {
      background: `linear-gradient(135deg, ${theme.textSecondary}30 0%, ${theme.textSecondary}15 100%)`,
      textColor: theme.text,
      hoverShadow: `0 8px 25px -4px ${theme.textSecondary}30, 0 4px 10px -3px ${theme.textSecondary}20`,
      defaultShadow: `0 4px 15px -3px ${theme.textSecondary}20, 0 2px 6px -2px ${theme.textSecondary}10`,
    },
    danger: {
      background: `linear-gradient(135deg, ${theme.error} 0%, ${theme.error}cc 100%)`,
      textColor: "#fff",
      hoverShadow: `0 8px 25px -4px ${theme.error}70, 0 4px 10px -3px ${theme.error}50`,
      defaultShadow: `0 4px 15px -3px ${theme.error}55, 0 2px 6px -2px ${theme.error}33`,
    },
    success: {
      background: `linear-gradient(135deg, ${theme.success} 0%, ${theme.success}cc 100%)`,
      textColor: "#fff",
      hoverShadow: `0 8px 25px -4px ${theme.success}70, 0 4px 10px -3px ${theme.success}50`,
      defaultShadow: `0 4px 15px -3px ${theme.success}55, 0 2px 6px -2px ${theme.success}33`,
    },
    warning: {
      background: `linear-gradient(135deg, ${theme.warning} 0%, ${theme.warning}cc 100%)`,
      textColor: "#fff",
      hoverShadow: `0 8px 25px -4px ${theme.warning}70, 0 4px 10px -3px ${theme.warning}50`,
      defaultShadow: `0 4px 15px -3px ${theme.warning}55, 0 2px 6px -2px ${theme.warning}33`,
    },
  };

  const currentVariant = variantStyles[variant];

  const elevationClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative cursor-pointer rounded-xl font-semibold
        flex items-center justify-center gap-2 overflow-hidden
        transition-all duration-300 ease-out
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${elevationClasses[elevation]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      style={{
        background: currentVariant.background,
        color: currentVariant.textColor,
        boxShadow: currentVariant.defaultShadow,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled || loading) return;
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          currentVariant.hoverShadow;
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        if (disabled || loading) return;
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          currentVariant.defaultShadow;
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(0)";
      }}
      onMouseDown={(e) => {
        if (disabled || loading) return;
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(0) scale(0.97)";
      }}
      onMouseUp={(e) => {
        if (disabled || loading) return;
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(-2px) scale(1)";
      }}
      {...restProps}
    >
      {showShineEffect && !disabled && (
        <span
          className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out"
          style={{
            background:
              "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)",
          }}
        />
      )}

      {showTopBorder && !disabled && (
        <span
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "rgba(255,255,255,0.35)" }}
        />
      )}

      {loading && (
        <svg
          className="animate-spin h-4 w-4"
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
      )}

      <div className="relative flex items-center justify-center gap-2">
        {icon && iconPosition === "left" && !loading && (
          <span className="transition-transform duration-300 group-hover/btn:scale-110">
            {icon}
          </span>
        )}
        <span className="relative tracking-wide">{children}</span>
        {icon && iconPosition === "right" && !loading && (
          <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
            {icon}
          </span>
        )}
      </div>
    </button>
  );
};

export default PrivilegedButton;
