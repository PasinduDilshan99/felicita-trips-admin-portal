import ProtectedRoute from "@/components/ProtectedRoute";
import ViewTourSchedulePage from "@/pages/content-management/tours-schedules/ViewTourSchedulePage";
import { TOUR_SCHEDULE_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_SCHEDULE_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_SCHEDULE_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_SCHEDULE_VIEW_PRIVILEGE]}>
      <ViewTourSchedulePage />
    </ProtectedRoute>
  );
};

export default page;
