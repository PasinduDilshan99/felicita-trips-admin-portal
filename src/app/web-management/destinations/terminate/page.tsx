import ProtectedRoute from "@/components/ProtectedRoute";
import TerminateDestinationPage from "@/pages/web-management/destinations/TerminateDestinationPage";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={["DESTINATION_TERMINATE"]}>
      <TerminateDestinationPage />
    </ProtectedRoute>
  );
};

export default page;
