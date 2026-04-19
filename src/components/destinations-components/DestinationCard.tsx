// components/destinations-components/DestinationCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Destination } from "@/types/destination-types";
import {
  MapPin,
  Tag,
  Clock,
  Users,
  Image as ImageIcon,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
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

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
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

  // Get primary category and all categories
  const primaryCategory = destination.destinationCategoryDetailsDtos.find(
    (cat) => cat.isPrimary === true
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
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
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

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoRotating(false);
  };

  // Handle view details button click
  const handleViewDetails = () => {
    router.push(
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/view/${destination.destinationId}`
    );
  };

  // Handle quick view click
  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Quick view for destination:", destination.destinationId);
    handleViewDetails();
  };

  const currentImage =
    images[currentImageIndex]?.imageUrl || PLACE_HOLDER_IMAGE;

  return (
    <div 
      className="group rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
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
      {/* Enhanced Image Section with Gallery */}
      <div className="relative h-64 overflow-hidden">
        {/* Main Image with Overlay */}
        <div className="relative w-full h-full">
          <img
            src={currentImage}
            alt={destination.destinationName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
            }}
            onClick={handleQuickView}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm hover:bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg hover:shadow-xl z-10"
            style={{ 
              backgroundColor: `${hexToRgba('#ffffff', 0.9)}`,
            }}
            title="Quick View"
          >
            <Eye className="w-3 h-3" />
            Quick View
          </button>

          {/* Primary Image Indicator */}
          {primaryImageIndex === currentImageIndex && (
            <div className="absolute top-12 right-4">
              <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                <Star className="w-3 h-3" />
                Primary
              </span>
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 0 && (
            <div className="absolute bottom-4 right-4">
              <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="px-4 pt-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <div
                key={image.imageId}
                className="relative flex-shrink-0 group/thumb"
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image.imageUrl}
                  alt={image.imageName}
                  className={`w-16 h-16 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                    currentImageIndex === index
                      ? "scale-105"
                      : "hover:opacity-80"
                  }`}
                  style={{
                    borderColor: currentImageIndex === index ? theme.primary : theme.border,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACE_HOLDER_IMAGE;
                  }}
                />

                {/* Primary Selection Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPrimary(index);
                  }}
                  className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    primaryImageIndex === index
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                      : "bg-white/90 backdrop-blur-sm text-gray-600 opacity-0 group-hover/thumb:opacity-100 hover:bg-blue-500 hover:text-white"
                  }`}
                  title={
                    primaryImageIndex === index
                      ? "Primary Image"
                      : "Set as Primary"
                  }
                >
                  {primaryImageIndex === index ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Star className="w-3 h-3" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 
            className="text-xl font-bold mb-2 line-clamp-1 transition-colors duration-200 cursor-pointer"
            style={{ color: theme.text }}
            onMouseEnter={(e) => { e.currentTarget.style.color = theme.primary; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = theme.text; }}
            onClick={handleViewDetails}
          >
            {destination.destinationName}
          </h3>
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
              style={{ background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})` }}
            >
              <MapPin className="w-4 h-4" style={{ color: theme.primary }} />
            </div>
            <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
              {destination.location}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm mb-4 line-clamp-2 flex-grow leading-relaxed" style={{ color: theme.textSecondary }}>
          {destination.destinationDescription}
        </p>

        {/* Categories Section */}
        <div className="mb-6">
          {/* Primary Category Badge */}
          {primaryCategory && (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                  style={{ background: `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})` }}
                >
                  <Tag className="w-4 h-4" style={{ color: theme.success }} />
                </div>
                <div>
                  <div className="text-xs" style={{ color: theme.textSecondary }}>Primary Category</div>
                  <div className="text-sm font-semibold" style={{ color: theme.success }}>
                    {primaryCategory.name}
                  </div>
                </div>
              </div>
              
              {/* Category Count Badge */}
              {hasMultipleCategories && (
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded-lg"
                  style={{ backgroundColor: hexToRgba(theme.primary, 0.1) }}
                >
                  <Layers className="w-3 h-3" style={{ color: theme.primary }} />
                  <span className="text-xs font-medium" style={{ color: theme.primary }}>
                    +{allCategories.length - 1} more
                  </span>
                </div>
              )}
            </div>
          )}

          {/* All Categories */}
          {hasMultipleCategories && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-2">
                {allCategories.slice(0, 3).map((category) => (
                  <span
                    key={category.id}
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      category.isPrimary
                        ? "border"
                        : ""
                    }`}
                    style={{
                      background: category.isPrimary 
                        ? `linear-gradient(135deg, ${hexToRgba(theme.success, 0.1)}, ${hexToRgba(theme.success, 0.05)})`
                        : hexToRgba(theme.textSecondary, 0.1),
                      color: category.isPrimary ? theme.success : theme.textSecondary,
                      borderColor: category.isPrimary ? hexToRgba(theme.success, 0.2) : 'transparent'
                    }}
                  >
                    {category.isPrimary && <Star className="w-2.5 h-2.5 mr-1" />}
                    {category.name}
                  </span>
                ))}
                {allCategories.length > 3 && (
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                    style={{ 
                      backgroundColor: hexToRgba(theme.textSecondary, 0.1),
                      color: theme.textSecondary
                    }}
                  >
                    +{allCategories.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div 
          className="grid grid-cols-3 gap-3 py-4 rounded-xl mb-4"
          style={{ 
            background: `linear-gradient(135deg, ${hexToRgba(theme.primary, 0.05)}, ${hexToRgba(theme.accent, 0.05)})`,
            borderTop: `1px solid ${theme.border}`,
            marginTop: 'auto'
          }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${hexToRgba(theme.accent, 0.1)}, ${hexToRgba(theme.accent, 0.05)})` }}
              >
                <Users className="w-4 h-4" style={{ color: theme.accent }} />
              </div>
            </div>
            <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>Activities</div>
            <div className="text-sm font-bold" style={{ color: theme.text }}>
              {destination.activities.length}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${hexToRgba(theme.warning, 0.1)}, ${hexToRgba(theme.warning, 0.05)})` }}
              >
                <Clock className="w-4 h-4" style={{ color: theme.warning }} />
              </div>
            </div>
            <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>Duration</div>
            <div className="text-sm font-bold" style={{ color: theme.text }}>
              {Math.round(
                destination.activities.reduce(
                  (sum, a) => sum + a.durationHours,
                  0
                ) / destination.activities.length
              ) || 0}
              h
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${hexToRgba(theme.error, 0.1)}, ${hexToRgba(theme.error, 0.05)})` }}
              >
                <ImageIcon className="w-4 h-4" style={{ color: theme.error }} />
              </div>
            </div>
            <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>Images</div>
            <div className="text-sm font-bold" style={{ color: theme.text }}>
              {destination.images.length}
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="w-full mt-auto font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group/btn"
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
  );
};

export default DestinationCard;