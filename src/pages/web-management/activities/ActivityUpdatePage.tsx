// app/activities/update/page.tsx
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { ActivityService } from '@/services/activityService';
import { Activity, ActivityIdName, UpdateImageRequest, UpdateRequirementRequest } from '@/types/activity-types';
import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const ActivityUpdatePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialActivityId = searchParams?.get("activity-id");
  const initialActivityName = searchParams?.get("activity-name");

  // State management
  const [activityData, setActivityData] = useState<Activity | null>(null);
  const [activityList, setActivityList] = useState<ActivityIdName[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityIdName[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    initialActivityId ? parseInt(initialActivityId) : null
  );
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    activitiesCategory: '',
    durationHours: 0,
    availableFrom: '',
    availableTo: '',
    priceLocal: 0,
    priceForeigners: 0,
    minParticipate: 0,
    maxParticipate: 0,
    season: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    destination_id: 0,
  });

  // Images and Requirements state
  const [images, setImages] = useState<UpdateImageRequest[]>([]);
  const [requirements, setRequirements] = useState<UpdateRequirementRequest[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  const [requirementsToRemove, setRequirementsToRemove] = useState<number[]>([]);

  // Load activity IDs and names
  const loadActivityList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ActivityService.getActivityIdsAndNames();
      if (response.code === 200) {
        setActivityList(response.data);
        setFilteredActivities(response.data);
      }
    } catch (error) {
      toast.error('Failed to load activity list');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load activity details
  const loadActivityDetails = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const response = await ActivityService.getActivityById(id);
      if (response.code === 200) {
        const activity = response.data;
        setActivityData(activity);
        
        // Set form data
        setFormData({
          name: activity.name,
          description: activity.description,
          activitiesCategory: activity.activities_category,
          durationHours: activity.duration_hours,
          availableFrom: activity.available_from.split(':').slice(0, 2).join(':'),
          availableTo: activity.available_to.split(':').slice(0, 2).join(':'),
          priceLocal: activity.price_local,
          priceForeigners: activity.price_foreigners,
          minParticipate: activity.min_participate,
          maxParticipate: activity.max_participate,
          season: activity.season,
          status: activity.status as 'ACTIVE' | 'INACTIVE',
          destination_id: activity.destination_id,
        });

        // Set images with IDs
        const imagesWithIds: UpdateImageRequest[] = activity.images.map(img => ({
          imageId: img.id,
          name: img.name,
          description: img.description,
          imageUrl: img.image_url,
          status: img.status === 1 ? 'ACTIVE' : 'INACTIVE'
        }));
        setImages(imagesWithIds);

        // Set requirements with IDs
        const requirementsWithIds: UpdateRequirementRequest[] = activity.requirements.map(req => ({
          requirementId: req.id,
          name: req.name,
          value: req.value,
          description: req.description,
          color: req.color,
          status: req.status === 1 ? 'ACTIVE' : 'INACTIVE'
        }));
        setRequirements(requirementsWithIds);

        // Reset removal arrays
        setImagesToRemove([]);
        setRequirementsToRemove([]);
      }
    } catch (error) {
      toast.error('Failed to load activity details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadActivityList();
    
    if (selectedActivityId) {
      loadActivityDetails(selectedActivityId);
    }
  }, [selectedActivityId, loadActivityList, loadActivityDetails]);

  // Filter activities based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredActivities(activityList);
    } else {
      const filtered = activityList.filter(activity =>
        activity.activityName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredActivities(filtered);
    }
  }, [searchTerm, activityList]);

  // Handle activity selection from dropdown
  const handleActivitySelect = (activity: ActivityIdName) => {
    setSelectedActivityId(activity.activityId);
    setSearchTerm(activity.activityName);
    setShowDropdown(false);
    // Update URL with selected activity
    router.push(`/web-management/activities/update?activity-id=${activity.activityId}&activity-name=${encodeURIComponent(activity.activityName)}`);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('price') || name.includes('Participate') || name.includes('Hours') 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  // Handle image updates
  const handleImageUpdate = (index: number, field: keyof UpdateImageRequest, value: string) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    ));
  };

  const handleRemoveImage = (index: number, imageId?: number) => {
    if (imageId) {
      setImagesToRemove(prev => [...prev, imageId]);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    setImages(prev => [...prev, {
      name: '',
      description: '',
      imageUrl: '',
      status: 'ACTIVE'
    }]);
  };

  // Handle requirement updates
  const handleRequirementUpdate = (index: number, field: keyof UpdateRequirementRequest, value: string) => {
    setRequirements(prev => prev.map((req, i) => 
      i === index ? { ...req, [field]: value } : req
    ));
  };

  const handleRemoveRequirement = (index: number, requirementId?: number) => {
    if (requirementId) {
      setRequirementsToRemove(prev => [...prev, requirementId]);
    }
    setRequirements(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddRequirement = () => {
    setRequirements(prev => [...prev, {
      name: '',
      value: '',
      description: '',
      color: '#3B82F6',
      status: 'ACTIVE'
    }]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedActivityId) {
      toast.error('Please select an activity to update');
      return;
    }

    // Prepare images data
    const updatedImages = images.filter(img => img.imageId).map(img => ({
      ...img,
      imageId: img.imageId!
    }));

    const addImages = images.filter(img => !img.imageId);

    const updatedRequirements = requirements.filter(req => req.requirementId).map(req => ({
      ...req,
      requirementId: req.requirementId!
    }));

    const addRequirements = requirements.filter(req => !req.requirementId);

    // Prepare update request
    const updateData = {
      activityId: selectedActivityId,
      destinationId: formData.destination_id,
      name: formData.name,
      description: formData.description,
      activitiesCategory: formData.activitiesCategory,
      durationHours: formData.durationHours,
      availableFrom: formData.availableFrom,
      availableTo: formData.availableTo,
      priceLocal: formData.priceLocal,
      priceForeigners: formData.priceForeigners,
      minParticipate: formData.minParticipate,
      maxParticipate: formData.maxParticipate,
      season: formData.season,
      status: formData.status,
      
      removeImagesIds: imagesToRemove,
      addImages,
      updatedImages,
      
      removeRequirementsIds: requirementsToRemove,
      addRequirements,
      updatedRequirements,
    };

    try {
      setUpdating(true);
      const response = await ActivityService.updateActivity(updateData);
      
      if (response.code === 200) {
        toast.success('Activity updated successfully!');
        // Reload activity details
        loadActivityDetails(selectedActivityId);
      } else {
        toast.error(response.message || 'Failed to update activity');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update activity');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  // Render activity selection section
  const renderActivitySelection = () => (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4  text-gray-800">Select Activity to Update</h2>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search activity by name..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500  text-gray-800"
        />
        
        {showDropdown && filteredActivities.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto ">
            {filteredActivities.map((activity) => (
              <div
                key={activity.activityId}
                onClick={() => handleActivitySelect(activity)}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 "
              >
                <div className="font-medium  text-gray-800">{activity.activityName}</div>
                <div className="text-sm text-gray-500 ">ID: {activity.activityId}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedActivityId && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg  text-gray-800">
          <p className="font-medium">Selected Activity:</p>
          <p>ID: {selectedActivityId} | Name: {searchTerm}</p>
        </div>
      )}
    </div>
  );

  // Render loading state
  if (loading && !activityData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          {renderActivitySelection()}
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Update Activity</h1>
        <p className="text-gray-600 mb-8">Modify activity details, images, and requirements</p>
        
        {renderActivitySelection()}
        
        {activityData && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b  text-gray-800">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className=" text-gray-600 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="activitiesCategory"
                    value={formData.activitiesCategory}
                    onChange={handleInputChange}
                    required
                    className=" text-gray-600 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Water Sports">Water Sports</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    name="durationHours"
                    value={formData.durationHours}
                    onChange={handleInputChange}
                    required
                    className="text-gray-600 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Season
                  </label>
                  <input
                    type="text"
                    name="season"
                    value={formData.season}
                    onChange={handleInputChange}
                    className="text-gray-600 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., December to April"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="text-gray-600 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Pricing and Participants */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b text-gray-800">Pricing & Participants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ">
                    Local Price (LKR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="priceLocal"
                    value={formData.priceLocal}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foreigner Price (LKR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="priceForeigners"
                    value={formData.priceForeigners}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Participants *
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="minParticipate"
                    value={formData.minParticipate}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Participants *
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="maxParticipate"
                    value={formData.maxParticipate}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available From *
                  </label>
                  <input
                    type="time"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available To *
                  </label>
                  <input
                    type="time"
                    name="availableTo"
                    value={formData.availableTo}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
                  />
                </div>
              </div>
            </div>
            
            {/* Images Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 pb-2 border-b text-gray-800">
                <h3 className="text-lg font-semibold">Images</h3>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Image
                </button>
              </div>
              
              {images.map((image, index) => (
                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg text-gray-600">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Image {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, image.imageId)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL *
                      </label>
                      <input
                        type="url"
                        value={image.imageUrl}
                        onChange={(e) => handleImageUpdate(index, 'imageUrl', e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      {image.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={image.imageUrl}
                            alt="Preview"
                            className="h-20 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={image.name}
                          onChange={(e) => handleImageUpdate(index, 'name', e.target.value)}
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={image.description}
                          onChange={(e) => handleImageUpdate(index, 'description', e.target.value)}
                          required
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={image.status}
                          onChange={(e) => handleImageUpdate(index, 'status', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Requirements Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 pb-2 border-b text-gray-800">
                <h3 className="text-lg font-semibold">Requirements</h3>
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Requirement
                </button>
              </div>
              
              {requirements.map((requirement, index) => (
                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg text-gray-600">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Requirement {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(index, requirement.requirementId)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={requirement.name}
                          onChange={(e) => handleRequirementUpdate(index, 'name', e.target.value)}
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Value *
                        </label>
                        <input
                          type="text"
                          value={requirement.value}
                          onChange={(e) => handleRequirementUpdate(index, 'value', e.target.value)}
                          required
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={requirement.description}
                          onChange={(e) => handleRequirementUpdate(index, 'description', e.target.value)}
                          required
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <input
                          type="color"
                          value={requirement.color}
                          onChange={(e) => handleRequirementUpdate(index, 'color', e.target.value)}
                          className="w-full h-10 p-1 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={requirement.status}
                          onChange={(e) => handleRequirementUpdate(index, 'status', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Status and Submit */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating || !selectedActivityId}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Update Activity'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ActivityUpdatePage;