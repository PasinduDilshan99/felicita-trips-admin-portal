// components/tours-components/TourListCard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Tour } from '@/types/tour-types';
import { 
  MapPin, Tag, Clock, Calendar, Users, Image as ImageIcon, 
  Compass, ChevronLeft, ChevronRight, Eye, ArrowRight,
  Camera, Star, Check, Navigation, TrendingUp, Globe
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WEB_MANAGEMENT_PATH, WEB_MANAGEMENT_TOURS_PATH } from '@/utils/constant';

interface TourListCardProps {
  tour: Tour;
}

const TourListCard: React.FC<TourListCardProps> = ({ tour }) => {
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

  const currentImage = images[currentImageIndex]?.imageUrl || '/images/placeholder.jpg';

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
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-100">
      <div className="flex flex-col lg:flex-row">
        {/* Image Gallery Section */}
        <div className="lg:w-1/3 xl:w-1/4 relative h-64 lg:h-auto">
          <div className="relative w-full h-full">
            <img
              src={currentImage}
              alt={tour.tourName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              onClick={handleViewDetails}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                tour.statusName === 'ACTIVE'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg'
              }`}>
                {tour.statusName === 'ACTIVE' ? (
                  <>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    Active
                  </>
                ) : 'Inactive'}
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

            {/* View Details Button */}
            <button
              onClick={handleViewDetails}
              className="absolute top-12 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg hover:shadow-xl"
            >
              <Eye className="w-3 h-3" />
              Quick View
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
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <div 
                    key={image.imageId} 
                    className="relative flex-shrink-0"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsAutoRotating(false);
                    }}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.imageName}
                      className={`w-12 h-12 rounded-lg object-cover border-2 cursor-pointer transition-all duration-200 ${
                        currentImageIndex === index 
                          ? 'border-white scale-110' 
                          : 'border-transparent hover:border-white/50'
                      }`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:w-2/3 xl:w-3/4 p-6">
          {/* Header with Title and Route */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={handleViewDetails}>
                {tour.tourName}
              </h3>
              <div className="flex items-center flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center mr-3">
                    <Navigation className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Route</div>
                    <div className="text-lg font-semibold">
                      {tour.startLocation} → {tour.endLocation}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-center mr-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="text-lg font-semibold">{tour.duration} day{tour.duration !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tour ID */}
            <div className="mt-4 md:mt-0 md:ml-6">
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Tour ID</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  #{tour.tourId}
                </div>
                <div className="text-xs text-gray-500">{upcomingSchedules} upcoming schedules</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed border-l-4 border-blue-100 pl-4 py-2 bg-gradient-to-r from-blue-50/50 to-transparent rounded-r-lg">
            {tour.tourDescription}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-y border-gray-100 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-center mr-3">
                <Tag className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Type</div>
                <div className="text-sm font-semibold text-emerald-700">{tour.tourTypeName}</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-50 to-violet-50 flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Category</div>
                <div className="text-sm font-semibold text-purple-700">{tour.tourCategoryName}</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Season</div>
                <div className="text-sm font-semibold text-amber-700">{tour.seasonName}</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 flex items-center justify-center mr-3">
                <ImageIcon className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Images</div>
                <div className="text-sm font-semibold">{tour.images.length}</div>
              </div>
            </div>
          </div>

          {/* Upcoming Schedules */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-sm font-semibold text-gray-700">Upcoming Schedules:</span>
                <span className="ml-2 text-xs text-gray-500">({upcomingSchedules} available)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tour.schedules.slice(0, 3).map((schedule) => (
                  <span
                    key={schedule.scheduleId}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
                  >
                    {formatScheduleDate(schedule.assumeStartDate)} - {formatScheduleDate(schedule.assumeEndDate)}
                  </span>
                ))}
                {tour.schedules.length > 3 && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-sm rounded-lg border border-gray-200">
                    +{tour.schedules.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Popularity Indicator */}
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-sm font-semibold text-gray-700">Popularity:</span>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(tour.schedules.length * 15, 100)}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-sm font-medium text-emerald-700">
                  {Math.min(tour.schedules.length * 15, 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Route Details and View Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <span className="text-sm font-semibold text-gray-700">Locations: </span>
                  <span className="text-sm text-gray-600">
                    {tour.startLocation} (Start) → {tour.endLocation} (End)
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Coordinates: {tour.latitude.toFixed(4)}°, {tour.longitude.toFixed(4)}°
              </div>
            </div>
            
            {/* View Details Button */}
            <button
              onClick={handleViewDetails}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group/btn whitespace-nowrap"
            >
              <Eye className="w-4 h-4" />
              <span>View Full Details</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourListCard;