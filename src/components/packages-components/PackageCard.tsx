// components/packages-components/PackageCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { TourPackage } from "@/types/package-types";
import {
  MapPin,
  Tag,
  Users,
  Calendar,
  DollarSign,
  Percent,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowRight,
  Package,
  Clock,
  Award,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_PACKAGES_PATH,
} from "@/utils/constant";
import { PackageService } from "@/services/packageService";

interface PackageCardProps {
  tourPackage: TourPackage;
}

const PackageCard: React.FC<PackageCardProps> = ({ tourPackage }) => {
  const router = useRouter();
  
  // State for current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const images = tourPackage.images;
  const upcomingSchedules = PackageService.getUpcomingSchedules(tourPackage);
  const isAvailable = PackageService.isPackageAvailable(tourPackage);
  const discountedPrice = PackageService.calculateDiscountedPrice(
    tourPackage.totalPrice,
    tourPackage.discountPercentage
  );
  const savings = PackageService.calculateSavings(
    tourPackage.totalPrice,
    tourPackage.discountPercentage
  );
  const rating = PackageService.getPackageRating(tourPackage);

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

  const handleViewDetails = () => {
    router.push(
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_PACKAGES_PATH}/view/${tourPackage.packageId}`
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleViewDetails();
  };

  const currentImage =
    images[currentImageIndex]?.imageUrl || "/images/placeholder.jpg";

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
    const endDate = new Date(tourPackage.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-blue-100"
      style={{
        borderLeftColor: tourPackage.color,
        borderLeftWidth: '4px'
      }}
    >
      {/* Image Section with Color Overlay */}
      <div className="relative h-56 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 z-0"
          style={{ backgroundColor: tourPackage.color }}
        ></div>
        
        <div className="relative w-full h-full z-10">
          <img
            src={currentImage}
            alt={tourPackage.packageName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
            }}
            onClick={handleQuickView}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status and Discount Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {/* Status Badge */}
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                isAvailable
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                  : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
              }`}
            >
              {isAvailable ? (
                <>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  Available
                </>
              ) : (
                "Expired"
              )}
            </span>

            {/* Discount Badge */}
            {tourPackage.discountPercentage > 0 && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                <Percent className="w-3 h-3" />
                {tourPackage.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Days Remaining Badge */}
          {daysRemaining > 0 && daysRemaining <= 30 && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                <Clock className="w-3 h-3" />
                {daysRemaining} days left
              </span>
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="absolute top-14 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg hover:shadow-xl z-10"
            title="Quick View"
          >
            <Eye className="w-3 h-3" />
            Quick View
          </button>

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

      {/* Content Section */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Title and Tour Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={handleViewDetails}>
            {tourPackage.packageName}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center mr-2">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-700">
                {tourPackage.tourName}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-center mr-2">
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-emerald-700">{tourPackage.duration} day{tourPackage.duration !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
          {tourPackage.packageDescription}
        </p>

        {/* Package Type and Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <span 
              className="px-3 py-1.5 text-white text-xs rounded-full border font-medium shadow-sm"
              style={{ 
                backgroundColor: tourPackage.color,
                borderColor: tourPackage.hoverColor
              }}
            >
              <Tag className="w-3 h-3 inline mr-1" />
              {tourPackage.packageTypeName}
            </span>
            <span className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 text-xs rounded-full border border-purple-100 font-medium">
              <Users className="w-3 h-3 inline mr-1" />
              {tourPackage.minPersonCount}-{tourPackage.maxPersonCount} people
            </span>
            <span className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-xs rounded-full border border-amber-100 font-medium">
              <Award className="w-3 h-3 inline mr-1" />
              {tourPackage.features.length} features
            </span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="grid grid-cols-2 gap-3 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1">Total Price</div>
            <div className="text-sm font-bold text-gray-900 line-through">
              LKR {tourPackage.totalPrice.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 flex items-center justify-center">
                <Percent className="w-4 h-4 text-rose-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1">After Discount</div>
            <div className="text-lg font-bold" style={{ color: tourPackage.color }}>
              LKR {discountedPrice.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Per Person Price and Savings */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-500">Per person: </span>
              <span className="font-semibold text-emerald-700">
                LKR {tourPackage.pricePerPerson.toLocaleString()}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Save: </span>
              <span className="font-semibold text-rose-600">
                LKR {savings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-xs text-gray-500">
              {upcomingSchedules.length} schedule{upcomingSchedules.length !== 1 ? 's' : ''} available • 
              Valid: {formatDate(tourPackage.startDate)} - {formatDate(tourPackage.endDate)}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="w-full mt-auto text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group/btn"
          style={{
            background: `linear-gradient(135deg, ${tourPackage.color}, ${tourPackage.hoverColor})`
          }}
        >
          <Eye className="w-4 h-4" />
          <span>View Package Details</span>
          <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PackageCard;