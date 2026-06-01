import ProtectedRoute from "@/components/ProtectedRoute";
import PackagesViewPage from "@/pages/content-management/packages/PackagesViewPage";
import { PACKAGE_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_VIEW_PRIVILEGE]}>
      <PackagesViewPage />
    </ProtectedRoute>
  );
};

export default page;
