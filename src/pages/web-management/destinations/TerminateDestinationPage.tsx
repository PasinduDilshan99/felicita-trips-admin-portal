// app/destinations/terminate/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import {
  DestinationForTerminate,
  SingleDestinationResponse,
} from "@/types/destination-types";
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
  Activity,
} from "lucide-react";

const TerminateDestinationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialDestinationName = searchParams?.get("destination-name") || "";
  const initialDestinationId = searchParams?.get("destination-id") || "";

  // State for destinations list
  const [destinations, setDestinations] = useState<DestinationForTerminate[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationForTerminate[]>([]);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState(initialDestinationName);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // State for selected destination
  const [selectedDestination, setSelectedDestination] = useState<DestinationForTerminate | null>(
    initialDestinationId && initialDestinationName
      ? {
          destinationId: parseInt(initialDestinationId),
          destinationName: initialDestinationName,
        }
      : null
  );
  
  // State for destination details
  const [destinationDetails, setDestinationDetails] = useState<SingleDestinationResponse | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingTerminate, setLoadingTerminate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState<number[]>([]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "Terminate",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/terminate`,
    },
  ];

  // Fetch destinations list on initial load
  useEffect(() => {
    if (!selectedDestination) {
      fetchDestinations();
    }
  }, []);

  // If initialDestinationId is provided, fetch details
  useEffect(() => {
    if (initialDestinationId && !destinationDetails) {
      handleSelectDestination(parseInt(initialDestinationId), initialDestinationName);
    }
  }, [initialDestinationId, initialDestinationName]);

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await DestinationService.getDestinationsForTerminate();
      setDestinations(response.data);
      setFilteredDestinations(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  // Filter destinations based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDestinations(destinations);
      return;
    }

    const filtered = destinations.filter((dest) =>
      dest.destinationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDestinations(filtered);
    setShowDropdown(true);
  }, [searchTerm, destinations]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  // Handle destination selection
  const handleSelectDestination = async (id: number, name: string) => {
    setSelectedDestination({ destinationId: id, destinationName: name });
    setSearchTerm(name);
    setShowDropdown(false);
    await fetchDestinationDetails(id);
  };

  // Fetch destination details
  const fetchDestinationDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setDestinationDetails(null);
    try {
      const response = await DestinationService.getDestinationById(id);
      setDestinationDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load destination details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle terminate confirmation
  const handleTerminateClick = () => {
    if (!selectedDestination) return;
    setShowConfirmModal(true);
  };

  // Handle confirm termination
  const handleConfirmTerminate = async () => {
    if (!selectedDestination) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await DestinationService.terminateDestination(selectedDestination.destinationId);
      
      setSuccess("Destination terminated successfully!");
      setShowConfirmModal(false);
      
      router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/terminate`)
    } catch (err: any) {
      setError(err.message || "Failed to terminate destination");
    } finally {
      setLoadingTerminate(false);
    }
  };

  // Toggle activity expansion
  const toggleActivity = (activityId: number) => {
    setExpandedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  // Calculate stats
  const stats = destinationDetails
    ? {
        totalActivities: destinationDetails.activities.length,
        totalImages: destinationDetails.images.length,
        avgDuration: Math.round(
          destinationDetails.activities.reduce((sum, a) => sum + a.durationHours, 0) /
          destinationDetails.activities.length
        ) || 0,
        minPrice: Math.min(...destinationDetails.activities.map((a) => a.priceLocal)),
        maxPrice: Math.max(...destinationDetails.activities.map((a) => a.priceLocal)),
      }
    : null;

  return (
    <div className=" bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Breadcrumb */}
      <div className="top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Terminate Destination"
            description="Permanently remove a destination from the system"
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
            Select Destination to Terminate
          </h2>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search destination by name..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-600">Loading destinations...</p>
                  </div>
                ) : filteredDestinations.length === 0 ? (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No destinations found</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  filteredDestinations.map((dest) => (
                    <button
                      key={dest.destinationId}
                      onClick={() =>
                        handleSelectDestination(dest.destinationId, dest.destinationName)
                      }
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {dest.destinationName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: {dest.destinationId}
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

        {/* Destination Details Section */}
        {selectedDestination && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header with Warning */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200 p-6">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-red-800">
                    Destination Termination Review
                  </h2>
                  <p className="text-red-600 mt-1">
                    Review the destination details below before proceeding with termination.
                    This action is permanent and cannot be undone.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">Destination ID</div>
                  <div className="text-xl font-bold text-gray-900">
                    #{selectedDestination.destinationId}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State for Details */}
            {loadingDetails ? (
              <div className="p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading destination details...</p>
              </div>
            ) : destinationDetails ? (
              <div className="p-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Activities</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats?.totalActivities || 0}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Images</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats?.totalImages || 0}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Avg Duration</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats?.avgDuration || 0}h
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Price Range</div>
                    <div className="text-lg font-bold text-gray-900">
                      LKR {stats?.minPrice?.toLocaleString()} - {stats?.maxPrice?.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div className="text-lg font-bold text-gray-900">
                      {destinationDetails.statusName}
                    </div>
                  </div>
                </div>

                {/* Destination Information */}
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
                          <div className="text-sm text-gray-500">Name</div>
                          <div className="text-lg font-medium text-gray-900">
                            {destinationDetails.destinationName}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Description</div>
                          <div className="text-gray-700 mt-1">
                            {destinationDetails.destinationDescription}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="text-gray-700 mt-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {destinationDetails.location}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Coordinates</div>
                            <div className="text-gray-700 mt-1 text-sm">
                              {destinationDetails.latitude.toFixed(6)}, {destinationDetails.longitude.toFixed(6)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Category</div>
                            <div className="text-gray-700 mt-1 flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              {destinationDetails.categoryName}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Images Preview */}
                    {destinationDetails.images.length > 0 && (
                      <div className="bg-gradient-to-r from-gray-50 to-rose-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-rose-600" />
                          Images ({destinationDetails.images.length})
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {destinationDetails.images.slice(0, 6).map((image) => (
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
                          {destinationDetails.images.length > 6 && (
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                +{destinationDetails.images.length - 6} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Activities */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-purple-600" />
                          Activities ({destinationDetails.activities.length})
                        </h3>
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 rounded-full text-xs font-medium">
                          All will be terminated
                        </span>
                      </div>

                      <div className="space-y-4">
                        {destinationDetails.activities.map((activity) => (
                          <div
                            key={activity.activityId}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => toggleActivity(activity.activityId)}
                              className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 flex items-center justify-between transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <Activity className="w-4 h-4 text-purple-600" />
                                <span className="font-medium text-gray-900 text-left">
                                  {activity.activityName}
                                </span>
                              </div>
                              {expandedActivities.includes(activity.activityId) ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>

                            {expandedActivities.includes(activity.activityId) && (
                              <div className="p-4 border-t border-gray-200 bg-white">
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <div className="text-xs text-gray-500">Duration</div>
                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {activity.durationHours} hours
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500">Price (Local)</div>
                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                      <DollarSign className="w-3 h-3" />
                                      LKR {activity.priceLocal.toLocaleString()}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500">Group Size</div>
                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      {activity.minParticipate} - {activity.maxParticipate}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500">Season</div>
                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {activity.season}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {activity.activityDescription}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Impact Warning */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
                      <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-600" />
                        Termination Impact
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-red-700">
                            All activities associated with this destination will be permanently deleted
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-red-700">
                            All booking records related to this destination will be affected
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
                        Terminate Destination Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Destination details could not be loaded</p>
                <p className="text-gray-500 text-sm mt-2">
                  Please try selecting the destination again
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
                    {selectedDestination?.destinationName}?
                  </p>

                  {/* Warning */}
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-red-700 text-center">
                      ⚠️ This action is permanent and cannot be undone!
                    </p>
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

export default TerminateDestinationPage;