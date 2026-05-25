import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewRolePage from "@/pages/employee-management/roles-pages/AddNewRolePage";
import { ROLE_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ROLE_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ROLE_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ROLE_CREATE_PRIVILEGE]}>
      <AddNewRolePage />
    </ProtectedRoute>
  );
};

export default page;
