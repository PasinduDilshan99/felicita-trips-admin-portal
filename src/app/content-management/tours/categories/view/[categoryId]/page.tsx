import ProtectedRoute from "@/components/ProtectedRoute";
import TourCategoryDetailsViewPage from "@/pages/content-management/tours/tour-categories/TourCategoryDetailsViewPage";
import { TOUR_CATEGORY_VIEW_DETAILS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_CATEGORY_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_CATEGORY_VIEW_DETAILS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_CATEGORY_DETAILS_VIEW_PRIVILEGE]}>
      <TourCategoryDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
