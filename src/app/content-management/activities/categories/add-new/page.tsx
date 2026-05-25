import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewActivityCategoryPage from "@/pages/content-management/activities/activity-caetgories/AddNewActivityCategoryPage";
import { ACTIVITY_CATEGORY_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_CATEGORY_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_CATEGORY_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_CATEGORY_PRIVILEGE]}>
      <AddNewActivityCategoryPage />
    </ProtectedRoute>
  );
};

export default page;
