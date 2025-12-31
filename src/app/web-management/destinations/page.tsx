import ProtectedRoute from "@/components/ProtectedRoute";
import DestinationPage from "@/pages/web-management/destinations/DestinationPage";
import React from "react";

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={["DESTINATION_VIEW"]}>
      <DestinationPage />
    </ProtectedRoute>
  );
};

export default page;
