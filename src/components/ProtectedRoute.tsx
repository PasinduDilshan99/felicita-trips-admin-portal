// components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UNIQUE_CODE_NAME } from "@/utils/constant";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Optional: Required privileges for this route
   * If not provided, only checks authentication
   */
  requiredPrivileges?: string[];
  /**
   * Optional: Redirect path when unauthorized
   * Defaults to "/login" for authentication failures
   * and "/unauthorized" for privilege failures
   */
  unauthorizedRedirect?: string;
  /**
   * Optional: Show loading state
   */
  showLoading?: boolean;
}

export default function ProtectedRoute({
  children,
  requiredPrivileges = [],
  unauthorizedRedirect = "/unauthorized",
  showLoading = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { hasPrivilege, loading: authLoading } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true);

      // 1. Check authentication
      const uniqueCode = sessionStorage.getItem(UNIQUE_CODE_NAME);
      if (!uniqueCode) {
        router.push("/login");
        return;
      }

      // 2. Check privileges if required
      if (requiredPrivileges.length > 0) {
        const hasAllPrivileges = requiredPrivileges.every(privilege =>
          hasPrivilege(privilege)
        );

        if (!hasAllPrivileges) {
          router.push(unauthorizedRedirect);
          return;
        }
      }

      // All checks passed
      setHasAccess(true);
      setIsChecking(false);
    };

    // Only check access when auth is loaded
    if (!authLoading) {
      checkAccess();
    }
  }, [router, requiredPrivileges, unauthorizedRedirect, authLoading, hasPrivilege]);

  // Show loading state
  if (authLoading || isChecking) {
    if (showLoading) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center transition-colors duration-300"
          style={{ backgroundColor: theme.background }}
        >
          <div className="text-center">
            {/* Spinner */}
            <div 
              className="inline-block animate-spin rounded-full h-12 w-12 border-4"
              style={{ 
                borderColor: hexToRgba(theme.primary, 0.2),
                borderTopColor: theme.primary,
                borderRightColor: theme.primary,
              }}
            />
            
            {/* Loading Text */}
            <p 
              className="mt-4 text-sm font-medium transition-colors duration-300"
              style={{ color: theme.textSecondary }}
            >
              {requiredPrivileges.length > 0
                ? "Checking permissions..."
                : "Verifying access..."}
            </p>
            
            {/* Optional: Subtle loading hint */}
            <p 
              className="mt-2 text-xs transition-colors duration-300"
              style={{ color: hexToRgba(theme.textSecondary, 0.7) }}
            >
              Please wait while we verify your credentials
            </p>
          </div>
        </div>
      );
    }
    return null;
  }

  // Don't render if no access (will redirect)
  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}