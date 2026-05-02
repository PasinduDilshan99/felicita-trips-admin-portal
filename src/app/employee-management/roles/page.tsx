import ProtectedRoute from "@/components/ProtectedRoute";
import RolesPage from "@/pages/employee-management/roles-pages/RolesPage";
import { ROLES_MANAGEMENT_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ROLE_MANAGEMENT_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ROLES_MANAGEMENT_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ROLE_MANAGEMENT_PRIVILEGE]}>
      <RolesPage />
    </ProtectedRoute>
  );
};

export default page;
