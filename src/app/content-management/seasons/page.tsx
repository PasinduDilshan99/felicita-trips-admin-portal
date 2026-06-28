import ProtectedRoute from "@/components/ProtectedRoute";
import SeasonsPage from "@/pages/content-management/seasons/SeasonsPage";
import { SEASON_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { SEASON_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: SEASON_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[SEASON_PRIVILEGE]}>
      <SeasonsPage />
    </ProtectedRoute>
  );
};

export default page;
