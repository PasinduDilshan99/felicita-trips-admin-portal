"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  MapPin,
  ImageIcon,
  Plus,
  X,
  ChevronDown,
  Loader2,
  Upload,
  Trash2,
  Edit2,
  Camera,
  Search as SearchIcon,
} from "lucide-react";
import ImageModal from "@/components/common-components/ImageModal";
import { ImageModalImage } from "@/types/common-components-types";
import { SeasonReadOnlyDetailsProps } from "@/types/season-types";
import { cardVariants, sectionVariants } from "@/app/animations/variants";

export const SeasonReadOnlyDetails: React.FC<SeasonReadOnlyDetailsProps> = ({
  season,
  allActivities,
  allTours,
  loadingActivities,
  loadingTours,
  expandedSections,
  onToggleSection,
  onAddActivity,
  onRemoveActivity,
  onAddTour,
  onRemoveTour,
  onRemoveImage,
  onAddNewImage,
  onUpdateImage,
  uploadingImages,
  theme,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAddActivityForm, setShowAddActivityForm] = useState(false);
  const [showAddTourForm, setShowAddTourForm] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null,
  );
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
  const [showNewImageForm, setShowNewImageForm] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [uploadingLocalImage, setUploadingLocalImage] = useState(false);

  // Search states
  const [activitySearchQuery, setActivitySearchQuery] = useState("");
  const [tourSearchQuery, setTourSearchQuery] = useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLDivElement>(null);

  const [newImageData, setNewImageData] = useState({
    name: "",
    description: "",
    file: null as File | null,
  });

  const [editImageData, setEditImageData] = useState({
    name: "",
    description: "",
  });

  // Filter available activities based on search query

  // Get activities and tours not already in the season
  const availableActivities = allActivities.filter(
    (a) =>
      !season.activities.some(
        (existing) => existing.activityId === a.activityId,
      ),
  );

  const availableTours = allTours.filter(
    (t) => !season.tours.some((existing) => existing.tourId === t.tourId),
  );

  const modalImages: ImageModalImage[] = season.seasonImages.map((img) => ({
    url: img.imageUrl,
    name: img.name,
    description: img.description || undefined,
    id: img.id,
  }));

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      setNewImageData({ ...newImageData, file });
    }
  };

  const filteredAvailableActivities = useMemo(() => {
    if (!activitySearchQuery.trim()) {
      return availableActivities;
    }
    const query = activitySearchQuery.toLowerCase();
    return availableActivities.filter((activity) =>
      activity.activityName.toLowerCase().includes(query),
    );
  }, [availableActivities, activitySearchQuery]);

  // Filter available tours based on search query
  const filteredAvailableTours = useMemo(() => {
    if (!tourSearchQuery.trim()) {
      return availableTours;
    }
    const query = tourSearchQuery.toLowerCase();
    return availableTours.filter((tour) =>
      tour.tourName.toLowerCase().includes(query),
    );
  }, [availableTours, tourSearchQuery]);

  const handleAddImage = async () => {
    if (!newImageData.name.trim()) {
      alert("Image name is required");
      return;
    }
    if (!newImageData.file) {
      alert("Please select an image file");
      return;
    }

    setUploadingLocalImage(true);
    try {
      await onAddNewImage(
        newImageData.file,
        newImageData.name,
        newImageData.description,
      );
      setNewImageData({ name: "", description: "", file: null });
      setShowNewImageForm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingLocalImage(false);
    }
  };

  const handleUpdateImage = () => {
    if (!editingImage) return;
    if (!editImageData.name.trim()) {
      alert("Image name is required");
      return;
    }
    onUpdateImage(
      editingImage.id,
      editImageData.name,
      editImageData.description,
    );
    setEditingImage(null);
    setEditImageData({ name: "", description: "" });
  };

  const handleAddActivity = () => {
    if (selectedActivityId) {
      onAddActivity(selectedActivityId);
      setSelectedActivityId(null);
      setShowAddActivityForm(false);
      setActivitySearchQuery(""); // Reset search query after adding
    }
  };

  const handleAddTour = () => {
    if (selectedTourId) {
      onAddTour(selectedTourId);
      setSelectedTourId(null);
      setShowAddTourForm(false);
      setTourSearchQuery(""); // Reset search query after adding
    }
  };

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = theme.primary;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}18`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = theme.border;
      e.currentTarget.style.boxShadow = "none";
    },
  };

  const fieldBase: React.CSSProperties = {
    backgroundColor: theme.background,
    color: theme.text,
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  };

  return (
    <div className="space-y-6">
      {/* Associated Activities Section */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }}
      >
        <button
          onClick={() => onToggleSection("activities")}
          className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
          style={{
            backgroundColor: expandedSections.has("activities")
              ? `${theme.primary}05`
              : "transparent",
            borderBottom: expandedSections.has("activities")
              ? `1px solid ${theme.border}`
              : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                backgroundColor: `${theme.primary}18`,
                color: theme.primary,
              }}
            >
              <Users className="w-4 h-4" />
            </span>
            <div>
              <h2
                className="text-sm sm:text-base font-semibold"
                style={{ color: theme.text }}
              >
                Associated Activities
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                Manage activities during this season ({season.activities.length}{" "}
                activities)
              </p>
            </div>
          </div>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{
              transform: expandedSections.has("activities")
                ? "rotate(180deg)"
                : "none",
              color: theme.textSecondary,
            }}
          />
        </button>

        <AnimatePresence>
          {expandedSections.has("activities") && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-6"
            >
              <div className="space-y-2 mb-4">
                {season.activities.length === 0 ? (
                  <div
                    className="text-center py-6 rounded-lg"
                    style={{
                      backgroundColor: `${theme.border}10`,
                      border: `1px dashed ${theme.border}`,
                    }}
                  >
                    <Users
                      className="w-8 h-8 mx-auto mb-2 opacity-40"
                      style={{ color: theme.textSecondary }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      No activities associated
                    </p>
                  </div>
                ) : (
                  season.activities.map((activity) => (
                    <div
                      key={activity.activityId}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        backgroundColor: `${theme.border}10`,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: theme.text }}
                        >
                          {activity.activityName}
                        </p>
                        {activity.activityDescription && (
                          <p
                            className="text-xs mt-1"
                            style={{ color: theme.textSecondary }}
                          >
                            {activity.activityDescription.length > 100
                              ? `${activity.activityDescription.substring(0, 100)}...`
                              : activity.activityDescription}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveActivity(activity.activityId)}
                        className="p-1.5 rounded-lg transition-all hover:scale-110"
                        style={{ color: theme.error }}
                        title="Remove Activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Activity Form */}
              <AnimatePresence>
                {showAddActivityForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 rounded-lg"
                    style={{
                      backgroundColor: `${theme.primary}10`,
                      border: `1px solid ${theme.primary}30`,
                    }}
                  >
                    <div className="space-y-3">
                      {/* Search Input */}
                      <div className="relative">
                        <SearchIcon
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ color: theme.textSecondary }}
                        />
                        <input
                          type="text"
                          placeholder="Search activities..."
                          value={activitySearchQuery}
                          onChange={(e) => {
                            setActivitySearchQuery(e.target.value);
                            setSelectedActivityId(null);
                          }}
                          className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.text,
                          }}
                        />
                      </div>

                      {/* Activities List with Search Results */}
                      <div
                        className="max-h-48 overflow-y-auto space-y-1 rounded-lg"
                        style={{
                          border: `1px solid ${theme.border}`,
                          backgroundColor: `${theme.border}05`,
                        }}
                      >
                        {loadingActivities ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2
                              className="w-4 h-4 animate-spin"
                              style={{ color: theme.primary }}
                            />
                            <span
                              className="text-xs ml-2"
                              style={{ color: theme.textSecondary }}
                            >
                              Loading activities...
                            </span>
                          </div>
                        ) : filteredAvailableActivities.length === 0 ? (
                          <div className="text-center py-4">
                            <p
                              className="text-xs"
                              style={{ color: theme.textSecondary }}
                            >
                              {activitySearchQuery
                                ? "No matching activities found"
                                : "No activities available"}
                            </p>
                          </div>
                        ) : (
                          filteredAvailableActivities.map((activity) => {
                            const isSelected =
                              selectedActivityId === activity.activityId;
                            return (
                              <button
                                key={activity.activityId}
                                onClick={() =>
                                  setSelectedActivityId(activity.activityId)
                                }
                                className={`w-full text-left px-3 py-2 transition-colors ${
                                  isSelected ? "bg-opacity-20" : ""
                                }`}
                                style={{
                                  backgroundColor: isSelected
                                    ? `${theme.primary}15`
                                    : "transparent",
                                  borderBottom: `1px solid ${theme.border}30`,
                                }}
                              >
                                <p
                                  className="text-sm font-medium"
                                  style={{
                                    color: isSelected
                                      ? theme.primary
                                      : theme.text,
                                  }}
                                >
                                  {activity.activityName}
                                </p>
                              </button>
                            );
                          })
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleAddActivity}
                          disabled={!selectedActivityId}
                          className="flex-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                          style={{ backgroundColor: theme.success }}
                        >
                          Add Selected Activity
                        </button>
                        <button
                          onClick={() => {
                            setShowAddActivityForm(false);
                            setSelectedActivityId(null);
                            setActivitySearchQuery("");
                          }}
                          className="px-3 py-1.5 rounded-lg text-sm"
                          style={{
                            backgroundColor: theme.background,
                            border: `1px solid ${theme.border}`,
                            color: theme.textSecondary,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setShowAddActivityForm(true)}
                className="mt-3 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: `${theme.primary}10`,
                  color: theme.primary,
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Activity
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Associated Tours Section */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }}
      >
        <button
          onClick={() => onToggleSection("tours")}
          className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
          style={{
            backgroundColor: expandedSections.has("tours")
              ? `${theme.accent}05`
              : "transparent",
            borderBottom: expandedSections.has("tours")
              ? `1px solid ${theme.border}`
              : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                backgroundColor: `${theme.accent}18`,
                color: theme.accent,
              }}
            >
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <h2
                className="text-sm sm:text-base font-semibold"
                style={{ color: theme.text }}
              >
                Associated Tours
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                Manage tours during this season ({season.tours.length} tours)
              </p>
            </div>
          </div>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{
              transform: expandedSections.has("tours")
                ? "rotate(180deg)"
                : "none",
              color: theme.textSecondary,
            }}
          />
        </button>

        <AnimatePresence>
          {expandedSections.has("tours") && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-6"
            >
              <div className="space-y-2 mb-4">
                {season.tours.length === 0 ? (
                  <div
                    className="text-center py-6 rounded-lg"
                    style={{
                      backgroundColor: `${theme.border}10`,
                      border: `1px dashed ${theme.border}`,
                    }}
                  >
                    <MapPin
                      className="w-8 h-8 mx-auto mb-2 opacity-40"
                      style={{ color: theme.textSecondary }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      No tours associated
                    </p>
                  </div>
                ) : (
                  season.tours.map((tour) => (
                    <div
                      key={tour.tourId}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        backgroundColor: `${theme.border}10`,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: theme.text }}
                        >
                          {tour.tourName}
                        </p>
                        {tour.tourDescription && (
                          <p
                            className="text-xs mt-1"
                            style={{ color: theme.textSecondary }}
                          >
                            {tour.tourDescription.length > 100
                              ? `${tour.tourDescription.substring(0, 100)}...`
                              : tour.tourDescription}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveTour(tour.tourId)}
                        className="p-1.5 rounded-lg transition-all hover:scale-110"
                        style={{ color: theme.error }}
                        title="Remove Tour"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Tour Form */}
              <AnimatePresence>
                {showAddTourForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 rounded-lg"
                    style={{
                      backgroundColor: `${theme.accent}10`,
                      border: `1px solid ${theme.accent}30`,
                    }}
                  >
                    <div className="space-y-3">
                      {/* Search Input */}
                      <div className="relative">
                        <SearchIcon
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ color: theme.textSecondary }}
                        />
                        <input
                          type="text"
                          placeholder="Search tours..."
                          value={tourSearchQuery}
                          onChange={(e) => {
                            setTourSearchQuery(e.target.value);
                            setSelectedTourId(null);
                          }}
                          className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                            color: theme.text,
                          }}
                        />
                      </div>

                      {/* Tours List with Search Results */}
                      <div
                        className="max-h-48 overflow-y-auto space-y-1 rounded-lg"
                        style={{
                          border: `1px solid ${theme.border}`,
                          backgroundColor: `${theme.border}05`,
                        }}
                      >
                        {loadingTours ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2
                              className="w-4 h-4 animate-spin"
                              style={{ color: theme.accent }}
                            />
                            <span
                              className="text-xs ml-2"
                              style={{ color: theme.textSecondary }}
                            >
                              Loading tours...
                            </span>
                          </div>
                        ) : filteredAvailableTours.length === 0 ? (
                          <div className="text-center py-4">
                            <p
                              className="text-xs"
                              style={{ color: theme.textSecondary }}
                            >
                              {tourSearchQuery
                                ? "No matching tours found"
                                : "No tours available"}
                            </p>
                          </div>
                        ) : (
                          filteredAvailableTours.map((tour) => {
                            const isSelected = selectedTourId === tour.tourId;
                            return (
                              <button
                                key={tour.tourId}
                                onClick={() => setSelectedTourId(tour.tourId)}
                                className={`w-full text-left px-3 py-2 transition-colors ${
                                  isSelected ? "bg-opacity-20" : ""
                                }`}
                                style={{
                                  backgroundColor: isSelected
                                    ? `${theme.accent}15`
                                    : "transparent",
                                  borderBottom: `1px solid ${theme.border}30`,
                                }}
                              >
                                <p
                                  className="text-sm font-medium"
                                  style={{
                                    color: isSelected
                                      ? theme.accent
                                      : theme.text,
                                  }}
                                >
                                  {tour.tourName}
                                </p>
                              </button>
                            );
                          })
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleAddTour}
                          disabled={!selectedTourId}
                          className="flex-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                          style={{ backgroundColor: theme.success }}
                        >
                          Add Selected Tour
                        </button>
                        <button
                          onClick={() => {
                            setShowAddTourForm(false);
                            setSelectedTourId(null);
                            setTourSearchQuery("");
                          }}
                          className="px-3 py-1.5 rounded-lg text-sm"
                          style={{
                            backgroundColor: theme.background,
                            border: `1px solid ${theme.border}`,
                            color: theme.textSecondary,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setShowAddTourForm(true)}
                className="mt-3 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: `${theme.accent}10`,
                  color: theme.accent,
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Tour
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Images Section (unchanged) */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }}
      >
        <button
          onClick={() => onToggleSection("images")}
          className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
          style={{
            backgroundColor: expandedSections.has("images")
              ? `${theme.error}05`
              : "transparent",
            borderBottom: expandedSections.has("images")
              ? `1px solid ${theme.border}`
              : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{
                backgroundColor: `${theme.error}18`,
                color: theme.error,
              }}
            >
              <ImageIcon className="w-4 h-4" />
            </span>
            <div>
              <h2
                className="text-sm sm:text-base font-semibold"
                style={{ color: theme.text }}
              >
                Season Images
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                Manage images for this season
              </p>
            </div>
          </div>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{
              transform: expandedSections.has("images")
                ? "rotate(180deg)"
                : "none",
              color: theme.textSecondary,
            }}
          />
        </button>

        <AnimatePresence>
          {expandedSections.has("images") && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-6"
            >
              {/* Edit Image Modal */}
              <AnimatePresence>
                {editingImage && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setEditingImage(null)}
                  >
                    <div
                      className="rounded-2xl p-6 max-w-md w-full mx-4"
                      style={{ backgroundColor: theme.surface }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3
                        className="text-lg font-semibold mb-4"
                        style={{ color: theme.text }}
                      >
                        Edit Image
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: theme.textSecondary }}
                          >
                            Image Name
                          </label>
                          <input
                            type="text"
                            value={editImageData.name}
                            onChange={(e) =>
                              setEditImageData({
                                ...editImageData,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border-2"
                            style={{ ...fieldBase, borderColor: theme.border }}
                            {...focusHandlers}
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: theme.textSecondary }}
                          >
                            Description
                          </label>
                          <input
                            type="text"
                            value={editImageData.description}
                            onChange={(e) =>
                              setEditImageData({
                                ...editImageData,
                                description: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border-2"
                            style={{ ...fieldBase, borderColor: theme.border }}
                            {...focusHandlers}
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => setEditingImage(null)}
                            className="flex-1 px-4 py-2 rounded-lg"
                            style={{
                              backgroundColor: theme.background,
                              border: `1px solid ${theme.border}`,
                              color: theme.textSecondary,
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdateImage}
                            className="flex-1 px-4 py-2 rounded-lg text-white"
                            style={{ backgroundColor: theme.primary }}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add Image Form */}
              <AnimatePresence>
                {showNewImageForm && (
                  <motion.div
                    ref={formRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-xl"
                    style={{
                      backgroundColor: `${theme.primary}08`,
                      border: `2px solid ${theme.primary}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4
                        className="text-sm font-semibold"
                        style={{ color: theme.text }}
                      >
                        Add New Image
                      </h4>
                      <button
                        onClick={() => {
                          setShowNewImageForm(false);
                          setNewImageData({
                            name: "",
                            description: "",
                            file: null,
                          });
                        }}
                        className="p-1 rounded hover:bg-black/10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Image File{" "}
                          <span style={{ color: theme.error }}>*</span>
                        </label>
                        <div
                          className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all"
                          style={{ borderColor: theme.border }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <Upload
                            className="w-6 h-6 mx-auto mb-2"
                            style={{ color: theme.textSecondary }}
                          />
                          <p
                            className="text-sm"
                            style={{ color: theme.textSecondary }}
                          >
                            {newImageData.file
                              ? newImageData.file.name
                              : "Click to select image"}
                          </p>
                        </div>
                      </div>

                      {newImageData.file && (
                        <div className="relative rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(newImageData.file)}
                            alt="Preview"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Image Name{" "}
                          <span style={{ color: theme.error }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={newImageData.name}
                          onChange={(e) =>
                            setNewImageData({
                              ...newImageData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          placeholder="e.g., Season Image"
                          {...focusHandlers}
                        />
                      </div>

                      <div>
                        <label
                          className="block text-xs font-medium mb-1"
                          style={{ color: theme.textSecondary }}
                        >
                          Description
                        </label>
                        <input
                          type="text"
                          value={newImageData.description}
                          onChange={(e) =>
                            setNewImageData({
                              ...newImageData,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border-2 text-sm"
                          style={{ ...fieldBase, borderColor: theme.border }}
                          placeholder="Optional description"
                          {...focusHandlers}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowNewImageForm(false);
                            setNewImageData({
                              name: "",
                              description: "",
                              file: null,
                            });
                          }}
                          className="flex-1 px-3 py-2 rounded-lg text-sm"
                          style={{
                            backgroundColor: theme.background,
                            border: `1px solid ${theme.border}`,
                            color: theme.textSecondary,
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddImage}
                          disabled={uploadingLocalImage || !newImageData.file}
                          className="flex-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                          style={{
                            backgroundColor: theme.success,
                            color: "#fff",
                          }}
                        >
                          {uploadingLocalImage ? (
                            <>
                              <Loader2 className="w-4 h-4 inline animate-spin mr-1" />
                              Uploading...
                            </>
                          ) : (
                            "Upload Image"
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Images Grid */}
              {season.seasonImages.length === 0 && (
                <div
                  className="text-center py-8 rounded-xl"
                  style={{
                    backgroundColor: `${theme.border}20`,
                    border: `1px dashed ${theme.border}`,
                  }}
                >
                  <Camera
                    className="w-12 h-12 mx-auto mb-3 opacity-30"
                    style={{ color: theme.textSecondary }}
                  />
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    No images added yet
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {season.seasonImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative group rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                    style={{
                      border: `1px solid ${theme.border}`,
                      backgroundColor: theme.background,
                    }}
                    onClick={() => openImageModal(index)}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: theme.text }}
                      >
                        {image.name}
                      </p>
                      {image.description && (
                        <p
                          className="text-xs truncate mt-0.5"
                          style={{ color: theme.textSecondary }}
                        >
                          {image.description}
                        </p>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingImage(image);
                          setEditImageData({
                            name: image.name,
                            description: image.description || "",
                          });
                        }}
                        className="p-1.5 rounded-full bg-blue-500 text-white shadow-lg hover:scale-110 transition-transform"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveImage(image.id);
                        }}
                        className="p-1.5 rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowNewImageForm(true)}
                className="mt-4 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  backgroundColor: `${theme.success}10`,
                  color: theme.success,
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Image
              </button>

              {/* Uploading Indicator */}
              {(uploadingImages || uploadingLocalImage) && (
                <div
                  className="mt-4 p-3 rounded-lg flex items-center gap-2"
                  style={{ backgroundColor: `${theme.primary}10` }}
                >
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    style={{ color: theme.primary }}
                  />
                  <span className="text-sm" style={{ color: theme.primary }}>
                    {uploadingLocalImage
                      ? "Uploading image to Cloudinary..."
                      : "Processing images..."}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        images={modalImages}
        initialIndex={selectedImageIndex}
        onClose={() => setModalOpen(false)}
        showNavigation={true}
        showDownload={true}
        showZoom={true}
        allowKeyboardNavigation={true}
      />
    </div>
  );
};
