import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateActivitySchedulePage from "@/pages/content-management/activities-schedules/UpdateActivitySchedulePage";
import { ACTIVITY_SCHEDULE_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_SCHEDULE_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_SCHEDULE_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_SCHEDULE_UPDATE_PRIVILEGE]}>
      <UpdateActivitySchedulePage />
    </ProtectedRoute>
  );
};

export default page;
