import ProtectedRoute from "@/components/ProtectedRoute";
import TourTypeDetailsViewPage from "@/pages/web-management/tours/tour-types/TourTypeDetailsViewPage";
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
      <TourTypeDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
