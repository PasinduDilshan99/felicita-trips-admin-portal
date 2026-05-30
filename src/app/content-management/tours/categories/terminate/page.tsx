import { Suspense } from "react";
import TerminateTourCategoryPage from "@/pages/content-management/tours/tour-categories/TerminateTourCategoryPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TOUR_CATEGORY_TERMINATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { Metadata } from "next";
import { TOUR_CATEGORY_TERMINATE_PRIVILEGE } from "@/utils/privileges";

export const metadata: Metadata = {
  title: TOUR_CATEGORY_TERMINATE_PAGE_TITLE,
};

export default function Page() {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_CATEGORY_TERMINATE_PRIVILEGE]}>
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
        <TerminateTourCategoryPage />
      </Suspense>
    </ProtectedRoute>
  );
}
