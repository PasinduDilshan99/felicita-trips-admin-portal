import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateTourPage from "@/pages/content-management/tours/UpdateTourPage";
import { TOUR_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_UPDATE_PRIVILEGE]}>
      <UpdateTourPage />
    </ProtectedRoute>
  );
};

export default page;
