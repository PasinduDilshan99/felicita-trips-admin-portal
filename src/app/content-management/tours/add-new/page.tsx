import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewTourPage from "@/pages/content-management/tours/AddNewTourPage";
import { TOUR_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { TOUR_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: TOUR_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[TOUR_CREATE_PRIVILEGE]}>
      <AddNewTourPage />
    </ProtectedRoute>
  );
};

export default page;
