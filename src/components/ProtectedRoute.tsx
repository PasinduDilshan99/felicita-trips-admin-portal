"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UNIQUE_CODE_NAME } from "@/utils/constant";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const uniqueCode = sessionStorage.getItem(UNIQUE_CODE_NAME);
    
    if (!uniqueCode) {
      router.push("/login");
    }
  }, [router]);

  const uniqueCode = sessionStorage.getItem(UNIQUE_CODE_NAME);

  if (!uniqueCode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}