// app/tours/view/[tourId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_TOURS_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
  WEB_MANAGEMENT_ACTIVITIES_PATH,
  WEB_MANAGEMENT_PACKAGES_PATH,
} from "@/utils/constant";
import { TourService } from "@/services/tourService";
import { Tour, Schedule, TourImage } from "@/types/tour-types";
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
  Target,
  BarChart3,
  CalendarDays,
  Award,
  Thermometer,
  Zap,
  Mountain,
  Waves,
  Castle,
  Trees,
  Compass,
  Navigation2,
  Map,
  Route,
  Flag,
  Wind,
  Sun,
  Cloud,
  Umbrella,
  Snowflake,
  Leaf,
  Flower2,
  Building,
  Heart,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const TourDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const tourId = parseInt(params?.tourId as string);

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);

  useEffect(() => {
    console.log('Tour ID from params:', tourId);
    if (tourId) {
      fetchTour();
    }
  }, [tourId]);

  const fetchTour = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching tour with ID:', tourId);
      const response = await TourService.getTourById(tourId);
      console.log('Full API Response:', response);
      
      if (response && response.data) {
        setTour(response.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error("Error fetching tour:", err);
      setError("Failed to load tour details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Tours",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}`,
    },
    {
      label: "View",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/view`,
    },
    {
      label: tour?.tourName || "Details",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/${tourId}`,
    },
  ];

  const handlePrevImage = () => {
    if (!tour) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? tour.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    if (!tour) return;
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % tour.images.length
    );
  };

  const handleBack = () => {
    router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/view`);
  };

  const handleEdit = () => {
    router.push(
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/${tourId}/edit`
    );
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this tour?")) {
      try {
        await TourService.terminateTour(tourId);
        router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/view`);
      } catch (error) {
        console.error("Error deleting tour:", error);
        alert("Failed to delete tour. Please try again.");
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour?.tourName,
        text: tour?.tourDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Get icon based on tour type
  const getTourTypeIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('adventure') || lowerType.includes('hiking')) {
      return <Mountain className="w-5 h-5" />;
    }
    if (lowerType.includes('cultural') || lowerType.includes('historical')) {
      return <Castle className="w-5 h-5" />;
    }
    if (lowerType.includes('wildlife') || lowerType.includes('nature')) {
      return <Trees className="w-5 h-5" />;
    }
    if (lowerType.includes('beach') || lowerType.includes('water')) {
      return <Waves className="w-5 h-5" />;
    }
    if (lowerType.includes('food') || lowerType.includes('dining')) {
      return <Flower2 className="w-5 h-5" />;
    }
    if (lowerType.includes('photography')) {
      return <ImageIcon className="w-5 h-5" />;
    }
    if (lowerType.includes('wellness')) {
      return <Leaf className="w-5 h-5" />;
    }
    if (lowerType.includes('educational')) {
      return <Compass className="w-5 h-5" />;
    }
    if (lowerType.includes('religious')) {
      return <Target className="w-5 h-5" />;
    }
    return <Compass className="w-5 h-5" />;
  };

  // Get icon based on tour category
  const getTourCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('solo')) {
      return <Users className="w-5 h-5" />;
    }
    if (lowerCategory.includes('budget')) {
      return <DollarSign className="w-5 h-5" />;
    }
    if (lowerCategory.includes('family')) {
      return <Users className="w-5 h-5" />;
    }
    if (lowerCategory.includes('group')) {
      return <Users className="w-5 h-5" />;
    }
    if (lowerCategory.includes('luxury')) {
      return <Star className="w-5 h-5" />;
    }
    if (lowerCategory.includes('corporate')) {
      return <Building className="w-5 h-5" />;
    }
    if (lowerCategory.includes('honeymoon')) {
      return <Heart className="w-5 h-5" />;
    }
    if (lowerCategory.includes('backpacker')) {
      return <Navigation className="w-5 h-5" />;
    }
    if (lowerCategory.includes('custom') || lowerCategory.includes('private')) {
      return <Shield className="w-5 h-5" />;
    }
    return <Compass className="w-5 h-5" />;
  };

  // Get season icon
  const getSeasonIcon = (season: string) => {
    const lowerSeason = season.toLowerCase();
    if (lowerSeason.includes('spring')) {
      return <Flower2 className="w-5 h-5" />;
    }
    if (lowerSeason.includes('summer')) {
      return <Sun className="w-5 h-5" />;
    }
    if (lowerSeason.includes('winter')) {
      return <Snowflake className="w-5 h-5" />;
    }
    if (lowerSeason.includes('monsoon') || lowerSeason.includes('rainy')) {
      return <Umbrella className="w-5 h-5" />;
    }
    if (lowerSeason.includes('fall')) {
      return <Leaf className="w-5 h-5" />;
    }
    if (lowerSeason.includes('dry')) {
      return <Sun className="w-5 h-5" />;
    }
    if (lowerSeason.includes('peak')) {
      return <TrendingUp className="w-5 h-5" />;
    }
    if (lowerSeason.includes('off')) {
      return <Wind className="w-5 h-5" />;
    }
    return <Thermometer className="w-5 h-5" />;
  };

  // Get upcoming schedules
  const getUpcomingSchedules = () => {
    if (!tour) return [];
    return TourService.getUpcomingSchedules(tour);
  };

  // Get schedule count for next 3 months
  const getScheduleCountForNextMonths = () => {
    if (!tour) return 0;
    return TourService.getScheduleCountForNextMonths(tour, 3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    console.log('====================================');
    console.log('Error state - tour:', tour);
    console.log('Error message:', error);
    console.log('====================================');
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || "Tour not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The tour you're looking for doesn't exist or couldn't be loaded.
          </p>
          <button
            onClick={handleBack}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  const currentImage = tour.images[currentImageIndex];
  const upcomingSchedules = getUpcomingSchedules();
  const scheduleCountNextMonths = getScheduleCountForNextMonths();
  const totalSchedules = tour.schedules.length;
  const totalImages = tour.images.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Breadcrumb */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={tour.tourName}
            description={`Tour ID: ${tour.tourId}`}
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
            Back to Tours
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
                  alt={tour.tourName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
                
                {/* Navigation Arrows */}
                {tour.images.length > 1 && (
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
                    {currentImageIndex + 1} / {tour.images.length}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      tour.statusName === "ACTIVE"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                        : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
                    }`}
                  >
                    {tour.statusName === "ACTIVE" ? (
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
                  
                  {/* Upcoming Schedules Badge */}
                  {upcomingSchedules.length > 0 && (
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                      <Calendar className="w-4 h-4" />
                      {upcomingSchedules.length} upcoming schedules
                    </span>
                  )}
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {tour.duration}
                        </div>
                        <div className="text-xs text-gray-500">
                          days tour
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {tour.images.length > 1 && (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {tour.images.map((image, index) => (
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
                            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tour Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-600" />
                Tour Overview
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {tour.tourDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      {getTourTypeIcon(tour.tourTypeName)}
                      Tour Type Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Type:</span> {tour.tourTypeName}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Description:</span> {tour.tourTypeDescription}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                          {tour.tourTypeName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      {getTourCategoryIcon(tour.tourCategoryName)}
                      Tour Category
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Category:</span> {tour.tourCategoryName}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Description:</span> {tour.tourCategoryDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Season Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    {getSeasonIcon(tour.seasonName)}
                    Season Information
                  </h3>
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{tour.seasonName}</div>
                        <p className="text-gray-600 text-sm mt-1">{tour.seasonDescription}</p>
                      </div>
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-semibold">
                        Best Season
                      </span>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Route className="w-5 h-5 text-purple-600" />
                    Tour Route
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Flag className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-500">Start Location</div>
                          <div className="font-semibold text-gray-900">{tour.startLocation}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Coordinates: {tour.latitude.toFixed(4)}, {tour.longitude.toFixed(4)}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-sm text-gray-500">End Location</div>
                          <div className="font-semibold text-gray-900">{tour.endLocation}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {tour.duration} days journey
                      </p>
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
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-full text-sm font-medium">
                    {totalSchedules} schedules
                  </span>
                  {upcomingSchedules.length > 0 && (
                    <span className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-sm font-medium">
                      {upcomingSchedules.length} upcoming
                    </span>
                  )}
                  {scheduleCountNextMonths > 0 && (
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium">
                      {scheduleCountNextMonths} in next 3 months
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {tour.schedules.map((schedule) => {
                  const isUpcoming = upcomingSchedules.some(s => s.scheduleId === schedule.scheduleId);
                  const isPast = new Date(schedule.assumeEndDate) < new Date();
                  
                  return (
                    <div
                      key={schedule.scheduleId}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        selectedSchedule === schedule.scheduleId
                          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50"
                          : isUpcoming
                            ? "border-green-200 hover:border-green-300 hover:bg-green-50"
                            : isPast
                              ? "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        setSelectedSchedule(
                          selectedSchedule === schedule.scheduleId
                            ? null
                            : schedule.scheduleId
                        )
                      }
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {schedule.scheduleName}
                            </h3>
                            {isUpcoming && (
                              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-semibold">
                                Upcoming
                              </span>
                            )}
                            {isPast && (
                              <span className="px-3 py-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full text-xs font-semibold">
                                Past
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {schedule.scheduleDescription}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs font-medium">
                              {new Date(schedule.assumeStartDate).toLocaleDateString()} → {new Date(schedule.assumeEndDate).toLocaleDateString()}
                            </span>
                            <span className="px-3 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-full text-xs font-medium">
                              {schedule.durationStart} - {schedule.durationEnd} days
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="text-right mb-2">
                            <div className="text-sm text-gray-500">
                              Duration
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              {schedule.durationStart}-{schedule.durationEnd} days
                            </div>
                          </div>
                          <div className={`text-xs font-medium ${
                            isUpcoming ? 'text-green-600' : 
                            isPast ? 'text-gray-500' : 'text-amber-600'
                          }`}>
                            {isUpcoming ? 'Available for booking' : 
                             isPast ? 'Completed' : 'Check availability'}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedSchedule === schedule.scheduleId && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">
                                Special Notes
                              </h4>
                              <p className="text-gray-600 text-sm bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-4 rounded-lg border border-amber-100">
                                {schedule.specialNote}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                  Date Range
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  {new Date(schedule.assumeStartDate).toLocaleDateString()} to {new Date(schedule.assumeEndDate).toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-amber-600" />
                                  Duration Range
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  {schedule.durationStart} - {schedule.durationEnd} days
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-green-600" />
                                  Schedule Status
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  {isUpcoming ? 'Upcoming - Available for booking' : 
                                   isPast ? 'Past - Completed' : 'Regular - Available'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
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
                  <span className="font-bold text-gray-900">{tour.duration} days</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <span className="text-gray-600">Tour Type</span>
                  <span className="font-bold text-gray-900">{tour.tourTypeName}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                  <span className="text-gray-600">Category</span>
                  <span className="font-bold text-gray-900">{tour.tourCategoryName}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                  <span className="text-gray-600">Total Schedules</span>
                  <span className="font-bold text-gray-900">{totalSchedules}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
                  <span className="text-gray-600">Upcoming Schedules</span>
                  <span className="font-bold text-gray-900">{upcomingSchedules.length}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span className="text-gray-600">Total Images</span>
                  <span className="font-bold text-gray-900">{totalImages}</span>
                </div>
              </div>
            </div>

            {/* Tour Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Compass className="w-5 h-5 text-purple-600" />
                Tour Information
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    {getTourTypeIcon(tour.tourTypeName)}
                    <div>
                      <div className="text-sm text-gray-500">Tour Type</div>
                      <div className="font-semibold text-gray-900">{tour.tourTypeName}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {tour.tourTypeDescription}
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    {getTourCategoryIcon(tour.tourCategoryName)}
                    <div>
                      <div className="text-sm text-gray-500">Tour Category</div>
                      <div className="font-semibold text-gray-900">{tour.tourCategoryName}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {tour.tourCategoryDescription}
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                  <div className="flex items-center gap-3 mb-2">
                    {getSeasonIcon(tour.seasonName)}
                    <div>
                      <div className="text-sm text-gray-500">Best Season</div>
                      <div className="font-semibold text-gray-900">{tour.seasonName}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {tour.seasonDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Tour Highlights */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Tour Highlights
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-medium text-gray-700">Duration</span>
                    <p className="text-sm text-gray-500">{tour.duration} days tour</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-lg">
                  <Route className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-medium text-gray-700">Route</span>
                    <p className="text-sm text-gray-500">{tour.startLocation} → {tour.endLocation}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50/50 to-violet-50/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <span className="font-medium text-gray-700">Availability</span>
                    <p className="text-sm text-gray-500">{totalSchedules} schedules available</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-rose-50/50 to-pink-50/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-rose-600" />
                  <div>
                    <span className="font-medium text-gray-700">Coordinates</span>
                    <p className="text-sm text-gray-500">
                      {tour.latitude.toFixed(4)}, {tour.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-lg">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <div>
                    <span className="font-medium text-gray-700">Status</span>
                    <p className="text-sm text-gray-500">
                      {tour.statusName === 'ACTIVE' ? 'Active - Bookable' : 'Inactive - Not available'}
                    </p>
                  </div>
                </div>
              </div>
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
                  <span className="font-medium">Share Tour</span>
                </button>

                <button
                  onClick={() => router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/view`)}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg border border-amber-100 hover:border-amber-300 transition-all duration-200"
                >
                  <Compass className="w-5 h-5" />
                  <span className="font-medium">View Packages</span>
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
                {tour.images.slice(0, 6).map((image, index) => (
                  <button
                    key={image.imageId}
                    onClick={() => setCurrentImageIndex(index)}
                    className="aspect-square relative group"
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.imageName}
                      className="w-full h-full object-cover rounded-lg border-2 hover:border-blue-500 transition-all duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
                  </button>
                ))}
                {tour.images.length > 6 && (
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      +{tour.images.length - 6} more
                    </span>
                  </div>
                )}
              </div>
              
              {tour.images.length > 0 && (
                <button
                  onClick={() => setCurrentImageIndex(0)}
                  className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Images
                </button>
              )}
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Map className="w-5 h-5 text-red-600" />
                Location Map
              </h3>
              
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Navigation2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    {tour.startLocation} → {tour.endLocation}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {tour.latitude.toFixed(4)}, {tour.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${tour.latitude},${tour.longitude}`,
                    "_blank"
                  )
                }
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Google Maps
              </button>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                Tour Metadata
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Tour ID</span>
                  <span className="font-medium text-gray-700">{tour.tourId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-medium ${
                    tour.statusName === 'ACTIVE' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {tour.statusName}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium text-gray-700">{tour.duration} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailsPage;