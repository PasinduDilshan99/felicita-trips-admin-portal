import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateTourPage from "@/pages/web-management/tours/UpdateTourPage";
import { ACTIVITY_VIEW_PRIVILEGE } from "@/utils/privileges";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_VIEW_PRIVILEGE]}>
      <UpdateTourPage />
    </ProtectedRoute>
  );
};

export default page;
