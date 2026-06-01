import ProtectedRoute from "@/components/ProtectedRoute";
import PackageDetailsViewPage from "@/pages/content-management/packages/PackageDetailsViewPage";
import { PACKAGE_DETAILS_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_DETAILS_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_DETAILS_VIEW_PRIVILEGE]}>
      <PackageDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
