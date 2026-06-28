import ProtectedRoute from "@/components/ProtectedRoute";
import SeasonViewPage from "@/pages/content-management/seasons/SeasonViewPage";
import { SEASON_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { SEASON_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: SEASON_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[SEASON_VIEW_PRIVILEGE]}>
      <SeasonViewPage />
    </ProtectedRoute>
  );
};

export default page;
