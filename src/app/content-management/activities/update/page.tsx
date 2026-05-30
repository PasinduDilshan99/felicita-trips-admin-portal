import ProtectedRoute from "@/components/ProtectedRoute";
import ActivityUpdatePage from "@/pages/content-management/activities/ActivityUpdatePage";
import { ACTIVITY_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_UPDATE_PRIVILEGE]}>
      <ActivityUpdatePage />
    </ProtectedRoute>
  );
};

export default page;
