import { Suspense } from "react";
import TerminateActivitySchedulePage from "@/pages/content-management/activities-schedules/TerminateActivitySchedulePage";
import { ACTIVITY_SCHEDULE_TERMINATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { Metadata } from "next";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ACTIVITY_SCHEDULE_TERMINATE_PRIVILEGE } from "@/utils/privileges";

export const metadata: Metadata = {
  title: ACTIVITY_SCHEDULE_TERMINATE_PAGE_TITLE,
};

export default function Page() {
  return (
    <ProtectedRoute
      requiredPrivileges={[ACTIVITY_SCHEDULE_TERMINATE_PRIVILEGE]}
    >
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
        <TerminateActivitySchedulePage />
      </Suspense>
    </ProtectedRoute>
  );
}
