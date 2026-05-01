// app/destinations/categories/terminate/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import { useCommon } from "@/contexts/CommonContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import CommonSearch, {
  SearchItem,
} from "@/components/common-components/CommonSearch";
import { CategoryDetailsByIdResponse } from "@/types/destination-types";
import { hexToRgba } from "@/utils/functions";
import CategoryTerminationDetails from "@/components/destination-categories-components/destination-categories-terminate-components/CategoryTerminationDetails";
import TerminationConfirmationModal from "@/components/destination-categories-components/destination-categories-terminate-components/TerminationConfirmationModal";

// Category search item interface
interface CategorySearchItem extends SearchItem {
  id: number;
  name: string;
  description?: string;
}

const TerminateDestinationCategoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const { categories, loading: categoriesLoading } = useCommon();

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
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

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
    { label: "Terminate", href: "#" },
  ];

  const destinationCategories = categories?.destinationCategoryList || [];

  // Convert categories to search items format
  const searchItems: CategorySearchItem[] = destinationCategories.map(
    (cat) => ({
      id: cat.destinationCategoryId,
      name: cat.destinationCategoryName,
      description: cat.destinationCategoryDescription,
    }),
  );

  const selectedSearchItem: CategorySearchItem | null = selectedCategory
    ? {
        id: selectedCategory.id,
        name: selectedCategory.name,
        description: destinationCategories.find(
          (cat) => cat.destinationCategoryId === selectedCategory.id,
        )?.destinationCategoryDescription,
      }
    : null;

  // Load category details when selected
  const loadCategoryDetails = async (categoryId: number) => {
    setLoadingDetails(true);
    try {
      const response =
        await DestinationService.getCategoryDetailsById(categoryId);
      setCategoryDetails(response.data);
    } catch (err: any) {
      console.error("Error loading category details:", err);
      setToast({
        type: "error",
        title: "Error",
        message: "Failed to load category details",
      });
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

  const handleSelectCategory = (item: CategorySearchItem) => {
    const id = item.id as number;
    const name = item.name;
    setSelectedCategory({ id, name });

    // Update URL with selected category as query param
    const url = new URL(window.location.href);
    url.searchParams.set("categoryId", id.toString());
    router.replace(url.toString(), { scroll: false });

    loadCategoryDetails(id);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setCategoryDetails(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("categoryId");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminate = async () => {
    if (!selectedCategory) return;

    setTerminating(true);
    setToast(null);

    try {
      const response = await DestinationService.terminateDestinationCategory(
        selectedCategory.id,
      );
      setToast({
        type: "success",
        title: "Success!",
        message: response.message || "Category terminated successfully!",
      });

      setTimeout(() => {
        router.push(
          `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/categories/view`,
        );
      }, 2000);
    } catch (err: any) {
      console.error("Error terminating category:", err);
      setToast({
        type: "error",
        title: "Error",
        message: err.message || "Failed to terminate category",
      });
      setShowConfirmModal(false);
    } finally {
      setTerminating(false);
    }
  };

  // Custom render function for category items
  const renderCategoryItem = (
    item: CategorySearchItem,
    searchTerm: string,
    isActive: boolean,
  ) => {
    const hexToRgba = (hex: string, opacity: number) => {
      if (!hex) return `rgba(0, 0, 0, ${opacity})`;
      hex = hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const highlightMatch = (text: string, query: string) => {
      if (!query.trim()) return text;
      const parts = text.split(new RegExp(`(${query})`, "gi"));
      return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            style={{
              backgroundColor: hexToRgba(theme.error, 0.18),
              color: theme.error,
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

    return (
      <>
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            background: isActive
              ? `linear-gradient(135deg, ${theme.error}, ${theme.error}CC)`
              : hexToRgba(theme.error, 0.1),
          }}
        >
          <span
            className="text-sm"
            style={{ color: isActive ? "#fff" : theme.error }}
          >
            🏷️
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm" style={{ color: theme.text }}>
            {highlightMatch(item.name, searchTerm)}
          </div>
          {item.description && (
            <div
              className="text-xs mt-0.5"
              style={{ color: theme.textSecondary }}
            >
              {item.description.length > 60
                ? `${item.description.substring(0, 60)}...`
                : item.description}
            </div>
          )}
        </div>
      </>
    );
  };

  if (categoriesLoading) {
    return (
      <CommonLoading
        message="Loading categories..."
        subMessage="Please wait while we fetch available categories"
        size="lg"
        fullScreen={true}
      />
    );
  }

  if (!selectedCategory && !categoryIdFromQuery) {
    return (
      <div
        className="min-h-screen transition-colors duration-300"
        style={{ backgroundColor: theme.background }}
      >
        <div
          className="sticky top-0 z-10 backdrop-blur-sm border-b transition-all duration-300"
          style={{
            backgroundColor: `${theme.surface}D9`,
            borderColor: theme.border,
          }}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <PageHeader
              title="Terminate Category"
              description="Search and select a category to terminate"
              breadcrumbItems={breadcrumbItems}
            />
          </div>
        </div>

        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <span className="text-lg">⚠️</span>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                Warning: Terminating a category will permanently remove it. This
                action cannot be undone.
              </p>
            </div>

            <h2
              className="text-xl font-semibold mb-6 flex items-center gap-2"
              style={{ color: theme.text }}
            >
              Select Category to Terminate
            </h2>

            <CommonSearch<CategorySearchItem>
              items={searchItems}
              loading={categoriesLoading}
              selectedItem={selectedSearchItem}
              onSelectItem={handleSelectCategory}
              onClearSelection={handleClearSelection}
              initialSearchTerm=""
              placeholder="Search categories..."
              title="Categories"
              variant="error"
              size="md"
              getBadgeText={(item) => `ID: ${item.id}`}
              renderItem={renderCategoryItem}
            />
          </div>
        </div>
      </div>
    );
  }

  if (loadingDetails) {
    return (
      <CommonLoading
        message="Loading category details..."
        subMessage="Please wait while we fetch category information"
        size="lg"
        fullScreen={true}
      />
    );
  }

  if (!categoryDetails) {
    return (
      <CommonErrorState
        error="Failed to load category details"
        title="Failed to Load Category"
        message="The category couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleClearSelection}
        onRetry={() =>
          selectedCategory && loadCategoryDetails(selectedCategory.id)
        }
        backButtonText="Go Back to Selection"
        retryButtonText="Try Again"
        fullScreen={true}
      />
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Toast Notifications */}
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-all duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Terminate Category"
            description="Permanently remove a destination category"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Selected Category Info Bar */}
        <SelectedItemBar
          item={
            selectedCategory
              ? {
                  id: selectedCategory.id,
                  name: selectedCategory.name,
                }
              : null
          }
          onClear={handleClearSelection}
          variant="error"
          title="Selected for Termination"
          showId={true}
          clearButtonText="Change Category"
          size="md"
        />

        {/* Category Details */}
        <CategoryTerminationDetails
          categoryDetails={categoryDetails}
          onTerminate={() => setShowConfirmModal(true)}
          terminating={terminating}
        />

        {/* Warning Card */}
        <div
          className="mt-6 rounded-2xl shadow-lg p-6"
          style={{
            backgroundColor: hexToRgba(theme.error, 0.05),
            border: `1px solid ${hexToRgba(theme.error, 0.3)}`,
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
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
          className="cursor-pointer relative w-full mt-6 py-3.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2.5 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed outline-none active:scale-[0.98] hover:scale-[1.01] transition-all duration-200"
          style={{
            background: terminating
              ? `${theme.error}99`
              : `linear-gradient(135deg, ${theme.error}EE 0%, ${theme.error}BB 100%)`,
            boxShadow: terminating
              ? "none"
              : `0 4px 14px ${theme.error}40, 0 1px 3px rgba(0,0,0,0.12)`,
            border: `1px solid ${theme.error}30`,
          }}
        >
          {/* Shimmer */}
          {!terminating && (
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.10) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2.8s infinite",
              }}
            />
          )}

          {terminating ? (
            <span className="flex items-center gap-2.5">
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="2.5"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="tracking-wide">Terminating…</span>
            </span>
          ) : (
            <span className="tracking-wide">Terminate Category</span>
          )}

          <style>{`
    @keyframes shimmer {
      0%   { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
  `}</style>
        </button>
      </div>

      {/* Confirmation Modal */}
      <TerminationConfirmationModal
        isOpen={showConfirmModal}
        categoryName={selectedCategory?.name || ""}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleTerminate}
        loading={terminating}
      />
    </div>
  );
};

export default TerminateDestinationCategoryPage;
