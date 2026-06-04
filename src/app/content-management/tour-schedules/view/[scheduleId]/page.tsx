import ProtectedRoute from "@/components/ProtectedRoute";
import TourScheduleDetailsViewPage from "@/pages/content-management/tours-schedules/TourScheduleDetailsViewPage";
import { TOUR_SCHEDULE_VIEW_DETAILS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_SCHEDULE_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_SCHEDULE_VIEW_DETAILS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_SCHEDULE_DETAILS_VIEW_PRIVILEGE]}>
      <TourScheduleDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
