// app/travel-management/page.tsx
import React from 'react';

export default function TravelManagementPage() {
  return (
    <div className='w-full'>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Travel Management</h1>
        <p className="text-gray-600 mt-2">
          Manage all travel requests, bookings, expenses, and reports in one place.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Trips</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-500 mt-2">Currently traveling</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Approval</h3>
          <p className="text-3xl font-bold text-amber-600">8</p>
          <p className="text-sm text-gray-500 mt-2">Awaiting review</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Budget</h3>
          <p className="text-3xl font-bold text-green-600">$24,580</p>
          <p className="text-sm text-gray-500 mt-2">Of $30,000 allocated</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Savings</h3>
          <p className="text-3xl font-bold text-purple-600">$3,240</p>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
        <div className="space-y-4">
          {/* Add your recent activities content here */}
          <p className="text-gray-500 text-center py-8">
            Recent travel activities will appear here...
          </p>
        </div>
      </div>
    </div>
  );
}