// components/tours-components/TourCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Tour } from "@/types/tour-types";
import {
  MapPin,
  Tag,
  Clock,
  Calendar,
  Users,
  Image as ImageIcon,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowRight,
  Compass,
  TrendingUp,
  Navigation,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_TOURS_PATH,
} from "@/utils/constant";

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const router = useRouter();
  
  // State for current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const images = tour.images;
  const upcomingSchedules = tour.schedules.filter(schedule => {
    const endDate = new Date(schedule.assumeEndDate);
    return endDate >= new Date();
  }).length;

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
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/view/${tour.tourId}`
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleViewDetails();
  };

  const currentImage =
    images[currentImageIndex]?.imageUrl || "/images/placeholder.jpg";

  // Format schedule dates
  const formatScheduleDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get earliest upcoming schedule
  const getEarliestSchedule = () => {
    if (upcomingSchedules === 0) return null;
    const upcoming = tour.schedules.filter(schedule => {
      const endDate = new Date(schedule.assumeEndDate);
      return endDate >= new Date();
    });
    return upcoming.sort((a, b) => new Date(a.assumeStartDate).getTime() - new Date(b.assumeStartDate).getTime())[0];
  };

  const earliestSchedule = getEarliestSchedule();

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-blue-100">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <div className="relative w-full h-full">
          <img
            src={currentImage}
            alt={tour.tourName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
            }}
            onClick={handleQuickView}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                tour.statusName === "ACTIVE"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                  : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
              }`}
            >
              {tour.statusName === "ACTIVE" ? (
                <>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  Active
                </>
              ) : (
                "Inactive"
              )}
            </span>
          </div>

          {/* Schedule Badge */}
          {earliestSchedule && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                <Calendar className="w-3 h-3" />
                {formatScheduleDate(earliestSchedule.assumeStartDate)}
              </span>
            </div>
          )}

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="absolute top-12 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg hover:shadow-xl z-10"
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
        {/* Title and Route */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={handleViewDetails}>
            {tour.tourName}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center mr-2">
                <Navigation className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">{tour.startLocation}</span>
                <span className="text-gray-400 mx-1">→</span>
                <span className="font-medium text-gray-700">{tour.endLocation}</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-center mr-2">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-amber-700">{tour.duration} day{tour.duration !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
          {tour.tourDescription}
        </p>

        {/* Category and Type */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs rounded-full border border-emerald-100 font-medium">
              <Tag className="w-3 h-3 inline mr-1" />
              {tour.tourTypeName}
            </span>
            <span className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 text-xs rounded-full border border-purple-100 font-medium">
              <Users className="w-3 h-3 inline mr-1" />
              {tour.tourCategoryName}
            </span>
            <span className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-xs rounded-full border border-amber-100 font-medium">
              <Calendar className="w-3 h-3 inline mr-1" />
              {tour.seasonName}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-50 to-violet-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1">Schedules</div>
            <div className="text-sm font-bold text-gray-900">
              {upcomingSchedules}
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
              {tour.images.length}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-center">
                <Compass className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1">Popular</div>
            <div className="text-sm font-bold text-gray-900">
              <TrendingUp className="w-4 h-4 text-green-600 inline" />
            </div>
          </div>
        </div>

        {/* Route Preview */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-xs text-gray-500">Route:</span>
          </div>
          <div className="flex items-center">
            <div className="flex-1 h -1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
            <div className="mx-2 text-xs text-gray-600">
              {tour.startLocation} → {tour.endLocation}
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

export default TourCard;