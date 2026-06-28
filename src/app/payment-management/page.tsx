import ProtectedRoute from "@/components/ProtectedRoute";
import ContentManagementPage from "@/pages/content-management/ContentManagementPage";
import PaymentManagementPage from "@/pages/payment-management/PaymentManagementPage";
import { CONTENT_MANAGEMENT_PAGE_TITLE } from "@/utils/pagesHeaderTitles";
import { PAYMENT_MANAGEMENT_PRIVILEGE } from "@/utils/privileges";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: CONTENT_MANAGEMENT_PAGE_TITLE,
};

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[PAYMENT_MANAGEMENT_PRIVILEGE]}>
      <PaymentManagementPage />
    </ProtectedRoute>
  );
};

export default page;
