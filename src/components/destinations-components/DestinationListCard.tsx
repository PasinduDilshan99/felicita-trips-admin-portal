// components/destinations-components/DestinationListCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Destination } from "@/types/destination-types";
import {
  MapPin,
  Tag,
  Clock,
  Users,
  Image as ImageIcon,
  Activity,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Camera,
  Eye,
  ArrowRight,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
  PLACE_HOLDER_IMAGE,
} from "@/utils/constant";
import { useTheme } from "@/contexts/ThemeContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface DestinationListCardProps {
  destination: Destination;
}

const DestinationListCard: React.FC<DestinationListCardProps> = ({
  destination,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  // State for current image index and selected primary image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const images = destination.images;
  const minPrice =
    destination.activities.length > 0
      ? Math.min(...destination.activities.map((a) => a.priceLocal))
      : 0;

  const avgDuration =
    destination.activities.length > 0
      ? Math.round(
          destination.activities.reduce((sum, a) => sum + a.durationHours, 0) /
            destination.activities.length,
        )
      : 0;

  // Get primary category and all categories
  const primaryCategory = destination.destinationCategoryDetailsDtos.find(
    (cat) => cat.isPrimary === true,
  );
  const allCategories = destination.destinationCategoryDetailsDtos;
  const hasMultipleCategories = allCategories.length > 1;

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!isAutoRotating || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, images.length]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
    setIsAutoRotating(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    setIsAutoRotating(false);
  };

  const handleSelectPrimary = (index: number) => {
    setPrimaryImageIndex(index);
    setCurrentImageIndex(index);
    setIsAutoRotating(false);
  };

  // Handle view details button click
  const handleViewDetails = () => {
    router.push(
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view/${destination.destinationId}`,
    );
  };

  const currentImage =
    images[currentImageIndex]?.imageUrl || PLACE_HOLDER_IMAGE;

  return (
    <div 
      className="group rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
      style={{ 
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        boxShadow: `0 10px 15px -3px ${hexToRgba(theme.text, 0.1)}, 0 4px 6px -2px ${hexToRgba(theme.text, 0.05)}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.border;
      }}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Gallery Section */}
        <div className="lg:w-2/5 xl:w-1/3 relative h-64 lg:h-auto">
          {/* Main Image with Navigation */}
          <div className="relative w-full h-full">
            <img
              src={currentImage}
              alt={destination.destinationName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              onClick={handleViewDetails}
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${
                  destination.statusName === "ACTIVE"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                }`}
              >
                {destination.statusName === "ACTIVE" ? (
                  <>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    Active
                  </>
                ) : (
                  "Inactive"
                )}
              </span>
            </div>

            {/* View Details Button */}
            <button
              onClick={handleViewDetails}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm hover:bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: `${hexToRgba('#ffffff', 0.9)}` }}
            >
              <Eye className="w-3 h-3" />
              View Details
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 0 && (
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-2">
                  <Camera className="w-3 h-3" />
                  {currentImageIndex + 1} / {images.length}
                </span>
              </div>
            )}

            {/* Primary Image Indicator */}
            {primaryImageIndex === currentImageIndex && (
              <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3" />
                  Primary
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <div key={image.imageId} className="relative flex-shrink-0">
                    <img
                      src={image.imageUrl}
                      alt={image.imageName}
                      className={`w-12 h-12 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                        currentImageIndex === index
                          ? "border-white scale-110"
                          : "border-transparent hover:border-white/50"
                      }`}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setIsAutoRotating(false);
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                      }}
                    />

                    {/* Primary Selection Dot */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPrimary(index);
                      }}
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                        primaryImageIndex === index
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                          : "bg-gray-800/80 backdrop-blur-sm text-gray-300 opacity-0 hover:opacity-100 group-hover:opacity-100 hover:bg-blue-500 hover:text-white"
                      }`}
                      title={
                        primaryImageIndex === index
                          ? "Primary Image"
                          : "Set as Primary"
                      }
                    >
                      {primaryImageIndex === index ? (
                        <Check className="w-2.5 h-2.5" />
                      ) : (
                        <Star className="w-2.5 h-2.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:w-3/5 xl:w-2/3 p-6">
          {/* Header with Title and Location */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex-1">
              <h3
                className="text-2xl font-bold mb-2 transition-colors duration-200 cursor-pointer"
                style={{ color: theme.text }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = theme.text; }}
                onClick={handleViewDetails}
              >
                {destination.destinationName}
              </h3>
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})` }}
                >
                  <MapPin className="w-5 h-5" style={{ color: theme.primary }} />
                </div>
                <div>
                  <div className="text-sm" style={{ color: theme.textSecondary }}>Location</div>
                  <div className="text-lg font-semibold" style={{ color: theme.text }}>
                    {destination.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p 
            className="mb-6 leading-relaxed pl-4 py-2 rounded-r-lg"
            style={{ 
              color: theme.textSecondary,
              borderLeft: `4px solid ${hexToRgba(theme.primary, 0.3)}`,
              background: `linear-gradient(90deg, ${hexToRgba(theme.primary, 0.05)}, transparent)`
            }}
          >
            {destination.destinationDescription}
          </p>

          {/* Stats Grid - Updated Categories Section */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 mb-6"
            style={{ 
              borderTop: `1px solid ${theme.border}`,
              borderBottom: `1px solid ${theme.border}`
            }}
          >
            {/* Categories Section */}
            <div className="flex items-start">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})` }}
              >
                <Tag className="w-5 h-5" style={{ color: theme.success }} />
              </div>
              <div className="flex-1">
                <div className="text-xs" style={{ color: theme.textSecondary }}>Categories</div>
                {primaryCategory && (
                  <div className="text-sm font-semibold mb-1" style={{ color: theme.success }}>
                    {primaryCategory.name}
                    {primaryCategory.isPrimary && (
                      <Star className="w-3 h-3 inline-block ml-1" style={{ color: theme.warning }} />
                    )}
                  </div>
                )}
                {hasMultipleCategories && (
                  <div className="flex items-center gap-1 mt-1">
                    <Layers className="w-3 h-3" style={{ color: theme.primary }} />
                    <span className="text-xs font-medium" style={{ color: theme.primary }}>
                      +{allCategories.length - 1} more categories
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ background: `linear-gradient(135deg, ${hexToRgba(theme.accent, 0.1)}, ${hexToRgba(theme.accent, 0.05)})` }}
              >
                <Activity className="w-5 h-5" style={{ color: theme.accent }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Activities</div>
                <div className="text-sm font-semibold" style={{ color: theme.text }}>
                  {destination.activities.length}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ background: `linear-gradient(135deg, ${hexToRgba(theme.warning, 0.1)}, ${hexToRgba(theme.warning, 0.05)})` }}
              >
                <Clock className="w-5 h-5" style={{ color: theme.warning }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Avg Duration</div>
                <div className="text-sm font-semibold" style={{ color: theme.text }}>
                  {avgDuration} hours
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ background: `linear-gradient(135deg, ${hexToRgba(theme.error, 0.1)}, ${hexToRgba(theme.error, 0.05)})` }}
              >
                <ImageIcon className="w-5 h-5" style={{ color: theme.error }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: theme.textSecondary }}>Images</div>
                <div className="text-sm font-semibold" style={{ color: theme.text }}>
                  {destination.images.length}
                </div>
              </div>
            </div>
          </div>

          {/* All Categories Chips Section */}
          {hasMultipleCategories && (
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                  style={{ background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})` }}
                >
                  <Layers className="w-3 h-3" style={{ color: theme.primary }} />
                </div>
                <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                  All Categories:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allCategories.slice(0, 4).map((category) => (
                  <span
                    key={category.id}
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                      category.isPrimary ? "border" : ""
                    }`}
                    style={{
                      background: category.isPrimary 
                        ? `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})`
                        : hexToRgba(theme.textSecondary, 0.1),
                      color: category.isPrimary ? theme.success : theme.textSecondary,
                      borderColor: category.isPrimary ? hexToRgba(theme.success, 0.2) : 'transparent'
                    }}
                  >
                    {category.isPrimary && (
                      <Star className="w-2.5 h-2.5 mr-1" style={{ fill: theme.success }} />
                    )}
                    {category.name}
                  </span>
                ))}
                {allCategories.length > 4 && (
                  <span 
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                    style={{ 
                      backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                      color: theme.textSecondary
                    }}
                  >
                    +{allCategories.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Activities Preview and View Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})` }}
                >
                  <Activity className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: theme.textSecondary }}>
                  Featured Activities:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {destination.activities.slice(0, 3).map((activity) => (
                  <span
                    key={activity.activityId}
                    className="px-4 py-2 text-sm rounded-lg transition-colors"
                    style={{ 
                      background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`,
                      color: theme.primary,
                      border: `1px solid ${hexToRgba(theme.primary, 0.2)}`
                    }}
                  >
                    {activity.activityName}
                  </span>
                ))}
                {destination.activities.length > 3 && (
                  <span 
                    className="px-4 py-2 text-sm rounded-lg"
                    style={{ 
                      backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                      color: theme.textSecondary,
                      border: `1px solid ${theme.border}`
                    }}
                  >
                    +{destination.activities.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* View Details Button */}
            <button
              onClick={handleViewDetails}
              className="font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group/btn whitespace-nowrap"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                color: '#fff'
              }}
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationListCard;