import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewDestinationPage from "@/pages/content-management/destinations/AddNewDestinationPage";
import { DESTINATION_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: DESTINATION_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_CREATE_PRIVILEGE]}>
      <AddNewDestinationPage />
    </ProtectedRoute>
  );
};

export default page;
