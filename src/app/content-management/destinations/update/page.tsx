import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateDestinationPage from "@/pages/content-management/destinations/UpdateDestinationPage";
import { DESTINATION_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: DESTINATION_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_UPDATE_PRIVILEGE]}>
      <UpdateDestinationPage />
    </ProtectedRoute>
  );
};

export default page;
