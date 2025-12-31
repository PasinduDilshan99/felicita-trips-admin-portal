// components/destinations-components/DestinationSearch.tsx
import React, { useState, useEffect } from "react";
import { DestinationForTerminate } from "@/types/destination-types";
import { Search, ChevronDown, Loader2, AlertCircle } from "lucide-react";

interface DestinationSearchProps {
  destinations: DestinationForTerminate[];
  loading: boolean;
  selectedDestination: DestinationForTerminate | null;
  onSelectDestination: (id: number, name: string) => void;
  initialSearchTerm?: string;
}

const DestinationSearch: React.FC<DestinationSearchProps> = ({
  destinations,
  loading,
  selectedDestination,
  onSelectDestination,
  initialSearchTerm = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filteredDestinations, setFilteredDestinations] = useState(destinations);
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter destinations based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDestinations(destinations);
      return;
    }

    const filtered = destinations.filter((dest) =>
      dest.destinationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDestinations(filtered);
  }, [searchTerm, destinations]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!showDropdown) setShowDropdown(true);
  };

  const handleSelectDestination = (dest: DestinationForTerminate) => {
    onSelectDestination(dest.destinationId, dest.destinationName);
    setSearchTerm(dest.destinationName);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-4">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search destination by name..."
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        {selectedDestination && (
          <div className="hidden sm:block px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg">
            ID: {selectedDestination.destinationId}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-gray-600">Loading destinations...</p>
            </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No destinations found</p>
              <p className="text-gray-500 text-sm mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            filteredDestinations.map((dest) => (
              <button
                key={dest.destinationId}
                onClick={() => handleSelectDestination(dest)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {dest.destinationName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {dest.destinationId}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default DestinationSearch;