// app/packages/view/page.tsx
"use client";

import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_PACKAGES_PATH,
} from "@/utils/constant";
import React, { useState, useEffect, useCallback } from "react";
import PackageFilter from "@/components/packages-components/PackageFilter";
import PackageCard from "@/components/packages-components/PackageCard";
import PackageListCard from "@/components/packages-components/PackageListCard";
import PackagePagination from "@/components/packages-components/PackagePagination";
import { PackageService } from "@/services/packageService";
import { PackageFilterParams, TourPackage } from "@/types/package-types";
import { Loader2, Grid, List, Package, Tag, Users, Calendar, TrendingUp, DollarSign, Percent } from "lucide-react";

const PackagesViewPage = () => {
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
  ];

  const [filters, setFilters] = useState<PackageFilterParams>({
    name: null,
    minPrice: null,
    maxPrice: null,
    duration: null,
    packageType: null,
    location: null,
    minGroupSize: null,
    maxGroupSize: null,
    fromDate: null,
    toDate: null,
    pageSize: 6,
    pageNumber: 1,
  });

  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [availablePackageTypes, setAvailablePackageTypes] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [availableTourNames, setAvailableTourNames] = useState<string[]>([]);
  
  // New state for view mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchPackages = useCallback(async (currentFilters: PackageFilterParams) => {
    setLoading(true);
    try {
      const response = await PackageService.getPackages(currentFilters);
      const data = response.data;
      
      setPackages(data.packageResponseDtos);
      setTotalItems(data.packageCount);

      // Extract unique values for filters
      const packageTypes = PackageService.extractPackageTypes(data.packageResponseDtos);
      const locations = PackageService.extractLocations(data.packageResponseDtos);
      const tourNames = PackageService.extractTourNames(data.packageResponseDtos);
      
      setAvailablePackageTypes(packageTypes);
      setAvailableLocations(locations);
      setAvailableTourNames(tourNames);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPackages(filters);
  }, []);

  // Track previous filters for comparison
  const [prevFilters, setPrevFilters] = useState(filters);

  // Auto-refetch when pageSize or pageNumber changes
  useEffect(() => {
    if (filters.pageSize !== prevFilters.pageSize || filters.pageNumber !== prevFilters.pageNumber) {
      fetchPackages(filters);
      setPrevFilters(filters);
    }
  }, [filters.pageSize, filters.pageNumber, fetchPackages]);

  const handleFilterChange = (newFilters: PackageFilterParams) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Reset to first page when searching and fetch data
    const updatedFilters = { ...filters, pageNumber: 1 };
    setFilters(updatedFilters);
    fetchPackages(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, pageNumber: page }));
  };

  const toggleViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  // Calculate statistics
  const calculateStats = () => {
    const activePackages = packages.filter(p => p.packageStatus === 'ACTIVE').length;
    const totalRevenue = packages.reduce((sum, pkg) => sum + pkg.totalPrice, 0);
    const totalDiscount = packages.reduce((sum, pkg) => sum + PackageService.calculateSavings(pkg.totalPrice, pkg.discountPercentage), 0);
    const avgDiscount = packages.length > 0 
      ? packages.reduce((sum, pkg) => sum + pkg.discountPercentage, 0) / packages.length
      : 0;
    const totalSchedules = packages.reduce((sum, pkg) => sum + pkg.schedules.length, 0);
    
    return { activePackages, totalRevenue, totalDiscount, avgDiscount, totalSchedules };
  };

  const stats = calculateStats();

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto px-2 sm:px-4 lg:px-6 py-6">
        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <PageHeader
            title="Packages View"
            description="Explore and manage comprehensive travel packages with special offers"
            breadcrumbItems={breadcrumbItems}
          />
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalItems}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Packages</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activePackages}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Discount</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgDiscount.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                <Percent className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Schedules</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalSchedules}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">Total Package Value</p>
                <p className="text-3xl font-bold mt-2">LKR {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-white/80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-100">Total Customer Savings</p>
                <p className="text-3xl font-bold mt-2">LKR {stats.totalDiscount.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <PackageFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            availablePackageTypes={availablePackageTypes}
            availableLocations={availableLocations}
            availableTourNames={availableTourNames}
          />
        </div>

        {/* Results Header with View Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Package Results
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Showing <span className="font-semibold text-blue-600">{((filters.pageNumber - 1) * filters.pageSize) + 1}</span> to{' '}
                <span className="font-semibold text-blue-600">{Math.min(filters.pageNumber * filters.pageSize, totalItems)}</span> of{' '}
                <span className="font-semibold text-blue-600">{totalItems}</span> packages
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-600 font-medium">
                View as:
              </div>
              <div className="flex bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-1">
                <button
                  onClick={() => toggleViewMode('grid')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-white hover:text-blue-600'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Grid</span>
                </button>
                <button
                  onClick={() => toggleViewMode('list')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-white hover:text-blue-600'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">List</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full"></div>
              </div>
            </div>
            <span className="mt-4 text-lg font-medium text-gray-700">Loading packages...</span>
            <p className="mt-2 text-gray-500">Fetching amazing travel deals and offers</p>
          </div>
        )}

        {/* Packages Grid/List */}
        {!loading && (
          <>
            {packages.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <div className="text-2xl font-semibold text-gray-700 mb-2">No packages found</div>
                <p className="text-gray-500 mb-6">Try adjusting your search filters or explore different categories</p>
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {packages.map((pkg) => (
                      <PackageCard
                        key={pkg.packageId}
                        tourPackage={pkg}
                      />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-6 mb-8">
                    {packages.map((pkg) => (
                      <PackageListCard
                        key={pkg.packageId}
                        tourPackage={pkg}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="mt-10">
                  <PackagePagination
                    currentPage={filters.pageNumber}
                    totalItems={totalItems}
                    pageSize={filters.pageSize}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PackagesViewPage;