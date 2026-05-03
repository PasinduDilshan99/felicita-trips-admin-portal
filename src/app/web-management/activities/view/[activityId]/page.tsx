// app/activities/view/[activityId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_ACTIVITIES_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { ActivityService } from "@/services/activityService";
import { Activity, ActivityCategoryDetail } from "@/types/activity-types";
import {
  MapPin,
  Tag,
  Clock,
  Users,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Globe,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Share2,
  Bookmark,
  Phone,
  Mail,
  ArrowLeft,
  Target,
  AlertCircle,
  BarChart3,
  CalendarDays,
  UserCheck,
  Award,
  Thermometer,
  Zap,
  Mountain,
  Waves,
  Castle,
  Trees,
  Package,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const ActivityDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const activityId = parseInt(params?.activityId as string);

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);

  useEffect(() => {
    if (activityId) {
      fetchActivity();
    }
  }, [activityId]);

  const fetchActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching activity with ID:', activityId);
      const response = await ActivityService.getActivityById(activityId);
      console.log('Full API Response:', response);
      
      if (response && response.data) {
        setActivity(response.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error("Error fetching activity:", err);
      setError("Failed to load activity details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Activities",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}`,
    },
    {
      label: "View",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/view`,
    },
    {
      label: activity?.name || "Details",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/${activityId}`,
    },
  ];

  const handlePrevImage = () => {
    if (!activity) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? activity.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    if (!activity) return;
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % activity.images.length
    );
  };

  const handleBack = () => {
    router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/view`);
  };

  const handleEdit = () => {
    router.push(
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/${activityId}/edit`
    );
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        await ActivityService.terminateActivity(activityId);
        router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/view`);
      } catch (error) {
        console.error("Error deleting activity:", error);
        alert("Failed to delete activity. Please try again.");
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activity?.name,
        text: activity?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Calculate availability status
  const isAvailableToday = () => {
    if (!activity) return false;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [fromHour, fromMin] = activity.available_from.split(':').map(Number);
    const [toHour, toMin] = activity.available_to.split(':').map(Number);
    const startMinutes = fromHour * 60 + fromMin;
    const endMinutes = toHour * 60 + toMin;
    
    return currentTime >= startMinutes && currentTime <= endMinutes;
  };

  // Get primary category
  const getPrimaryCategory = (): ActivityCategoryDetail | null => {
    if (!activity?.categories) return null;
    return activity.categories.find(cat => cat.is_primary) || activity.categories[0] || null;
  };

  // Get icon based on category
  const getCategoryIcon = (categoryName: string) => {
    const lowerCategory = categoryName.toLowerCase();
    if (lowerCategory.includes('adventure') || lowerCategory.includes('hiking')) {
      return <Mountain className="w-5 h-5" />;
    }
    if (lowerCategory.includes('water') || lowerCategory.includes('swim')) {
      return <Waves className="w-5 h-5" />;
    }
    if (lowerCategory.includes('cultural') || lowerCategory.includes('historical')) {
      return <Castle className="w-5 h-5" />;
    }
    if (lowerCategory.includes('wildlife') || lowerCategory.includes('nature')) {
      return <Trees className="w-5 h-5" />;
    }
    return <Target className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading activity details...</p>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || "Activity not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The activity you're looking for doesn't exist or couldn't be loaded.
          </p>
          <button
            onClick={handleBack}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back to Activities
          </button>
        </div>
      </div>
    );
  }

  const primaryCategory = getPrimaryCategory();
  const currentImage = activity.images[currentImageIndex];
  const totalSchedules = activity.schedules.length;
  const totalRequirements = activity.requirements.length;
  const totalImages = activity.images.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Breadcrumb */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={activity.name}
            description={`Activity ID: ${activity.id}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Activities
          </button>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg border border-green-100 hover:border-green-300 transition-all duration-200"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-100 hover:border-blue-300 transition-all duration-200"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-lg border border-red-100 hover:border-red-300 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="relative h-96">
                <img
                  src={currentImage?.image_url || "/images/placeholder.jpg"}
                  alt={activity.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
                
                {/* Navigation Arrows */}
                {activity.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4">
                  <span className="px-4 py-2 bg-black/60 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {activity.images.length}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      activity.status === "ACTIVE"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                        : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
                    }`}
                  >
                    {activity.status === "ACTIVE" ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        Inactive
                      </>
                    )}
                  </span>
                  
                  {activity.status === "ACTIVE" && isAvailableToday() && (
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                      <Zap className="w-4 h-4" />
                      Available Now
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {activity.images.length > 1 && (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {activity.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className="flex-shrink-0"
                      >
                        <img
                          src={image.image_url}
                          alt={image.name}
                          className={`w-20 h-20 rounded-lg object-cover border-2 transition-all duration-200 ${
                            currentImageIndex === index
                              ? "border-blue-500 scale-105"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/placeholder.jpg";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Activity Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-600" />
                Activity Overview
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {activity.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-emerald-600" />
                      Category Information
                    </h3>
                    <div className="space-y-3">
                      {activity.categories.map((category) => (
                        <div key={category.id} className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            {getCategoryIcon(category.name)}
                            <span className="font-medium text-gray-800">{category.name}</span>
                            {category.is_primary && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{category.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      Timing & Availability
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Available:</span> {activity.available_from} - {activity.available_to}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Duration:</span> {activity.duration_hours} hours
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Destination:</span> {activity.destinationName}
                      </p>
                      {activity.seasonName && (
                        <p className="text-gray-600">
                          <span className="font-medium">Season:</span> {activity.seasonName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedules Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <CalendarDays className="w-6 h-6 text-purple-600" />
                  Available Schedules ({totalSchedules})
                </h2>
                <span className="px-4 py-2 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-full text-sm font-medium">
                  {totalSchedules} schedules
                </span>
              </div>

              <div className="space-y-6">
                {activity.schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      selectedSchedule === schedule.id
                        ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setSelectedSchedule(
                        selectedSchedule === schedule.id ? null : schedule.id
                      )
                    }
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {schedule.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {schedule.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs font-medium">
                            {schedule.assume_start_date} to {schedule.assume_end_date}
                          </span>
                          <span className="px-3 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-full text-xs font-medium">
                            {schedule.duration_hours_start} - {schedule.duration_hours_end} hours
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            schedule.status === 1 
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700'
                              : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700'
                          }`}>
                            {schedule.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedSchedule === schedule.id && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">
                              Special Notes
                            </h4>
                            <p className="text-gray-600 text-sm bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-4 rounded-lg border border-amber-100">
                              {schedule.special_note}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                Date Range
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {schedule.assume_start_date} to {schedule.assume_end_date}
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-600" />
                                Duration Range
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {schedule.duration_hours_start} - {schedule.duration_hours_end} hours
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-600" />
                                Schedule Status
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {schedule.status === 1 ? 'Active - Available for booking' : 'Inactive - Not available'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements Section */}
            {activity.requirements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    Requirements ({totalRequirements})
                  </h2>
                  <span className="px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-full text-sm font-medium">
                    {totalRequirements} requirements
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activity.requirements.map((requirement) => (
                    <div
                      key={requirement.id}
                      className="p-6 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-200 bg-gradient-to-br from-gray-50 to-white"
                      style={{ borderLeftColor: requirement.color, borderLeftWidth: '4px' }}
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${requirement.color}20` }}
                        >
                          <UserCheck className="w-5 h-5" style={{ color: requirement.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {requirement.name}
                            </h3>
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: `${requirement.color}20`,
                                color: requirement.color
                              }}
                            >
                              {requirement.value}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {requirement.description}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: requirement.color }}
                            />
                            <span className="text-xs text-gray-500">
                              Status: {requirement.status === 1 ? 'Required' : 'Optional'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Quick Info */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Quick Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-bold text-gray-900">{activity.duration_hours}h</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <span className="text-gray-600">Group Size</span>
                  <span className="font-bold text-gray-900">{activity.min_participate}-{activity.max_participate}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                  <span className="text-gray-600">Destination</span>
                  <span className="font-bold text-gray-900">{activity.destinationName}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                  <span className="text-gray-600">Total Schedules</span>
                  <span className="font-bold text-gray-900">{totalSchedules}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span className="text-gray-600">Total Images</span>
                  <span className="font-bold text-gray-900">{totalImages}</span>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Pricing Information
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Local Price</span>
                    <span className="text-lg font-bold text-green-700">
                      LKR {activity.price_local.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Price for local residents and citizens
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Foreign Price</span>
                    <span className="text-lg font-bold text-blue-700">
                      LKR {activity.price_foreigners.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Price for international tourists
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Group Size</div>
                    <div className="text-2xl font-bold text-amber-700">
                      {activity.min_participate} - {activity.max_participate}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Minimum to maximum participants
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Highlights */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Activity Highlights
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-medium text-gray-700">Duration</span>
                    <p className="text-sm text-gray-500">{activity.duration_hours} hours</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50/50 to-violet-50/50 rounded-lg">
                  <Package className="w-5 h-5 text-purple-600" />
                  <div>
                    <span className="font-medium text-gray-700">Categories</span>
                    <p className="text-sm text-gray-500">{activity.categories.map(c => c.name).join(', ')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-medium text-gray-700">Group Friendly</span>
                    <p className="text-sm text-gray-500">Suitable for groups of {activity.min_participate}-{activity.max_participate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-rose-50/50 to-pink-50/50 rounded-lg">
                  <Shield className="w-5 h-5 text-rose-600" />
                  <div>
                    <span className="font-medium text-gray-700">Safety</span>
                    <p className="text-sm text-gray-500">{totalRequirements} requirements specified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.open(`tel:+94123456789`)}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg border border-green-100 hover:border-green-300 transition-all duration-200"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Book Now</span>
                </button>
                
                <button
                  onClick={() => window.open(`mailto:support@example.com`)}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-100 hover:border-blue-300 transition-all duration-200"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Send Inquiry</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-lg border border-purple-100 hover:border-purple-300 transition-all duration-200"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Share Activity</span>
                </button>

                <button
                  onClick={() => router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/${activity.destination_id}`)}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg border border-amber-100 hover:border-amber-300 transition-all duration-200"
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">View Destination</span>
                </button>
              </div>
            </div>

            {/* Image Gallery Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-rose-600" />
                Image Gallery ({totalImages})
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {activity.images.slice(0, 6).map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className="aspect-square"
                  >
                    <img
                      src={image.image_url}
                      alt={image.name}
                      className="w-full h-full object-cover rounded-lg border-2 hover:border-blue-500 transition-all duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                      }}
                    />
                  </button>
                ))}
                {activity.images.length > 6 && (
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      +{activity.images.length - 6} more
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                Activity Metadata
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Created At</span>
                  <span className="font-medium text-gray-700">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Updated At</span>
                  <span className="font-medium text-gray-700">
                    {new Date(activity.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Activity ID</span>
                  <span className="font-medium text-gray-700">{activity.id}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Destination ID</span>
                  <span className="font-medium text-gray-700">{activity.destination_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailsPage;