import ProtectedRoute from "@/components/ProtectedRoute";
import { TOUR_CATEGORY_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_CATEGORY_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";
import ViewTourCategoryPage from "@/pages/content-management/tours/tour-categories/ViewTourCategoryPage";

export const metadata: Metadata = {
  title: TOUR_CATEGORY_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_CATEGORY_VIEW_PRIVILEGE]}>
      <ViewTourCategoryPage />
    </ProtectedRoute>
  );
};

export default page;
