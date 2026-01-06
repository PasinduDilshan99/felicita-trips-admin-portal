// app/tours/add/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_TOURS_PATH,
} from "@/utils/constant";
import { TourService } from "@/services/tourService";
import {
  TourAssignmentEmployee,
  DestinationForTour,
  DestinationDetailsForTour,
  AddTourRequest,
  TourDestinationInput,
  TourImageInput,
  InclusionInput,
  ExclusionInput,
  ConditionInput,
  TravelTipInput,
} from "@/types/tour-types";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Tag,
  Image as ImageIcon,
  Check,
  X,
  Search,
  ChevronDown,
  Clock,
  DollarSign,
  Target,
  AlertCircle,
  Globe,
  Upload,
  Link,
  MessageSquare,
  FileText,
  Lightbulb,
  Shield,
  User,
  Briefcase,
  Mail,
  Phone,
  Award,
  ActivityIcon,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const AddNewTourPage = () => {
  const router = useRouter();

  // Basic tour information
  const [formData, setFormData] = useState<AddTourRequest>({
    name: "",
    description: "",
    tourType: 1,
    tourCategory: 1,
    duration: 1,
    latitude: 6.927079,
    longitude: 79.861244,
    startLocation: "",
    endLocation: "",
    season: 1,
    status: "ACTIVE",
    assignTo: 0,
    assignMessage: "",
    destinations: [],
    images: [],
    inclusions: [],
    exclusions: [],
    conditions: [],
    travelTips: [],
  });

  // Data for dropdowns
  const [employees, setEmployees] = useState<TourAssignmentEmployee[]>([]);
  const [destinations, setDestinations] = useState<DestinationForTour[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [loadingDestinationDetails, setLoadingDestinationDetails] = useState<
    number | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Search and selection states
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  // Destination details cache
  const [destinationDetails, setDestinationDetails] = useState<{
    [key: number]: DestinationDetailsForTour;
  }>({});

  // Current day for destination addition
  const [currentDay, setCurrentDay] = useState(1);

  // Selected employee details
  const [selectedEmployee, setSelectedEmployee] =
    useState<TourAssignmentEmployee | null>(null);

  // Current destination being added
  const [currentDestination, setCurrentDestination] = useState<{
    destinationId: number;
    destinationName: string;
    activities: number[];
  } | null>(null);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    {
      label: "Tour Management",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}`,
    },
    {
      label: "Add New Tour",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/add`,
    },
  ];

  // Initialize data
  useEffect(() => {
    fetchEmployees();
    fetchDestinations();
  }, []);

  // Filter employees based on search
  const filteredEmployees = employees.filter(
    (emp) =>
      `${emp.firstName} ${emp.lastName}`
        .toLowerCase()
        .includes(employeeSearch.toLowerCase()) ||
      emp.email.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  // Filter destinations based on search
  const filteredDestinations = destinations.filter((dest) =>
    dest.destinationName.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await TourService.getEmployeesForTourAssignment();
      setEmployees(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load employees");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchDestinations = async () => {
    setLoadingDestinations(true);
    try {
      const response = await TourService.getDestinationNames();
      setDestinations(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load destinations");
    } finally {
      setLoadingDestinations(false);
    }
  };

  const fetchDestinationDetails = async (destinationId: number) => {
    if (destinationDetails[destinationId]) return;

    setLoadingDestinationDetails(destinationId);
    try {
      const response = await TourService.getDestinationDetails(destinationId);
      setDestinationDetails((prev) => ({
        ...prev,
        [destinationId]: response.data,
      }));
    } catch (err: any) {
      setError(`Failed to load destination ${destinationId} details`);
    } finally {
      setLoadingDestinationDetails(null);
    }
  };

  const handleInputChange = (field: keyof AddTourRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectEmployee = (employee: TourAssignmentEmployee) => {
    setSelectedEmployee(employee);
    setFormData((prev) => ({ ...prev, assignTo: employee.employeeId }));
    setEmployeeSearch(`${employee.firstName} ${employee.lastName}`);
    setShowEmployeeDropdown(false);
  };

  const handleSelectDestination = (destination: DestinationForTour) => {
    fetchDestinationDetails(destination.destinationId);
    setCurrentDestination({
      destinationId: destination.destinationId,
      destinationName: destination.destinationName,
      activities: [],
    });
    setDestinationSearch(destination.destinationName);
    setShowDestinationDropdown(false);
  };

  const handleAddDestination = () => {
    if (!currentDestination || currentDestination.activities.length === 0) {
      setError("Please select at least one activity for the destination");
      return;
    }

    const newDestinations = currentDestination.activities.map((activityId) => ({
      destinationId: currentDestination.destinationId,
      activityId,
      dayNumber: currentDay,
    }));

    setFormData((prev) => ({
      ...prev,
      destinations: [...prev.destinations, ...newDestinations],
    }));

    // Clear current selection
    setCurrentDestination(null);
    setDestinationSearch("");
  };

  const handleAddInclusion = () => {
    const newInclusion: InclusionInput = {
      inclusionText: "",
      displayOrder: formData.inclusions.length + 1,
      status: "ACTIVE",
    };
    setFormData((prev) => ({
      ...prev,
      inclusions: [...prev.inclusions, newInclusion],
    }));
  };

  const handleAddExclusion = () => {
    const newExclusion: ExclusionInput = {
      exclusionText: "",
      displayOrder: formData.exclusions.length + 1,
      status: "ACTIVE",
    };
    setFormData((prev) => ({
      ...prev,
      exclusions: [...prev.exclusions, newExclusion],
    }));
  };

  const handleAddCondition = () => {
    const newCondition: ConditionInput = {
      conditionText: "",
      displayOrder: formData.conditions.length + 1,
      status: "ACTIVE",
    };
    setFormData((prev) => ({
      ...prev,
      conditions: [...prev.conditions, newCondition],
    }));
  };

  const handleAddTravelTip = () => {
    const newTravelTip: TravelTipInput = {
      tipTitle: "",
      tipDescription: "",
      displayOrder: formData.travelTips.length + 1,
      status: "ACTIVE",
    };
    setFormData((prev) => ({
      ...prev,
      travelTips: [...prev.travelTips, newTravelTip],
    }));
  };

  const handleAddImage = () => {
    const newImage: TourImageInput = {
      name: "",
      description: "",
      imageUrl: "",
      status: "ACTIVE",
    };
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImage],
    }));
  };

  const handleRemoveDestination = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveListItem = <T extends any[]>(
    list: T,
    index: number,
    field: keyof AddTourRequest
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: list.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Tour name is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Tour description is required");
      }
      if (formData.assignTo === 0) {
        throw new Error("Please assign tour to an employee");
      }
      if (formData.destinations.length === 0) {
        throw new Error("Please add at least one destination with activity");
      }

      await TourService.addTour(formData);

      setSuccess("Tour created successfully!");

      // Reset form after success
      setTimeout(() => {
        router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/view`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to create tour");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/view`);
  };

  // Get selected destination details
  const getSelectedDestinationDetails = () => {
    if (!currentDestination) return null;
    return destinationDetails[currentDestination.destinationId];
  };

  const destinationDetailsData = getSelectedDestinationDetails();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Breadcrumb */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Add New Tour"
            description="Create a new tour package with destinations, activities, and assignments"
            breadcrumbItems={breadcrumbItems}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <Check className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800">
                  Tour Created Successfully!
                </h3>
                <p className="text-green-600 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <X className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800">Error</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tour Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-600" />
              Tour Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tour Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="e.g., Sri Lanka Highlights Tour"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", parseInt(e.target.value) || 1)
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  required
                />
              </div>

              {/* Start Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Location *
                </label>
                <input
                  type="text"
                  value={formData.startLocation}
                  onChange={(e) =>
                    handleInputChange("startLocation", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="e.g., Colombo"
                  required
                />
              </div>

              {/* End Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Location *
                </label>
                <input
                  type="text"
                  value={formData.endLocation}
                  onChange={(e) =>
                    handleInputChange("endLocation", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="e.g., Galle"
                  required
                />
              </div>

              {/* Tour Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Type *
                </label>
                <select
                  value={formData.tourType}
                  onChange={(e) =>
                    handleInputChange("tourType", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
                  required
                >
                  <option value="1">Adventure</option>
                  <option value="2">Cultural</option>
                  <option value="3">Wildlife</option>
                  <option value="4">Beach</option>
                  <option value="5">Food & Dining</option>
                  <option value="6">Historical</option>
                </select>
              </div>

              {/* Tour Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Category *
                </label>
                <select
                  value={formData.tourCategory}
                  onChange={(e) =>
                    handleInputChange("tourCategory", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
                  required
                >
                  <option value="1">Solo</option>
                  <option value="2">Budget</option>
                  <option value="3">Family</option>
                  <option value="4">Group</option>
                  <option value="5">Luxury</option>
                  <option value="6">Corporate</option>
                </select>
              </div>

              {/* Season */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Season *
                </label>
                <select
                  value={formData.season}
                  onChange={(e) =>
                    handleInputChange("season", parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
                  required
                >
                  <option value="1">Summer</option>
                  <option value="2">Winter</option>
                  <option value="3">Spring</option>
                  <option value="4">Monsoon</option>
                  <option value="5">Fall</option>
                  <option value="6">Dry Season</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
                  required
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {/* Latitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) =>
                    handleInputChange(
                      "latitude",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="e.g., 6.927079"
                />
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) =>
                    handleInputChange(
                      "longitude",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="e.g., 79.861244"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                  placeholder="Describe the tour package..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Employee Assignment */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-600" />
              Assign Tour to Employee
            </h2>

            <div className="space-y-6">
              {/* Employee Search and Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Employee *
                </label>
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={employeeSearch}
                    onChange={(e) => {
                      setEmployeeSearch(e.target.value);
                      setShowEmployeeDropdown(true);
                    }}
                    onFocus={() => setShowEmployeeDropdown(true)}
                    placeholder="Search employee by name or email..."
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                {/* Employee Dropdown */}
                {showEmployeeDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                    {loadingEmployees ? (
                      <div className="p-8 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-3" />
                        <p className="text-gray-600">Loading employees...</p>
                      </div>
                    ) : filteredEmployees.length === 0 ? (
                      <div className="p-8 text-center">
                        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No employees found</p>
                      </div>
                    ) : (
                      filteredEmployees.map((emp) => (
                        <button
                          key={emp.employeeId}
                          type="button"
                          onClick={() => handleSelectEmployee(emp)}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {emp.firstName} {emp.lastName}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {emp.designationName} • {emp.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="px-3 py-1 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-full text-xs font-medium">
                                {emp.tours.filter((t) => t.tour_id).length}{" "}
                                tours
                              </span>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {/* Click outside to close dropdown */}
                {showEmployeeDropdown && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowEmployeeDropdown(false)}
                  />
                )}
              </div>

              {/* Selected Employee Details */}
              {selectedEmployee && (
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-violet-100 flex items-center justify-center flex-shrink-0">
                      {selectedEmployee.imageUrl ? (
                        <img
                          src={selectedEmployee.imageUrl}
                          alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {selectedEmployee.firstName}{" "}
                            {selectedEmployee.lastName}
                          </h3>
                          <p className="text-purple-600 font-medium">
                            {selectedEmployee.designationName}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-medium">
                          ID: {selectedEmployee.employeeId}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {selectedEmployee.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {selectedEmployee.mobileNumber1}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {
                              selectedEmployee.tours.filter((t) => t.tour_id)
                                .length
                            }{" "}
                            assigned tours
                          </span>
                        </div>
                      </div>

                      {/* Assigned Tours Preview */}
                      {selectedEmployee.tours.some((t) => t.tour_id) && (
                        <div className="mt-4 pt-4 border-t border-purple-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Currently Assigned Tours:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedEmployee.tours
                              .filter((t) => t.tour_id)
                              .slice(0, 3)
                              .map((tour, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-white text-gray-700 rounded-full text-xs border border-purple-200"
                                >
                                  {tour.name}
                                </span>
                              ))}
                            {selectedEmployee.tours.filter((t) => t.tour_id)
                              .length > 3 && (
                              <span className="px-3 py-1 bg-white text-gray-500 rounded-full text-xs border border-purple-200">
                                +
                                {selectedEmployee.tours.filter((t) => t.tour_id)
                                  .length - 3}{" "}
                                more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Assign Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Message *{/* Destinations & Activities */}
<div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
    <MapPin className="w-6 h-6 text-emerald-600" />
    Tour Itinerary - Destinations & Activities
  </h2>

  <div className="space-y-8">
    {/* Current Working Day */}
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Current Working Day
          </h3>
          <p className="text-gray-600 text-sm">
            You're currently adding destinations for:
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={currentDay}
              onChange={(e) => {
                const newDay = parseInt(e.target.value);
                setCurrentDay(newDay);
                setCurrentDestination(null);
                setDestinationSearch("");
              }}
              className="appearance-none px-6 py-2.5 bg-white text-gray-900 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium pr-10"
            >
              {Array.from({ length: formData.duration }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  Day {day}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* All Days Quick Navigation */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-700">
          Quick Navigation - Click to switch day:
        </label>
        <span className="text-xs text-gray-500">
          {formData.destinations.filter(d => d.dayNumber === currentDay).length} activities on Day {currentDay}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: formData.duration }, (_, i) => i + 1).map((day) => {
          const dayActivityCount = formData.destinations.filter(d => d.dayNumber === day).length;
          return (
            <button
              key={day}
              type="button"
              onClick={() => {
                setCurrentDay(day);
                setCurrentDestination(null);
                setDestinationSearch("");
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                currentDay === day
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                  : dayActivityCount > 0
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200 hover:border-amber-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Day {day}
              {dayActivityCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  currentDay === day
                    ? "bg-white/30"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {dayActivityCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>

    {/* Destination Search and Selection */}
    <div className="space-y-4">
      {/* Destination Day Selection */}
      <div className="bg-gradient-to-r from-gray-50 to-emerald-50 p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Destination Details
            </h3>
            <p className="text-xs text-gray-500">
              You can change the day number for this destination
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Add to:</span>
            <div className="relative">
              <select
                value={currentDay}
                onChange={(e) => setCurrentDay(parseInt(e.target.value))}
                className="appearance-none px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 text-sm font-medium pr-8"
                disabled={!currentDestination}
              >
                {Array.from({ length: formData.duration }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    Day {day}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Destination for Day {currentDay}
        </label>
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={destinationSearch}
            onChange={(e) => {
              setDestinationSearch(e.target.value);
              setShowDestinationDropdown(true);
            }}
            onFocus={() => setShowDestinationDropdown(true)}
            placeholder="Search destination by name..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => {
              setCurrentDestination(null);
              setDestinationSearch("");
            }}
            className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            Clear
          </button>
        </div>

        {/* Destination Dropdown */}
        {showDestinationDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
            {loadingDestinations ? (
              <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-3" />
                <p className="text-gray-600">Loading destinations...</p>
              </div>
            ) : filteredDestinations.length === 0 ? (
              <div className="p-8 text-center">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No destinations found</p>
              </div>
            ) : (
              filteredDestinations.map((dest) => (
                <button
                  key={dest.destinationId}
                  type="button"
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
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Click outside to close dropdown */}
        {showDestinationDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDestinationDropdown(false)}
          />
        )}
      </div>

      {/* Selected Destination Details & Activities */}
      {currentDestination && destinationDetailsData && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Day {currentDay}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {destinationDetailsData.destinationName}
                </h3>
              </div>
              <p className="text-gray-600 mb-3">{destinationDetailsData.destinationDescription}</p>
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1 text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                  <MapPin className="w-3 h-3" />
                  {destinationDetailsData.location}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                  <Tag className="w-3 h-3" />
                  {destinationDetailsData.categoryName}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                  <ActivityIcon className="w-3 h-3" />
                  {destinationDetailsData.activities.length} activities available
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentDestination(null);
                setDestinationSearch("");
              }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Activities Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                Select Activities for Day {currentDay}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Selected: {currentDestination.activities.length} of {destinationDetailsData.activities.length}
                </span>
              </div>
            </div>
            
            {/* Select All / Deselect All */}
            {destinationDetailsData.activities.length > 1 && (
              <div className="mb-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const allActivityIds = destinationDetailsData.activities.map(a => a.activityId);
                    setCurrentDestination(prev => ({
                      ...prev!,
                      activities: allActivityIds
                    }));
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-100 hover:border-blue-300 text-sm font-medium transition-all duration-200"
                >
                  Select All Activities
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentDestination(prev => ({
                      ...prev!,
                      activities: []
                    }));
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:border-gray-300 text-sm font-medium transition-all duration-200"
                >
                  Clear Selection
                </button>
              </div>
            )}

            <div className="space-y-4">
              {destinationDetailsData.activities.map((activity) => (
                <label
                  key={activity.activityId}
                  className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    currentDestination.activities.includes(activity.activityId)
                      ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={currentDestination.activities.includes(activity.activityId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCurrentDestination(prev => ({
                          ...prev!,
                          activities: [...prev!.activities, activity.activityId]
                        }));
                      } else {
                        setCurrentDestination(prev => ({
                          ...prev!,
                          activities: prev!.activities.filter(id => id !== activity.activityId)
                        }));
                      }
                    }}
                    className="mt-1 mr-3 h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">{activity.activityName}</h5>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{activity.activityDescription}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-gray-900">
                          LKR {activity.priceLocal.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Local Price</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{activity.durationHours} hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {activity.minParticipate}-{activity.maxParticipate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 line-clamp-1">{activity.season}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{activity.activitiesCategory}</span>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Add Destination Button */}
          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Add to:</span>
              <div className="relative">
                <select
                  value={currentDay}
                  onChange={(e) => setCurrentDay(parseInt(e.target.value))}
                  className="appearance-none px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 text-sm font-medium pr-8"
                >
                  {Array.from({ length: formData.duration }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      Day {day}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setCurrentDestination(null);
                  setDestinationSearch("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDestination}
                disabled={currentDestination.activities.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add to Day {currentDay} Itinerary
                {currentDestination.activities.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                    {currentDestination.activities.length} selected
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State for Destination Details */}
      {currentDestination && !destinationDetailsData && loadingDestinationDetails === currentDestination.destinationId && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-12 rounded-xl border border-gray-200 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading destination details...</p>
        </div>
      )}
    </div>

    {/* Selected Destinations Preview - Grouped by Day */}
    {formData.destinations.length > 0 && (
      <div className="bg-gradient-to-r from-gray-50 to-amber-50 p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Tour Itinerary Preview ({formData.destinations.length} activities)
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-white text-amber-700 rounded-full text-sm font-medium border border-amber-200">
              {new Set(formData.destinations.map(d => d.dayNumber)).size} days
            </span>
            <span className="px-4 py-2 bg-white text-amber-700 rounded-full text-sm font-medium border border-amber-200">
              {new Set(formData.destinations.map(d => d.destinationId)).size} destinations
            </span>
          </div>
        </div>

        {/* Group destinations by day */}
        {(() => {
          const destinationsByDay: { [day: number]: TourDestinationInput[] } = {};
          formData.destinations.forEach(dest => {
            if (!destinationsByDay[dest.dayNumber]) {
              destinationsByDay[dest.dayNumber] = [];
            }
            destinationsByDay[dest.dayNumber].push(dest);
          });

          return Object.entries(destinationsByDay)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([day, destinations]) => (
              <div key={day} className="mb-6 last:mb-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                      <span className="font-bold text-amber-700">{day}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Day {day} Itinerary</h4>
                      <p className="text-sm text-gray-500">
                        {destinations.length} activity{destinations.length > 1 ? 's' : ''} • {
                          new Set(destinations.map(d => d.destinationId)).size
                        } destination{new Set(destinations.map(d => d.destinationId)).size > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentDay(parseInt(day));
                      setCurrentDestination(null);
                      setDestinationSearch("");
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-100 hover:border-blue-300 text-sm font-medium transition-all duration-200"
                  >
                    Add More to Day {day}
                  </button>
                </div>
                
                <div className="space-y-3">
                  {(() => {
                    // Group by destination
                    const destGroups: { [destId: number]: TourDestinationInput[] } = {};
                    destinations.forEach(dest => {
                      if (!destGroups[dest.destinationId]) {
                        destGroups[dest.destinationId] = [];
                      }
                      destGroups[dest.destinationId].push(dest);
                    });

                    return Object.entries(destGroups).map(([destId, destGroup]) => {
                      const destDetails = destinationDetails[parseInt(destId)];
                      
                      return (
                        <div key={destId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                          {/* Destination Header */}
                          <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                                  <MapPin className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900">
                                    {destDetails?.destinationName || `Destination ${destId}`}
                                  </h5>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {destGroup.length} activity{destGroup.length > 1 ? 's' : ''} • Day {day}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Edit this destination - move to this day and show details
                                    setCurrentDay(parseInt(day));
                                    fetchDestinationDetails(parseInt(destId));
                                    setCurrentDestination({
                                      destinationId: parseInt(destId),
                                      destinationName: destDetails?.destinationName || `Destination ${destId}`,
                                      activities: destGroup.map(d => d.activityId)
                                    });
                                    setDestinationSearch(destDetails?.destinationName || "");
                                  }}
                                  className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-100 hover:border-blue-300 text-xs font-medium transition-all duration-200"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Remove all activities for this destination on this day
                                    const newDestinations = formData.destinations.filter(d => 
                                      !(parseInt(d.dayNumber.toString()) === parseInt(day) && d.destinationId === parseInt(destId))
                                    );
                                    handleInputChange("destinations", newDestinations);
                                  }}
                                  className="px-3 py-1.5 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-lg border border-red-100 hover:border-red-300 text-xs font-medium transition-all duration-200"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Activities List */}
                          <div className="divide-y divide-gray-100">
                            {destGroup.map((groupDest, groupIndex) => {
                              const groupActivity = destDetails?.activities.find(a => a.activityId === groupDest.activityId);
                              return (
                                <div key={groupIndex} className="p-4 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center">
                                      <ActivityIcon className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-900">
                                        {groupActivity?.activityName || `Activity ${groupDest.activityId}`}
                                      </span>
                                      {groupActivity && (
                                        <div className="flex items-center gap-3 mt-1">
                                          <span className="text-xs text-gray-500">
                                            Duration: {groupActivity.durationHours}h
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            Price: LKR {groupActivity.priceLocal.toLocaleString()}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            Group: {groupActivity.minParticipate}-{groupActivity.maxParticipate}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDestination(
                                      formData.destinations.findIndex(d => 
                                        d.dayNumber === groupDest.dayNumber && 
                                        d.destinationId === groupDest.destinationId && 
                                        d.activityId === groupDest.activityId
                                      )
                                    )}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove this activity"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ));
        })()}
      </div>
    )}

    {/* Empty State */}
    {formData.destinations.length === 0 && (
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-12 rounded-xl border border-gray-200 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Destinations Added Yet</h3>
        <p className="text-gray-600 mb-4">
          Start building your tour itinerary by selecting a day above and adding destinations with activities.
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="text-sm text-gray-500">Start with:</div>
          {[1, 2, 3].slice(0, formData.duration).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => {
                setCurrentDay(day);
                setCurrentDestination(null);
                setDestinationSearch("");
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-lg border border-emerald-200 hover:border-emerald-300 text-sm font-medium transition-all duration-200"
            >
              Day {day}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
</div>
                </label>
                <textarea
                  value={formData.assignMessage}
                  onChange={(e) =>
                    handleInputChange("assignMessage", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                  placeholder="Enter assignment instructions or message..."
                  required
                />
              </div>
            </div>
          </div>

          

          {/* Tour Images */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-rose-600" />
                Tour Images
              </h2>
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-lg border border-rose-100 hover:border-rose-300 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Image
              </button>
            </div>

            <div className="space-y-6">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-rose-50 p-6 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Image {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveListItem(formData.images, index, "images")
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Name *
                      </label>
                      <input
                        type="text"
                        value={image.name}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index].name = e.target.value;
                          handleInputChange("images", newImages);
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="e.g., Sigiriya Rock View"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={image.imageUrl}
                          onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[index].imageUrl = e.target.value;
                            handleInputChange("images", newImages);
                          }}
                          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="/images/tours/example.jpg"
                        />
                        <button
                          type="button"
                          className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-200"
                          title="Upload Image"
                        >
                          <Upload className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={image.description}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index].description = e.target.value;
                          handleInputChange("images", newImages);
                        }}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                        placeholder="Describe the image..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={image.status}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index].status = e.target.value as
                            | "ACTIVE"
                            | "INACTIVE";
                          handleInputChange("images", newImages);
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Check className="w-6 h-6 text-green-600" />
                Tour Inclusions
              </h2>
              <button
                type="button"
                onClick={handleAddInclusion}
                className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg border border-green-100 hover:border-green-300 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Inclusion
              </button>
            </div>

            <div className="space-y-4">
              {formData.inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={inclusion.inclusionText}
                    onChange={(e) => {
                      const newInclusions = [...formData.inclusions];
                      newInclusions[index].inclusionText = e.target.value;
                      handleInputChange("inclusions", newInclusions);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="e.g., Hotel accommodation"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveListItem(
                        formData.inclusions,
                        index,
                        "inclusions"
                      )
                    }
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <X className="w-6 h-6 text-red-600" />
                Tour Exclusions
              </h2>
              <button
                type="button"
                onClick={handleAddExclusion}
                className="px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-lg border border-red-100 hover:border-red-300 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Exclusion
              </button>
            </div>

            <div className="space-y-4">
              {formData.exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-100 to-rose-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-700 font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={exclusion.exclusionText}
                    onChange={(e) => {
                      const newExclusions = [...formData.exclusions];
                      newExclusions[index].exclusionText = e.target.value;
                      handleInputChange("exclusions", newExclusions);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="e.g., International airfare"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveListItem(
                        formData.exclusions,
                        index,
                        "exclusions"
                      )
                    }
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-6 h-6 text-amber-600" />
                Booking Conditions
              </h2>
              <button
                type="button"
                onClick={handleAddCondition}
                className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg border border-amber-100 hover:border-amber-300 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Condition
              </button>
            </div>

            <div className="space-y-4">
              {formData.conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-700 font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={condition.conditionText}
                    onChange={(e) => {
                      const newConditions = [...formData.conditions];
                      newConditions[index].conditionText = e.target.value;
                      handleInputChange("conditions", newConditions);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="e.g., Valid passport required"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveListItem(
                        formData.conditions,
                        index,
                        "conditions"
                      )
                    }
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Tips */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-purple-600" />
                Travel Tips
              </h2>
              <button
                type="button"
                onClick={handleAddTravelTip}
                className="px-4 py-2 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-lg border border-purple-100 hover:border-purple-300 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Travel Tip
              </button>
            </div>

            <div className="space-y-6">
              {formData.travelTips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Travel Tip {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveListItem(
                          formData.travelTips,
                          index,
                          "travelTips"
                        )
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tip Title *
                      </label>
                      <input
                        type="text"
                        value={tip.tipTitle}
                        onChange={(e) => {
                          const newTips = [...formData.travelTips];
                          newTips[index].tipTitle = e.target.value;
                          handleInputChange("travelTips", newTips);
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="e.g., Footwear"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tip Description *
                      </label>
                      <textarea
                        value={tip.tipDescription}
                        onChange={(e) => {
                          const newTips = [...formData.travelTips];
                          newTips[index].tipDescription = e.target.value;
                          handleInputChange("travelTips", newTips);
                        }}
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                        placeholder="e.g., Wear comfortable walking shoes"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="px-8 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Tours
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Tour...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Tour Package
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewTourPage;
