import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewActivitySchedulePage from "@/pages/content-management/activities-schedules/AddNewActivitySchedulePage";
import { ACTIVITY_SCHEDULE_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_SCHEDULE_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_SCHEDULE_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_SCHEDULE_CREATE_PRIVILEGE]}>
      <AddNewActivitySchedulePage />
    </ProtectedRoute>
  );
};

export default page;
