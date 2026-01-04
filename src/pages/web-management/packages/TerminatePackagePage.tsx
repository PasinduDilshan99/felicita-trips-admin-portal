// app/packages/terminate/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_PACKAGES_PATH,
} from "@/utils/constant";
import { PackageService } from "@/services/packageService";
import {
  PackageForTerminate,
  TourPackage,
} from "@/types/package-types";
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
  Gift,
  Award,
  Star,
  Percent,
  CalendarDays,
  Package,
  FileWarning,
  AlertOctagon,
  Route,
  Briefcase,
  Heart,
  Target,
  TrendingUp,
} from "lucide-react";

const TerminatePackagePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialPackageName = searchParams?.get("package-name") || "";
  const initialPackageId = searchParams?.get("package-id") || "";

  // State for packages list
  const [packages, setPackages] = useState<PackageForTerminate[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageForTerminate[]>([]);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState(initialPackageName);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // State for selected package
  const [selectedPackage, setSelectedPackage] = useState<PackageForTerminate | null>(
    initialPackageId && initialPackageName
      ? {
          packageId: parseInt(initialPackageId),
          packageName: initialPackageName,
        }
      : null
  );
  
  // State for package details
  const [packageDetails, setPackageDetails] = useState<TourPackage | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingTerminate, setLoadingTerminate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedSchedules, setExpandedSchedules] = useState<number[]>([]);
  const [expandedFeatures, setExpandedFeatures] = useState<number[]>([]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Packages",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}`,
    },
    {
      label: "Terminate",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/terminate`,
    },
  ];

  // Fetch packages list on initial load
  useEffect(() => {
    if (!selectedPackage) {
      fetchPackages();
    }
  }, []);

  // If initialPackageId is provided, fetch details
  useEffect(() => {
    if (initialPackageId && !packageDetails) {
      handleSelectPackage(parseInt(initialPackageId), initialPackageName);
    }
  }, [initialPackageId, initialPackageName]);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await PackageService.getPackagesForTerminate();
      setPackages(response.data);
      setFilteredPackages(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  // Filter packages based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPackages(packages);
      return;
    }

    const filtered = packages.filter((pkg) =>
      pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPackages(filtered);
    setShowDropdown(true);
  }, [searchTerm, packages]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  // Handle package selection
  const handleSelectPackage = async (id: number, name: string) => {
    setSelectedPackage({ packageId: id, packageName: name });
    setSearchTerm(name);
    setShowDropdown(false);
    await fetchPackageDetails(id);
  };

  // Fetch package details
  const fetchPackageDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setPackageDetails(null);
    try {
      const response = await PackageService.getPackageById(id);
      setPackageDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load package details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle terminate confirmation
  const handleTerminateClick = () => {
    if (!selectedPackage) return;
    setShowConfirmModal(true);
  };

  // Handle confirm termination
  const handleConfirmTerminate = async () => {
    if (!selectedPackage) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await PackageService.terminatePackage(selectedPackage.packageId);
      
      setSuccess("Package terminated successfully!");
      setShowConfirmModal(false);
      
      // Redirect to packages list after delay
      setTimeout(() => {
        router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/view`);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Failed to terminate package");
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

  // Toggle feature expansion
  const toggleFeature = (featureId: number) => {
    setExpandedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  // Calculate package stats
  const stats = packageDetails
    ? {
        totalSchedules: packageDetails.schedules.length,
        totalFeatures: packageDetails.features.length,
        totalImages: packageDetails.images.length,
        discountedPrice: PackageService.calculateDiscountedPrice(
          packageDetails.totalPrice,
          packageDetails.discountPercentage
        ),
        savings: PackageService.calculateSavings(
          packageDetails.totalPrice,
          packageDetails.discountPercentage
        ),
        perPersonPrice: packageDetails.pricePerPerson,
        isAvailable: PackageService.isPackageAvailable(packageDetails),
        upcomingSchedules: PackageService.getUpcomingSchedules(packageDetails),
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

  // Format price
  const formatPrice = (amount: number) => {
    return PackageService.formatPrice(amount);
  };

  // Get package type icon
  const getPackageTypeIcon = (packageType: string) => {
    const lowerType = packageType.toLowerCase();
    if (lowerType.includes('luxury') || lowerType.includes('premium')) return <Award className="w-4 h-4" />;
    if (lowerType.includes('budget')) return <Tag className="w-4 h-4" />;
    if (lowerType.includes('family')) return <Users className="w-4 h-4" />;
    if (lowerType.includes('honeymoon')) return <Heart className="w-4 h-4" />;
    if (lowerType.includes('adventure')) return <Target className="w-4 h-4" />;
    return <Package className="w-4 h-4" />;
  };

  // Get package rating (placeholder)
  const getPackageRating = () => {
    if (!packageDetails) return 0;
    return PackageService.getPackageRating(packageDetails);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Breadcrumb */}
      <div className="top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Terminate Package"
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
            Select Package to Terminate
          </h2>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search package by name..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-600">Loading packages...</p>
                  </div>
                ) : filteredPackages.length === 0 ? (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No packages found</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  filteredPackages.map((pkg) => (
                    <button
                      key={pkg.packageId}
                      onClick={() =>
                        handleSelectPackage(pkg.packageId, pkg.packageName)
                      }
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {pkg.packageName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: {pkg.packageId}
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

        {/* Package Details Section */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header with Warning */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200 p-6">
              <div className="flex items-center gap-4">
                <AlertOctagon className="w-8 h-8 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-red-800">
                    Package Termination Review
                  </h2>
                  <p className="text-red-600 mt-1">
                    Review the package details below before proceeding with termination.
                    This action is permanent and cannot be undone.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">Package ID</div>
                  <div className="text-xl font-bold text-gray-900">
                    #{selectedPackage.packageId}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State for Details */}
            {loadingDetails ? (
              <div className="p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading package details...</p>
              </div>
            ) : packageDetails ? (
              <div className="p-8">
                {/* Quick Stats - Pricing Focus */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Duration</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {packageDetails.duration} days
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Discount</div>
                    <div className="text-2xl font-bold text-emerald-700">
                      {packageDetails.discountPercentage}%
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Total Price</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(packageDetails.totalPrice)}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Per Person</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(packageDetails.pricePerPerson)}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div className={`text-lg font-bold ${
                      packageDetails.packageStatus === 'ACTIVE' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {packageDetails.packageStatus}
                    </div>
                  </div>
                </div>

                {/* Package Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-6">
                    {/* Package Header with Color */}
                    <div 
                      className="rounded-xl p-6 text-white"
                      style={{ 
                        background: `linear-gradient(135deg, ${packageDetails.color}, ${packageDetails.hoverColor})`
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{packageDetails.packageName}</h3>
                          <p className="text-white/80">{packageDetails.packageDescription}</p>
                        </div>
                        <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 mr-1" />
                          <span className="font-medium">{getPackageRating().toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        Pricing Details
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Original Price</div>
                            <div className="text-lg font-bold text-gray-900">
                              {formatPrice(packageDetails.totalPrice)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Discount</div>
                            <div className="text-lg font-bold text-emerald-700">
                              {packageDetails.discountPercentage}%
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm text-gray-500">Discounted Price</div>
                              <div className="text-2xl font-bold text-emerald-700">
                                {formatPrice(stats?.discountedPrice || 0)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">You Save</div>
                              <div className="text-lg font-bold text-emerald-700">
                                {formatPrice(stats?.savings || 0)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Group Size</div>
                            <div className="text-lg font-medium text-gray-900 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {packageDetails.minPersonCount} - {packageDetails.maxPersonCount}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Per Person</div>
                            <div className="text-lg font-medium text-gray-900">
                              {formatPrice(packageDetails.pricePerPerson)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tour Information */}
                    <div className="bg-gradient-to-r from-gray-50 to-green-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Route className="w-5 h-5 text-green-600" />
                        Tour Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Tour Name</div>
                          <div className="text-lg font-medium text-gray-900">
                            {packageDetails.tourName}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Tour Description</div>
                          <div className="text-gray-700 mt-1">
                            {packageDetails.tourDescription}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Start Location</div>
                            <div className="text-gray-700 mt-1 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {packageDetails.startLocation}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">End Location</div>
                            <div className="text-gray-700 mt-1 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {packageDetails.endLocation}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Package Type */}
                    <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                        Package Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Package Type</div>
                          <div className="text-gray-700 mt-1 flex items-center gap-2">
                            {getPackageTypeIcon(packageDetails.packageTypeName)}
                            {packageDetails.packageTypeName}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Package Type Description</div>
                          <div className="text-gray-700 mt-1">
                            {packageDetails.packageTypeDescription}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Date Range</div>
                            <div className="text-gray-700 mt-1 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(packageDetails.startDate)} - {formatDate(packageDetails.endDate)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Created</div>
                            <div className="text-gray-700 mt-1">
                              {formatDate(packageDetails.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Schedules, Features & Images */}
                  <div className="space-y-6">
                    {/* Schedules */}
                    <div className="bg-gradient-to-r from-gray-50 to-amber-50 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-amber-600" />
                          Schedules ({packageDetails.schedules.length})
                        </h3>
                        <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-xs font-medium">
                          All will be terminated
                        </span>
                      </div>

                      <div className="space-y-4">
                        {packageDetails.schedules.map((schedule) => (
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

                    {/* Features */}
                    {packageDetails.features.length > 0 && (
                      <div className="bg-gradient-to-r from-gray-50 to-emerald-50 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Gift className="w-5 h-5 text-emerald-600" />
                            Features ({packageDetails.features.length})
                          </h3>
                          <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 rounded-full text-xs font-medium">
                            All will be terminated
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {packageDetails.features.map((feature) => (
                            <div
                              key={feature.featureId}
                              className="p-3 bg-white rounded-lg border border-gray-200"
                              style={{ borderLeftColor: feature.color, borderLeftWidth: '3px' }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Award className="w-4 h-4" style={{ color: feature.color }} />
                                    <span className="font-medium text-gray-900">
                                      {feature.featureName}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {feature.featureDescription}
                                  </p>
                                  <div className="mt-2">
                                    <span 
                                      className="px-2 py-1 text-xs font-medium rounded"
                                      style={{ 
                                        backgroundColor: `${feature.color}20`,
                                        color: feature.color
                                      }}
                                    >
                                      {feature.featureValue}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleFeature(feature.featureId)}
                                  className="ml-2 text-gray-400 hover:text-gray-600"
                                >
                                  {expandedFeatures.includes(feature.featureId) ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              
                              {expandedFeatures.includes(feature.featureId) && feature.specialNote && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <div className="text-xs text-gray-500 mb-1">Special Note</div>
                                  <div className="text-sm text-gray-700">
                                    {feature.specialNote}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Images Preview */}
                    {packageDetails.images.length > 0 && (
                      <div className="bg-gradient-to-r from-gray-50 to-rose-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-rose-600" />
                          Images ({packageDetails.images.length})
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          {packageDetails.images.map((image) => (
                            <div 
                              key={image.imageId} 
                              className="aspect-square relative group"
                              style={{ borderLeftColor: image.color, borderLeftWidth: '3px' }}
                            >
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
                            All features and pricing details will be removed
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-red-700">
                            All booking records for this package will be affected
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
                        Terminate Package Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Package details could not be loaded</p>
                <p className="text-gray-500 text-sm mt-2">
                  Please try selecting the package again
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
                    Confirm Package Termination
                  </h3>

                  {/* Message */}
                  <p className="text-gray-600 text-center mb-2">
                    Are you sure you want to permanently terminate
                  </p>
                  <p className="text-lg font-semibold text-red-600 text-center mb-6">
                    {selectedPackage?.packageName}?
                  </p>

                  {/* Pricing Warning */}
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-lg mb-6">
                    <div className="text-sm text-red-700 space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="text-lg">💰</span>
                        <span>Package Value: {formatPrice(packageDetails?.totalPrice || 0)}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <span>This will delete:</span>
                      </p>
                      <ul className="list-disc list-inside ml-6 space-y-1">
                        <li>{packageDetails?.schedules.length || 0} schedule(s)</li>
                        <li>{packageDetails?.features.length || 0} feature(s)</li>
                        <li>{packageDetails?.images.length || 0} image(s)</li>
                        <li>All booking records</li>
                        <li>Pricing and discount details</li>
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
                    By confirming, you acknowledge that all package data, schedules, features, and booking records will be permanently deleted.
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

export default TerminatePackagePage;