import ProtectedRoute from "@/components/ProtectedRoute";
import ActivitiesSchedulePage from "@/pages/content-management/activities-schedules/ActivitiesSchedulePage";
import { ACTIVITY_SCHEDULE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_SCHEDULE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_SCHEDULE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_SCHEDULE_PRIVILEGE]}>
      <ActivitiesSchedulePage />
    </ProtectedRoute>
  );
};

export default page;
