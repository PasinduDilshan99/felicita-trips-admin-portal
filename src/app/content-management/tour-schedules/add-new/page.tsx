import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewTourSchedulePage from "@/pages/content-management/tours-schedules/AddNewTourSchedulePage";
import { TOUR_SCHEDULE_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_SCHEDULE_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_SCHEDULE_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_SCHEDULE_CREATE_PRIVILEGE]}>
      <AddNewTourSchedulePage />
    </ProtectedRoute>
  );
};

export default page;
