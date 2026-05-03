// app/packages/view/[packageId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_PACKAGES_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
  WEB_MANAGEMENT_ACTIVITIES_PATH,
} from "@/utils/constant";
import { PackageService } from "@/services/packageService";
import { TourPackage, PackageSchedule, Feature, PackageImage } from "@/types/package-types";
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
  AlertCircle,
  BarChart3,
  CalendarDays,
  UserCheck,
  Award,
  Thermometer,
  Heart,
  Trophy,
  Zap,
  Mountain,
  Waves,
  Castle,
  Trees,
  Package,
  Percent,
  Users2,
  Building,
  Map,
  Sparkles,
  Gift,
  BadgePercent,
  CalendarRange,
  CreditCard,
  CheckSquare,
  Clock4,
  Hotel,
  Coffee,
  Car,
  Plane,
  Compass,
  Navigation2,
  Palette,
  Sparkle,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const PackageDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const packageId = parseInt(params?.packageId as string);

  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  useEffect(() => {
    console.log('Package ID from params:', packageId);
    if (packageId) {
      fetchPackage();
    }
  }, [packageId]);

  const fetchPackage = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching package with ID:', packageId);
      const response = await PackageService.getPackageById(packageId);
      console.log('Full API Response:', response);
      
      if (response && response.data) {
        setTourPackage(response.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error("Error fetching package:", err);
      setError("Failed to load package details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Packages",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}`,
    },
    {
      label: "View",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/view`,
    },
    {
      label: tourPackage?.packageName || "Details",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/${packageId}`,
    },
  ];

  const handlePrevImage = () => {
    if (!tourPackage) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? tourPackage.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    if (!tourPackage) return;
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % tourPackage.images.length
    );
  };

  const handleBack = () => {
    router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/view`);
  };

  const handleEdit = () => {
    router.push(
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/${packageId}/edit`
    );
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this package?")) {
      try {
        await PackageService.terminatePackage(packageId);
        router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/view`);
      } catch (error) {
        console.error("Error deleting package:", error);
        alert("Failed to delete package. Please try again.");
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tourPackage?.packageName,
        text: tourPackage?.packageDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Calculate discounted price
  const calculateDiscountedPrice = () => {
    if (!tourPackage) return 0;
    return PackageService.calculateDiscountedPrice(
      tourPackage.totalPrice,
      tourPackage.discountPercentage
    );
  };

  // Calculate per person price
  const calculatePerPersonPrice = () => {
    if (!tourPackage) return 0;
    return PackageService.calculatePerPersonPrice(
      tourPackage.totalPrice,
      tourPackage.discountPercentage,
      tourPackage.maxPersonCount
    );
  };

  // Calculate savings
  const calculateSavings = () => {
    if (!tourPackage) return 0;
    return PackageService.calculateSavings(
      tourPackage.totalPrice,
      tourPackage.discountPercentage
    );
  };

  // Check if package is currently available
  const isPackageAvailable = () => {
    if (!tourPackage) return false;
    return PackageService.isPackageAvailable(tourPackage);
  };

  // Get upcoming schedules
  const getUpcomingSchedules = () => {
    if (!tourPackage) return [];
    return PackageService.getUpcomingSchedules(tourPackage);
  };

  // Get icon based on package type
  const getPackageTypeIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('adventure') || lowerType.includes('hiking')) {
      return <Mountain className="w-5 h-5" />;
    }
    if (lowerType.includes('luxury') || lowerType.includes('premium')) {
      return <Sparkle className="w-5 h-5" />;
    }
    if (lowerType.includes('family')) {
      return <Users2 className="w-5 h-5" />;
    }
    if (lowerType.includes('honeymoon') || lowerType.includes('romantic')) {
      return <Heart className="w-5 h-5" />;
    }
    if (lowerType.includes('budget') || lowerType.includes('economy')) {
      return <CreditCard className="w-5 h-5" />;
    }
    if (lowerType.includes('corporate') || lowerType.includes('business')) {
      return <Building className="w-5 h-5" />;
    }
    if (lowerType.includes('custom') || lowerType.includes('tailored')) {
      return <Sparkles className="w-5 h-5" />;
    }
    return <Package className="w-5 h-5" />;
  };

  // Get feature icon
  const getFeatureIcon = (featureName: string) => {
    const lowerName = featureName.toLowerCase();
    if (lowerName.includes('hotel') || lowerName.includes('accommodation')) {
      return <Hotel className="w-4 h-4" />;
    }
    if (lowerName.includes('meal') || lowerName.includes('food') || lowerName.includes('breakfast')) {
      return <Coffee className="w-4 h-4" />;
    }
    if (lowerName.includes('transport') || lowerName.includes('transfer') || lowerName.includes('car')) {
      return <Car className="w-4 h-4" />;
    }
    if (lowerName.includes('flight') || lowerName.includes('air')) {
      return <Plane className="w-4 h-4" />;
    }
    if (lowerName.includes('guide') || lowerName.includes('tour')) {
      return <Compass className="w-4 h-4" />;
    }
    if (lowerName.includes('insurance') || lowerName.includes('safety')) {
      return <Shield className="w-4 h-4" />;
    }
    return <CheckSquare className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error || !tourPackage) {
    console.log('====================================');
    console.log('Error state - package:', tourPackage);
    console.log('Error message:', error);
    console.log('====================================');
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || "Package not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The package you're looking for doesn't exist or couldn't be loaded.
          </p>
          <button
            onClick={handleBack}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  const currentImage = tourPackage.images[currentImageIndex];
  const discountedPrice = calculateDiscountedPrice();
  const perPersonPrice = calculatePerPersonPrice();
  const savingsAmount = calculateSavings();
  const isAvailable = isPackageAvailable();
  const upcomingSchedules = getUpcomingSchedules();
  const totalSchedules = tourPackage.schedules.length;
  const totalFeatures = tourPackage.features.length;
  const totalImages = tourPackage.images.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Breadcrumb */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={tourPackage.packageName}
            description={`Package ID: ${tourPackage.packageId}`}
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
            Back to Packages
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
            {/* Hero Image Section with Pricing Badge */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="relative h-96">
                <img
                  src={currentImage?.imageUrl || "/images/placeholder.jpg"}
                  alt={tourPackage.packageName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
                
                {/* Navigation Arrows */}
                {tourPackage.images.length > 1 && (
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
                    {currentImageIndex + 1} / {tourPackage.images.length}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      tourPackage.packageStatus === "ACTIVE"
                        ? isAvailable
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                          : "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                        : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
                    }`}
                  >
                    {tourPackage.packageStatus === "ACTIVE" ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        {isAvailable ? 'Available' : 'Coming Soon'}
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        Inactive
                      </>
                    )}
                  </span>
                  
                  {/* Discount Badge */}
                  {tourPackage.discountPercentage > 0 && (
                    <span className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                      <BadgePercent className="w-4 h-4" />
                      {tourPackage.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {/* Price Overlay */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                    <div className="flex items-end gap-2">
                      {tourPackage.discountPercentage > 0 && (
                        <div className="text-gray-400 line-through text-sm">
                          LKR {tourPackage.totalPrice.toLocaleString()}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-gray-900">
                        LKR {discountedPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      For {tourPackage.maxPersonCount} persons
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {tourPackage.images.length > 1 && (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {tourPackage.images.map((image, index) => (
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

            {/* Package Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-600" />
                Package Overview
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {tourPackage.packageDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      {getPackageTypeIcon(tourPackage.packageTypeName)}
                      Package Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Type:</span> {tourPackage.packageTypeName}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Description:</span> {tourPackage.packageTypeDescription}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span 
                          className="text-sm font-medium px-3 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${tourPackage.color}20`,
                            color: tourPackage.color
                          }}
                        >
                          {tourPackage.packageTypeName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <CalendarRange className="w-5 h-5 text-amber-600" />
                      Date & Duration
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Duration:</span> {tourPackage.duration} days
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Valid From:</span> {new Date(tourPackage.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Valid To:</span> {new Date(tourPackage.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tour Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Map className="w-5 h-5 text-purple-600" />
                    Tour Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Navigation2 className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-sm text-gray-500">Tour</div>
                          <div className="font-semibold text-gray-900">{tourPackage.tourName}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{tourPackage.tourDescription}</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-500">Locations</div>
                          <div className="font-semibold text-gray-900">
                            {tourPackage.startLocation} → {tourPackage.endLocation}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Coordinates: {tourPackage.latitude.toFixed(4)}, {tourPackage.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            {tourPackage.features.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Gift className="w-6 h-6 text-green-600" />
                    Package Features ({totalFeatures})
                  </h2>
                  <span className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-sm font-medium">
                    {totalFeatures} features included
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tourPackage.features.map((feature) => (
                    <div
                      key={feature.featureId}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        selectedFeature === feature.featureId
                          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        setSelectedFeature(
                          selectedFeature === feature.featureId
                            ? null
                            : feature.featureId
                        )
                      }
                      style={{ borderLeftColor: feature.color, borderLeftWidth: '4px' }}
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${feature.color}20` }}
                        >
                          {getFeatureIcon(feature.featureName)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {feature.featureName}
                            </h3>
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: `${feature.color}20`,
                                color: feature.color
                              }}
                            >
                              {feature.featureValue}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {feature.featureDescription}
                          </p>
                          
                          {/* Expanded Details */}
                          {selectedFeature === feature.featureId && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: feature.color }}
                                />
                                <span className="text-sm font-medium text-gray-700">Special Notes:</span>
                              </div>
                              <p className="text-gray-600 text-sm bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg">
                                {feature.specialNote}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                </div>
              </div>

              <div className="space-y-6">
                {tourPackage.schedules.map((schedule) => {
                  const isUpcoming = upcomingSchedules.some(s => s.scheduleId === schedule.scheduleId);
                  
                  return (
                    <div
                      key={schedule.scheduleId}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        selectedSchedule === schedule.scheduleId
                          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50"
                          : isUpcoming
                            ? "border-green-200 hover:border-green-300 hover:bg-green-50"
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
                                  {isUpcoming ? 'Upcoming - Available for booking' : 'Past - Not available'}
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
            {/* Pricing Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Pricing Information
              </h3>
              
              <div className="space-y-4">
                {/* Original Price */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Original Price</span>
                    <span className="text-lg font-bold text-gray-700 line-through">
                      LKR {tourPackage.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Price before discount
                  </p>
                </div>
                
                {/* Discount */}
                {tourPackage.discountPercentage > 0 && (
                  <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Discount ({tourPackage.discountPercentage}%)</span>
                      <span className="text-lg font-bold text-rose-700">
                        - LKR {savingsAmount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      You save {tourPackage.discountPercentage}%
                    </p>
                  </div>
                )}
                
                {/* Final Price */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Final Price</span>
                    <span className="text-2xl font-bold text-green-700">
                      LKR {discountedPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Price after discount
                  </p>
                </div>
                
                {/* Per Person Price */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Per Person Price</div>
                    <div className="text-2xl font-bold text-blue-700">
                      LKR {perPersonPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      For {tourPackage.maxPersonCount} persons
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Quick Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-bold text-gray-900">{tourPackage.duration} days</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <span className="text-gray-600">Group Size</span>
                  <span className="font-bold text-gray-900">{tourPackage.minPersonCount}-{tourPackage.maxPersonCount}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-bold text-gray-900">{tourPackage.discountPercentage}%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                  <span className="text-gray-600">Total Schedules</span>
                  <span className="font-bold text-gray-900">{totalSchedules}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
                  <span className="text-gray-600">Total Features</span>
                  <span className="font-bold text-gray-900">{totalFeatures}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span className="text-gray-600">Total Images</span>
                  <span className="font-bold text-gray-900">{totalImages}</span>
                </div>
              </div>
            </div>

            {/* Package Highlights */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                Package Highlights
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-medium text-gray-700">Package Type</span>
                    <p className="text-sm text-gray-500">{tourPackage.packageTypeName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-medium text-gray-700">Duration</span>
                    <p className="text-sm text-gray-500">{tourPackage.duration} days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50/50 to-violet-50/50 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <span className="font-medium text-gray-700">Group Size</span>
                    <p className="text-sm text-gray-500">{tourPackage.minPersonCount}-{tourPackage.maxPersonCount} persons</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-rose-50/50 to-pink-50/50 rounded-lg">
                  <Percent className="w-5 h-5 text-rose-600" />
                  <div>
                    <span className="font-medium text-gray-700">Discount</span>
                    <p className="text-sm text-gray-500">{tourPackage.discountPercentage}% off</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-lg">
                  <Palette className="w-5 h-5 text-amber-600" />
                  <div>
                    <span className="font-medium text-gray-700">Theme Color</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: tourPackage.color }}
                      />
                      <span className="text-sm text-gray-500">{tourPackage.color}</span>
                    </div>
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
                  <span className="font-medium">Share Package</span>
                </button>

                <button
                  onClick={() => router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/${tourPackage.tourId}`)}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg border border-amber-100 hover:border-amber-300 transition-all duration-200"
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">View Tour</span>
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
                {tourPackage.images.slice(0, 6).map((image, index) => (
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
                    <div 
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ backgroundColor: `${image.color}20` }}
                    />
                  </button>
                ))}
                {tourPackage.images.length > 6 && (
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      +{tourPackage.images.length - 6} more
                    </span>
                  </div>
                )}
              </div>
              
              {tourPackage.images.length > 0 && (
                <button
                  onClick={() => setCurrentImageIndex(0)}
                  className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Images
                </button>
              )}
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                Package Metadata
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Created At</span>
                  <span className="font-medium text-gray-700">
                    {new Date(tourPackage.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Package ID</span>
                  <span className="font-medium text-gray-700">{tourPackage.packageId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Tour ID</span>
                  <span className="font-medium text-gray-700">{tourPackage.tourId}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-medium ${
                    tourPackage.packageStatus === 'ACTIVE' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {tourPackage.packageStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsPage;