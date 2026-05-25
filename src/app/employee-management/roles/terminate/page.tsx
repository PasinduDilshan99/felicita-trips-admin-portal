import ProtectedRoute from "@/components/ProtectedRoute";
import TerminateRolePage from "@/pages/employee-management/roles-pages/TerminateRolePage";
import { ROLE_TERMINATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ROLE_TERMINATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ROLE_TERMINATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ROLE_TERMINATE_PRIVILEGE]}>
      <TerminateRolePage />
    </ProtectedRoute>
  );
};

export default page;
