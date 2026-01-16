// components/packages-components/PackageListCard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { TourPackage } from '@/types/package-types';
import { 
  MapPin, Tag, Users, Calendar, DollarSign, Percent, Star, 
  ChevronLeft, ChevronRight, Eye, ArrowRight, Package, Clock, 
  Award, Shield, CheckCircle, TrendingUp, Save
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WEB_MANAGEMENT_PATH, WEB_MANAGEMENT_PACKAGES_PATH } from '@/utils/constant';
import { PackageService } from '@/services/packageService';

interface PackageListCardProps {
  tourPackage: TourPackage;
}

const PackageListCard: React.FC<PackageListCardProps> = ({ tourPackage }) => {
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

  const currentImage = images[currentImageIndex]?.imageUrl || '/images/placeholder.jpg';

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
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
      style={{
        borderLeftColor: tourPackage.color,
        borderLeftWidth: '6px'
      }}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Gallery Section */}
        <div className="lg:w-1/3 xl:w-1/4 relative h-64 lg:h-auto">
          <div 
            className="absolute inset-0 opacity-5 z-0"
            style={{ backgroundColor: tourPackage.color }}
          ></div>
          
          <div className="relative w-full h-full z-10">
            <img
              src={currentImage}
              alt={tourPackage.packageName}
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
                isAvailable
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg'
              }`}>
                {isAvailable ? (
                  <>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    Available
                  </>
                ) : 'Expired'}
              </span>
            </div>

            {/* Discount Badge */}
            {tourPackage.discountPercentage > 0 && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <Percent className="w-3 h-3" />
                  {tourPackage.discountPercentage}% OFF
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
                  <Package className="w-3 h-3" />
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
                      style={{
                        boxShadow: currentImageIndex === index ? `0 0 0 2px ${tourPackage.color}` : 'none'
                      }}
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
          {/* Header with Title and Tour Info */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={handleViewDetails}>
                {tourPackage.packageName}
              </h3>
              <div className="flex items-center flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center mr-3">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Tour</div>
                    <div className="text-lg font-semibold">{tourPackage.tourName}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-center mr-3">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="text-lg font-semibold">{tourPackage.duration} day{tourPackage.duration !== 1 ? 's' : ''}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-center mr-3">
                    <Star className="w-5 h-5 text-amber-600 fill-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Rating</div>
                    <div className="text-lg font-semibold">{rating.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Package ID */}
            <div className="mt-4 md:mt-0 md:ml-6">
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Package ID</div>
                <div 
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    background: `linear-gradient(135deg, ${tourPackage.color}, ${tourPackage.hoverColor})`
                  }}
                >
                  #{tourPackage.packageId}
                </div>
                <div className="text-xs text-gray-500">{upcomingSchedules.length} upcoming schedules</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed border-l-4 pl-4 py-2 bg-gradient-to-r from-blue-50/50 to-transparent rounded-r-lg"
            style={{ borderLeftColor: tourPackage.color }}>
            {tourPackage.packageDescription}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-y border-gray-100 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-50 to-violet-50 flex items-center justify-center mr-3">
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Type</div>
                <div 
                  className="text-sm font-semibold"
                  style={{ color: tourPackage.color }}
                >
                  {tourPackage.packageTypeName}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Group Size</div>
                <div className="text-sm font-semibold">{tourPackage.minPersonCount}-{tourPackage.maxPersonCount}</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Validity</div>
                <div className="text-sm font-semibold">
                  {new Date(tourPackage.startDate).toLocaleDateString('en-US', { month: 'short' })} - 
                  {new Date(tourPackage.endDate).toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-center mr-3">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Features</div>
                <div className="text-sm font-semibold">{tourPackage.features.length}</div>
              </div>
            </div>
          </div>

          {/* Pricing and Savings Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <DollarSign className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-sm font-semibold text-gray-700">Pricing Details:</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="text-xs text-gray-500 mb-1">Total Price</div>
                  <div className="text-lg font-bold text-gray-900 line-through">
                    LKR {tourPackage.totalPrice.toLocaleString()}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="text-xs text-gray-500 mb-1">After Discount</div>
                  <div className="text-xl font-bold" style={{ color: tourPackage.color }}>
                    LKR {discountedPrice.toLocaleString()}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
                  <div className="text-xs text-gray-500 mb-1">You Save</div>
                  <div className="text-lg font-bold text-rose-600 flex items-center justify-center">
                    <Save className="w-4 h-4 mr-1" />
                    LKR {savings.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-sm font-semibold text-gray-700">Key Features:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tourPackage.features.slice(0, 3).map((feature) => (
                  <span
                    key={feature.featureId}
                    className="px-3 py-1.5 text-sm rounded-lg border hover:border-gray-300 transition-colors"
                    style={{ 
                      backgroundColor: `${feature.color}15`,
                      borderColor: `${feature.color}30`,
                      color: feature.color
                    }}
                  >
                    {feature.featureName}: {feature.featureValue}
                  </span>
                ))}
                {tourPackage.features.length > 3 && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-sm rounded-lg border border-gray-200">
                    +{tourPackage.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Schedule and View Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <span className="text-sm font-semibold text-gray-700">Availability: </span>
                  <span className="text-sm text-gray-600">
                    {formatDate(tourPackage.startDate)} - {formatDate(tourPackage.endDate)}
                  </span>
                  {daysRemaining > 0 && (
                    <span className="ml-2 text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded-full">
                      {daysRemaining} days remaining
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Created on {new Date(tourPackage.createdAt).toLocaleDateString()} • 
                Per person: LKR {tourPackage.pricePerPerson.toLocaleString()}
              </div>
            </div>
            
            {/* View Details Button */}
            <button
              onClick={handleViewDetails}
              className="text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group/btn whitespace-nowrap"
              style={{
                background: `linear-gradient(135deg, ${tourPackage.color}, ${tourPackage.hoverColor})`
              }}
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

export default PackageListCard;