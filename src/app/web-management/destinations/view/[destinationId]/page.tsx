// app/destinations/view/[destinationId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import { SingleDestinationResponse } from "@/types/destination-types";
import {
  MapPin,
  Tag,
  Clock,
  Users,
  Image as ImageIcon,
  Star,
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
  Navigation,
  Phone,
  Mail,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const DestinationDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const destinationId = parseInt(params?.destinationId as string);

  const [destination, setDestination] = useState<SingleDestinationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "View",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view`,
    },
    {
      label: destination?.destinationName || "Details",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/${destinationId}`,
    },
  ];

  useEffect(() => {
    if (destinationId) {
      fetchDestination();
    }
  }, [destinationId]);

  const fetchDestination = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await DestinationService.getDestinationById(destinationId);
      setDestination(response.data);
    } catch (err) {
      console.error("Error fetching destination:", err);
      setError("Failed to load destination details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    if (!destination) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? destination.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    if (!destination) return;
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % destination.images.length
    );
  };

  const handleBack = () => {
    router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view`);
  };

  const handleEdit = () => {
    // Navigate to edit page
    router.push(
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/${destinationId}/edit`
    );
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this destination?")) {
      // Implement delete functionality
      console.log("Delete destination:", destinationId);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: destination?.destinationName,
        text: destination?.destinationDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || "Destination not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The destination you're looking for doesn't exist or couldn't be loaded.
          </p>
          <button
            onClick={handleBack}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  const currentImage = destination.images[currentImageIndex];
  const totalActivities = destination.activities.length;
  const totalImages = destination.images.length;
  const avgDuration = destination.activities.length > 0
    ? Math.round(
        destination.activities.reduce((sum, a) => sum + a.durationHours, 0) /
          destination.activities.length
      )
    : 0;
  const minPrice = destination.activities.length > 0
    ? Math.min(...destination.activities.map((a) => a.priceLocal))
    : 0;
  const maxPrice = destination.activities.length > 0
    ? Math.max(...destination.activities.map((a) => a.priceLocal))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Breadcrumb */}
      <div className="top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={destination.destinationName}
            description={`Destination ID: ${destination.destinationId}`}
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
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Destinations
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
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg border border-amber-100 hover:border-amber-300 transition-all duration-200"
            >
              <Bookmark className="w-4 h-4" />
              Save
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
                  src={currentImage?.imageUrl || "/images/placeholder.jpg"}
                  alt={destination.destinationName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
                
                {/* Navigation Arrows */}
                {destination.images.length > 1 && (
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
                    {currentImageIndex + 1} / {destination.images.length}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      destination.statusName === "ACTIVE"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                        : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
                    }`}
                  >
                    {destination.statusName === "ACTIVE" ? (
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
                </div>
              </div>

              {/* Thumbnail Strip */}
              {destination.images.length > 1 && (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {destination.images.map((image, index) => (
                      <button
                        key={image.imageId}
                        onClick={() => setCurrentImageIndex(index)}
                        className="flex-shrink-0"
                      >
                        <img
                          src={image.imageUrl}
                          alt={image.imageName}
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

            {/* Destination Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-600" />
                Destination Overview
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {destination.destinationDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Location Details
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Region:</span> {destination.location}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Coordinates:</span>{" "}
                        {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-emerald-600" />
                      Category Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Category:</span> {destination.categoryName}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Description:</span> {destination.categoryDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activities Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  Available Activities ({totalActivities})
                </h2>
                <span className="px-4 py-2 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-full text-sm font-medium">
                  {totalActivities} activities
                </span>
              </div>

              <div className="space-y-6">
                {destination.activities.map((activity) => (
                  <div
                    key={activity.activityId}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      selectedActivity === activity.activityId
                        ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setSelectedActivity(
                        selectedActivity === activity.activityId
                          ? null
                          : activity.activityId
                      )
                    }
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {activity.activityName}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {activity.activityDescription}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <span className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full text-xs font-medium">
                            {activity.activitiesCategory}
                          </span>
                          <span className="px-3 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-full text-xs font-medium">
                            {activity.durationHours} hours
                          </span>
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs font-medium">
                            Season: {activity.season}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="text-right mb-2">
                          <div className="text-2xl font-bold text-gray-900">
                            LKR {activity.priceLocal.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Local Price
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-700">
                            LKR {activity.priceForeigners.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Foreigners
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedActivity === activity.activityId && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-700 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-amber-600" />
                              Timing
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Available: {activity.availableFrom} - {activity.availableTo}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-700 flex items-center gap-2">
                              <Users className="w-4 h-4 text-purple-600" />
                              Group Size
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {activity.minParticipate} - {activity.maxParticipate} participants
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-700 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-green-600" />
                              Requirements
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Duration: {activity.durationHours} hours
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Quick Info */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-600" />
                Quick Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <span className="text-gray-600">Total Activities</span>
                  <span className="font-bold text-gray-900">{totalActivities}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <span className="text-gray-600">Total Images</span>
                  <span className="font-bold text-gray-900">{totalImages}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                  <span className="text-gray-600">Avg Duration</span>
                  <span className="font-bold text-gray-900">{avgDuration}h</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                  <span className="text-gray-600">Price Range</span>
                  <span className="font-bold text-gray-900">
                    LKR {minPrice.toLocaleString()} - {maxPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Map Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-red-600" />
                Location Map
              </h3>
              
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    {destination.location}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`,
                    "_blank"
                  )
                }
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Google Maps
              </button>
            </div>

            {/* Contact & Actions */}
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
                  <span className="font-medium">Call Support</span>
                </button>
                
                <button
                  onClick={() => window.open(`mailto:support@example.com`)}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-100 hover:border-blue-300 transition-all duration-200"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email Inquiry</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-lg border border-purple-100 hover:border-purple-300 transition-all duration-200"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Share Destination</span>
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
                {destination.images.slice(0, 6).map((image, index) => (
                  <button
                    key={image.imageId}
                    onClick={() => setCurrentImageIndex(index)}
                    className="aspect-square"
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.imageName}
                      className="w-full h-full object-cover rounded-lg border-2 hover:border-blue-500 transition-all duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                      }}
                    />
                  </button>
                ))}
                {destination.images.length > 6 && (
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      +{destination.images.length - 6} more
                    </span>
                  </div>
                )}
              </div>
              
              {destination.images.length > 0 && (
                <button
                  onClick={() => setCurrentImageIndex(0)}
                  className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Images
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailsPage;