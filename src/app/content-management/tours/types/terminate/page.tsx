import { Suspense } from "react";
import TerminateTourTypePage from "@/pages/content-management/tours/tour-types/TerminateTourTypePage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TOUR_TYPE_TERMINATE_PRIVILEGE } from "@/utils/privileges";
import { TOUR_TYPE_TERMINATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: TOUR_TYPE_TERMINATE_PAGE_TITLE,
};

export default function Page() {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_TYPE_TERMINATE_PRIVILEGE]}>
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
        <TerminateTourTypePage />
      </Suspense>
    </ProtectedRoute>
  );
}
