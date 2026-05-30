import ProtectedRoute from "@/components/ProtectedRoute";
import ViewActivityCategoryPage from "@/pages/content-management/activities/activity-caetgories/ViewActivityCategoryPage";
import { ACTIVITY_CATEGORY_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_CATEGORY_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_CATEGORY_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_CATEGORY_VIEW_PRIVILEGE]}>
      <ViewActivityCategoryPage />
    </ProtectedRoute>
  );
};

export default page;
