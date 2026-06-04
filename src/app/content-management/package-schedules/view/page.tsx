import ProtectedRoute from "@/components/ProtectedRoute";
import ViewPackageSchedulePage from "@/pages/content-management/packages-schedules/ViewPackageSchedulePage";
import { PACKAGE_SCHEDULE_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_SCHEDULE_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_SCHEDULE_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_SCHEDULE_VIEW_PRIVILEGE]}>
      <ViewPackageSchedulePage />
    </ProtectedRoute>
  );
};

export default page;
