import ProtectedRoute from "@/components/ProtectedRoute";
import UpdatePackageTypesPage from "@/pages/content-management/packages/package-types/UpdatePackageTypesPage";
import { PACKAGE_TYPE_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_TYPE_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_TYPE_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_TYPE_UPDATE_PRIVILEGE]}>
      <UpdatePackageTypesPage />
    </ProtectedRoute>
  );
};

export default page;
