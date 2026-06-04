import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateTourTypePage from "@/pages/content-management/tours/tour-types/UpdateTourTypePage";
import { TOUR_TYPE_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_TYPE_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_TYPE_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_TYPE_UPDATE_PRIVILEGE]}>
      <UpdateTourTypePage />
    </ProtectedRoute>
  );
};

export default page;
