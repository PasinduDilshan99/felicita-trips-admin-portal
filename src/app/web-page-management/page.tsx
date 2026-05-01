import ProtectedRoute from "@/components/ProtectedRoute";
import WebPageManagementPage from "@/pages/web-page-management/WebPageManagementPage";
import { WEB_PAGE_MANAGEMENT_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { WEB_PAGE_MANAGEMENT_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: WEB_PAGE_MANAGEMENT_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[WEB_PAGE_MANAGEMENT_PRIVILEGE]}>
      <WebPageManagementPage />
    </ProtectedRoute>
  );
};

export default page;
