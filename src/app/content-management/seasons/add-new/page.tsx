import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewSeasonPage from "@/pages/content-management/seasons/AddNewSeasonPage";
import { SEASON_CREATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { SEASON_CREATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: SEASON_CREATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[SEASON_CREATE_PRIVILEGE]}>
      <AddNewSeasonPage />
    </ProtectedRoute>
  );
};

export default page;
