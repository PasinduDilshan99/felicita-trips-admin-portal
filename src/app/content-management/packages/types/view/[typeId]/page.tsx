import ProtectedRoute from "@/components/ProtectedRoute";
import PackageTypeDetailsViewPage from "@/pages/content-management/packages/package-types/PackageTypeDetailsViewPage";
import { PACKAGE_TYPE_VIEW_DETAILS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_TYPE_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_TYPE_VIEW_DETAILS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_TYPE_DETAILS_VIEW_PRIVILEGE]}>
      <PackageTypeDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
