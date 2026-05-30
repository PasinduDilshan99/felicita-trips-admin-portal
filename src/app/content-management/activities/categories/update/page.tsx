import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateActivityCategoryPage from "@/pages/content-management/activities/activity-caetgories/UpdateActivityCategoryPage";
import { ACTIVITY_CATEGORY_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_CATEGORY_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_CATEGORY_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_CATEGORY_UPDATE_PRIVILEGE]}>
      <UpdateActivityCategoryPage />
    </ProtectedRoute>
  );
};

export default page;
