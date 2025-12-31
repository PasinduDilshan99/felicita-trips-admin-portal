import ProtectedRoute from '@/components/ProtectedRoute';
import ActivitiesViewPage from '@/pages/web-management/activities/ActivitiesViewPage';
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={["DESTINATION_VIEW"]}>
      <ActivitiesViewPage />
    </ProtectedRoute>
  );
}

export default page
