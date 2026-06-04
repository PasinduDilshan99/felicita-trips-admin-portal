import ProtectedRoute from "@/components/ProtectedRoute";
import { TOUR_TYPES_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_TYPE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";
import TourTypesPage from "@/pages/content-management/tours/tour-types/TourTypesPage";

export const metadata: Metadata = {
  title: TOUR_TYPES_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_TYPE_PRIVILEGE]}>
      <TourTypesPage />
    </ProtectedRoute>
  );
};

export default page;
