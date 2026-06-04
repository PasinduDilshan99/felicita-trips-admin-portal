import ProtectedRoute from "@/components/ProtectedRoute";
import ToursSchedulesPage from "@/pages/content-management/tours-schedules/ToursSchedulesPage";
import { TOUR_SCHEDULE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_SCHEDULE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_SCHEDULE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_SCHEDULE_PRIVILEGE]}>
      <ToursSchedulesPage />
    </ProtectedRoute>
  );
};

export default page;
