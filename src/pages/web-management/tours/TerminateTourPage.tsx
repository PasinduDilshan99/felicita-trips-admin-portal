// app/tours/terminate/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_TOURS_PATH,
} from "@/utils/constant";
import { TourService } from "@/services/tourService";
import {
  TourForTerminate,
  Tour,
} from "@/types/tour-types";
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
  Compass,
  Route,
  CalendarDays,
  Thermometer,
  Briefcase,
  Award,
  Navigation,
  FileWarning,
  AlertOctagon,
} from "lucide-react";

const TerminateTourPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTourName = searchParams?.get("tour-name") || "";
  const initialTourId = searchParams?.get("tour-id") || "";

  // State for tours list
  const [tours, setTours] = useState<TourForTerminate[]>([]);
  const [filteredTours, setFilteredTours] = useState<TourForTerminate[]>([]);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState(initialTourName);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // State for selected tour
  const [selectedTour, setSelectedTour] = useState<TourForTerminate | null>(
    initialTourId && initialTourName
      ? {
          tourId: parseInt(initialTourId),
          tourName: initialTourName,
        }
      : null
  );
  
  // State for tour details
  const [tourDetails, setTourDetails] = useState<Tour | null>(null);
  
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
      label: "Tours",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}`,
    },
    {
      label: "Terminate",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/terminate`,
    },
  ];

  // Fetch tours list on initial load
  useEffect(() => {
    if (!selectedTour) {
      fetchTours();
    }
  }, []);

  // If initialTourId is provided, fetch details
  useEffect(() => {
    if (initialTourId && !tourDetails) {
      handleSelectTour(parseInt(initialTourId), initialTourName);
    }
  }, [initialTourId, initialTourName]);

  const fetchTours = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TourService.getToursForTerminate();
      setTours(response.data);
      setFilteredTours(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load tours");
    } finally {
      setLoading(false);
    }
  };

  // Filter tours based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTours(tours);
      return;
    }

    const filtered = tours.filter((tour) =>
      tour.tourName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTours(filtered);
    setShowDropdown(true);
  }, [searchTerm, tours]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  // Handle tour selection
  const handleSelectTour = async (id: number, name: string) => {
    setSelectedTour({ tourId: id, tourName: name });
    setSearchTerm(name);
    setShowDropdown(false);
    await fetchTourDetails(id);
  };

  // Fetch tour details
  const fetchTourDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setTourDetails(null);
    try {
      const response = await TourService.getTourById(id);
      setTourDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load tour details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle terminate confirmation
  const handleTerminateClick = () => {
    if (!selectedTour) return;
    setShowConfirmModal(true);
  };

  // Handle confirm termination
  const handleConfirmTerminate = async () => {
    if (!selectedTour) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await TourService.terminateTour(selectedTour.tourId);
      
      setSuccess("Tour terminated successfully!");
      setShowConfirmModal(false);
      
      // Redirect to tours list after delay
      setTimeout(() => {
        router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/view`);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Failed to terminate tour");
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
  const stats = tourDetails
    ? {
        totalSchedules: tourDetails.schedules.length,
        totalImages: tourDetails.images.length,
        upcomingSchedules: TourService.getScheduleCountForNextMonths(tourDetails, 3),
        scheduleDurationRange: {
          min: Math.min(...tourDetails.schedules.map(s => s.durationStart)),
          max: Math.max(...tourDetails.schedules.map(s => s.durationEnd))
        }
      }
    : null;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get tour type icon
  const getTourTypeIcon = (tourType: string) => {
    const lowerType = tourType.toLowerCase();
    if (lowerType.includes('adventure')) return <Compass className="w-4 h-4" />;
    if (lowerType.includes('cultural')) return <Globe className="w-4 h-4" />;
    if (lowerType.includes('wildlife')) return <Tag className="w-4 h-4" />;
    if (lowerType.includes('beach')) return <ImageIcon className="w-4 h-4" />;
    return <Briefcase className="w-4 h-4" />;
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Breadcrumb */}
      <div className="top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Terminate Tour"
            description="Permanently remove a tour package from the system"
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
            Select Tour to Terminate
          </h2>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search tour by name..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-600">Loading tours...</p>
                  </div>
                ) : filteredTours.length === 0 ? (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No tours found</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  filteredTours.map((tour) => (
                    <button
                      key={tour.tourId}
                      onClick={() =>
                        handleSelectTour(tour.tourId, tour.tourName)
                      }
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {tour.tourName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: {tour.tourId}
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

        {/* Tour Details Section */}
        {selectedTour && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header with Warning */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200 p-6">
              <div className="flex items-center gap-4">
                <AlertOctagon className="w-8 h-8 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-red-800">
                    Tour Termination Review
                  </h2>
                  <p className="text-red-600 mt-1">
                    Review the tour details below before proceeding with termination.
                    This action is permanent and cannot be undone.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">Tour ID</div>
                  <div className="text-xl font-bold text-gray-900">
                    #{selectedTour.tourId}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State for Details */}
            {loadingDetails ? (
              <div className="p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading tour details...</p>
              </div>
            ) : tourDetails ? (
              <div className="p-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Duration</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {tourDetails.duration} days
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Schedules</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats?.totalSchedules || 0}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Upcoming</div>
                    <div className="text-lg font-bold text-gray-900">
                      {stats?.upcomingSchedules || 0} in 3 months
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Images</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats?.totalImages || 0}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div className={`text-lg font-bold ${
                      tourDetails.statusName === 'ACTIVE' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {tourDetails.statusName}
                    </div>
                  </div>
                </div>

                {/* Tour Information */}
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
                          <div className="text-sm text-gray-500">Tour Name</div>
                          <div className="text-lg font-medium text-gray-900">
                            {tourDetails.tourName}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Description</div>
                          <div className="text-gray-700 mt-1">
                            {tourDetails.tourDescription}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Tour Type</div>
                            <div className="text-gray-700 mt-1 flex items-center gap-2">
                              {getTourTypeIcon(tourDetails.tourTypeName)}
                              {tourDetails.tourTypeName}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Tour Category</div>
                            <div className="text-gray-700 mt-1 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              {tourDetails.tourCategoryName}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Season</div>
                            <div className="text-gray-700 mt-1 flex items-center gap-2">
                              <Thermometer className="w-4 h-4" />
                              {tourDetails.seasonName}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Duration</div>
                            <div className="text-gray-700 mt-1 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {tourDetails.duration} days
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Route Information */}
                    <div className="bg-gradient-to-r from-gray-50 to-green-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Route className="w-5 h-5 text-green-600" />
                        Route Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Navigation className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-500">Start Location</div>
                            <div className="text-gray-900 font-medium">
                              {tourDetails.startLocation}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-500">End Location</div>
                            <div className="text-gray-900 font-medium">
                              {tourDetails.endLocation}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Award className="w-4 h-4 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-500">Coordinates</div>
                            <div className="text-gray-900 text-sm">
                              {tourDetails.latitude.toFixed(6)}, {tourDetails.longitude.toFixed(6)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tour Categories */}
                    <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-purple-600" />
                        Category Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-500">Tour Type Description</div>
                          <div className="text-gray-700 mt-1">
                            {tourDetails.tourTypeDescription}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Tour Category Description</div>
                          <div className="text-gray-700 mt-1">
                            {tourDetails.tourCategoryDescription}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Season Description</div>
                          <div className="text-gray-700 mt-1">
                            {tourDetails.seasonDescription}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Schedules & Images */}
                  <div className="space-y-6">
                    {/* Schedules */}
                    <div className="bg-gradient-to-r from-gray-50 to-amber-50 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-amber-600" />
                          Schedules ({tourDetails.schedules.length})
                        </h3>
                        <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-xs font-medium">
                          All will be terminated
                        </span>
                      </div>

                      <div className="space-y-4">
                        {tourDetails.schedules.map((schedule) => (
                          <div
                            key={schedule.scheduleId}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => toggleSchedule(schedule.scheduleId)}
                              className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 flex items-center justify-between transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-amber-600" />
                                <div className="text-left">
                                  <span className="font-medium text-gray-900 block">
                                    {schedule.scheduleName}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(schedule.assumeStartDate)} - {formatDate(schedule.assumeEndDate)}
                                  </span>
                                </div>
                              </div>
                              {expandedSchedules.includes(schedule.scheduleId) ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>

                            {expandedSchedules.includes(schedule.scheduleId) && (
                              <div className="p-4 border-t border-gray-200 bg-white">
                                <p className="text-sm text-gray-600 mb-3">
                                  {schedule.scheduleDescription}
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-xs text-gray-500">Duration Range</div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {schedule.durationStart} - {schedule.durationEnd} days
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500">Date Range</div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {formatDate(schedule.assumeStartDate)} to {formatDate(schedule.assumeEndDate)}
                                    </div>
                                  </div>
                                </div>
                                {schedule.specialNote && (
                                  <div className="mt-3 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded">
                                    <div className="text-xs text-gray-500">Special Note</div>
                                    <div className="text-sm text-gray-700">
                                      {schedule.specialNote}
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
                    {tourDetails.images.length > 0 && (
                      <div className="bg-gradient-to-r from-gray-50 to-rose-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-rose-600" />
                          Images ({tourDetails.images.length})
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {tourDetails.images.slice(0, 6).map((image) => (
                            <div key={image.imageId} className="aspect-square">
                              <img
                                src={image.imageUrl}
                                alt={image.imageName}
                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                                }}
                              />
                            </div>
                          ))}
                          {tourDetails.images.length > 6 && (
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                +{tourDetails.images.length - 6} more
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
                            All schedules will be permanently deleted
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-red-700">
                            All booking records for this tour will be affected
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
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-red-700">
                            Associated promotional materials will be removed
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
                        Terminate Tour Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Tour details could not be loaded</p>
                <p className="text-gray-500 text-sm mt-2">
                  Please try selecting the tour again
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
                    Confirm Tour Termination
                  </h3>

                  {/* Message */}
                  <p className="text-gray-600 text-center mb-2">
                    Are you sure you want to permanently terminate
                  </p>
                  <p className="text-lg font-semibold text-red-600 text-center mb-6">
                    {selectedTour?.tourName}?
                  </p>

                  {/* Warning Details */}
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-lg mb-6">
                    <div className="text-sm text-red-700 space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <span>This will delete:</span>
                      </p>
                      <ul className="list-disc list-inside ml-6 space-y-1">
                        <li>{tourDetails?.schedules.length || 0} schedule(s)</li>
                        <li>{tourDetails?.images.length || 0} image(s)</li>
                        <li>All booking records</li>
                        <li>Tour package details</li>
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
                    By confirming, you acknowledge that all tour data, schedules, and booking records will be permanently deleted.
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

export default TerminateTourPage;