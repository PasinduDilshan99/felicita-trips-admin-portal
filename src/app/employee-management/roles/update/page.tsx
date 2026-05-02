import ProtectedRoute from "@/components/ProtectedRoute";
import RoleUpdatePage from "@/pages/employee-management/roles-pages/RoleUpdatePage";
import { ROLE_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ROLE_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ROLE_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ROLE_UPDATE_PRIVILEGE]}>
      <RoleUpdatePage />
    </ProtectedRoute>
  );
};

export default page;
