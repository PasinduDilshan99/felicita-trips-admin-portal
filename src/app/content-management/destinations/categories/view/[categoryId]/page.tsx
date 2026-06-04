import ProtectedRoute from "@/components/ProtectedRoute";
import DestinationCategoryDetailsPage from "@/pages/content-management/destinations/destination-categories/DestinationCategoryDetailsPage";
import { DESTINATION_CATEGORY_VIEW_DETAILS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_CATEGORY_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: DESTINATION_CATEGORY_VIEW_DETAILS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_CATEGORY_DETAILS_VIEW_PRIVILEGE]}>
      <DestinationCategoryDetailsPage />
    </ProtectedRoute>
  );
};

export default page;
