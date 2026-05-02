import ProtectedRoute from "@/components/ProtectedRoute";
import EmployeesPage from "@/pages/employee-management/employees-pages/EmployeesPage";
import { EMPLOYEE_PAGE_MANAGEMENT_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { EMPLOYEE_PAGE_MANAGEMENT_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: EMPLOYEE_PAGE_MANAGEMENT_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[EMPLOYEE_PAGE_MANAGEMENT_PRIVILEGE]}>
      <EmployeesPage />
    </ProtectedRoute>
  );
};

export default page;
