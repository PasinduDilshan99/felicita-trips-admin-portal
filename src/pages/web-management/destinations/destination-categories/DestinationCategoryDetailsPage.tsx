// app/destinations/categories/view/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import { DestinationService } from "@/services/destinationService";
import { CategoryDetailsByIdResponse } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";
import { CategoryHeroImage } from "@/components/destination-categories-components/destination-category-details-veiw-components/CategoryHeroImage";
import { CategoryBasicInfo } from "@/components/destination-categories-components/destination-category-details-veiw-components/CategoryBasicInfo";
import { CategoryBrandColors } from "@/components/destination-categories-components/destination-category-details-veiw-components/CategoryBrandColors";
import { CategoryStatistics } from "@/components/destination-categories-components/destination-category-details-veiw-components/CategoryStatistics";
import { CategoryQuickActions } from "@/components/destination-categories-components/destination-category-details-veiw-components/CategoryQuickActions";
import { ExpandedGallery } from "@/components/destination-categories-components/destination-category-details-veiw-components/ExpandedGallery";
import { DestinationsList } from "@/components/destination-categories-components/destination-category-details-veiw-components/DestinationsList";
import ActionButtons from "@/components/common-components/ActionButtons";
import ImageModal, {
  ImageModalImage,
} from "@/components/common-components/ImageModal";
import CommonLoading from "@/components/common-components/CommonLoading";
import CommonErrorState from "@/components/common-components/CommonErrorState";
import {
  DESTINATION_CATEGORIES_PAGE_URL,
  DESTINATION_CATEGORY_TERMINATE_URL,
  DESTINATION_CATEGORY_UPDATE_URL,
  DESTINATION_CATEGORY_VIEW_PAGE_URL,
  DESTINATION_PAGE_URL,
  WEB_MANAGEMENT_URL,
} from "@/utils/urls";

const DestinationCategoryDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();

  const categoryIdParam =
    (params?.id as string) || (params?.categoryId as string);

  const [category, setCategory] = useState<CategoryDetailsByIdResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgTransition, setImgTransition] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpandedGalleryOpen, setIsExpandedGalleryOpen] = useState(false);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_URL },
    {
      label: "Destinations",
      href: DESTINATION_PAGE_URL,
    },
    {
      label: "Categories",
      href: DESTINATION_CATEGORIES_PAGE_URL,
    },
    {
      label: category?.category || "Category Details",
      href: "#",
    },
  ];

  useEffect(() => {
    if (categoryIdParam && !isNaN(parseInt(categoryIdParam))) {
      fetchCategoryDetails();
    } else {
      setError("Invalid category ID");
      setLoading(false);
    }
  }, [categoryIdParam]);

  const fetchCategoryDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const numericId = parseInt(categoryIdParam);
      const response =
        await DestinationService.getCategoryDetailsById(numericId);
      setCategory(response.data);
    } catch (err) {
      console.error("Error fetching category details:", err);
      setError("Failed to load category details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare images for modal
  const getModalImages = (): ImageModalImage[] => {
    if (!category) return [];
    return category.images.map((img) => ({
      url: img.imageUrl,
      name: img.imageName,
      description: img.imageDescription || undefined,
      id: img.imageId,
    }));
  };

  const changeImage = (idx: number) => {
    setImgTransition(true);
    setTimeout(() => {
      setCurrentImageIndex(idx);
      setImgTransition(false);
    }, 160);
  };

  const handlePrevImage = () => {
    if (!category) return;
    const next =
      currentImageIndex === 0
        ? category.images.length - 1
        : currentImageIndex - 1;
    changeImage(next);
  };

  const handleNextImage = () => {
    if (!category) return;
    changeImage((currentImageIndex + 1) % category.images.length);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleBack = () => router.push(DESTINATION_CATEGORY_VIEW_PAGE_URL);

  const handleEdit = () =>
    router.push(
      `${DESTINATION_CATEGORY_UPDATE_URL}/?categoryId=${categoryIdParam}&name=${category?.category}`,
    );

  const handleDelete = () => {
    router.push(
      `${DESTINATION_CATEGORY_TERMINATE_URL}?categoryId=${categoryIdParam}&name=${category?.category}`,
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: category?.category,
        text: category?.categoryDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <CommonLoading
        message="Loading category details..."
        subMessage="Please wait while we fetch category information"
        size="lg"
        fullScreen={true}
      />
    );
  }

  if (error || !category) {
    return (
      <CommonErrorState
        error={error}
        title="Failed to Load Category"
        message="The category couldn't be loaded. Please try again."
        variant="error"
        showBackButton={true}
        showRetryButton={true}
        onBack={handleBack}
        onRetry={fetchCategoryDetails}
        backButtonText="Back to Categories"
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
      {/* Topbar */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title={category.category}
            description={`Category ID: ${category.categoryId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActionButtons
          title={category.category}
          showEdit={true}
          showDelete={true}
          showShare={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShare={handleShare}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">
            <CategoryHeroImage
              images={category.images}
              currentIndex={currentImageIndex}
              status={category.categoryStatus}
              color={category.color}
              onPrev={handlePrevImage}
              onNext={handleNextImage}
              onImageChange={changeImage}
              imgTransition={imgTransition}
              onImageClick={() => handleImageClick(currentImageIndex)}
            />

            <CategoryBasicInfo
              name={category.category}
              description={category.categoryDescription}
              color={category.color}
              hoverColor={category.hoverColor}
            />

            {/* Destinations List Section */}
            {category.destinations && category.destinations.length > 0 && (
              <DestinationsList
                destinations={category.destinations}
                color={category.color}
              />
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <CategoryStatistics
              totalImages={category.images.length}
              totalDestinations={category.destinations.length}
              createdAt={category.createdAt}
              updatedAt={category.updatedAt}
              status={category.categoryStatus}
              color={category.color}
            />

            <CategoryBrandColors
              primaryColor={category.color}
              hoverColor={category.hoverColor}
            />

            <CategoryQuickActions
              categoryId={category.categoryId}
              categoryName={category.category}
              color={category.color}
              hoverColor={category.hoverColor}
              onEdit={handleEdit}
              onBack={handleBack}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && category && (
        <ImageModal
          isOpen={isModalOpen}
          images={getModalImages()}
          initialIndex={currentImageIndex}
          onClose={handleModalClose}
          showNavigation={true}
          showDownload={true}
          showZoom={true}
          allowKeyboardNavigation={true}
        />
      )}

      {isExpandedGalleryOpen && category && (
        <ExpandedGallery
          images={category.images}
          onClose={() => setIsExpandedGalleryOpen(false)}
          onImageClick={(index) => {
            setCurrentImageIndex(index);
            setIsExpandedGalleryOpen(false);
            setIsModalOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default DestinationCategoryDetailsPage;
