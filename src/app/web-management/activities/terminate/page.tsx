import ProtectedRoute from "@/components/ProtectedRoute";
import TerminateActivityPage from "@/pages/web-management/activities/TerminateActivityPage";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={["ACTIVITY_TERMINATE"]}>
      <TerminateActivityPage />
    </ProtectedRoute>
  );
};

export default page;
