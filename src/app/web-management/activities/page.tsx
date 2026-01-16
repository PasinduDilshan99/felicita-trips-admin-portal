import ProtectedRoute from "@/components/ProtectedRoute";
import ActivitiesPage from "@/pages/web-management/activities/ActivitiesPage";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={["ACTIVITY_VIEW"]}>
      <ActivitiesPage />
    </ProtectedRoute>
  );
};

export default page;
