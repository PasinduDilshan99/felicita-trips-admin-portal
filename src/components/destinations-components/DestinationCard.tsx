// components/destinations-components/DestinationCard.tsx
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const router = useRouter();
  
  // State for current image index and selected primary image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const images = destination.images;
  const minPrice =
    destination.activities.length > 0
      ? Math.min(...destination.activities.map((a) => a.priceLocal))
      : 0;

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

  // Handle quick view click (opens in modal or new page)
  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    // You can implement a modal here or navigate to a quick view page
    console.log("Quick view for destination:", destination.destinationId);
    // For now, we'll just navigate to details page
    handleViewDetails();
  };

  const currentImage =
    images[currentImageIndex]?.imageUrl || "/images/placeholder.jpg";

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-blue-100">
      {/* Enhanced Image Section with Gallery */}
      <div className="relative h-64 overflow-hidden">
        {/* Main Image with Overlay */}
        <div className="relative w-full h-full">
          <img
            src={currentImage}
            alt={destination.destinationName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
            }}
            onClick={handleQuickView}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                destination.statusName === "ACTIVE"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                  : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
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
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg hover:shadow-xl z-10"
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
        <div className="px-4 pt-4 border-b border-gray-100">
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
                      ? "border-blue-500 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/placeholder.jpg";
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
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {destination.destinationName}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center mr-2">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium">{destination.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
          {destination.destinationDescription}
        </p>

        {/* Category and Pricing */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-center mr-2">
              <Tag className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Category</div>
              <div className="text-sm font-semibold text-emerald-700">
                {destination.categoryName}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100 mt-auto bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-50 to-violet-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1">Activities</div>
            <div className="text-sm font-bold text-gray-900">
              {destination.activities.length}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1">Duration</div>
            <div className="text-sm font-bold text-gray-900">
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-rose-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1">Images</div>
            <div className="text-sm font-bold text-gray-900">
              {destination.images.length}
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="w-full mt-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group/btn"
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