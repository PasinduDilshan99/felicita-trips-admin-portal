import ProtectedRoute from "@/components/ProtectedRoute";
import PrivilegeViewPage from "@/pages/employee-management/privileges-pages/PrivilegeViewPage";
import { PRIVILEGE_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PRIVILEGE_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PRIVILEGE_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PRIVILEGE_VIEW_PRIVILEGE]}>
      <PrivilegeViewPage />
    </ProtectedRoute>
  );
};

export default page;
