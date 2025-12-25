// app/destinations/add/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common-components/Breadcrumb";
import {
  WEB_MANAGEMENT_PATH,
  WEB_MANAGEMENT_DESTINATION_PATH,
} from "@/utils/constant";
import { DestinationService } from "@/services/destinationService";
import {
  AddDestinationRequest,
  DestinationImageRequest,
} from "@/types/destination-types";
import {
  MapPin,
  Tag,
  Image as ImageIcon,
  Globe,
  DollarSign,
  FileText,
  Plus,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Camera,
  Trash2,
  Eye,
  Shield,
  Save,
  ArrowLeft,
} from "lucide-react";

const AddNewDestinationPage = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Web Management", href: WEB_MANAGEMENT_PATH },
    {
      label: "Destinations",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}`,
    },
    {
      label: "Add New",
      href: `${WEB_MANAGEMENT_PATH}${WEB_MANAGEMENT_DESTINATION_PATH}/add`,
    },
  ];

  // Form state
  const [formData, setFormData] = useState<AddDestinationRequest>({
    name: "",
    description: "",
    status: "ACTIVE",
    destinationCategory: "",
    location: "",
    latitude: 0,
    longitude: 0,
    extraPrice: undefined,
    extraPriceNote: "",
    images: [],
  });

  // Image preview state
  const [imagePreviews, setImagePreviews] = useState<
    { url: string; file?: File }[]
  >([]);
  const [newImage, setNewImage] = useState<DestinationImageRequest>({
    name: "",
    description: "",
    imageUrl: "",
    status: "ACTIVE",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [mapPreview, setMapPreview] = useState(false);

  // Initialize categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesList = await DestinationService.getCategories();
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle number inputs
    if (name === "latitude" || name === "longitude" || name === "extraPrice") {
      setFormData({
        ...formData,
        [name]: value === "" ? undefined : parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Update the handleImageUpload function to warn about data URLs
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;

        // Add to image previews
        setImagePreviews((prev) => [...prev, { url: imageUrl, file }]);

        // Warn about data URLs
        if (imageUrl.startsWith("data:")) {
          setErrors((prev) => ({
            ...prev,
            image:
              "Warning: Images are stored as base64 data URLs. For production, you need to upload them to a server first.",
          }));
        }

        // Add to form data images
        const newImageData: DestinationImageRequest = {
          name: file.name.split(".")[0],
          description: `Uploaded image: ${file.name}`,
          imageUrl,
          status: "ACTIVE",
        };

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, newImageData],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle manual image URL addition
  const handleAddImage = () => {
    if (!newImage.name.trim() || !newImage.imageUrl.trim()) {
      setErrors((prev) => ({
        ...prev,
        image: "Image name and URL are required",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { ...newImage }],
    }));

    setImagePreviews((prev) => [...prev, { url: newImage.imageUrl }]);

    setNewImage({
      name: "",
      description: "",
      imageUrl: "",
      status: "ACTIVE",
    });

    if (errors.image) {
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = "Destination name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.destinationCategory)
      newErrors.destinationCategory = "Category is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    // Coordinates validation
    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = "Latitude must be between -90 and 90";
    }
    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = "Longitude must be between -180 and 180";
    }

    // Images validation
    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // app/destinations/add/page.tsx

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      console.log("=================formData===================");
      console.log("Raw form data:", formData);

      // Prepare images - check for data URLs and handle them
      const preparedImages = formData.images.map((image, index) => {
        const imageUrl = image.imageUrl;

        // Check if it's a data URL (base64 encoded)
        if (imageUrl.startsWith("data:")) {
          // For data URLs, we need to upload them to a server first
          // For now, we'll replace with a placeholder or throw an error
          console.warn(
            `Image ${index + 1} is a data URL, not a proper HTTP URL`
          );
          console.log(
            "Data URL preview (first 100 chars):",
            imageUrl.substring(0, 100) + "..."
          );

          // In a real application, you would:
          // 1. Upload the base64 image to your server
          // 2. Get back a proper URL
          // 3. Use that URL in the API call

          // For testing, use a placeholder or throw an error
          throw new Error(
            "Please use proper HTTP/HTTPS URLs for images, not base64 data URLs. Upload images to an image hosting service first."
          );
        }

        return {
          ...image,
          name: image.name.trim(),
          description: image.description.trim(),
          status: image.status as "ACTIVE" | "INACTIVE",
        };
      });

      // Create the final submission data
      const submissionData: AddDestinationRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        destinationCategory: formData.destinationCategory,
        location: formData.location.trim(),
        latitude: parseFloat(formData.latitude.toFixed(6)),
        longitude: parseFloat(formData.longitude.toFixed(6)),
        extraPrice: formData.extraPrice || undefined,
        extraPriceNote: formData.extraPriceNote?.trim() || undefined,
        images: preparedImages,
      };

      console.log("Processed submission data:", submissionData);
      console.log("====================================");

      await DestinationService.addDestination(submissionData);

      setSuccess(true);

      handleReset();
    } catch (error: any) {
      console.error("Submission error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to add destination. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      status: "ACTIVE",
      destinationCategory: "",
      location: "",
      latitude: 0,
      longitude: 0,
      extraPrice: undefined,
      extraPriceNote: "",
      images: [],
    });
    setImagePreviews([]);
    setErrors({});
    setSuccess(false);
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(position.coords.latitude.toFixed(6)),
            longitude: parseFloat(position.coords.longitude.toFixed(6)),
          }));
        },
        (error) => {
          setErrors((prev) => ({
            ...prev,
            location: "Unable to get current location. Please enter manually.",
          }));
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header with Breadcrumb */}
      <div className="top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PageHeader
            title="Add New Destination"
            description="Create a new travel destination with all details"
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
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800">
                  Destination Added Successfully!
                </h3>
                <p className="text-green-600 mt-1">
                  Redirecting to destinations list...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800">
                  Submission Failed
                </h3>
                <p className="text-red-600 mt-1">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Destination Information Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Destination Information
                </h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="Enter destination name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.description
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="Enter destination description"
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Category & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="destinationCategory"
                        value={formData.destinationCategory}
                        onChange={handleInputChange}
                        className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.destinationCategory
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {errors.destinationCategory && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.destinationCategory}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Coordinates Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-red-600" />
                  Location & Coordinates
                </h2>

                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.location
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="e.g., Sigiriya, Central Province, Sri Lanka"
                    />
                    {errors.location && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Coordinates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Latitude *
                          </label>
                          <input
                            type="number"
                            name="latitude"
                            value={formData.latitude || ""}
                            onChange={handleInputChange}
                            step="0.000001"
                            min="-90"
                            max="90"
                            className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                              errors.latitude
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            placeholder="e.g., 7.9570"
                          />
                          {errors.latitude && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.latitude}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Longitude *
                          </label>
                          <input
                            type="number"
                            name="longitude"
                            value={formData.longitude || ""}
                            onChange={handleInputChange}
                            step="0.000001"
                            min="-180"
                            max="180"
                            className={`text-gray-600 w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                              errors.longitude
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            placeholder="e.g., 80.7600"
                          />
                          {errors.longitude && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.longitude}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 font-medium"
                      >
                        <Globe className="w-4 h-4 inline mr-2" />
                        Use Current Location
                      </button>
                    </div>
                  </div>

                  {/* Map Preview */}
                  {mapPreview && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                      <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">
                            Map preview would show here
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            {formData.latitude}, {formData.longitude}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Information Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  Pricing Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extra Price (Optional)
                    </label>
                    <input
                      type="number"
                      name="extraPrice"
                      value={formData.extraPrice || ""}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="e.g., 100.50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Note (Optional)
                    </label>
                    <input
                      type="text"
                      name="extraPriceNote"
                      value={formData.extraPriceNote}
                      onChange={handleInputChange}
                      className="text-gray-600 w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="e.g., Entrance fee, Tax, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 font-medium"
                  >
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl border-2 border-blue-500 hover:from-blue-700 hover:to-indigo-700 hover:border-blue-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding Destination...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Add Destination
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Image Upload & Preview */}
          <div className="space-y-8">
            {/* Image Upload Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-rose-600" />
                Upload Images
              </h3>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Image Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium mb-1">
                      Click to upload images
                    </p>
                    <p className="text-gray-500 text-sm">
                      PNG, JPG, GIF up to 5MB each
                    </p>
                  </label>
                </div>
              </div>

              {/* Manual Image URL */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or Add by URL
                  </label>
                  <input
                    type="text"
                    value={newImage.imageUrl}
                    onChange={(e) =>
                      setNewImage({ ...newImage, imageUrl: e.target.value })
                    }
                    className="text-gray-600 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Name
                  </label>
                  <input
                    type="text"
                    value={newImage.name}
                    onChange={(e) =>
                      setNewImage({ ...newImage, name: e.target.value })
                    }
                    className="text-gray-600 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Main View, Panorama, etc."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddImage}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-lg border border-emerald-100 hover:border-emerald-300 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Image
                </button>
              </div>

              {errors.images && (
                <p className="mt-4 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.images}
                </p>
              )}
            </div>

            {/* Image Gallery Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-600" />
                  Image Preview ({imagePreviews.length})
                </h3>
                {imagePreviews.length > 0 && (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 rounded-full text-sm font-medium">
                    {imagePreviews.length} images
                  </span>
                )}
              </div>

              {imagePreviews.length === 0 ? (
                <div className="text-center py-8">
                  <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No images added yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Upload or add images to preview
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="group relative rounded-xl overflow-hidden border border-gray-200"
                    >
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white text-sm font-medium truncate">
                            {formData.images[index]?.name ||
                              `Image ${index + 1}`}
                          </p>
                          <p className="text-white/80 text-xs truncate">
                            {formData.images[index]?.description ||
                              "No description"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && imagePreviews.length === 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-100">
                  <p className="text-red-600 text-sm">{errors.images}</p>
                </div>
              )}
            </div>

            {/* Form Preview Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-600" />
                Form Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <span className="text-gray-600">Destination</span>
                  <span className="font-semibold text-gray-900 truncate ml-2">
                    {formData.name || "Not set"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-900">
                    {formData.destinationCategory || "Not set"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold text-gray-900 truncate ml-2">
                    {formData.location || "Not set"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                  <span className="text-gray-600">Status</span>
                  <span className="font-semibold text-gray-900">
                    {formData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Help & Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Tips & Guidelines
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-600 text-sm">
                    Use descriptive names and detailed descriptions
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-600 text-sm">
                    Add high-quality images for better presentation
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-600 text-sm">
                    Verify coordinates for accurate location mapping
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-600 text-sm">
                    Review all information before submitting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewDestinationPage;
