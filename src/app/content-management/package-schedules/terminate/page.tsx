import { Suspense } from "react";
import TerminatePackageSchedulePage from "@/pages/content-management/packages-schedules/TerminatePackageSchedulePage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Metadata } from "next";
import { PACKAGE_SCHEDULE_TERMINATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_SCHEDULE_TERMINATE_PRIVILEGE } from "@/utils/privileges";

export const metadata: Metadata = {
  title: PACKAGE_SCHEDULE_TERMINATE_PAGE_TITLE,
};

export default function Page() {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_SCHEDULE_TERMINATE_PRIVILEGE]}>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tour termination page...</p>
            </div>
          </div>
        }
      >
        <TerminatePackageSchedulePage />
      </Suspense>
    </ProtectedRoute>
  );
}
