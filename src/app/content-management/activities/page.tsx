import ProtectedRoute from "@/components/ProtectedRoute";
import ActivitiesPage from "@/pages/content-management/activities/ActivitiesPage";
import { ACTIVITY_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_VIEW_PRIVILEGE]}>
      <ActivitiesPage />
    </ProtectedRoute>
  );
};

export default page;
