import { Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import TerminateDestinationCategoryPage from "@/pages/content-management/destinations/destination-categories/TerminateDestinationCategoryPage";
import { DESTINATION_CATEGORY_TERMINATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_CATEGORY_TERMINATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: DESTINATION_CATEGORY_TERMINATE_PAGE_TITLE,
};

export default function Page() {
  return (
    <ProtectedRoute
      requiredPrivileges={[DESTINATION_CATEGORY_TERMINATE_PRIVILEGE]}
    >
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <TerminateDestinationCategoryPage />
      </Suspense>
    </ProtectedRoute>
  );
}