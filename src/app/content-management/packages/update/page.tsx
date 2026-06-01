import ProtectedRoute from "@/components/ProtectedRoute";
import UpdatePackagePage from "@/pages/content-management/packages/UpdatePackagePage";
import { PACKAGE_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_UPDATE_PRIVILEGE]}>
      <UpdatePackagePage />
    </ProtectedRoute>
  );
};

export default page;
