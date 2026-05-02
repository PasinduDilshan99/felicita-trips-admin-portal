import ProtectedRoute from "@/components/ProtectedRoute";
import PrivilegeUpdatePage from "@/pages/employee-management/privileges-pages/PrivilegeUpdatePage";
import { PRIVILEGE_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PRIVILEGE_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PRIVILEGE_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PRIVILEGE_UPDATE_PRIVILEGE]}>
      <PrivilegeUpdatePage />
    </ProtectedRoute>
  );
};

export default page;
