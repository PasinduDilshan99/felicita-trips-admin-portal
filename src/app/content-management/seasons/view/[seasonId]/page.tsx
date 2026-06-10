import ProtectedRoute from "@/components/ProtectedRoute";
import SeasonDetailsViewPage from "@/pages/content-management/seasons/SeasonDetailsViewPage";
import { SEASON_DETAILS_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { SEASON_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: SEASON_DETAILS_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[SEASON_DETAILS_VIEW_PRIVILEGE]}>
      <SeasonDetailsViewPage />
    </ProtectedRoute>
  );
};

export default page;
