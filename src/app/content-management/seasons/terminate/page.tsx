import ProtectedRoute from "@/components/ProtectedRoute";
import TerminateSeasonPage from "@/pages/content-management/seasons/TerminateSeasonPage";
import { SEASON_TERMINATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { SEASON_TERMINATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: SEASON_TERMINATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[SEASON_TERMINATE_PRIVILEGE]}>
      <TerminateSeasonPage />
    </ProtectedRoute>
  );
};

export default page;
