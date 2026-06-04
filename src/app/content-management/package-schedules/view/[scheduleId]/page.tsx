import ProtectedRoute from "@/components/ProtectedRoute";
import PackageScheduleDetailsViewPage from "@/pages/content-management/packages-schedules/PackageScheduleDetailsViewPage";
import { PACKAGE_SCHEDULE_VIEW_DETAILS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PACKAGE_SCHEDULE_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: PACKAGE_SCHEDULE_VIEW_DETAILS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute
      requiredPrivileges={[PACKAGE_SCHEDULE_DETAILS_VIEW_PRIVILEGE]}
    >
      <PackageScheduleDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
