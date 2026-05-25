import ProtectedRoute from "@/components/ProtectedRoute";
import ActivityDetailsPage from "@/pages/content-management/activities/ActivityDetailsPage";
import DestinationDetailsPage from "@/pages/content-management/destinations/DestinationDetailsPage";
import TourDetailsViewPage from "@/pages/content-management/tours/TourDetailsViewPage";
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
      <TourDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
