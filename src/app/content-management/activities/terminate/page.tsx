import ProtectedRoute from "@/components/ProtectedRoute";
import TerminateActivityPage from "@/pages/content-management/activities/TerminateActivityPage";
import { ACTIVITY_TERMINATE_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_TERMINATE_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_TERMINATE_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_TERMINATE_PRIVILEGE]}>
      <TerminateActivityPage />
    </ProtectedRoute>
  );
};

export default page;
