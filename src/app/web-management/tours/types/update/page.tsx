import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateTourTypePage from "@/pages/web-management/tours/tour-types/UpdateTourTypePage";
import { ACTIVITY_CATEGORY_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_CATEGORY_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_CATEGORY_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_CATEGORY_PRIVILEGE]}>
      <UpdateTourTypePage />
    </ProtectedRoute>
  );
};

export default page;
