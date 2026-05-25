import ProtectedRoute from "@/components/ProtectedRoute";
import PrivilegePage from "@/pages/employee-management/privileges-pages/PrivilegePage";
import { PRIVILEGE_MANAGEMENT_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PRIVILEGE_MANAGEMENT_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PRIVILEGE_MANAGEMENT_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PRIVILEGE_MANAGEMENT_PRIVILEGE]}>
      <PrivilegePage />
    </ProtectedRoute>
  );
};

export default page;
