import ProtectedRoute from "@/components/ProtectedRoute";
import ToursPage from "@/pages/content-management/tours/ToursPage";
import { TOUR_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_PRIVILEGE]}>
      <ToursPage />
    </ProtectedRoute>
  );
};

export default page;
