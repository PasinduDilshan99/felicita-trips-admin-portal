import ProtectedRoute from "@/components/ProtectedRoute";
import ViewBillingDetailsPage from "@/pages/payment-management/billings/ViewBillingDetailsPage";
import { ACTIVITY_DETAILS_VIEW_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { ACTIVITY_DETAILS_VIEW_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: ACTIVITY_DETAILS_VIEW_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_DETAILS_VIEW_PRIVILEGE]}>
      <ViewBillingDetailsPage />
    </ProtectedRoute>
  );
};

export default page;
