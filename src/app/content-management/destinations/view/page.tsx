import DestinationsViewPage from "@/pages/content-management/destinations/DestinationsViewPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DESTINATION_VIEW_PRIVILEGE } from "@/utils/privileges";
import React from "react";
import { Metadata } from "next";
import { DESTINATION_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";

export const metadata: Metadata = {
  title: DESTINATION_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_VIEW_PRIVILEGE]}>
      <DestinationsViewPage />
    </ProtectedRoute>
  );
};

export default page;
