import ProtectedRoute from "@/components/ProtectedRoute";
import PackagesSchedulesPage from "@/pages/content-management/packages-schedules/PackagesSchedulesPage";
import { PACKAGE_SCHEDULE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_SCHEDULE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_SCHEDULE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_SCHEDULE_PRIVILEGE]}>
      <PackagesSchedulesPage />
    </ProtectedRoute>
  );
};

export default page;
