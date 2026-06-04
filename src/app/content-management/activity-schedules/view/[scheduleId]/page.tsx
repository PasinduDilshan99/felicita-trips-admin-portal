import ProtectedRoute from "@/components/ProtectedRoute";
import ActivityScheduleDetailsViewPage from "@/pages/content-management/activities-schedules/ActivityScheduleDetailsViewPage";
import { ACTIVITY_SCHEDULE_VIEW_DETAILS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_SCHEDULE_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_SCHEDULE_VIEW_DETAILS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute
      requiredPrivileges={[ACTIVITY_SCHEDULE_DETAILS_VIEW_PRIVILEGE]}
    >
      <ActivityScheduleDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
