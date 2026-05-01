import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateDestinationCategoryPage from "@/pages/web-management/destinations/destination-categories/UpdateDestinationCategoryPage";
import { UPDATE_DESTINATION_CATEGORY_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_CATEGORY_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: UPDATE_DESTINATION_CATEGORY_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute
      requiredPrivileges={[DESTINATION_CATEGORY_UPDATE_PRIVILEGE]}
    >
      <UpdateDestinationCategoryPage />
    </ProtectedRoute>
  );
};

export default page;
