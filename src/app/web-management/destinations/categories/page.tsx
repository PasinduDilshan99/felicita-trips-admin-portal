import ProtectedRoute from "@/components/ProtectedRoute";
import DestinationCategoriesPage from "@/pages/web-management/destinations/destination-categories/DestinationCategoriesPage";
import { DESTINATION_CATEGORIES_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_CATEGORY_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: DESTINATION_CATEGORIES_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_CATEGORY_PRIVILEGE]}>
      <DestinationCategoriesPage />
    </ProtectedRoute>
  );
};

export default page;
