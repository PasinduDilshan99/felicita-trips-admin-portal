import ProtectedRoute from '@/components/ProtectedRoute';
import ActivitiesViewPage from '@/pages/web-management/activities/ActivitiesViewPage';
import { ACTIVITY_VIEW_PRIVILEGE } from '@/utils/privileges';
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute requiredPrivileges={[ACTIVITY_VIEW_PRIVILEGE]}>
      <ActivitiesViewPage />
    </ProtectedRoute>
  );
}

export default page
