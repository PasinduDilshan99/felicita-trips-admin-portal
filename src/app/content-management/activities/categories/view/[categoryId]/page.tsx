import ProtectedRoute from "@/components/ProtectedRoute";
import ActivitiesViewPage from "@/pages/content-management/activities/ActivitiesViewPage";
import ActivityCategoryDetailsPage from "@/pages/content-management/activities/activity-caetgories/ActivityCategoryDetailsPage";
import { ACTIVITY_VIEW_PRIVILEGE } from "@/utils/privileges";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_VIEW_PRIVILEGE]}>
      <ActivityCategoryDetailsPage />
    </ProtectedRoute>
  );
};

export default page;
