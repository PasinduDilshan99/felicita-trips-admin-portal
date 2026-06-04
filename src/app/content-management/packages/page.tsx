import ProtectedRoute from "@/components/ProtectedRoute";
import PackagesPage from "@/pages/content-management/packages/PackagesPage";
import { PACKAGE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_PRIVILEGE]}>
      <PackagesPage />
    </ProtectedRoute>
  );
};

export default page;
