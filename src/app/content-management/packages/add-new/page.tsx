import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewPackagePage from "@/pages/content-management/packages/AddNewPackagePage";
import { PACKAGE_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_CREATE_PRIVILEGE]}>
      <AddNewPackagePage />
    </ProtectedRoute>
  );
};

export default page;
