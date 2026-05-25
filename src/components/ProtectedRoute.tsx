// components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UNIQUE_CODE_NAME } from "@/utils/constant";
import { useAuth } from "@/contexts/AuthContext";
import CommonLoading from "@/components/common-components/CommonLoading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPrivileges?: string[];
  unauthorizedRedirect?: string;
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

      const uniqueCode = sessionStorage.getItem(UNIQUE_CODE_NAME);
      if (!uniqueCode) {
        router.push("/login");
        return;
      }

      if (requiredPrivileges.length > 0) {
        const hasAllPrivileges = requiredPrivileges.every((privilege) =>
          hasPrivilege(privilege)
        );

        if (!hasAllPrivileges) {
          router.push(unauthorizedRedirect);
          return;
        }
      }

      setHasAccess(true);
      setIsChecking(false);
    };

    if (!authLoading) {
      checkAccess();
    }
  }, [router, requiredPrivileges, unauthorizedRedirect, authLoading, hasPrivilege]);

  if (authLoading || isChecking) {
    if (showLoading) {
      return (
        <CommonLoading
          fullScreen
          size="md"
          message={
            requiredPrivileges.length > 0
              ? "Checking permissions..."
              : "Verifying access..."
          }
          subMessage="Please wait while we verify your credentials"
        />
      );
    }
    return null;
  }

  if (!hasAccess) return null;

  return <>{children}</>;
}