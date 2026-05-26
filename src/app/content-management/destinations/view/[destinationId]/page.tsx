import ProtectedRoute from "@/components/ProtectedRoute";
import DestinationDetailsPage from "@/pages/content-management/destinations/DestinationDetailsPage";
import { DESTINATION_VIEW_DETAILS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: DESTINATION_VIEW_DETAILS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_DETAILS_VIEW_PRIVILEGE]}>
      <DestinationDetailsPage />
    </ProtectedRoute>
  );
};

export default page;
