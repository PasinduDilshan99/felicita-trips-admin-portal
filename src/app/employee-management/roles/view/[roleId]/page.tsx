import ProtectedRoute from "@/components/ProtectedRoute";
import RoleDetailsPage from "@/pages/employee-management/roles-pages/RoleDetailsPage";
import {  ROLES_DETAILS_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ROLE_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ROLES_DETAILS_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ROLE_DETAILS_VIEW_PRIVILEGE]}>
      <RoleDetailsPage />
    </ProtectedRoute>
  );
};

export default page;
