import ProtectedRoute from "@/components/ProtectedRoute";
import TourTypeDetailsViewPage from "@/pages/content-management/tours/tour-types/TourTypeDetailsViewPage";
import { TOUR_TYPE_VIEW_DETAILS_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_TYPE_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_TYPE_VIEW_DETAILS_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_TYPE_DETAILS_VIEW_PRIVILEGE]}>
      <TourTypeDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
