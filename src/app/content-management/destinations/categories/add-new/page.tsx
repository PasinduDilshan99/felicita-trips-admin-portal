import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewDestinationCategoryPage from "@/pages/content-management/destinations/destination-categories/AddNewDestinationCategoryPage";
import { DESTINATION_CATEGORY_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_CATEGORY_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: DESTINATION_CATEGORY_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute
      requiredPrivileges={[DESTINATION_CATEGORY_CREATE_PRIVILEGE]}
    >
      <AddNewDestinationCategoryPage />
    </ProtectedRoute>
  );
};

export default page;
