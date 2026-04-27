// app/destinations/categories/terminate/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
  PLACE_HOLDER_IMAGE,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Search,
  AlertTriangle,
  Trash2,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  MapPin,
  Tag,
  Eye,
  Calendar,
  Clock,
  Image as ImageIcon,
  Palette,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CategoryDetailsByIdResponse } from "@/types/destination-types";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return `rgba(0, 0, 0, ${opacity})`;
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const TerminateDestinationCategoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const { categories, loading: categoriesLoading } = useCommon();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get category ID from query params
  const categoryIdFromQuery = searchParams?.get("categoryId") ?? null;

  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [categoryDetails, setCategoryDetails] =
    useState<CategoryDetailsByIdResponse | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [terminating, setTerminating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "Categories",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/categories/view`,
    },
    {
      label: "Terminate",
      href: "#",
    },
  ];

  // Get destination categories from CommonContext
  const destinationCategories = categories?.destinationCategoryList || [];

  const filteredCategories = destinationCategories.filter((cat) =>
    cat.destinationCategoryName
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // Load category details when selected
  const loadCategoryDetails = async (categoryId: number) => {
    setLoadingDetails(true);
    setError(null);
    setCurrentImageIndex(0);
    try {
      const response =
        await DestinationService.getCategoryDetailsById(categoryId);
      setCategoryDetails(response.data);
    } catch (err: any) {
      console.error("Error loading category details:", err);
      setError("Failed to load category details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Load category if categoryId is in URL query params
  useEffect(() => {
    if (categoryIdFromQuery) {
      const id = parseInt(categoryIdFromQuery);
      if (!isNaN(id)) {
        const foundCategory = destinationCategories.find(
          (cat) => cat.destinationCategoryId === id,
        );
        setSelectedCategory({
          id,
          name: foundCategory?.destinationCategoryName || "",
        });
        loadCategoryDetails(id);
      }
    }
  }, [categoryIdFromQuery, destinationCategories]);

  const handleSelectCategory = (
    category: (typeof destinationCategories)[0],
  ) => {
    setSelectedCategory({
      id: category.destinationCategoryId,
      name: category.destinationCategoryName,
    });
    setSearchTerm(category.destinationCategoryName);
    setShowDropdown(false);
    setIsFocused(false);

    // Update URL with selected category as query param
    const url = new URL(window.location.href);
    url.searchParams.set(
      "categoryId",
      category.destinationCategoryId.toString(),
    );
    router.replace(url.toString(), { scroll: false });

    loadCategoryDetails(category.destinationCategoryId);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setCategoryDetails(null);
    setSearchTerm("");
    setShowDropdown(false);
    setError(null);
    setCurrentImageIndex(0);
    const url = new URL(window.location.href);
    url.searchParams.delete("categoryId");
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const handlePrevImage = () => {
    if (!categoryDetails?.images) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? categoryDetails.images.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    if (!categoryDetails?.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % categoryDetails.images.length);
  };

  const handleTerminate = async () => {
    if (!selectedCategory) return;

    setTerminating(true);
    setError(null);

    try {
      const response = await DestinationService.terminateDestinationCategory(
        selectedCategory.id,
      );
      setSuccessMessage(
        response.message || "Category terminated successfully!",
      );

      setTimeout(() => {
        router.push(
          `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/categories/view`,
        );
      }, 2000);
    } catch (err: any) {
      console.error("Error terminating category:", err);
      setError(err.message || "Failed to terminate category");
      setShowConfirmModal(false);
    } finally {
      setTerminating(false);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.18),
            color: theme.primary,
            fontWeight: 600,
            borderRadius: "2px",
            padding: "0 1px",
          }}
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show category selection if no category is selected
  if (!selectedCategory && !categoryIdFromQuery) {
    return (
      <div
        className="min-h-screen transition-colors duration-300"
        style={{ backgroundColor: theme.background }}
      >
        <div
          className="sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
          style={{
            backgroundColor: `${theme.surface}D9`,
            borderColor: theme.border,
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <PageHeader
              title="Terminate Category"
              description="Search and select a category to terminate"
              breadcrumbItems={breadcrumbItems}
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-12">
          <div
            className="rounded-2xl shadow-lg p-8"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              className="flex items-center gap-3 mb-6 p-3 rounded-xl"
              style={{
                backgroundColor: hexToRgba(theme.error, 0.1),
                border: `1px solid ${hexToRgba(theme.error, 0.3)}`,
              }}
            >
              <AlertTriangle
                className="w-5 h-5 flex-shrink-0"
                style={{ color: theme.error }}
              />
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                Warning: Terminating a category will permanently remove it. This
                action cannot be undone.
              </p>
            </div>

            <h2
              className="text-xl font-semibold mb-6 flex items-center gap-2"
              style={{ color: theme.text }}
            >
              <Search className="w-5 h-5" style={{ color: theme.primary }} />
              Select Category to Terminate
            </h2>

            {/* Enhanced Search Input */}
            <div className="relative">
              <div
                className={`flex items-center rounded-xl border-2 transition-all duration-200 ${
                  isFocused ? "focused" : ""
                }`}
                style={{
                  borderColor: isFocused ? theme.primary : theme.border,
                  backgroundColor: isFocused
                    ? hexToRgba(theme.primary, 0.02)
                    : theme.surface,
                  boxShadow: isFocused
                    ? `0 0 0 4px ${hexToRgba(theme.primary, 0.12)}`
                    : "none",
                }}
              >
                <Search
                  className="ml-4 flex-shrink-0"
                  size={17}
                  style={{
                    color: isFocused ? theme.primary : theme.textSecondary,
                  }}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    setIsFocused(true);
                    setShowDropdown(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowDropdown(false);
                      setIsFocused(false);
                    }, 200);
                  }}
                  placeholder="Search categories..."
                  className="flex-1 px-3 py-3.5 bg-transparent outline-none text-sm"
                  style={{ color: theme.text }}
                />
                {searchTerm && (
                  <button
                    className="mr-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: hexToRgba(theme.primary, 0.15),
                      color: theme.primary,
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Dropdown Results */}
              {showDropdown && (
                <div
                  className="absolute z-50 w-full mt-2 rounded-xl border-2 shadow-lg overflow-hidden"
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  }}
                >
                  <div className="max-h-72 overflow-y-auto">
                    {categoriesLoading ? (
                      <div className="p-8 text-center">
                        <Loader2
                          className="w-8 h-8 animate-spin mx-auto"
                          style={{ color: theme.primary }}
                        />
                        <p
                          className="mt-2 text-sm"
                          style={{ color: theme.textSecondary }}
                        >
                          Loading categories...
                        </p>
                      </div>
                    ) : filteredCategories.length === 0 ? (
                      <div className="p-8 text-center">
                        <AlertCircle
                          className="w-8 h-8 mx-auto mb-2"
                          style={{ color: theme.textSecondary }}
                        />
                        <p style={{ color: theme.textSecondary }}>
                          No categories found
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: theme.textSecondary }}
                        >
                          {searchTerm
                            ? "Try a different search term"
                            : "Start typing to search"}
                        </p>
                      </div>
                    ) : (
                      filteredCategories.map((category, idx) => (
                        <button
                          key={category.destinationCategoryId}
                          className="w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-3"
                          style={{
                            backgroundColor: "transparent",
                            borderBottom: `1px solid ${hexToRgba(theme.border, 0.5)}`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = hexToRgba(
                              theme.primary,
                              0.05,
                            );
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                          onClick={() => handleSelectCategory(category)}
                        >
                          <div
                            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              background: hexToRgba(theme.error, 0.1),
                            }}
                          >
                            <Tag size={14} style={{ color: theme.error }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-medium text-sm"
                              style={{ color: theme.text }}
                            >
                              {searchTerm
                                ? highlightMatch(
                                    category.destinationCategoryName,
                                    searchTerm,
                                  )
                                : category.destinationCategoryName}
                            </div>
                            <div
                              className="text-xs mt-0.5"
                              style={{ color: theme.textSecondary }}
                            >
                              ID: {category.destinationCategoryId}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading category details
  if (loadingDetails) {
    return (
      <div
        className="min-h-screen transition-colors duration-300"
        style={{ backgroundColor: theme.background }}
      >
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div
            className="flex flex-col justify-center items-center py-16 rounded-xl shadow-sm border"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            <Loader2
              className="w-12 h-12 animate-spin"
              style={{ color: theme.primary }}
            />
            <span
              className="mt-4 text-lg font-medium"
              style={{ color: theme.text }}
            >
              Loading category details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <PageHeader
            title="Terminate Category"
            description="Permanently remove a destination category"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Success Message */}
        {successMessage && (
          <div
            className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-slide-down"
            style={{
              backgroundColor: hexToRgba(theme.success, 0.1),
              border: `1px solid ${theme.success}`,
            }}
          >
            <CheckCircle
              className="w-5 h-5 flex-shrink-0"
              style={{ color: theme.success }}
            />
            <span style={{ color: theme.text }}>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-shake"
            style={{
              backgroundColor: hexToRgba(theme.error, 0.1),
              border: `1px solid ${theme.error}`,
            }}
          >
            <AlertCircle
              className="w-5 h-5 flex-shrink-0"
              style={{ color: theme.error }}
            />
            <span style={{ color: theme.text }}>{error}</span>
          </div>
        )}

        {/* Selected Category Info Bar */}
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between flex-wrap gap-4"
          style={{
            backgroundColor: hexToRgba(theme.primary, 0.1),
            border: `1px solid ${theme.primary}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.2)}, ${hexToRgba(theme.primary, 0.1)})`,
              }}
            >
              <Tag className="w-5 h-5" style={{ color: theme.primary }} />
            </div>
            <div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                Selected Category
              </div>
              <div
                className="font-semibold text-lg"
                style={{ color: theme.text }}
              >
                {selectedCategory?.name}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                ID: {selectedCategory?.id}
              </div>
            </div>
          </div>
          <button
            onClick={handleClearSelection}
            disabled={terminating}
            className="px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              border: `1px solid ${theme.border}`,
              color: theme.textSecondary,
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              if (!terminating) {
                e.currentTarget.style.backgroundColor = hexToRgba(
                  theme.primary,
                  0.05,
                );
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X className="w-4 h-4" />
            Change Category
          </button>
        </div>

        {/* Category Details Grid */}
        {categoryDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Images & Basic Info */}
            <div className="space-y-6">
              {/* Image Gallery */}
              <div
                className="rounded-2xl shadow-lg overflow-hidden"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div className="relative aspect-video bg-black/5">
                  <img
                    src={
                      categoryDetails.images[currentImageIndex]?.imageUrl ||
                      PLACE_HOLDER_IMAGE
                    }
                    alt={
                      categoryDetails.images[currentImageIndex]?.imageName ||
                      categoryDetails.category
                    }
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                    }}
                  />

                  {/* Image Counter */}
                  {categoryDetails.images.length > 0 && (
                    <div className="absolute bottom-4 right-4">
                      <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" />
                        {currentImageIndex + 1} /{" "}
                        {categoryDetails.images.length}
                      </span>
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {categoryDetails.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-800" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {categoryDetails.images.length > 1 && (
                  <div
                    className="p-4 border-t"
                    style={{ borderColor: theme.border }}
                  >
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {categoryDetails.images.map((image, index) => (
                        <div
                          key={image.imageId}
                          className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                            currentImageIndex === index
                              ? "ring-2 ring-offset-2"
                              : ""
                          }`}
                          style={{
                            boxShadow:
                              currentImageIndex === index
                                ? `0 0 0 2px ${categoryDetails.color || theme.primary}`
                                : "none",
                            borderRadius: "8px",
                          }}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={image.imageUrl}
                            alt={image.imageName}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                PLACE_HOLDER_IMAGE;
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div
                className="rounded-2xl shadow-lg p-6"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: theme.textSecondary }}
                  >
                    Current Status
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      categoryDetails.categoryStatus === "ACTIVE"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {categoryDetails.categoryStatus === "ACTIVE" ? (
                      <>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Active
                      </>
                    ) : (
                      "Inactive"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div
                className="rounded-2xl shadow-lg p-6"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <h2
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <FileText
                    className="w-5 h-5"
                    style={{ color: categoryDetails.color || theme.primary }}
                  />
                  Basic Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <div
                      className="text-sm font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Category Name
                    </div>
                    <div
                      className="text-base font-semibold px-3 py-2 rounded-lg"
                      style={{
                        color: categoryDetails.color || theme.primary,
                        backgroundColor: hexToRgba(
                          categoryDetails.color || theme.primary,
                          0.1,
                        ),
                      }}
                    >
                      {categoryDetails.category}
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-sm font-medium mb-1"
                      style={{ color: theme.textSecondary }}
                    >
                      Description
                    </div>
                    <p
                      className="text-sm leading-relaxed px-3 py-2 rounded-lg"
                      style={{
                        color: theme.text,
                        backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                      }}
                    >
                      {categoryDetails.categoryDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Brand Colors */}
              <div
                className="rounded-2xl shadow-lg p-6"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <h2
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <Palette
                    className="w-5 h-5"
                    style={{ color: categoryDetails.color || theme.primary }}
                  />
                  Brand Colors
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div
                      className="text-sm font-medium mb-2"
                      style={{ color: theme.textSecondary }}
                    >
                      Primary Color
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg shadow-md"
                        style={{
                          backgroundColor:
                            categoryDetails.color || theme.primary,
                        }}
                      />
                      <code
                        className="px-2 py-1 rounded text-sm"
                        style={{
                          backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                          color: theme.text,
                        }}
                      >
                        {categoryDetails.color || theme.primary}
                      </code>
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-sm font-medium mb-2"
                      style={{ color: theme.textSecondary }}
                    >
                      Hover Color
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg shadow-md"
                        style={{
                          backgroundColor:
                            categoryDetails.hoverColor || theme.accent,
                        }}
                      />
                      <code
                        className="px-2 py-1 rounded text-sm"
                        style={{
                          backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                          color: theme.text,
                        }}
                      >
                        {categoryDetails.hoverColor || theme.accent}
                      </code>
                    </div>
                  </div>
                </div>
                <div
                  className="mt-4 pt-3 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <div
                    className="h-12 rounded-lg transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${categoryDetails.color || theme.primary}, ${
                        categoryDetails.hoverColor || theme.accent
                      })`,
                    }}
                  />
                </div>
              </div>

              {/* Statistics */}
              <div
                className="rounded-2xl shadow-lg p-6"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <h2
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <ImageIcon
                    className="w-5 h-5"
                    style={{ color: categoryDetails.color || theme.primary }}
                  />
                  Statistics
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{
                      backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: hexToRgba(
                          categoryDetails.color || theme.primary,
                          0.1,
                        ),
                      }}
                    >
                      <ImageIcon
                        className="w-5 h-5"
                        style={{
                          color: categoryDetails.color || theme.primary,
                        }}
                      />
                    </div>
                    <div>
                      <div
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        Total Images
                      </div>
                      <div
                        className="text-xl font-bold"
                        style={{ color: theme.text }}
                      >
                        {categoryDetails.images.length}
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{
                      backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: hexToRgba(theme.warning, 0.1) }}
                    >
                      <MapPin
                        className="w-5 h-5"
                        style={{ color: theme.warning }}
                      />
                    </div>
                    <div>
                      <div
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        Destinations
                      </div>
                      <div
                        className="text-xl font-bold"
                        style={{ color: theme.text }}
                      >
                        {categoryDetails.destinations?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div
                className="rounded-2xl shadow-lg p-6"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <h2
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: theme.text }}
                >
                  <Calendar
                    className="w-5 h-5"
                    style={{ color: categoryDetails.color || theme.primary }}
                  />
                  Timestamps
                </h2>
                <div className="space-y-3">
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{
                      backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                    }}
                  >
                    <Calendar
                      className="w-5 h-5"
                      style={{ color: theme.warning }}
                    />
                    <div>
                      <div
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        Created At
                      </div>
                      <div
                        className="text-sm font-semibold"
                        style={{ color: theme.text }}
                      >
                        {formatDate(categoryDetails.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{
                      backgroundColor: hexToRgba(theme.textSecondary, 0.05),
                    }}
                  >
                    <Clock
                      className="w-5 h-5"
                      style={{ color: theme.primary }}
                    />
                    <div>
                      <div
                        className="text-xs"
                        style={{ color: theme.textSecondary }}
                      >
                        Last Updated
                      </div>
                      <div
                        className="text-sm font-semibold"
                        style={{ color: theme.text }}
                      >
                        {formatDate(categoryDetails.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning Card */}
        <div
          className="mt-6 rounded-2xl shadow-lg p-6"
          style={{
            backgroundColor: hexToRgba(theme.error, 0.05),
            border: `1px solid ${hexToRgba(theme.error, 0.3)}`,
          }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="w-6 h-6 flex-shrink-0"
              style={{ color: theme.error }}
            />
            <div>
              <h3 className="font-semibold mb-1" style={{ color: theme.error }}>
                Warning: This action cannot be undone
              </h3>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                Terminating this category will permanently remove it from the
                system. Any destinations associated with this category will no
                longer have this category assigned.
              </p>
            </div>
          </div>
        </div>

        {/* Terminate Button */}
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={terminating}
          className="w-full mt-6 py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          style={{
            background: `linear-gradient(135deg, ${theme.error}, ${theme.error}CC)`,
          }}
        >
          {terminating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Terminating...
            </>
          ) : (
            <>
              <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
              Terminate Category
            </>
          )}
        </button>
      </div>

      {/* Confirmation Modal with Animation */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => !terminating && setShowConfirmModal(false)}
        >
          <div
            className="max-w-md w-full mx-4 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-6"
              style={{
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse-once"
                  style={{ backgroundColor: hexToRgba(theme.error, 0.1) }}
                >
                  <AlertTriangle
                    className="w-6 h-6"
                    style={{ color: theme.error }}
                  />
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: theme.text }}
                  >
                    Confirm Termination
                  </h3>
                  <p
                    className="text-sm mt-1"
                    style={{ color: theme.textSecondary }}
                  >
                    Are you sure you want to terminate this category?
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  You are about to terminate{" "}
                  <span
                    className="font-semibold"
                    style={{ color: theme.error }}
                  >
                    {selectedCategory?.name}
                  </span>
                  . This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={terminating}
                  className="flex-1 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    border: `1px solid ${theme.border}`,
                    color: theme.textSecondary,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!terminating) {
                      e.currentTarget.style.backgroundColor = hexToRgba(
                        theme.primary,
                        0.05,
                      );
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleTerminate}
                  disabled={terminating}
                  className="flex-1 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: theme.error,
                    color: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    if (!terminating) {
                      e.currentTarget.style.opacity = "0.9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  {terminating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Terminating...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Yes, Terminate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(2px);
          }
        }

        @keyframes pulse-once {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }

        .animate-pulse-once {
          animation: pulse-once 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TerminateDestinationCategoryPage;
