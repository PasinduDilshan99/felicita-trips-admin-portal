// components/activities-components/ActivityCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Activity } from "@/types/activity-types";
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
  Calendar,
  AlertCircle,
  DollarSign,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_ACTIVITIES_PATH,
} from "@/utils/constant";

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const router = useRouter();
  
  // State for current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const images = activity.images;
  const seasons = activity.season.split(',').map(s => s.trim());

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
      `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_ACTIVITIES_PATH}/view/${activity.id}`
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleViewDetails();
  };

  const currentImage =
    images[currentImageIndex]?.image_url || "/images/placeholder.jpg";

  // Calculate availability status
  const isAvailableToday = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [fromHour, fromMin] = activity.available_from.split(':').map(Number);
    const [toHour, toMin] = activity.available_to.split(':').map(Number);
    const startMinutes = fromHour * 60 + fromMin;
    const endMinutes = toHour * 60 + toMin;
    
    return currentTime >= startMinutes && currentTime <= endMinutes;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-blue-100">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <div className="relative w-full h-full">
          <img
            src={currentImage}
            alt={activity.name}
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
                activity.status === "ACTIVE"
                  ? isAvailableToday() 
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                    : "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                  : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
              }`}
            >
              {activity.status === "ACTIVE" ? (
                <>
                  <div className={`w-1.5 h-1.5 bg-white rounded-full ${isAvailableToday() ? 'animate-pulse' : ''}`}></div>
                  {isAvailableToday() ? 'Available Now' : 'Available'}
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
        {/* Title and Category */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={handleViewDetails}>
            {activity.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-center mr-2">
                <Tag className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-emerald-700">
                {activity.activities_category}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center mr-2">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">ID: {activity.destination_id}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
          {activity.description}
        </p>

        {/* Seasons */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-xs text-gray-500">Best Seasons:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {seasons.slice(0, 3).map((season, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-xs rounded border border-amber-100"
              >
                {season}
              </span>
            ))}
            {seasons.length > 3 && (
              <span className="px-2 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                +{seasons.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-50 to-violet-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1">Duration</div>
            <div className="text-sm font-bold text-gray-900">
              {activity.duration_hours}h
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-rose-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1">Group</div>
            <div className="text-sm font-bold text-gray-900">
              {activity.min_participate}-{activity.max_participate}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1">Price</div>
            <div className="text-sm font-bold text-gray-900">
              LKR {activity.price_local.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Requirements Preview */}
        {activity.requirements.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-xs text-gray-500">Requirements:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {activity.requirements.slice(0, 2).map((req) => (
                <span
                  key={req.id}
                  className="px-2 py-1 bg-gradient-to-r from-red-50 to-rose-50 text-rose-700 text-xs rounded border border-rose-100"
                  style={{ borderLeftColor: req.color, borderLeftWidth: '3px' }}
                >
                  {req.name}: {req.value}
                </span>
              ))}
              {activity.requirements.length > 2 && (
                <span className="px-2 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                  +{activity.requirements.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Schedules Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Target className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-xs text-gray-500">
              {activity.schedules.length} schedule{activity.schedules.length !== 1 ? 's' : ''} available
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {activity.available_from} - {activity.available_to}
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

export default ActivityCard;