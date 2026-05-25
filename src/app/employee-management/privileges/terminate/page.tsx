import ProtectedRoute from "@/components/ProtectedRoute";
import TerminatePrivilegePage from "@/pages/employee-management/privileges-pages/TerminatePrivilegePage";
import { PRIVILEGE_TERMINATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PRIVILEGE_TERMINATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PRIVILEGE_TERMINATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PRIVILEGE_TERMINATE_PRIVILEGE]}>
      <TerminatePrivilegePage />
    </ProtectedRoute>
  );
};

export default page;
