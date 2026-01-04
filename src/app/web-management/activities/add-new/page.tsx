import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewActivityPage from "@/pages/web-management/activities/AddNewActivityPage";
import { ACTIVITY_CREATE_PRIVILEGE } from "@/utils/privileges";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_CREATE_PRIVILEGE]}>
      <AddNewActivityPage />
    </ProtectedRoute>
  );
};

export default page;
