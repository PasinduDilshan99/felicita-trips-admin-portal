import { SearchItem } from "@/components/common-components/CommonSearch";
import {
  ActiveCategory,
  CategoryDestination,
  CategoryDetailsByIdResponse,
} from "./destination-types";

export interface CategoryFilterParams {
  name: string | null;
  categoryStatus: "ACTIVE" | "INACTIVE" | null;
  pageSize: number;
  pageNumber: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface DestinationCategoryCardProps {
  category: ActiveCategory;
}

export interface DestinationCategoryListCardProps {
  category: ActiveCategory;
}

export interface DestinationCategoryOverviewProps {
  name: string;
  description: string;
  color: string;
  hoverColor: string;
}

export interface DestinationCategoryDestinationsListProps {
  destinations: CategoryDestination[];
  categoryColor: string;
  onViewDestination: (destinationId: number, destinationName: string) => void;
}

export interface ExistingImage {
  imageId: number;
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
  isRemoved?: boolean;
}

export interface NewImage {
  name: string;
  description: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
  imageFile?: File;
  uploadProgress?: number;
  previewUrl?: string;
  isNew?: boolean;
}

export interface CategorySearchItem extends SearchItem {
  id: number;
  name: string;
  description?: string;
}

export interface DestinationCategoryReadOnlyDetailsProps {
  category: CategoryDetailsByIdResponse;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  onRemoveImage: (imageId: number) => void;
  onAddNewImage: (
    file: File,
    name: string,
    description: string,
  ) => Promise<void>;
  onUpdateImage: (imageId: number, name: string, description: string) => void;
  uploadingImages: boolean;
  theme: any;
}

export interface DestinationCategorySearchItem {
  id: number;
  name: string;
}

export interface BasicInfoPanelProps {
  categoryDetails: CategoryDetailsByIdResponse;
}

export interface DestinationCategoryStatsProps {
  categoryDetails: CategoryDetailsByIdResponse;
}

export interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatter?: (value: number | string) => string | number;
}

export interface DestinationsListProps {
  destinations: CategoryDestination[];
}
