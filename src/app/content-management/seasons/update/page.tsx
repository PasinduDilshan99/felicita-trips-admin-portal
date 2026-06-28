import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateSeasonPage from "@/pages/content-management/seasons/UpdateSeasonPage";
import { SEASON_UPDATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { SEASON_UPDATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: SEASON_UPDATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[SEASON_UPDATE_PRIVILEGE]}>
      <UpdateSeasonPage />
    </ProtectedRoute>
  );
};

export default page;
