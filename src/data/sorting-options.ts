import { SortOption } from "@/types/filter-types";

export const DESTINATION_VIEW_SORTING_OPTIONS: SortOption[] = [
  { value: "name", label: "Destination Name" },
  { value: "destination_id", label: "Destination ID" },
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" },
  { value: "location", label: "Location" },
];
