import ProtectedRoute from "@/components/ProtectedRoute";
import ViewPackageTypePage from "@/pages/content-management/packages/package-types/ViewPackageTypePage";
import { PACKAGE_TYPES_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_TYPE_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_TYPES_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_TYPE_VIEW_PRIVILEGE]}>
      <ViewPackageTypePage />
    </ProtectedRoute>
  );
};

export default page;
