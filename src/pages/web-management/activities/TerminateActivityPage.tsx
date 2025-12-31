// app/activities/terminate/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_ACTIVITIES_PATH,
} from "@/utils/constant";
import { ActivityService } from "@/services/activityService";
import {
  ActivityForTerminate,
  Activity,
} from "@/types/activity-types";
import {
  Search,
  MapPin,
  Tag,
  Clock,
  Users,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  Shield,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Globe,
  Calendar,
  DollarSign,
  Activity as ActivityIcon,
  Target,
  AlertOctagon,
  FileWarning,
  CalendarDays,
  Thermometer,
  BarChart3,
  Award,
} from "lucide-react";

const TerminateActivityPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialActivityName = searchParams?.get("activity-name") || "";
  const initialActivityId = searchParams?.get("activity-id") || "";

  // State for activities list
  const [activities, setActivities] = useState<ActivityForTerminate[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityForTerminate[]>([]);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState(initialActivityName);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // State for selected activity
  const [selectedActivity, setSelectedActivity] = useState<ActivityForTerminate | null>(
    initialActivityId && initialActivityName
      ? {
          activityId: parseInt(initialActivityId),
          activityName: initialActivityName,
        }
      : null
  );
  
  // State for activity details
  const [activityDetails, setActivityDetails] = useState<Activity | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingTerminate, setLoadingTerminate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedSchedules, setExpandedSchedules] = useState<number[]>([]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Activities",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}`,
    },
    {
      label: "Terminate",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/terminate`,
    },
  ];

  // Fetch activities list on initial load
  useEffect(() => {
    if (!selectedActivity) {
      fetchActivities();
    }
  }, []);

  // If initialActivityId is provided, fetch details
  useEffect(() => {
    if (initialActivityId && !activityDetails) {
      handleSelectActivity(parseInt(initialActivityId), initialActivityName);
    }
  }, [initialActivityId, initialActivityName]);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ActivityService.getActivitiesForTerminate();
      setActivities(response.data);
      setFilteredActivities(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  // Filter activities based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredActivities(activities);
      return;
    }

    const filtered = activities.filter((act) =>
      act.activityName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActivities(filtered);
    setShowDropdown(true);
  }, [searchTerm, activities]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  // Handle activity selection
  const handleSelectActivity = async (id: number, name: string) => {
    setSelectedActivity({ activityId: id, activityName: name });
    setSearchTerm(name);
    setShowDropdown(false);
    await fetchActivityDetails(id);
  };

  // Fetch activity details
  const fetchActivityDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setActivityDetails(null);
    try {
      const response = await ActivityService.getActivityById(id);
      setActivityDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load activity details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle terminate confirmation
  const handleTerminateClick = () => {
    if (!selectedActivity) return;
    setShowConfirmModal(true);
  };

  // Handle confirm termination
  const handleConfirmTerminate = async () => {
    if (!selectedActivity) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await ActivityService.terminateActivity(selectedActivity.activityId);
      
      setSuccess("Activity terminated successfully!");
      setShowConfirmModal(false);
      
      // Redirect to activities list after delay
      setTimeout(() => {
        router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/view`);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Failed to terminate activity");
    } finally {
      setLoadingTerminate(false);
    }
  };

  // Toggle schedule expansion
  const toggleSchedule = (scheduleId: number) => {
    setExpandedSchedules((prev) =>
      prev.includes(scheduleId)
        ? prev.filter((id) => id !== scheduleId)
        : [...prev, scheduleId]
    );
  };

  // Calculate stats
  const stats = activityDetails
    ? {
        totalSchedules: activityDetails.schedules.length,
        totalRequirements: activityDetails.requirements.length,
        totalImages: activityDetails.images.length,
        seasons: activityDetails.season.split(',').map(s => s.trim()),
      }
    : null;

  // Format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('adventure')) return <Target className="w-4 h-4" />;
    if (lowerCategory.includes('water')) return <ActivityIcon className="w-4 h-4" />;
    if (lowerCategory.includes('cultural')) return <Globe className="w-4 h-4" />;
    if (lowerCategory.includes('wildlife')) return <ActivityIcon className="w-4 h-4" />;
    return <ActivityIcon className="w-4 h-4" />;
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Breadcrumb */}
      <div className="top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Terminate Activity"
            description="Permanently remove an activity from the system"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Search className="w-6 h-6 text-blue-600" />
            Select Activity to Terminate
          </h2>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search activity by name..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-600">Loading activities...</p>
                  </div>
                ) : filteredActivities.length === 0 ? (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No activities found</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  filteredActivities.map((act) => (
                    <button
                      key={act.activityId}
                      onClick={() =>
                        handleSelectActivity(act.activityId, act.activityName)
                      }
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {act.activityName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: {act.activityId}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-full text-xs font-medium">
                            Select
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Click outside to close dropdown */}
            {showDropdown && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
            )}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800">
                  Operation Successful!
                </h3>
                <p className="text-green-600 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800">Error</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Activity Details Section */}
        {selectedActivity && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header with Warning */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200 p-6">
              <div className="flex items-center gap-4">
                <AlertOctagon className="w-8 h-8 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-red-800">
                    Activity Termination Review
                  </h2>
                  <p className="text-red-600 mt-1">
                    Review the activity details below before proceeding with termination.
                    This action is permanent and cannot be undone.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">Activity ID</div>
                  <div className="text-xl font-bold text-gray-900">
                    #{selectedActivity.activityId}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State for Details */}
            {loadingDetails ? (
              <div className="p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading activity details...</p>
              </div>
            ) : activityDetails ? (
              <div className="p-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Duration</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {activityDetails.duration_hours}h
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Schedules</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats?.totalSchedules || 0}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Local Price</div>
                    <div className="text-lg font-bold text-gray-900">
                      LKR {activityDetails.price_local.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Foreign Price</div>
                    <div className="text-lg font-bold text-gray-900">
                      LKR {activityDetails.price_foreigners.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div className={`text-lg font-bold ${
                      activityDetails.status === 'ACTIVE' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {activityDetails.status}
                    </div>
                  </div>
                </div>

                {/* Activity Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Basic Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Activity Name</div>
                          <div className="text-lg font-medium text-gray-900">
                            {activityDetails.name}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Description</div>
                          <div className="text-gray-700 mt-1">
                            {activityDetails.description}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Destination ID</div>
                            <div className="text-gray-700 mt-1 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {activityDetails.destination_id}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Category</div>
                            <div className="text-gray-700 mt-1 flex items-center gap-2">
                              {getCategoryIcon(activityDetails.activities_category)}
                              {activityDetails.activities_category}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Available Time</div>
                            <div className="text-gray-700 mt-1 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {formatTime(activityDetails.available_from)} - {formatTime(activityDetails.available_to)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Group Size</div>
                            <div className="text-gray-700 mt-1 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {activityDetails.min_participate} - {activityDetails.max_participate}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Seasons */}
                    <div className="bg-gradient-to-r from-gray-50 to-amber-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-amber-600" />
                        Best Seasons
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {stats?.seasons?.map((season, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-lg text-sm font-medium"
                          >
                            {season}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    {activityDetails.requirements.length > 0 && (
                      <div className="bg-gradient-to-r from-gray-50 to-rose-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-rose-600" />
                          Requirements ({activityDetails.requirements.length})
                        </h3>
                        <div className="space-y-3">
                          {activityDetails.requirements.map((req) => (
                            <div
                              key={req.id}
                              className="p-3 bg-white rounded-lg border border-gray-200"
                              style={{ borderLeftColor: req.color, borderLeftWidth: '3px' }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">
                                  {req.name}
                                </span>
                                <span 
                                  className="px-2 py-1 rounded text-xs font-medium"
                                  style={{ 
                                    backgroundColor: `${req.color}20`,
                                    color: req.color
                                  }}
                                >
                                  {req.value}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {req.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Schedules & Images */}
                  <div className="space-y-6">
                    {/* Schedules */}
                    <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-purple-600" />
                          Schedules ({activityDetails.schedules.length})
                        </h3>
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 rounded-full text-xs font-medium">
                          All will be terminated
                        </span>
                      </div>

                      <div className="space-y-4">
                        {activityDetails.schedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => toggleSchedule(schedule.id)}
                              className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 flex items-center justify-between transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                <span className="font-medium text-gray-900 text-left">
                                  {schedule.name}
                                </span>
                              </div>
                              {expandedSchedules.includes(schedule.id) ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>

                            {expandedSchedules.includes(schedule.id) && (
                              <div className="p-4 border-t border-gray-200 bg-white">
                                <p className="text-sm text-gray-600 mb-3">
                                  {schedule.description}
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-xs text-gray-500">Date Range</div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {schedule.assume_start_date} to {schedule.assume_end_date}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500">Duration Range</div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {schedule.duration_hours_start} - {schedule.duration_hours_end} hours
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500">Status</div>
                                    <div className={`text-sm font-medium ${
                                      schedule.status === 1 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {schedule.status === 1 ? 'Active' : 'Inactive'}
                                    </div>
                                  </div>
                                </div>
                                {schedule.special_note && (
                                  <div className="mt-3 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded">
                                    <div className="text-xs text-gray-500">Special Note</div>
                                    <div className="text-sm text-gray-700">
                                      {schedule.special_note}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Images Preview */}
                    {activityDetails.images.length > 0 && (
                      <div className="bg-gradient-to-r from-gray-50 to-rose-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-rose-600" />
                          Images ({activityDetails.images.length})
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {activityDetails.images.slice(0, 6).map((image) => (
                            <div key={image.id} className="aspect-square">
                              <img
                                src={image.image_url}
                                alt={image.name}
                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                                }}
                              />
                            </div>
                          ))}
                          {activityDetails.images.length > 6 && (
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                +{activityDetails.images.length - 6} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Impact Warning */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
                      <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                        <FileWarning className="w-5 h-5 text-red-600" />
                        Termination Impact
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-red-700">
                            All associated schedules will be permanently deleted
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-red-700">
                            All booking records for this activity will be affected
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-red-700">
                            This action cannot be undone. Recovery is not possible
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-red-700">
                            System will log this termination for audit purposes
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Termination Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleTerminateClick}
                    disabled={loadingTerminate}
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    {loadingTerminate ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Terminate Activity Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Activity details could not be loaded</p>
                <p className="text-gray-500 text-sm mt-2">
                  Please try selecting the activity again
                </p>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="p-8">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                    Confirm Termination
                  </h3>

                  {/* Message */}
                  <p className="text-gray-600 text-center mb-2">
                    Are you sure you want to permanently terminate
                  </p>
                  <p className="text-lg font-semibold text-red-600 text-center mb-6">
                    {selectedActivity?.activityName}?
                  </p>

                  {/* Warning Details */}
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-lg mb-6">
                    <div className="text-sm text-red-700 space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <span>This will delete:</span>
                      </p>
                      <ul className="list-disc list-inside ml-6 space-y-1">
                        <li>{activityDetails?.schedules.length || 0} schedule(s)</li>
                        <li>{activityDetails?.requirements.length || 0} requirement(s)</li>
                        <li>{activityDetails?.images.length || 0} image(s)</li>
                      </ul>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 font-medium"
                      disabled={loadingTerminate}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmTerminate}
                      disabled={loadingTerminate}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loadingTerminate ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Terminating...
                        </>
                      ) : (
                        "Confirm Termination"
                      )}
                    </button>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-xs text-gray-500 text-center mt-6">
                    By confirming, you acknowledge that all associated data will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TerminateActivityPage;