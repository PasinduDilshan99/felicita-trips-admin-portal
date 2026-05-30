import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateTourCategoryPage from "@/pages/content-management/tours/tour-categories/UpdateTourCategoryPage";
import { TOUR_CATEGORY_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_CATEGORY_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_CATEGORY_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_CATEGORY_UPDATE_PRIVILEGE]}>
      <UpdateTourCategoryPage />
    </ProtectedRoute>
  );
};

export default page;
