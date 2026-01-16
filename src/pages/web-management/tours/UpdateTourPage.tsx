"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_TOURS_PATH,
} from "@/utils/constant";
import { TourService } from "@/services/tourService";
import {
  TourNameId,
  TourAllDetails,
  TourAssignmentEmployee,
  DestinationForTour,
  DestinationDetailsForTour,
  UpdateTourRequest,
  TourDestinationInput,
  UpdateDestinationInput,
  TourImageInput,
  UpdateImageInput,
  InclusionInput,
  UpdateInclusionInput,
  ExclusionInput,
  UpdateExclusionInput,
  ConditionInput,
  UpdateConditionInput,
  TravelTipInput,
  UpdateTravelTipInput,
  Inclusion,
  Exclusion,
  Condition,
  TravelTip,
  TourImage,
  DayToDayResponse,
  DayToDayDestination,
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
  Edit,
  Eye,
  EyeOff,
  RefreshCw,
  Filter,
  ExternalLink,
  Package,
  Settings,
  Zap,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Loader2 } from "lucide-react";

// Notification Component
interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  tourName?: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, tourName, onClose }) => {
  const [progress, setProgress] = useState(100);
  const duration = 30; // seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - (100 / (duration * 10)); // Update every 100ms
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 w-96 animate-slide-in">
      <div className={`relative overflow-hidden rounded-xl shadow-lg border ${
        type === 'success' 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
          : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
      }`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-semibold ${
                type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {type === 'success' ? 'Tour Updated Successfully!' : 'Update Failed'}
              </h3>
              <p className={`text-sm mt-1 ${
                type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {message}
              </p>
              {tourName && type === 'success' && (
                <p className="text-xs text-green-600 mt-1">
                  Tour: <span className="font-medium">{tourName}</span>
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className={`h-1 w-full ${
          type === 'success' ? 'bg-green-200' : 'bg-red-200'
        }`}>
          <div
            className={`h-full transition-all duration-100 ${
              type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const TourUpdatePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTourId = searchParams?.get("tour-id");
  const initialTourName = searchParams?.get("tour-name");

  // States for tour selection
  const [tourNames, setTourNames] = useState<TourNameId[]>([]);
  const [tourSearch, setTourSearch] = useState("");
  const [selectedTour, setSelectedTour] = useState<TourNameId | null>(
    initialTourId && initialTourName
      ? { tourId: parseInt(initialTourId), tourName: initialTourName }
      : null
  );
  const [showTourDropdown, setShowTourDropdown] = useState(false);
  const [loadingTourNames, setLoadingTourNames] = useState(false);

  // Tour details state
  const [tourDetails, setTourDetails] = useState<TourAllDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Form data for update
  const [formData, setFormData] = useState<UpdateTourRequest>({
    tourId: 0,
    tourBasicDetails: {
      tourName: "",
      tourDescription: "",
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
    },
    addDestinations: [],
    removeDestinations: [],
    updateDestinations: [],
    addImages: [],
    removeImages: [],
    updateImages: [],
    addInclusions: [],
    removeInclusions: [],
    updateInclusions: [],
    addExclusions: [],
    removeExclusions: [],
    updateExclusions: [],
    addConditions: [],
    removeConditions: [],
    updateConditions: [],
    addTravelTips: [],
    removeTravelTips: [],
    updateTravelTips: [],
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

  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    tourName?: string;
  } | null>(null);

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

  // Track removed destinations with more detail
  const [removedDestinations, setRemovedDestinations] = useState<Array<{
    dayNumber: number;
    destinationId: number;
    activityIds: number[];
    destinationName: string;
  }>>([]);

  const [removedImages, setRemovedImages] = useState<number[]>([]);
  const [removedInclusions, setRemovedInclusions] = useState<number[]>([]);
  const [removedExclusions, setRemovedExclusions] = useState<number[]>([]);
  const [removedConditions, setRemovedConditions] = useState<number[]>([]);
  const [removedTravelTips, setRemovedTravelTips] = useState<number[]>([]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    {
      label: "Tour Management",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}`,
    },
    {
      label: selectedTour ? `Update ${selectedTour.tourName}` : "Update Tour",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_TOURS_PATH}/update`,
    },
  ];

  // Initialize data
  useEffect(() => {
    fetchTourNames();
    fetchEmployees();
    fetchDestinations();
  }, []);

  // Load tour details if initialTourId exists
  useEffect(() => {
    if (initialTourId) {
      handleSelectTour({
        tourId: parseInt(initialTourId),
        tourName: initialTourName || "",
      });
    }
  }, [initialTourId, initialTourName]);

  // Filter tours based on search
  const filteredTours = tourNames.filter(
    (tour) =>
      tour.tourName.toLowerCase().includes(tourSearch.toLowerCase()) ||
      tour.tourId.toString().includes(tourSearch)
  );

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

  const fetchTourNames = async () => {
    setLoadingTourNames(true);
    try {
      const response = await TourService.getAllTourNames();
      setTourNames(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load tours");
      showNotification('error', err.message || "Failed to load tours");
    } finally {
      setLoadingTourNames(false);
    }
  };

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await TourService.getEmployeesForTourAssignment();
      setEmployees(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load employees");
      showNotification('error', err.message || "Failed to load employees");
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
      showNotification('error', err.message || "Failed to load destinations");
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
      showNotification('error', `Failed to load destination details`);
    } finally {
      setLoadingDestinationDetails(null);
    }
  };

  const handleSelectTour = async (tour: TourNameId) => {
    setSelectedTour(tour);
    setTourSearch(tour.tourName);
    setShowTourDropdown(false);
    setTourDetails(null);
    setLoadingDetails(true);

    try {
      const response = await TourService.getTourAllDetails(tour.tourId);
      const details = response.data;
      setTourDetails(details);

      // Initialize form data with existing tour details
      setFormData({
        tourId: details.tourId,
        tourBasicDetails: {
          tourName: details.tourName,
          tourDescription: details.tourDescription,
          tourType: 1,
          tourCategory: 1,
          duration: details.duration,
          latitude: details.latitude,
          longitude: details.longitude,
          startLocation: details.startLocation,
          endLocation: details.endLocation,
          season: 1,
          status: details.statusName as 'ACTIVE' | 'INACTIVE',
          assignTo: details.assignTo,
          assignMessage: details.assignMessage,
        },
        addDestinations: [],
        removeDestinations: [],
        updateDestinations: [],
        addImages: [],
        removeImages: [],
        updateImages: [],
        addInclusions: [],
        removeInclusions: [],
        updateInclusions: [],
        addExclusions: [],
        removeExclusions: [],
        updateExclusions: [],
        addConditions: [],
        removeConditions: [],
        updateConditions: [],
        addTravelTips: [],
        removeTravelTips: [],
        updateTravelTips: [],
      });

      // Set current day to max day
      if (details.dayToDayResponses.length > 0) {
        const maxDay = Math.max(...details.dayToDayResponses.map(d => d.dayNumber));
        setCurrentDay(maxDay + 1);
      }

      // Find and set selected employee
      const employee = employees.find(emp => emp.employeeId === details.assignTo);
      if (employee) {
        setSelectedEmployee(employee);
        setEmployeeSearch(`${employee.firstName} ${employee.lastName}`);
      }

      // Reset removed items
      setRemovedDestinations([]);
      setRemovedImages([]);
      setRemovedInclusions([]);
      setRemovedExclusions([]);
      setRemovedConditions([]);
      setRemovedTravelTips([]);

    } catch (err: any) {
      setError(err.message || "Failed to load tour details");
      showNotification('error', err.message || "Failed to load tour details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleInputChange = (field: keyof UpdateTourRequest['tourBasicDetails'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      tourBasicDetails: {
        ...prev.tourBasicDetails,
        [field]: value,
      },
    }));
  };

  const handleSelectEmployee = (employee: TourAssignmentEmployee) => {
    setSelectedEmployee(employee);
    setFormData((prev) => ({
      ...prev,
      tourBasicDetails: {
        ...prev.tourBasicDetails,
        assignTo: employee.employeeId,
      },
    }));
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
      showNotification('error', "Please select at least one activity for the destination");
      return;
    }

    const newDestinations = currentDestination.activities.map((activityId) => ({
      destinationId: currentDestination.destinationId,
      activityId,
      dayNumber: currentDay,
    }));

    setFormData((prev) => ({
      ...prev,
      addDestinations: [...prev.addDestinations, ...newDestinations],
    }));

    // Clear current selection
    setCurrentDestination(null);
    setDestinationSearch("");
    showNotification('success', `Added ${newDestinations.length} activities to Day ${currentDay}`);
  };

  const handleRemoveExistingDestination = (dayNumber: number, destination: DayToDayDestination) => {
    // Get all activity IDs from this destination
    const activityIds = destination.activities.map(activity => activity.activityId);
    
    // Add to removed destinations tracking
    const removedDest = {
      dayNumber,
      destinationId: destination.destination.destinationId,
      activityIds,
      destinationName: destination.destination.destinationName
    };
    
    setRemovedDestinations(prev => [...prev, removedDest]);
    
    // Add activity IDs to removeDestinations array in formData
    setFormData(prev => ({
      ...prev,
      removeDestinations: [...prev.removeDestinations, ...activityIds]
    }));
    
    showNotification('success', `Marked destination "${destination.destination.destinationName}" for removal`);
  };

  const handleUndoRemoveDestination = (destinationId: number, activityIds: number[]) => {
    // Remove from tracking
    setRemovedDestinations(prev => 
      prev.filter(dest => 
        !(dest.destinationId === destinationId && 
          JSON.stringify(dest.activityIds) === JSON.stringify(activityIds))
      )
    );
    
    // Remove from formData's removeDestinations
    setFormData(prev => ({
      ...prev,
      removeDestinations: prev.removeDestinations.filter(id => !activityIds.includes(id))
    }));
    
    showNotification('success', "Destination removal cancelled");
  };

  // Image Management
  const handleAddImage = () => {
    const newImage: TourImageInput = {
      name: "",
      description: "",
      imageUrl: "",
      status: "ACTIVE",
    };
    setFormData((prev) => ({
      ...prev,
      addImages: [...prev.addImages, newImage],
    }));
  };

  const handleRemoveExistingImage = (imageId: number, imageName: string) => {
    setRemovedImages([...removedImages, imageId]);
    setFormData((prev) => ({
      ...prev,
      removeImages: [...prev.removeImages, imageId],
    }));
    showNotification('success', `Image "${imageName}" marked for removal`);
  };

  const handleUpdateImage = (index: number, field: keyof TourImageInput, value: any) => {
    if (tourDetails?.images[index]) {
      const updateData: UpdateImageInput = {
        imageId: tourDetails.images[index].imageId,
        name: field === 'name' ? value : tourDetails.images[index].imageName,
        imageDescription: field === 'description' ? value : tourDetails.images[index].imageDescription,
        imageUrl: field === 'imageUrl' ? value : tourDetails.images[index].imageUrl,
        status: field === 'status' ? value : "ACTIVE",
      };

      setFormData((prev) => {
        const existingUpdateIndex = prev.updateImages.findIndex(
          img => img.imageId === updateData.imageId
        );

        if (existingUpdateIndex >= 0) {
          const updatedImages = [...prev.updateImages];
          updatedImages[existingUpdateIndex] = {
            ...updatedImages[existingUpdateIndex],
            [field]: value,
          };
          return { ...prev, updateImages: updatedImages };
        } else {
          return { ...prev, updateImages: [...prev.updateImages, updateData] };
        }
      });
      
      showNotification('success', `Image updated`);
    }
  };

  // Inclusion Management
  const handleAddInclusion = () => {
    const newInclusion: InclusionInput = {
      inclusionText: "",
      displayOrder: (tourDetails?.inclusions.length || 0) + (formData.addInclusions.length || 0) + 1,
      status: "ACTIVE",
    };
    setFormData((prev) => ({
      ...prev,
      addInclusions: [...prev.addInclusions, newInclusion],
    }));
  };

  const handleRemoveExistingInclusion = (inclusionId: number, inclusionText: string) => {
    setRemovedInclusions([...removedInclusions, inclusionId]);
    setFormData((prev) => ({
      ...prev,
      removeInclusions: [...prev.removeInclusions, inclusionId],
    }));
    showNotification('success', `Inclusion "${inclusionText}" marked for removal`);
  };

  const handleUpdateInclusion = (index: number, field: keyof Inclusion, value: any) => {
    if (tourDetails?.inclusions[index]) {
      const updateData: UpdateInclusionInput = {
        inclusionId: tourDetails.inclusions[index].id,
        inclusionText: field === 'description' ? value : tourDetails.inclusions[index].description,
        displayOrder: field === 'displayOrder' ? value : tourDetails.inclusions[index].displayOrder,
        status: field === 'status' ? value : tourDetails.inclusions[index].status,
      };

      setFormData((prev) => {
        const existingUpdateIndex = prev.updateInclusions.findIndex(
          inc => inc.inclusionId === updateData.inclusionId
        );

        if (existingUpdateIndex >= 0) {
          const updatedInclusions = [...prev.updateInclusions];
          updatedInclusions[existingUpdateIndex] = {
            ...updatedInclusions[existingUpdateIndex],
            [field === 'description' ? 'inclusionText' : field]: value,
          };
          return { ...prev, updateInclusions: updatedInclusions };
        } else {
          return { ...prev, updateInclusions: [...prev.updateInclusions, updateData] };
        }
      });
      
      showNotification('success', `Inclusion updated`);
    }
  };

  // Exclusion Management
  const handleAddExclusion = () => {
    const newExclusion: ExclusionInput = {
      exclusionText: "",
      displayOrder: (tourDetails?.exclusions.length || 0) + (formData.addExclusions.length || 0) + 1,
      status: "ACTIVE",
    };
    setFormData((prev) => ({
      ...prev,
      addExclusions: [...prev.addExclusions, newExclusion],
    }));
  };

  const handleRemoveExistingExclusion = (exclusionId: number, exclusionText: string) => {
    setRemovedExclusions([...removedExclusions, exclusionId]);
    setFormData((prev) => ({
      ...prev,
      removeExclusions: [...prev.removeExclusions, exclusionId],
    }));
    showNotification('success', `Exclusion "${exclusionText}" marked for removal`);
  };

  const handleUpdateExclusion = (index: number, field: keyof Exclusion, value: any) => {
    if (tourDetails?.exclusions[index]) {
      const updateData: UpdateExclusionInput = {
        exclusionId: tourDetails.exclusions[index].id,
        exclusionText: field === 'description' ? value : tourDetails.exclusions[index].description,
        displayOrder: field === 'displayOrder' ? value : tourDetails.exclusions[index].displayOrder,
        status: field === 'status' ? value : tourDetails.exclusions[index].status,
      };

      setFormData((prev) => {
        const existingUpdateIndex = prev.updateExclusions.findIndex(
          exc => exc.exclusionId === updateData.exclusionId
        );

        if (existingUpdateIndex >= 0) {
          const updatedExclusions = [...prev.updateExclusions];
          updatedExclusions[existingUpdateIndex] = {
            ...updatedExclusions[existingUpdateIndex],
            [field === 'description' ? 'exclusionText' : field]: value,
          };
          return { ...prev, updateExclusions: updatedExclusions };
        } else {
          return { ...prev, updateExclusions: [...prev.updateExclusions, updateData] };
        }
      });
      
      showNotification('success', `Exclusion updated`);
    }
  };

  // Condition Management
  const handleAddCondition = () => {
    const newCondition: ConditionInput = {
      conditionText: "",
      displayOrder: (tourDetails?.conditions.length || 0) + (formData.addConditions.length || 0) + 1,
      status: "ACTIVE",
    };
    setFormData((prev) => ({
      ...prev,
      addConditions: [...prev.addConditions, newCondition],
    }));
  };

  const handleRemoveExistingCondition = (conditionId: number, conditionText: string) => {
    setRemovedConditions([...removedConditions, conditionId]);
    setFormData((prev) => ({
      ...prev,
      removeConditions: [...prev.removeConditions, conditionId],
    }));
    showNotification('success', `Condition "${conditionText}" marked for removal`);
  };

  const handleUpdateCondition = (index: number, field: keyof Condition, value: any) => {
    if (tourDetails?.conditions[index]) {
      const updateData: UpdateConditionInput = {
        conditionId: tourDetails.conditions[index].id,
        conditionText: field === 'description' ? value : tourDetails.conditions[index].description,
        displayOrder: field === 'displayOrder' ? value : tourDetails.conditions[index].displayOrder,
        status: field === 'status' ? value : tourDetails.conditions[index].status,
      };

      setFormData((prev) => {
        const existingUpdateIndex = prev.updateConditions.findIndex(
          cond => cond.conditionId === updateData.conditionId
        );

        if (existingUpdateIndex >= 0) {
          const updatedConditions = [...prev.updateConditions];
          updatedConditions[existingUpdateIndex] = {
            ...updatedConditions[existingUpdateIndex],
            [field === 'description' ? 'conditionText' : field]: value,
          };
          return { ...prev, updateConditions: updatedConditions };
        } else {
          return { ...prev, updateConditions: [...prev.updateConditions, updateData] };
        }
      });
      
      showNotification('success', `Condition updated`);
    }
  };

  // Travel Tip Management
  const handleAddTravelTip = () => {
    const newTravelTip: TravelTipInput = {
      tipTitle: "",
      tipDescription: "",
      displayOrder: (tourDetails?.travelTips.length || 0) + (formData.addTravelTips.length || 0) + 1,
      status: "ACTIVE",
    };
    setFormData((prev) => ({
      ...prev,
      addTravelTips: [...prev.addTravelTips, newTravelTip],
    }));
  };

  const handleRemoveExistingTravelTip = (travelTipId: number, tipTitle: string) => {
    setRemovedTravelTips([...removedTravelTips, travelTipId]);
    setFormData((prev) => ({
      ...prev,
      removeTravelTips: [...prev.removeTravelTips, travelTipId],
    }));
    showNotification('success', `Travel tip "${tipTitle}" marked for removal`);
  };

  const handleUpdateTravelTip = (index: number, field: keyof TravelTip, value: any) => {
    if (tourDetails?.travelTips[index]) {
      const updateData: UpdateTravelTipInput = {
        travelTipId: tourDetails.travelTips[index].id,
        tipTitle: field === 'title' ? value : tourDetails.travelTips[index].title,
        tipDescription: field === 'description' ? value : tourDetails.travelTips[index].description,
        displayOrder: field === 'displayOrder' ? value : tourDetails.travelTips[index].displayOrder,
        status: field === 'status' ? value : tourDetails.travelTips[index].status,
      };

      setFormData((prev) => {
        const existingUpdateIndex = prev.updateTravelTips.findIndex(
          tip => tip.travelTipId === updateData.travelTipId
        );

        if (existingUpdateIndex >= 0) {
          const updatedTravelTips = [...prev.updateTravelTips];
          updatedTravelTips[existingUpdateIndex] = {
            ...updatedTravelTips[existingUpdateIndex],
            [field]: value,
          };
          return { ...prev, updateTravelTips: updatedTravelTips };
        } else {
          return { ...prev, updateTravelTips: [...prev.updateTravelTips, updateData] };
        }
      });
      
      showNotification('success', `Travel tip updated`);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string, tourName?: string) => {
    setNotification({
      type,
      message,
      tourName: tourName || selectedTour?.tourName
    });
    
    // Auto-hide after 30 seconds
    setTimeout(() => {
      setNotification(null);
    }, 30000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!formData.tourBasicDetails.tourName.trim()) {
        throw new Error("Tour name is required");
      }
      if (!formData.tourBasicDetails.tourDescription.trim()) {
        throw new Error("Tour description is required");
      }
      if (formData.tourBasicDetails.assignTo === 0) {
        throw new Error("Please assign tour to an employee");
      }

      // Update removed arrays with actual IDs
      const finalFormData = {
        ...formData,
        removeImages: removedImages,
        removeInclusions: removedInclusions,
        removeExclusions: removedExclusions,
        removeConditions: removedConditions,
        removeTravelTips: removedTravelTips,
        // Remove destinations are already in formData.removeDestinations
      };

      const response = await TourService.updateTour(finalFormData);

      if (response.code === 200) {
        showNotification('success', "Tour updated successfully!", formData.tourBasicDetails.tourName);
        
        // Refresh tour details
        if (selectedTour) {
          const updatedDetails = await TourService.getTourAllDetails(selectedTour.tourId);
          setTourDetails(updatedDetails.data);
          
          // Reset form data to reflect changes
          setFormData({
            tourId: updatedDetails.data.tourId,
            tourBasicDetails: {
              tourName: updatedDetails.data.tourName,
              tourDescription: updatedDetails.data.tourDescription,
              tourType: 1,
              tourCategory: 1,
              duration: updatedDetails.data.duration,
              latitude: updatedDetails.data.latitude,
              longitude: updatedDetails.data.longitude,
              startLocation: updatedDetails.data.startLocation,
              endLocation: updatedDetails.data.endLocation,
              season: 1,
              status: updatedDetails.data.statusName as 'ACTIVE' | 'INACTIVE',
              assignTo: updatedDetails.data.assignTo,
              assignMessage: updatedDetails.data.assignMessage,
            },
            addDestinations: [],
            removeDestinations: [],
            updateDestinations: [],
            addImages: [],
            removeImages: [],
            updateImages: [],
            addInclusions: [],
            removeInclusions: [],
            updateInclusions: [],
            addExclusions: [],
            removeExclusions: [],
            updateExclusions: [],
            addConditions: [],
            removeConditions: [],
            updateConditions: [],
            addTravelTips: [],
            removeTravelTips: [],
            updateTravelTips: [],
          });

          // Reset removed items
          setRemovedDestinations([]);
          setRemovedImages([]);
          setRemovedInclusions([]);
          setRemovedExclusions([]);
          setRemovedConditions([]);
          setRemovedTravelTips([]);
        }
      } else {
        throw new Error(response.message || "Failed to update tour");
      }

    } catch (err: any) {
      showNotification('error', err.message || "Failed to update tour");
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

  // Calculate total changes
  const totalChanges = 
    formData.addDestinations.length +
    formData.removeDestinations.length +
    formData.updateDestinations.length +
    formData.addImages.length +
    formData.removeImages.length +
    formData.updateImages.length +
    formData.addInclusions.length +
    formData.removeInclusions.length +
    formData.updateInclusions.length +
    formData.addExclusions.length +
    formData.removeExclusions.length +
    formData.updateExclusions.length +
    formData.addConditions.length +
    formData.removeConditions.length +
    formData.updateConditions.length +
    formData.addTravelTips.length +
    formData.removeTravelTips.length +
    formData.updateTravelTips.length;

  if (!selectedTour) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <PageHeader
              title="Update Tour"
              description="Select a tour to update its details"
              breadcrumbItems={breadcrumbItems}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center">
              <Package className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Select Tour to Update
              </h2>
              <p className="text-gray-600 mb-8">
                Search and select a tour from the list below to update its details
              </p>

              {/* Tour Search */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Tour *
                </label>
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={tourSearch}
                    onChange={(e) => {
                      setTourSearch(e.target.value);
                      setShowTourDropdown(true);
                    }}
                    onFocus={() => setShowTourDropdown(true)}
                    placeholder="Search tour by name or ID..."
                    className="text-gray-600 flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                {/* Tour Dropdown */}
                {showTourDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                    {loadingTourNames ? (
                      <div className="p-8 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-3" />
                        <p className="text-gray-600">Loading tours...</p>
                      </div>
                    ) : filteredTours.length === 0 ? (
                      <div className="p-8 text-center">
                        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No tours found</p>
                      </div>
                    ) : (
                      filteredTours.map((tour) => (
                        <button
                          key={tour.tourId}
                          type="button"
                          onClick={() => handleSelectTour(tour)}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {tour.tourName}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                ID: {tour.tourId}
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
                {showTourDropdown && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowTourDropdown(false)}
                  />
                )}
              </div>

              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 font-medium flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Tours
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">Loading Tour Details...</h3>
          <p className="text-gray-600">Please wait while we load the tour information</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          tourName={notification.tourName}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Header with Breadcrumb */}
        <div className="top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <PageHeader
              title={`Update: ${selectedTour.tourName}`}
              description="Update tour package details, destinations, activities, and assignments"
              breadcrumbItems={breadcrumbItems}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tour Selection Bar */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedTour.tourName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    ID: {selectedTour.tourId} • Duration: {tourDetails?.duration || 0} days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium">
                  {totalChanges} pending changes
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTour(null);
                    setTourSearch("");
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 text-sm font-medium transition-all duration-200"
                >
                  Change Tour
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tour Basic Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                  Tour Basic Information
                  <span className="text-sm font-normal text-gray-500">
                    (Current values shown)
                  </span>
                </h2>
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Edit fields to update</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tour Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tour Name *
                  </label>
                  <input
                    type="text"
                    value={formData.tourBasicDetails.tourName}
                    onChange={(e) => handleInputChange("tourName", e.target.value)}
                    className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                    value={formData.tourBasicDetails.duration}
                    onChange={(e) =>
                      handleInputChange("duration", parseInt(e.target.value) || 1)
                    }
                    className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                    value={formData.tourBasicDetails.startLocation}
                    onChange={(e) =>
                      handleInputChange("startLocation", e.target.value)
                    }
                    className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                    value={formData.tourBasicDetails.endLocation}
                    onChange={(e) =>
                      handleInputChange("endLocation", e.target.value)
                    }
                    className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                    value={formData.tourBasicDetails.tourType}
                    onChange={(e) =>
                      handleInputChange("tourType", parseInt(e.target.value))
                    }
                    className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
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
                    value={formData.tourBasicDetails.tourCategory}
                    onChange={(e) =>
                      handleInputChange("tourCategory", parseInt(e.target.value))
                    }
                    className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
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
                    value={formData.tourBasicDetails.season}
                    onChange={(e) =>
                      handleInputChange("season", parseInt(e.target.value))
                    }
                    className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
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
                    value={formData.tourBasicDetails.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
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
                    value={formData.tourBasicDetails.latitude}
                    onChange={(e) =>
                      handleInputChange(
                        "latitude",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                    value={formData.tourBasicDetails.longitude}
                    onChange={(e) =>
                      handleInputChange(
                        "longitude",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="e.g., 79.861244"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.tourBasicDetails.tourDescription}
                    onChange={(e) =>
                      handleInputChange("tourDescription", e.target.value)
                    }
                    rows={4}
                    className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
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
                      className="text-gray-600 flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                    Assignment Message *
                  </label>
                  <textarea
                    value={formData.tourBasicDetails.assignMessage}
                    onChange={(e) =>
                      handleInputChange("assignMessage", e.target.value)
                    }
                    rows={3}
                    className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                    placeholder="Enter assignment instructions or message..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Destinations & Activities Management */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                  Destinations & Activities Management
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full text-sm font-medium">
                    {formData.addDestinations.length} to add
                  </span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-full text-sm font-medium">
                    {formData.removeDestinations.length} to remove
                  </span>
                </div>
              </div>

              {/* Removed Destinations Summary */}
              {removedDestinations.length > 0 && (
                <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-red-800">
                      Destinations Marked for Removal
                    </h4>
                    <span className="px-2 py-1 bg-white text-red-700 rounded-full text-xs">
                      {removedDestinations.length} destinations
                    </span>
                  </div>
                  <div className="space-y-2">
                    {removedDestinations.map((dest, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg">
                        <div>
                          <span className="text-sm text-gray-700">{dest.destinationName}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            (Day {dest.dayNumber}, {dest.activityIds.length} activities)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUndoRemoveDestination(dest.destinationId, dest.activityIds)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Undo
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Destinations Display */}
              {tourDetails?.dayToDayResponses && tourDetails.dayToDayResponses.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Current Itinerary
                  </h3>
                  <div className="space-y-6">
                    {tourDetails.dayToDayResponses.map((day) => (
                      <div key={day.dayNumber} className="bg-gradient-to-r from-gray-50 to-amber-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                              <span className="font-bold text-amber-700">
                                {day.dayNumber}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                Day {day.dayNumber} Itinerary
                              </h4>
                              <p className="text-sm text-gray-500">
                                {day.destinations.length} destination{day.destinations.length > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentDay(day.dayNumber);
                              setCurrentDestination(null);
                              setDestinationSearch("");
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-100 hover:border-blue-300 text-sm font-medium transition-all duration-200"
                          >
                            Add More to Day {day.dayNumber}
                          </button>
                        </div>

                        <div className="space-y-4">
                          {day.destinations.map((dest, destIndex) => {
                            // Check if this destination is marked for removal
                            const isMarkedForRemoval = removedDestinations.some(
                              d => d.destinationId === dest.destination.destinationId && 
                                   d.dayNumber === day.dayNumber
                            );
                            
                            return (
                              <div 
                                key={destIndex} 
                                className={`bg-white rounded-xl border overflow-hidden ${
                                  isMarkedForRemoval 
                                    ? 'border-red-300 opacity-60' 
                                    : 'border-gray-200'
                                }`}
                              >
                                <div className={`p-4 border-b ${
                                  isMarkedForRemoval 
                                    ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200' 
                                    : 'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        isMarkedForRemoval
                                          ? 'bg-gradient-to-r from-red-100 to-rose-100'
                                          : 'bg-gradient-to-r from-blue-100 to-indigo-100'
                                      }`}>
                                        {isMarkedForRemoval ? (
                                          <X className="w-4 h-4 text-red-600" />
                                        ) : (
                                          <MapPin className="w-4 h-4 text-blue-600" />
                                        )}
                                      </div>
                                      <div>
                                        <h5 className="font-medium text-gray-900">
                                          {dest.destination.destinationName}
                                          {isMarkedForRemoval && (
                                            <span className="ml-2 text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                              To be removed
                                            </span>
                                          )}
                                        </h5>
                                        <p className="text-sm text-gray-600 mt-1">
                                          {dest.activities.length} activit{dest.activities.length > 1 ? 'ies' : 'y'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      {!isMarkedForRemoval ? (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveExistingDestination(day.dayNumber, dest)}
                                          className="px-3 py-1.5 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-lg border border-red-100 hover:border-red-300 text-xs font-medium transition-all duration-200"
                                        >
                                          Remove
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleUndoRemoveDestination(dest.destination.destinationId, dest.activities.map(a => a.activityId))}
                                          className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-100 hover:border-blue-300 text-xs font-medium transition-all duration-200"
                                        >
                                          Undo
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="divide-y divide-gray-100">
                                  {dest.activities.map((activity, activityIndex) => (
                                    <div key={activityIndex} className="p-4 flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center">
                                          <ActivityIcon className="w-3 h-3 text-emerald-600" />
                                        </div>
                                        <div>
                                          <span className="font-medium text-gray-900">
                                            {activity.activityName}
                                          </span>
                                          <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-gray-500">
                                              Duration: {activity.durationHours}h
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              Category: {activity.categoryName}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        ID: {activity.activityId}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Destinations Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Add New Destinations
                </h3>

                {/* Current Day Selection */}
                <div className="bg-gradient-to-r from-gray-50 to-emerald-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-1">
                        Destination Details
                      </h3>
                      <p className="text-xs text-gray-500">
                        Select day number for the new destination
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Add to:</span>
                      <div className="relative">
                        <select
                          value={currentDay}
                          onChange={(e) =>
                            setCurrentDay(parseInt(e.target.value))
                          }
                          className="appearance-none px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 text-sm font-medium pr-8"
                        >
                          {Array.from(
                            { length: formData.tourBasicDetails.duration },
                            (_, i) => i + 1
                          ).map((day) => (
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

                {/* Destination Search */}
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
                      className="text-gray-600 flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
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
                        
                        <div className="flex flex-wrap gap-3 mb-3">
                          <span className="flex items-center gap-1 text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                            <MapPin className="w-3 h-3" />
                            {destinationDetailsData.location}
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
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Select Activities for Day {currentDay}
                      </h4>

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
                                  setCurrentDestination((prev) => ({
                                    ...prev!,
                                    activities: [...prev!.activities, activity.activityId],
                                  }));
                                } else {
                                  setCurrentDestination((prev) => ({
                                    ...prev!,
                                    activities: prev!.activities.filter(
                                      (id) => id !== activity.activityId
                                    ),
                                  }));
                                }
                              }}
                              className="mt-1 mr-3 h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h5 className="font-medium text-gray-900">
                                    {activity.activityName}
                                  </h5>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {activity.activityDescription}
                                  </p>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-lg font-bold text-gray-900">
                                    LKR {activity.priceLocal.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Local Price
                                  </div>
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
                            onChange={(e) =>
                              setCurrentDay(parseInt(e.target.value))
                            }
                            className="appearance-none px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 text-sm font-medium pr-8"
                          >
                            {Array.from(
                              { length: formData.tourBasicDetails.duration },
                              (_, i) => i + 1
                            ).map((day) => (
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

                {/* Pending Destination Additions */}
                {formData.addDestinations.length > 0 && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-emerald-800">
                        Pending Destination Additions
                      </h4>
                      <span className="px-3 py-1 bg-white text-emerald-700 rounded-full text-sm font-medium">
                        {formData.addDestinations.length} to add
                      </span>
                    </div>
                    <div className="space-y-2">
                      {formData.addDestinations.map((dest, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <span className="text-gray-700">
                            Destination {dest.destinationId} - Activity {dest.activityId} (Day {dest.dayNumber})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                addDestinations: prev.addDestinations.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Images Management */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <ImageIcon className="w-6 h-6 text-rose-600" />
                  Tour Images Management
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-lg border border-rose-100 hover:border-rose-300 transition-all duration-200 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Image
                  </button>
                </div>
              </div>

              {/* Existing Images */}
              {tourDetails?.images && tourDetails.images.filter(img => !removedImages.includes(img.imageId)).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Current Images
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tourDetails.images
                      .filter(img => !removedImages.includes(img.imageId))
                      .map((image, index) => (
                        <div key={image.imageId} className="bg-gradient-to-r from-gray-50 to-rose-50 p-6 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-800">
                              {image.imageName}
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(image.imageId, image.imageName)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image URL
                              </label>
                              <input
                                type="text"
                                value={image.imageUrl}
                                onChange={(e) => handleUpdateImage(index, 'imageUrl', e.target.value)}
                                className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                              </label>
                              <textarea
                                value={image.imageDescription}
                                onChange={(e) => handleUpdateImage(index, 'description', e.target.value)}
                                rows={2}
                                className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                              />
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {image.imageId}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* New Images to Add */}
              {formData.addImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    New Images to Add
                  </h3>
                  <div className="space-y-6">
                    {formData.addImages.map((image, index) => (
                      <div key={index} className="bg-gradient-to-r from-gray-50 to-rose-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-800">
                            New Image {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                addImages: prev.addImages.filter((_, i) => i !== index)
                              }));
                            }}
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
                                const newImages = [...formData.addImages];
                                newImages[index].name = e.target.value;
                                setFormData(prev => ({ ...prev, addImages: newImages }));
                              }}
                              className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              placeholder="e.g., Sigiriya Rock View"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Image URL *
                            </label>
                            <input
                              type="text"
                              value={image.imageUrl}
                              onChange={(e) => {
                                const newImages = [...formData.addImages];
                                newImages[index].imageUrl = e.target.value;
                                setFormData(prev => ({ ...prev, addImages: newImages }));
                              }}
                              className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              placeholder="/images/tours/example.jpg"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description *
                            </label>
                            <textarea
                              value={image.description}
                              onChange={(e) => {
                                const newImages = [...formData.addImages];
                                newImages[index].description = e.target.value;
                                setFormData(prev => ({ ...prev, addImages: newImages }));
                              }}
                              rows={2}
                              className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                              placeholder="Describe the image..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Inclusions Management */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600" />
                  Tour Inclusions Management
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddInclusion}
                    className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg border border-green-100 hover:border-green-300 transition-all duration-200 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Inclusion
                  </button>
                </div>
              </div>

              {/* Existing Inclusions */}
              {tourDetails?.inclusions && tourDetails.inclusions.filter(inc => !removedInclusions.includes(inc.id)).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Current Inclusions
                  </h3>
                  <div className="space-y-4">
                    {tourDetails.inclusions
                      .filter(inc => !removedInclusions.includes(inc.id))
                      .map((inclusion, index) => (
                        <div key={inclusion.id} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-green-700 font-medium">
                              {index + 1}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={inclusion.description}
                            onChange={(e) => handleUpdateInclusion(index, 'description', e.target.value)}
                            className="text-gray-600 flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingInclusion(inclusion.id, inclusion.description)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* New Inclusions to Add */}
              {formData.addInclusions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    New Inclusions to Add
                  </h3>
                  <div className="space-y-4">
                    {formData.addInclusions.map((inclusion, index) => (
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
                            const newInclusions = [...formData.addInclusions];
                            newInclusions[index].inclusionText = e.target.value;
                            setFormData(prev => ({ ...prev, addInclusions: newInclusions }));
                          }}
                          className="text-gray-600 flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="e.g., Hotel accommodation"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              addInclusions: prev.addInclusions.filter((_, i) => i !== index)
                            }));
                          }}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Exclusions Management */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <X className="w-6 h-6 text-red-600" />
                  Tour Exclusions Management
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddExclusion}
                    className="px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-lg border border-red-100 hover:border-red-300 transition-all duration-200 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Exclusion
                  </button>
                </div>
              </div>

              {/* Existing Exclusions */}
              {tourDetails?.exclusions && tourDetails.exclusions.filter(exc => !removedExclusions.includes(exc.id)).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Current Exclusions
                  </h3>
                  <div className="space-y-4">
                    {tourDetails.exclusions
                      .filter(exc => !removedExclusions.includes(exc.id))
                      .map((exclusion, index) => (
                        <div key={exclusion.id} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-100 to-rose-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-red-700 font-medium">
                              {index + 1}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={exclusion.description}
                            onChange={(e) => handleUpdateExclusion(index, 'description', e.target.value)}
                            className="text-gray-600 flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingExclusion(exclusion.id, exclusion.description)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* New Exclusions to Add */}
              {formData.addExclusions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    New Exclusions to Add
                  </h3>
                  <div className="space-y-4">
                    {formData.addExclusions.map((exclusion, index) => (
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
                            const newExclusions = [...formData.addExclusions];
                            newExclusions[index].exclusionText = e.target.value;
                            setFormData(prev => ({ ...prev, addExclusions: newExclusions }));
                          }}
                          className="text-gray-600 flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="e.g., International airfare"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              addExclusions: prev.addExclusions.filter((_, i) => i !== index)
                            }));
                          }}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Conditions Management */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-amber-600" />
                  Booking Conditions Management
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddCondition}
                    className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg border border-amber-100 hover:border-amber-300 transition-all duration-200 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Condition
                  </button>
                </div>
              </div>

              {/* Existing Conditions */}
              {tourDetails?.conditions && tourDetails.conditions.filter(cond => !removedConditions.includes(cond.id)).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Current Conditions
                  </h3>
                  <div className="space-y-4">
                    {tourDetails.conditions
                      .filter(cond => !removedConditions.includes(cond.id))
                      .map((condition, index) => (
                        <div key={condition.id} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-amber-700 font-medium">
                              {index + 1}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={condition.description}
                            onChange={(e) => handleUpdateCondition(index, 'description', e.target.value)}
                            className="text-gray-600 flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingCondition(condition.id, condition.description)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* New Conditions to Add */}
              {formData.addConditions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    New Conditions to Add
                  </h3>
                  <div className="space-y-4">
                    {formData.addConditions.map((condition, index) => (
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
                            const newConditions = [...formData.addConditions];
                            newConditions[index].conditionText = e.target.value;
                            setFormData(prev => ({ ...prev, addConditions: newConditions }));
                          }}
                          className="text-gray-600 flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="e.g., Valid passport required"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              addConditions: prev.addConditions.filter((_, i) => i !== index)
                            }));
                          }}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Travel Tips Management */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                  Travel Tips Management
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddTravelTip}
                    className="px-4 py-2 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-lg border border-purple-100 hover:border-purple-300 transition-all duration-200 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Travel Tip
                  </button>
                </div>
              </div>

              {/* Existing Travel Tips */}
              {tourDetails?.travelTips && tourDetails.travelTips.filter(tip => !removedTravelTips.includes(tip.id)).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Current Travel Tips
                  </h3>
                  <div className="space-y-6">
                    {tourDetails.travelTips
                      .filter(tip => !removedTravelTips.includes(tip.id))
                      .map((tip, index) => (
                        <div key={tip.id} className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-800">
                              {tip.title}
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingTravelTip(tip.id, tip.title)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tip Title
                              </label>
                              <input
                                type="text"
                                value={tip.title}
                                onChange={(e) => handleUpdateTravelTip(index, 'title', e.target.value)}
                                className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tip Description
                              </label>
                              <textarea
                                value={tip.description}
                                onChange={(e) => handleUpdateTravelTip(index, 'description', e.target.value)}
                                rows={2}
                                className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* New Travel Tips to Add */}
              {formData.addTravelTips.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    New Travel Tips to Add
                  </h3>
                  <div className="space-y-6">
                    {formData.addTravelTips.map((travelTip, index) => (
                      <div key={index} className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-800">
                            New Travel Tip {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                addTravelTips: prev.addTravelTips.filter((_, i) => i !== index)
                              }));
                            }}
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
                              value={travelTip.tipTitle}
                              onChange={(e) => {
                                const newTips = [...formData.addTravelTips];
                                newTips[index].tipTitle = e.target.value;
                                setFormData(prev => ({ ...prev, addTravelTips: newTips }));
                              }}
                              className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              placeholder="e.g., Footwear"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tip Description *
                            </label>
                            <textarea
                              value={travelTip.tipDescription}
                              onChange={(e) => {
                                const newTips = [...formData.addTravelTips];
                                newTips[index].tipDescription = e.target.value;
                                setFormData(prev => ({ ...prev, addTravelTips: newTips }));
                              }}
                              rows={2}
                              className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                              placeholder="e.g., Wear comfortable walking shoes"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Tours
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Refresh the form
                    if (selectedTour) {
                      handleSelectTour(selectedTour);
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-xl border border-amber-100 hover:border-amber-300 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reset Changes
                </button>
              </div>
              <div className="flex items-center gap-4">
                {totalChanges > 0 && (
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium">
                    {totalChanges} pending changes
                  </span>
                )}
                <button
                  type="submit"
                  disabled={loading || totalChanges === 0}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating Tour...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Tour Package
                    </>
                )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TourUpdatePage;