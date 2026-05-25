import ProtectedRoute from "@/components/ProtectedRoute";
import PackageScheduleDetailsViewPage from "@/pages/web-management/packages-schedules/PackageScheduleDetailsViewPage";
import UpdatePackageSchedulePage from "@/pages/web-management/packages-schedules/UpdatePackageSchedulePage";
import UpdateTourSchedulePage from "@/pages/web-management/tours-schedules/UpdateTourSchedulePage";
import { VIEW_DESTINATION_DETAILS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: VIEW_DESTINATION_DETAILS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_VIEW_PRIVILEGE]}>
      <UpdateTourSchedulePage />
    </ProtectedRoute>
  );
};

export default page;
