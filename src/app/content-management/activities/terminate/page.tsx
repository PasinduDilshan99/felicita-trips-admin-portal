import ProtectedRoute from "@/components/ProtectedRoute";
import TerminateActivityPage from "@/pages/content-management/activities/TerminateActivityPage";
import { ACTIVITY_TERMINATE_PRIVILEGE } from "@/utils/privileges";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_TERMINATE_PRIVILEGE]}>
      <TerminateActivityPage />
    </ProtectedRoute>
  );
};

export default page;
