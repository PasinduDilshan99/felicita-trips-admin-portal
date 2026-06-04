import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateTourSchedulePage from "@/pages/content-management/tours-schedules/UpdateTourSchedulePage";
import { TOUR_SCHEDULE_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_SCHEDULE_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_SCHEDULE_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_SCHEDULE_UPDATE_PRIVILEGE]}>
      <UpdateTourSchedulePage />
    </ProtectedRoute>
  );
};

export default page;
