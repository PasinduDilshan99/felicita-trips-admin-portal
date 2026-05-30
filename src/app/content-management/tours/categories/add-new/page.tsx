import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewTourCategoryPage from "@/pages/content-management/tours/tour-categories/AddNewTourCategoryPage";
import { TOUR_CATEGORY_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_CATEGORY_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_CATEGORY_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_CATEGORY_CREATE_PRIVILEGE]}>
      <AddNewTourCategoryPage />
    </ProtectedRoute>
  );
};

export default page;
