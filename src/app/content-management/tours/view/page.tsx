import ProtectedRoute from "@/components/ProtectedRoute";
import ToursViewPage from "@/pages/content-management/tours/TourViewPage";
import { TOUR_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_VIEW_PRIVILEGE]}>
      <ToursViewPage />
    </ProtectedRoute>
  );
};

export default page;
