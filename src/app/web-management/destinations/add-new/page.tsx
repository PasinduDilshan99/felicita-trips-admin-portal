import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewDestinationPage from "@/pages/web-management/destinations/AddNewDestinationPage";
import { ADD_DESTINATION_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ADD_DESTINATION_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_CREATE_PRIVILEGE]}>
      <AddNewDestinationPage />
    </ProtectedRoute>
  );
};

export default page;
