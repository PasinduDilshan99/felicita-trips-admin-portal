import ProtectedRoute from "@/components/ProtectedRoute";
import EmployeeDetailsViewPage from "@/pages/employee-management/employees-pages/EmployeeDetailsViewPage";
import { EMPLOYEE_DETAILS_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { EMPLOYEE_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: EMPLOYEE_DETAILS_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[EMPLOYEE_VIEW_PRIVILEGE]}>
      <EmployeeDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
