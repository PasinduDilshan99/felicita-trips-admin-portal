import ProtectedRoute from "@/components/ProtectedRoute";
import UpdatePackageSchedulePage from "@/pages/content-management/packages-schedules/UpdatePackageSchedulePage";
import { PACKAGE_SCHEDULE_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_SCHEDULE_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_SCHEDULE_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PACKAGE_SCHEDULE_UPDATE_PRIVILEGE]}>
      <UpdatePackageSchedulePage />
    </ProtectedRoute>
  );
};

export default page;
