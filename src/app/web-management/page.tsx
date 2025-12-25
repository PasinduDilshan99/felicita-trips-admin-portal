import ProtectedRoute from "@/components/ProtectedRoute";
import WebManagementPage from "@/pages/web-management/WebManagementPage";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={["WEB_MANAGEMENT"]}>
      <WebManagementPage />
    </ProtectedRoute>
  );
};

export default page;
