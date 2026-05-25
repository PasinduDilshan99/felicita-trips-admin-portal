import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewTourSchedulePage from "@/pages/content-management/tours-schedules/AddNewTourSchedulePage";
import { VIEW_DESTINATION_DETAILS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { DESTINATION_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: VIEW_DESTINATION_DETAILS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_VIEW_PRIVILEGE]}>
      <AddNewTourSchedulePage />
    </ProtectedRoute>
  );
};

export default page;
