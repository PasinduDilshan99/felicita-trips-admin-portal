import ProtectedRoute from "@/components/ProtectedRoute";
import CreateEmployeePage from "@/pages/employee-management/employees-pages/CreateEmployeePage";
import { EMPLOYEE_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { EMPLOYEE_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: EMPLOYEE_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[EMPLOYEE_CREATE_PRIVILEGE]}>
      <CreateEmployeePage />
    </ProtectedRoute>
  );
};

export default page;
