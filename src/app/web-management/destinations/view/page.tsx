import DestinationsViewPage from "@/pages/web-management/destinations/DestinationsViewPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DESTINATION_VIEW_PRIVILEGE } from "@/utils/privileges";
import React from "react";
import { Metadata } from "next";
import { VIEW_DESTINATION_PAGE_TITLE } from "@/utils/pagesHeaderTitles";

export const metadata: Metadata = {
  title: VIEW_DESTINATION_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_VIEW_PRIVILEGE]}>
      <DestinationsViewPage />
    </ProtectedRoute>
  );
};

export default page;
