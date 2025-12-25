// components/destinations/DestinationCard.tsx
import React from 'react';
import { Destination } from '@/types/destination-types';
import { MapPin, Tag, Clock, Users } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const mainImage = destination.images[0]?.imageUrl || '/images/placeholder.jpg';
  const averagePrice = destination.activities.length > 0
    ? destination.activities.reduce((sum, activity) => sum + activity.priceLocal, 0) / destination.activities.length
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={mainImage}
          alt={destination.destinationName}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${destination.statusName === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {destination.statusName}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {destination.destinationName}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{destination.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {destination.destinationDescription}
        </p>

        {/* Category and Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Tag className="w-4 h-4 text-blue-600 mr-1" />
            <span className="text-sm font-medium text-blue-600">
              {destination.categoryName}
            </span>
          </div>
          <div className="text-sm font-semibold text-gray-800">
            From LKR {Math.min(...destination.activities.map(a => a.priceLocal)).toLocaleString()}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Activities</div>
            <div className="text-sm font-semibold text-gray-800">
              {destination.activities.length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Avg Duration</div>
            <div className="flex items-center justify-center text-sm font-semibold text-gray-800">
              <Clock className="w-3 h-3 mr-1" />
              {Math.round(destination.activities.reduce((sum, a) => sum + a.durationHours, 0) / destination.activities.length)}h
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Avg Group</div>
            <div className="flex items-center justify-center text-sm font-semibold text-gray-800">
              <Users className="w-3 h-3 mr-1" />
              {Math.round(destination.activities.reduce((sum, a) => sum + (a.minParticipate + a.maxParticipate) / 2, 0) / destination.activities.length)}
            </div>
          </div>
        </div>

        {/* Images Preview */}
        {destination.images.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex space-x-2 overflow-x-auto">
              {destination.images.slice(0, 3).map((image) => (
                <div key={image.imageId} className="flex-shrink-0">
                  <img
                    src={image.imageUrl}
                    alt={image.imageName}
                    className="w-16 h-16 rounded object-cover"
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
    </div>
  );
};

export default DestinationCard;