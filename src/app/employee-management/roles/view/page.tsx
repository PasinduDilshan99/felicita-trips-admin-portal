import ProtectedRoute from "@/components/ProtectedRoute";
import RoleViewPage from "@/pages/employee-management/roles-pages/RoleViewPage";
import {  ROLES_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ROLE_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ROLES_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ROLE_VIEW_PRIVILEGE]}>
      <RoleViewPage />
    </ProtectedRoute>
  );
};

export default page;
