import ProtectedRoute from "@/components/ProtectedRoute";
import TrendingDestinationsChangePage from "@/pages/web-page-management/TrendingDestinationsChangePage";
import { HOME_PAGE_TRENDING_DESTINATION_MANAGEMENT_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { HOME_TRENDING_DESTINATIONS_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: HOME_PAGE_TRENDING_DESTINATION_MANAGEMENT_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[HOME_TRENDING_DESTINATIONS_PRIVILEGE]}>
      <TrendingDestinationsChangePage />
    </ProtectedRoute>
  );
};

export default page;
