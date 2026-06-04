import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewTourTypePage from "@/pages/content-management/tours/tour-types/AddNewTourTypePage";
import { TOUR_TYPE_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_TYPE_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_TYPE_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_TYPE_CREATE_PRIVILEGE]}>
      <AddNewTourTypePage />
    </ProtectedRoute>
  );
};

export default page;
