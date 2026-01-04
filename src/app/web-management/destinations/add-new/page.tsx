import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewDestinationPage from "@/pages/web-management/destinations/AddNewDestinationPage";
import { DESTINATION_CREATE_PRIVILEGE } from "@/utils/privileges";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[DESTINATION_CREATE_PRIVILEGE]}>
      <AddNewDestinationPage />
    </ProtectedRoute>
  );
};

export default page;
