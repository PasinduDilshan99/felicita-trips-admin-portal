import ProtectedRoute from "@/components/ProtectedRoute";
import ContentManagementPage from "@/pages/content-management/ContentManagementPage";
import { CONTENT_MANAGEMENT_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { CONTENT_MANAGEMENT_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: CONTENT_MANAGEMENT_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[CONTENT_MANAGEMENT_PRIVILEGE]}>
      <ContentManagementPage />
    </ProtectedRoute>
  );
};

export default page;
