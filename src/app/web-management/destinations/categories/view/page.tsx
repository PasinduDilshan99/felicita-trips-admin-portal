import ProtectedRoute from "@/components/ProtectedRoute";
import DestinationCategoriesViewPage from "@/pages/web-management/destinations/destination-categories/DestinationCategoriesViewPage";
import { VIEW_DESTINATION_CATEGORIES_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_CATEGORY_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: VIEW_DESTINATION_CATEGORIES_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_CATEGORY_VIEW_PRIVILEGE]}>
      <DestinationCategoriesViewPage />
    </ProtectedRoute>
  );
};

export default page;
