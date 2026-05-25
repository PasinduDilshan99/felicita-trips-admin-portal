import ProtectedRoute from "@/components/ProtectedRoute";
import PrivilegeDetailsViewPage from "@/pages/employee-management/privileges-pages/PrivilegeDetailsViewPage";
import { PRIVILEGE_DETAILS_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PRIVILEGE_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PRIVILEGE_DETAILS_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PRIVILEGE_VIEW_PRIVILEGE]}>
      <PrivilegeDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
