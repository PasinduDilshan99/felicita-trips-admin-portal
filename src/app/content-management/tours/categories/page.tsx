import ProtectedRoute from "@/components/ProtectedRoute";
import { TOUR_CATEGORY_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_CATEGORY_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";
import TourCategoriesPage from "@/pages/content-management/tours/tour-categories/TourCategoriesPage";

export const metadata: Metadata = {
  title: TOUR_CATEGORY_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_CATEGORY_PRIVILEGE]}>
      <TourCategoriesPage />
    </ProtectedRoute>
  );
};

export default page;
