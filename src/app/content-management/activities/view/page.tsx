import ProtectedRoute from "@/components/ProtectedRoute";
import ActivitiesViewPage from "@/pages/content-management/activities/ActivitiesViewPage";
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
      <ActivitiesViewPage />
    </ProtectedRoute>
  );
};

export default page;
