import ProtectedRoute from "@/components/ProtectedRoute";
import ViewTourTypePage from "@/pages/content-management/tours/tour-types/ViewTourTypePage";
import { TOUR_TYPES_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_TYPE_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_TYPES_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_TYPE_VIEW_PRIVILEGE]}>
      <ViewTourTypePage />
    </ProtectedRoute>
  );
};

export default page;
