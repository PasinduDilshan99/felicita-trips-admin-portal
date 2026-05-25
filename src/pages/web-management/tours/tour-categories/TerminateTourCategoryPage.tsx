// app/web-management/tour-categories/terminate/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
} from "@/utils/constant";
import { TourCategoryService } from "@/services/tourCategoryService";
import { TourCategoryDetails } from "@/types/tour-category-types";
import { AlertTriangle, Search, Calendar, User, Clock, Palette, Info, MapPin, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToastNotification } from "@/components/common-components/ToastNotification";
import ImageModal, { ImageModalImage } from "@/components/common-components/ImageModal";
import CommonSearch from "@/components/common-components/CommonSearch";
import SelectedItemBar from "@/components/common-components/SelectedItemBar";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import { ImagesPanel } from "@/components/common-components/terminate-components/ImagesPanel";
import { ImpactWarning } from "@/components/common-components/terminate-components/ImpactWarning";
import { TerminationItem, TerminationModal } from "@/components/common-components/terminate-components/TerminationModal";
import { useCommon } from "@/contexts/CommonContext";
import { TourCategoryStats } from "@/components/tour-category-components/terminate-tour-category-components/TourCategoryStats";
import { BasicInfoPanel } from "@/components/tour-category-components/terminate-tour-category-components/BasicInfoPanel";
import { ToursList } from "@/components/tour-category-components/terminate-tour-category-components/ToursList";

const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Type for search items
interface TourCategorySearchItem {
  id: number;
  name: string;
}

