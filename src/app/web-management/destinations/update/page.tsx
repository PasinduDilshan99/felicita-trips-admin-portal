import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateDestinationPage from "@/pages/web-management/destinations/UpdateDestinationPage";
import { UPDATE_DESTINATION_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: UPDATE_DESTINATION_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_UPDATE_PRIVILEGE]}>
      <UpdateDestinationPage />
    </ProtectedRoute>
  );
};

export default page;
