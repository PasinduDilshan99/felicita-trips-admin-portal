// components/common-components/PrivilegedTag.tsx (updated)
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Lock } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export interface PrivilegedTagProps {
  id: string | number;
  name?: string; // Make name optional when using children
  requiredPrivilege?: string;
  requiredRole?: string;
  navigateTo: string | ((id: string | number, name?: string) => string);
  queryParams?: Record<string, string | number>;
  onUnauthorized?: () => void;
  onBeforeNavigate?: () => boolean | void;
  showLockIcon?: boolean;
  showTooltip?: boolean;
  tooltipText?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  requireAuth?: boolean;
  children?: React.ReactNode; // Add children support
  asDiv?: boolean; // Allow rendering as div instead of span
}

const PrivilegedTag: React.FC<PrivilegedTagProps> = ({
  id,
  name,
  requiredPrivilege,
  requiredRole,
  navigateTo,
  queryParams = {},
  onUnauthorized,
  onBeforeNavigate,
  showLockIcon = false,
  showTooltip = false,
  tooltipText = "You don't have permission to access this",
  className = "",
  style,
  variant = "primary",
  size = "md",
  disabled = false,
  requireAuth = true,
  children,
  asDiv = false,
}) => {
  const router = useRouter();
  const { hasPrivilege, hasRole, user } = useAuth();
  const { theme } = useTheme();

  // Check if user has required permission
  const hasPermission = React.useMemo(() => {
    if (requireAuth && !user) return false;
    if (requiredPrivilege && !hasPrivilege(requiredPrivilege)) return false;
    if (requiredRole && !hasRole(requiredRole)) return false;
    return true;
  }, [requiredPrivilege, requiredRole, hasPrivilege, hasRole, user, requireAuth]);

  // Build navigation URL
  const getNavigationUrl = (): string => {
    let baseUrl: string;
    
    if (typeof navigateTo === "function") {
      baseUrl = navigateTo(id, name);
    } else {
      baseUrl = navigateTo;
    }

    const params = new URLSearchParams();
    if (name) params.append("name", name);
    
    Object.entries(queryParams).forEach(([key, value]) => {
      params.append(key, String(value));
    });

    const queryString = params.toString();
    return queryString ? `${baseUrl}/${id}?${queryString}` : `${baseUrl}/${id}`;
  };

  const handleClick = () => {
    if (disabled || !hasPermission) {
      if (!hasPermission && onUnauthorized) {
        onUnauthorized();
      } else if (!hasPermission) {
        alert(tooltipText);
      }
      return;
    }

    if (onBeforeNavigate) {
      const shouldNavigate = onBeforeNavigate();
      if (shouldNavigate === false) return;
    }

    router.push(getNavigationUrl());
  };

  const isClickable = hasPermission && !disabled;
  const Container = asDiv ? 'div' : 'span';

  // If children are provided, wrap them with click handler
  if (children) {
    return (
      <div className="relative inline-block w-full">
        <Container
          onClick={handleClick}
          className={`${isClickable ? "cursor-pointer" : "cursor-not-allowed"} ${className}`}
          style={style}
        >
          {children}
          {showLockIcon && !hasPermission && (
            <div className="absolute top-2 right-2">
              <Lock className="w-4 h-4 opacity-60" />
            </div>
          )}
        </Container>
        
        {showTooltip && !hasPermission && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            {tooltipText}
          </div>
        )}
      </div>
    );
  }

  // Default rendering (without children)
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-xs sm:text-sm",
    lg: "px-4 py-2 text-sm sm:text-base",
  };

  const getVariantStyles = () => {
    const variants = {
      primary: {
        bg: `${theme.primary}10`,
        color: theme.primary,
        border: `${theme.primary}20`,
        hoverBg: `${theme.primary}20`,
      },
      secondary: {
        bg: `${theme.textSecondary}10`,
        color: theme.textSecondary,
        border: `${theme.textSecondary}20`,
        hoverBg: `${theme.textSecondary}20`,
      },
      success: {
        bg: `${theme.success}10`,
        color: theme.success,
        border: `${theme.success}20`,
        hoverBg: `${theme.success}20`,
      },
      warning: {
        bg: `${theme.warning}10`,
        color: theme.warning,
        border: `${theme.warning}20`,
        hoverBg: `${theme.warning}20`,
      },
      error: {
        bg: `${theme.error}10`,
        color: theme.error,
        border: `${theme.error}20`,
        hoverBg: `${theme.error}20`,
      },
      info: {
        bg: `${theme.accent}10`,
        color: theme.accent,
        border: `${theme.accent}20`,
        hoverBg: `${theme.accent}20`,
      },
    };
    return variants[variant];
  };

  const variantStyles = getVariantStyles();

  return (
    <div className="relative inline-block">
      <span
        onClick={handleClick}
        className={`
          inline-flex items-center gap-1.5 rounded-lg font-medium
          transition-all duration-200
          ${sizeClasses[size]}
          ${isClickable ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-60"}
          ${className}
        `}
        style={{
          backgroundColor: variantStyles.bg,
          color: variantStyles.color,
          border: `1px solid ${variantStyles.border}`,
          ...style,
        }}
      >
        {showLockIcon && !hasPermission && <Lock className="w-3 h-3" />}
        {name}
      </span>

      {showTooltip && !hasPermission && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default PrivilegedTag;