const TerminateTourCategoryPage = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categories, loading: commonLoading } = useCommon();

  const initialCategoryName = searchParams?.get("category-name") || "";
  const initialCategoryId = searchParams?.get("category-id") || "";

  const [selectedCategory, setSelectedCategory] = useState<{ categoryId: number; categoryName: string } | null>(
    initialCategoryId && initialCategoryName
      ? {
          categoryId: parseInt(initialCategoryId),
          categoryName: initialCategoryName,
        }
      : null,
  );
  const [categoryDetails, setCategoryDetails] = useState<TourCategoryDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingTerminate, setLoadingTerminate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    actionLink?: string;
  } | null>(null);

  // Image modal state
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Tour Categories",
      href: `${WEB_MANAGEMENT_PATH}/tour-categories`,
    },
    {
      label: "Terminate",
      href: `${WEB_MANAGEMENT_PATH}/tour-categories/terminate`,
    },
  ];

  // Get tour categories from common context
  const tourCategories = categories?.tourCategoryList || [];
  
  const searchItems: TourCategorySearchItem[] = tourCategories.map((cat) => ({
    id: cat.tourCategoryId,
    name: cat.tourCategoryName,
  }));

  const fetchCategoryDetails = async (id: number) => {
    setLoadingDetails(true);
    setError(null);
    setCategoryDetails(null);
    try {
      const response = await TourCategoryService.getTourCategoryDetails(id);
      setCategoryDetails(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load tour category details");
      setToast({
        type: "error",
        title: "Load Failed",
        message: err.message || "Failed to load tour category details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSelectCategory = async (id: number, name: string) => {
    setSelectedCategory({ categoryId: id, categoryName: name });
    await fetchCategoryDetails(id);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("category-id", id.toString());
    url.searchParams.set("category-name", name);
    router.replace(url.toString(), { scroll: false });
  };

  const handleClearCategorySelection = () => {
    setSelectedCategory(null);
    setCategoryDetails(null);
    setError(null);
    setSuccess(null);

    // Update URL to remove query params
    const url = new URL(window.location.href);
    url.searchParams.delete("category-id");
    url.searchParams.delete("category-name");
    router.replace(url.toString(), { scroll: false });
  };

  const handleTerminateClick = () => {
    if (!selectedCategory) return;
    setShowConfirmModal(true);
  };

  const handleConfirmTerminate = async () => {
    if (!selectedCategory) return;

    setLoadingTerminate(true);
    setError(null);
    setSuccess(null);

    try {
      await TourCategoryService.terminateTourCategory(selectedCategory.categoryId);

      setSuccess("Tour category terminated successfully!");
      setToast({
        type: "success",
        title: "Termination Successful!",
        message: `"${selectedCategory.categoryName}" has been permanently removed from the system.`,
      });

      setShowConfirmModal(false);

      setTimeout(() => {
        handleClearCategorySelection();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to terminate tour category");
      setToast({
        type: "error",
        title: "Termination Failed",
        message: err.message || "Failed to terminate tour category. Please try again.",
      });
    } finally {
      setLoadingTerminate(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!categoryDetails?.images) return [];
    return categoryDetails.images.map((img) => ({
      url: img.imageUrl,
      name: img.name,
      description: img.description || "",
      id: img.imageId,
    }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setImageModalOpen(true);
  };

  const selectedSearchItem: TourCategorySearchItem | null = selectedCategory
    ? {
        id: selectedCategory.categoryId,
        name: selectedCategory.categoryName,
      }
    : null;

  // Prepare termination item for modal
  const terminationItem: TerminationItem | null = selectedCategory
    ? {
        id: selectedCategory.categoryId,
        name: selectedCategory.categoryName,
        type: "custom",
        additionalInfo: "Tour Category",
      }
    : null;

  useEffect(() => {
    if (initialCategoryId && !categoryDetails) {
      handleSelectCategory(parseInt(initialCategoryId), initialCategoryName);
    }
  }, [initialCategoryId, initialCategoryName]);

  if ((commonLoading && tourCategories.length === 0) || (loading && !selectedCategory)) {
    return (
      <CommonLoading
        message="Loading tour categories..."
        subMessage="Please wait while we fetch available tour categories"
        size="lg"
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
          actionLink={toast.actionLink}
          actionText="View Details"
        />
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-sm border-b transition-all duration-300"
        style={{
          backgroundColor: `${theme.surface}CC`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Terminate Tour Category"
            description="Permanently remove a tour category from the system"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section - Only show when no category is selected */}
        {!selectedCategory && (
          <div
            className="rounded-2xl shadow-lg mb-8 transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <div
              className="px-5 sm:px-6 py-4 flex items-center gap-3 border-b"
              style={{ borderColor: theme.border }}
            >
              <span
                className="w-9 h-9 flex items-center justify-center rounded-xl"
                style={{
                  background: hexToRgba(theme.error, 0.1),
                  color: theme.error,
                }}
              >
                <Search className="w-4 h-4" />
              </span>
              <div>
                <h2
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: theme.text }}
                >
                  Select Tour Category to Terminate
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: theme.textSecondary }}
                >
                  Search and select a category to review its data before termination
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-5">
              <CommonSearch<TourCategorySearchItem>
                items={searchItems}
                loading={commonLoading}
                selectedItem={selectedSearchItem}
                onSelectItem={(item) => handleSelectCategory(item.id, item.name)}
                onClearSelection={handleClearCategorySelection}
                initialSearchTerm={initialCategoryName}
                placeholder="Search tour categories..."
                title="Tour Categories"
                variant="error"
                size="md"
                getBadgeText={(item) => `ID: ${item.id}`}
              />
            </div>
          </div>
        )}

        {/* Selected Category Info Bar */}
        <SelectedItemBar
          item={
            selectedCategory
              ? {
                  id: selectedCategory.categoryId,
                  name: selectedCategory.categoryName,
                }
              : null
          }
          onClear={handleClearCategorySelection}
          variant="error"
          title="Selected for Termination"
          showId={true}
          clearButtonText="Change Selection"
          size="md"
        />

        {/* Category Details Section */}
        {selectedCategory && (
          <div
            className="rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              border: `1.5px solid ${hexToRgba(theme.error, 0.5)}`,
              boxShadow: `0 4px 32px ${hexToRgba(theme.error, 0.07)}`,
            }}
          >
            {/* Warning Header */}
            <div
              className="px-5 sm:px-6 py-4 flex flex-wrap items-center gap-4"
              style={{
                background: `linear-gradient(90deg, ${hexToRgba(theme.error, 0.08)}, ${hexToRgba(theme.error, 0.03)})`,
                borderBottom: `1.5px solid ${hexToRgba(theme.error, 0.3)}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.error}, ${theme.error})`,
                  color: "#fff",
                }}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold" style={{ color: theme.error }}>
                  Tour Category Termination Review
                </h2>
                <p className="text-xs mt-0.5" style={{ color: theme.error }}>
                  Review all data carefully. This action is permanent and cannot be undone.
                </p>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl flex-shrink-0"
                style={{
                  background: hexToRgba(theme.error, 0.08),
                  border: `1px solid ${hexToRgba(theme.error, 0.2)}`,
                }}
              >
                <span className="text-xs" style={{ color: theme.error }}>
                  ID
                </span>
                <span className="text-sm font-bold" style={{ color: theme.error }}>
                  #{selectedCategory.categoryId}
                </span>
              </div>
            </div>

            {/* Loading Details */}
            {loadingDetails && (
              <CommonLoading
                message="Loading category details..."
                subMessage="Please wait while we fetch the category information"
                size="lg"
              />
            )}

            {/* Category Details Content */}
            {!loadingDetails && categoryDetails && (
              <div className="p-5 sm:p-6 space-y-6">
                <TourCategoryStats categoryDetails={categoryDetails} />

                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  }}
                >
                  {/* Left Column */}
                  <div className="space-y-5">
                    <BasicInfoPanel categoryDetails={categoryDetails} />
                    <ImagesPanel
                      images={categoryDetails.images.map((img) => ({
                        id: img.imageId,
                        url: img.imageUrl,
                        name: img.name,
                        description: img.description || "",
                      }))}
                      onImageClick={handleImageClick}
                      title="Category Images"
                      showDeletionBadge={true}
                      deletionBadgeText="Will be deleted"
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <ToursList 
                      tours={categoryDetails.tours} 
                      primaryCategory={false}
                    />

                    {/* Custom Impact Warning for Tour Categories */}
                    <ImpactWarning
                      title="Tour Category Termination Impact"
                      customItems={[
                        {
                          icon: <MapPin size={11} />,
                          text: `All ${categoryDetails.totalTours} tours associated with this category will lose their category association`,
                        },
                        {
                          icon: <Star size={11} />,
                          text: "Tours that have this as primary category will need to be reassigned",
                        },
                        {
                          icon: <Palette size={11} />,
                          text: "All color and styling settings will be permanently removed",
                        },
                        {
                          icon: <Info size={11} />,
                          text: "All category descriptions and metadata will be deleted",
                        },
                        {
                          icon: <AlertTriangle size={11} />,
                          text: "This action cannot be undone — recovery is not possible",
                        },
                        {
                          icon: <AlertTriangle size={11} />,
                          text: "This termination will be logged for audit trail purposes",
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Termination Button */}
                <div
                  className="flex justify-center pt-4"
                  style={{
                    borderTop: `1.5px solid ${hexToRgba(theme.error, 0.2)}`,
                  }}
                >
                  <button
                    onClick={handleTerminateClick}
                    disabled={loadingTerminate}
                    className="cursor-pointer flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:hover:scale-100"
                    style={{
                      background: loadingTerminate
                        ? `linear-gradient(135deg, ${theme.error}, ${theme.error}dd)`
                        : `linear-gradient(135deg, ${theme.error}, ${hexToRgba(theme.error, 0.8)})`,
                      color: "#fff",
                      opacity: loadingTerminate ? 0.6 : 1,
                      boxShadow: `0 4px 16px ${hexToRgba(theme.error, 0.3)}`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {loadingTerminate ? (
                      <>
                        <div className="relative w-4 h-4">
                          <div className="absolute inset-0 border-2 border-white/30 rounded-full" />
                          <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                        <span className="animate-pulse">Processing…</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Terminate Category Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loadingDetails && !categoryDetails && error && (
              <CommonErrorState
                error={error}
                title="Failed to Load Category"
                message="The category couldn't be loaded. Please try again."
                variant="error"
                showBackButton={true}
                showRetryButton={true}
                onBack={handleClearCategorySelection}
                onRetry={() =>
                  selectedCategory && fetchCategoryDetails(selectedCategory.categoryId)
                }
                backButtonText="Change Selection"
                retryButtonText="Try Again"
                fullScreen={false}
              />
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <TerminationModal
        isOpen={showConfirmModal}
        item={terminationItem}
        loading={loadingTerminate}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmTerminate}
        title="Confirm Tour Category Termination"
        description="You are about to permanently terminate:"
        warningMessage={`All ${categoryDetails?.totalTours || 0} tours associated with this category will lose their category association, and all category images will be permanently deleted.`}
      />

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        images={getModalImages()}
        initialIndex={selectedImageIndex}
        onClose={() => setImageModalOpen(false)}
        showNavigation={true}
        showDownload={true}
        showZoom={true}
        allowKeyboardNavigation={true}
      />
    </div>
  );
};

export default TerminateTourCategoryPage;