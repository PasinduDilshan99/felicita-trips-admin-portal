import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewPackageSchedulePage from "@/pages/content-management/packages-schedules/AddNewPackageSchedulePage";
import { PACKAGE_SCHEDULE_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_SCHEDULE_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_SCHEDULE_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_SCHEDULE_CREATE_PRIVILEGE]}>
      <AddNewPackageSchedulePage />
    </ProtectedRoute>
  );
};

export default page;
