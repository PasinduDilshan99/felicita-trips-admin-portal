import ProtectedRoute from "@/components/ProtectedRoute";
import TerminateDestinationPage from "@/pages/content-management/destinations/TerminateDestinationPage";
import { DESTINATION_TERMINATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_TERMINATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: DESTINATION_TERMINATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_TERMINATE_PRIVILEGE]}>
      <TerminateDestinationPage />
    </ProtectedRoute>
  );
};

export default page;
