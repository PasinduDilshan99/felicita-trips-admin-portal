import ProtectedRoute from "@/components/ProtectedRoute";
import DestinationCategoriesViewPage from "@/pages/content-management/destinations/destination-categories/DestinationCategoriesViewPage";
import { DESTINATION_CATEGORIES_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_CATEGORY_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: DESTINATION_CATEGORIES_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_CATEGORY_VIEW_PRIVILEGE]}>
      <DestinationCategoriesViewPage />
    </ProtectedRoute>
  );
};

export default page;
