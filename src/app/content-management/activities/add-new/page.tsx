import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewActivityPage from "@/pages/content-management/activities/AddNewActivityPage";
import { ACTIVITY_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_CREATE_PRIVILEGE]}>
      <AddNewActivityPage />
    </ProtectedRoute>
  );
};

export default page;
