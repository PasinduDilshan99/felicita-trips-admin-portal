import ProtectedRoute from "@/components/ProtectedRoute";
import TerminateDestinationPage from "@/pages/web-management/destinations/TerminateDestinationPage";
import { DESTINATION_TERMINATE_PRIVILEGE } from "@/utils/privileges";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_TERMINATE_PRIVILEGE]}>
      <TerminateDestinationPage />
    </ProtectedRoute>
  );
};

export default page;
