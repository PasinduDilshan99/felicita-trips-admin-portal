import ProtectedRoute from "@/components/ProtectedRoute";
import EmployeeManagementPage from "@/pages/employee-management/EmployeeManagementPage";
import { EMPLOYEE_MANAGEMENT_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { EMPLOYEE_MANAGEMENT_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: EMPLOYEE_MANAGEMENT_PAGE_TITLE,
};

export default function Home() {
  return (
    <ProtectedRoute requiredPrivileges={[EMPLOYEE_MANAGEMENT_PRIVILEGE]}>
      <EmployeeManagementPage />
    </ProtectedRoute>
  );
}
