import ProtectedRoute from "@/components/ProtectedRoute";
import DestinationPage from "@/pages/web-management/destinations/DestinationPage";
import { DESTINATION_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: DESTINATION_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_VIEW_PRIVILEGE]}>
      <DestinationPage />
    </ProtectedRoute>
  );
};

export default page;
