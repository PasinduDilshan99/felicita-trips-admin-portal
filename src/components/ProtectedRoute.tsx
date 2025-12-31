// components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UNIQUE_CODE_NAME } from "@/utils/constant";
import { useAuth } from "@/contexts/AuthContext";

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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {requiredPrivileges.length > 0
                ? "Checking permissions..."
                : "Verifying access..."}
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