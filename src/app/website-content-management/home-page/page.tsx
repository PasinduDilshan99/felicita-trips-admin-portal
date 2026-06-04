import ProtectedRoute from "@/components/ProtectedRoute";
import HomePage from "@/pages/web-page-management/HomePage";
import { HOME_PAGE_MANAGEMENT_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { HOME_PAGE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: HOME_PAGE_MANAGEMENT_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[HOME_PAGE_PRIVILEGE]}>
      <HomePage />
    </ProtectedRoute>
  );
};

export default page;
