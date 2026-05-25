import ProtectedRoute from "@/components/ProtectedRoute";
import TerminateActivityCategoryPage from "@/pages/web-management/activities/activity-caetgories/TerminateActivityCategoryPage";
import TerminateActivityPage from "@/pages/web-management/activities/TerminateActivityPage";
import { ACTIVITY_TERMINATE_PRIVILEGE } from "@/utils/privileges";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_TERMINATE_PRIVILEGE]}>
      <TerminateActivityCategoryPage />
    </ProtectedRoute>
  );
};

export default page;
