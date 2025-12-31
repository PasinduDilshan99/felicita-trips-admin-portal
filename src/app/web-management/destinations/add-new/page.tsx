import ProtectedRoute from "@/components/ProtectedRoute";
import AddNewDestinationPage from "@/pages/web-management/destinations/AddNewDestinationPage";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={["DESTINATION_CREATE"]}>
      <AddNewDestinationPage />
    </ProtectedRoute>
  );
};

export default page;
