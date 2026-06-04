import ProtectedRoute from "@/components/ProtectedRoute";
import TourDetailsViewPage from "@/pages/content-management/tours/TourDetailsViewPage";
import { TOUR_DETAILS_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_DETAILS_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_DETAILS_VIEW_PRIVILEGE]}>
      <TourDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
