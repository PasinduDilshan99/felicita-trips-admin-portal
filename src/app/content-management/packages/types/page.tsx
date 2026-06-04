import ProtectedRoute from "@/components/ProtectedRoute";
import PackageTypesPage from "@/pages/content-management/packages/package-types/PackageTypesPage";
import { PACKAGE_TYPES_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_TYPE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_TYPES_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_TYPE_PRIVILEGE]}>
      <PackageTypesPage />
    </ProtectedRoute>
  );
};

export default page;
