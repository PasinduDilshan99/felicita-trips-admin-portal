import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewPackageTypePage from "@/pages/content-management/packages/package-types/AddNewPackageTypePage";
import { PACKAGE_TYPE_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_TYPE_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_TYPE_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_TYPE_CREATE_PRIVILEGE]}>
      <AddNewPackageTypePage />
    </ProtectedRoute>
  );
};

export default page;
