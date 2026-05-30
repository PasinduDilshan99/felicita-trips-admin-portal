import ProtectedRoute from "@/components/ProtectedRoute";
import ActivityCategoryDetailsPage from "@/pages/content-management/activities/activity-caetgories/ActivityCategoryDetailsPage";
import { ACTIVITY_CATEGORY_VIEW_DETAILS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_CATEGORY_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_CATEGORY_VIEW_DETAILS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute
      requiredPrivileges={[ACTIVITY_CATEGORY_DETAILS_VIEW_PRIVILEGE]}
    >
      <ActivityCategoryDetailsPage />
    </ProtectedRoute>
  );
};

export default page;
