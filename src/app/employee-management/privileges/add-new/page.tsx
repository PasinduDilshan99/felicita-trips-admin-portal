import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewPrivilegePage from "@/pages/employee-management/privileges-pages/AddNewPrivilegePage";
import { PRIVILEGE_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PRIVILEGE_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PRIVILEGE_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PRIVILEGE_CREATE_PRIVILEGE]}>
      <AddNewPrivilegePage />
    </ProtectedRoute>
  );
};

export default page;
