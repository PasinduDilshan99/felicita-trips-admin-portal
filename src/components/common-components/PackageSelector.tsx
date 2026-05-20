// components/common-components/PackageSelector.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Package, Search, ChevronDown, Check, AlertCircle, Loader, Calendar, Users, DollarSign, MapPin, Clock, Tag } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { PackageService } from "@/services/packageService";
import { TourPackage } from "@/types/package-types";

export interface PackageForTerminate {
  packageId: number;
  packageName: string;
}

interface PackageSelectorProps {
  selectedPackageId?: number;
  onPackageSelect: (packageId: number, packageDetails?: TourPackage) => void;
  onPackageClear?: () => void;
  error?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
  showDetails?: boolean;
  fetchDetails?: boolean;
}

export const PackageSelector: React.FC<PackageSelectorProps> = ({
  selectedPackageId,
  onPackageSelect,
  onPackageClear,
  error,
  required = false,
  label = "Select Package",
  placeholder = "Search and select a package...",
  showDetails = true,
  fetchDetails = true,
}) => {
  const { theme } = useTheme();
  const [packages, setPackages] = useState<PackageForTerminate[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageForTerminate | null>(null);
  const [packageDetails, setPackageDetails] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extracted outside JSX to avoid TypeScript narrowing to `never` inside ternary branches
  const currentSelectedId: number | null = selectedPackage?.packageId ?? null;

  const fetchPackageDetails = async (packageId: number) => {
    try {
      setLoadingDetails(true);
      const response = await PackageService.getPackageById(packageId);
      if (response.code === 200 && response.data) {
        const details = response.data;
        setPackageDetails(details);
        onPackageSelect(packageId, details);
      }
    } catch (err) {
      console.error("Error fetching package details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fetch packages on mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await PackageService.getPackagesForTerminate();
        if (response.code === 200 && response.data) {
          const data: PackageForTerminate[] = response.data;
          setPackages(data);

          if (selectedPackageId && selectedPackageId > 0) {
            const preSelected = data.find((p: PackageForTerminate) => p.packageId === selectedPackageId);
            if (preSelected) {
              setSelectedPackage(preSelected);
              if (fetchDetails) {
                await fetchPackageDetails(preSelected.packageId);
              } else {
                onPackageSelect(preSelected.packageId);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPackageId]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when dropdown is open
  useEffect(() => {
    if (isDropdownOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isDropdownOpen]);

  const filteredPackages: PackageForTerminate[] = React.useMemo(() => {
    if (!searchQuery.trim()) return packages;
    return packages.filter((pkg: PackageForTerminate) =>
      pkg.packageName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [packages, searchQuery]);

  const handleSelectPackage = (pkg: PackageForTerminate) => {
    setSelectedPackage(pkg);
    setIsDropdownOpen(false);
    setSearchQuery("");
    if (fetchDetails) {
      fetchPackageDetails(pkg.packageId);
    } else {
      onPackageSelect(pkg.packageId);
    }
  };

  const handleClearPackage = () => {
    setSelectedPackage(null);
    setPackageDetails(null);
    if (onPackageClear) onPackageClear();
    onPackageSelect(0);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${error ? theme.error : theme.border}`,
        boxShadow: error
          ? `0 0 0 3px ${theme.error}18`
          : "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <span
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
        >
          <Package className="w-4 h-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold leading-tight" style={{ color: theme.text }}>
            {label}
            {required && <span style={{ color: theme.error }}> *</span>}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
            Search and select a package
          </p>
        </div>
        {selectedPackage && (
          <button
            type="button"
            onClick={handleClearPackage}
            className="ml-auto text-xs px-2 py-1 rounded-lg transition-colors hover:bg-opacity-20"
            style={{ color: theme.error }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="px-6 py-6 space-y-4">
        {!selectedPackage ? (
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: theme.textSecondary }}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => {
                  setIsDropdownOpen(true);
                  const scrollY = window.scrollY;
                  setTimeout(() => window.scrollTo(0, scrollY), 0);
                }}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 focus:outline-none text-sm transition-all duration-200"
                style={{
                  backgroundColor: theme.background,
                  borderColor: isDropdownOpen ? theme.primary : theme.border,
                  color: theme.text,
                }}
              />
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform duration-200 cursor-pointer"
                style={{
                  color: theme.textSecondary,
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              />
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div
                className="absolute w-full mt-2 rounded-xl shadow-lg z-50"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  maxHeight: "300px",
                  overflowY: "auto",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                }}
              >
                {loading ? (
                  <div className="p-4 text-center text-sm" style={{ color: theme.textSecondary }}>
                    <Loader
                      className="w-5 h-5 animate-spin mx-auto mb-2"
                      style={{ color: theme.primary }}
                    />
                    Loading packages...
                  </div>
                ) : filteredPackages.length === 0 ? (
                  <div className="p-4 text-center text-sm" style={{ color: theme.textSecondary }}>
                    {searchQuery ? "No packages match your search" : "No packages available"}
                  </div>
                ) : (
                  filteredPackages.map((pkg: PackageForTerminate) => {
                    const isSelected: boolean = currentSelectedId === pkg.packageId;
                    return (
                      <button
                        key={pkg.packageId}
                        type="button"
                        onClick={() => handleSelectPackage(pkg)}
                        className="w-full px-4 py-3 text-left transition-all duration-150 flex items-center justify-between group"
                        style={{
                          backgroundColor: isSelected ? `${theme.primary}10` : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = `${theme.border}30`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-1.5 h-1.5 rounded-full transition-all duration-200 group-hover:scale-150"
                              style={{
                                backgroundColor: isSelected ? theme.primary : theme.textSecondary,
                              }}
                            />
                            <p className="text-sm font-medium" style={{ color: theme.text }}>
                              {pkg.packageName}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check
                            className="w-4 h-4 ml-2 flex-shrink-0"
                            style={{ color: theme.primary }}
                          />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: `${theme.primary}08`,
                border: `1px solid ${theme.primary}20`,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4" style={{ color: theme.primary }} />
                    <p className="text-sm font-semibold" style={{ color: theme.text }}>
                      {selectedPackage.packageName}
                    </p>
                    {packageDetails?.packageTypeName && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${theme.primary}20`,
                          color: theme.primary,
                        }}
                      >
                        {packageDetails.packageTypeName}
                      </span>
                    )}
                  </div>

                  {loadingDetails ? (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader className="w-4 h-4 animate-spin" style={{ color: theme.primary }} />
                      <span className="text-xs" style={{ color: theme.textSecondary }}>
                        Loading package details...
                      </span>
                    </div>
                  ) : (
                    showDetails &&
                    packageDetails && (
                      <div className="space-y-3">
                        {/* Description */}
                        {packageDetails.packageDescription && (
                          <p className="text-sm" style={{ color: theme.textSecondary }}>
                            {packageDetails.packageDescription}
                          </p>
                        )}

                        {/* Package Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t" style={{ borderColor: theme.border }}>
                          {/* Tour Name */}
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
                            <div>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>Tour</p>
                              <p className="text-xs font-medium truncate" style={{ color: theme.text }}>
                                {packageDetails.tourName}
                              </p>
                            </div>
                          </div>

                          {/* Duration */}
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
                            <div>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>Duration</p>
                              <p className="text-xs font-medium" style={{ color: theme.text }}>
                                {packageDetails.duration} days
                              </p>
                            </div>
                          </div>

                          {/* Price Per Person */}
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
                            <div>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>Price/Person</p>
                              <p className="text-xs font-medium" style={{ color: theme.text }}>
                                {formatCurrency(packageDetails.pricePerPerson)}
                              </p>
                            </div>
                          </div>

                          {/* Total Price */}
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.success }} />
                            <div>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>Total Price</p>
                              <p className="text-xs font-medium" style={{ color: theme.text }}>
                                {formatCurrency(packageDetails.totalPrice)}
                              </p>
                            </div>
                          </div>

                          {/* Discount */}
                          {packageDetails.discountPercentage > 0 && (
                            <div className="flex items-center gap-2">
                              <Tag className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.warning }} />
                              <div>
                                <p className="text-xs" style={{ color: theme.textSecondary }}>Discount</p>
                                <p className="text-xs font-medium" style={{ color: theme.warning }}>
                                  {packageDetails.discountPercentage}%
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Capacity */}
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
                            <div>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>Capacity</p>
                              <p className="text-xs font-medium" style={{ color: theme.text }}>
                                {packageDetails.minPersonCount} - {packageDetails.maxPersonCount} persons
                              </p>
                            </div>
                          </div>

                          {/* Date Range */}
                          <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: theme.primary }} />
                            <div>
                              <p className="text-xs" style={{ color: theme.textSecondary }}>Package Dates</p>
                              <p className="text-xs font-medium" style={{ color: theme.text }}>
                                {formatDate(packageDetails.startDate)} - {formatDate(packageDetails.endDate)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Features Preview */}
                        {packageDetails.features && packageDetails.features.length > 0 && (
                          <div className="pt-2 border-t" style={{ borderColor: theme.border }}>
                            <p className="text-xs font-medium mb-2" style={{ color: theme.textSecondary }}>
                              Key Features:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {packageDetails.features.slice(0, 3).map((feature) => (
                                <span
                                  key={feature.featureId}
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: `${theme.primary}10`,
                                    color: theme.primary,
                                  }}
                                >
                                  {feature.featureName}
                                </span>
                              ))}
                              {packageDetails.features.length > 3 && (
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: theme.textSecondary }}>
                                  +{packageDetails.features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleClearPackage}
                  className="ml-3 text-xs px-2 py-1 rounded-lg transition-colors hover:bg-opacity-20 flex-shrink-0"
                  style={{ color: theme.error }}
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Helper Text */}
        {!error && !selectedPackage && packages.length > 0 && (
          <p className="text-xs" style={{ color: theme.textSecondary }}>
            Search and select a package from the list
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-xs flex items-center gap-1" style={{ color: theme.error }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
};