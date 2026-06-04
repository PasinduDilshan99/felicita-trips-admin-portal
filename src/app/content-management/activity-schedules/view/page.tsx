import ProtectedRoute from "@/components/ProtectedRoute";
import ViewActivitySchedulePage from "@/pages/content-management/activities-schedules/ViewActivitySchedulePage";
import { ACTIVITY_SCHEDULE_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_SCHEDULE_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_SCHEDULE_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_SCHEDULE_VIEW_PRIVILEGE]}>
      <ViewActivitySchedulePage />
    </ProtectedRoute>
  );
};

export default page;
