import ProtectedRoute from "@/components/ProtectedRoute";
import TerminateActivityCategoryPage from "@/pages/content-management/activities/activity-caetgories/TerminateActivityCategoryPage";
import { ACTIVITY_CATEGORY_TERMINATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_CATEGORY_TERMINATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_CATEGORY_TERMINATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute
      requiredPrivileges={[ACTIVITY_CATEGORY_TERMINATE_PRIVILEGE]}
    >
      <TerminateActivityCategoryPage />
    </ProtectedRoute>
  );
};

export default page;
