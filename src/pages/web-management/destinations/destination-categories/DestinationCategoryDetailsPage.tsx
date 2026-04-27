// app/destinations/categories/view/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import { CategoryDetailsByIdResponse } from "@/types/destination-types";
import { useTheme } from "@/contexts/ThemeContext";

// Import components
import { ErrorState } from "@/components/destination-categories-components/destination-category-details-veiw-components/ErrorState";
import { ActionButtons } from "@/components/destination-categories-components/destination-category-details-veiw-components/ActionButtons";
import { CategoryHeroImage } from "@/components/destination-categories-components/destination-category-details-veiw-components/CategoryHeroImage";
import { CategoryBasicInfo } from "@/components/destination-categories-components/destination-category-details-veiw-components/CategoryBasicInfo";
import { CategoryBrandColors } from "@/components/destination-categories-components/destination-category-details-veiw-components/CategoryBrandColors";
import { CategoryStatistics } from "@/components/destination-categories-components/destination-category-details-veiw-components/CategoryStatistics";
import { CategoryQuickActions } from "@/components/destination-categories-components/destination-category-details-veiw-components/CategoryQuickActions";
import { ImageModal } from "@/components/destination-categories-components/destination-category-details-veiw-components/ImageModal";
import { ExpandedGallery } from "@/components/destination-categories-components/destination-category-details-veiw-components/ExpandedGallery";
import { LoadingState } from "@/components/destination-categories-components/destination-category-details-veiw-components/LoadingState";
import { DestinationsList } from "@/components/destination-categories-components/destination-category-details-veiw-components/DestinationsList";

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

  const handleBack = () =>
    router.push(
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/categories/view`,
    );

  const handleEdit = () =>
    router.push(
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/categories/edit/${categoryIdParam}`,
    );

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this category?")) {
      console.log("Delete category:", categoryIdParam);
    }
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

  if (loading) return <LoadingState />;
  if (error || !category)
    return <ErrorState error={error} onBack={handleBack} />;

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Topbar */}
      <div
        className="sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-colors duration-300"
        style={{
          backgroundColor: `${theme.surface}D9`,
          borderColor: theme.border,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3.5">
          <PageHeader
            title={category.category}
            description={`Category ID: ${category.categoryId}`}
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ActionButtons
          onBack={handleBack}
          onShare={handleShare}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
          images={category.images}
          currentIndex={currentImageIndex}
          onClose={() => setIsModalOpen(false)}
          onNavigate={(index) => {
            setCurrentImageIndex(index);
            setImgTransition(false);
          }}
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
