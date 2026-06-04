export type FilterFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'daterange'
  | 'boolean'
  | 'search';

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: FilterOption[];
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  width?: 'full' | 'half' | 'third' | 'quarter';
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterPanelProps {
  filters: Record<string, any>;
  fields: FilterField[];
  onFilterChange: (key: string, value: any) => void;
  onSearch: () => void;
  onReset: () => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (sortBy: string, sortDirection: 'ASC' | 'DESC') => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showSorting?: boolean;
  sortOptions?: SortOption[];
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  title?: string;
  searchButtonText?: string;
  resetButtonText?: string;
  showActiveFilters?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  isLoading?: boolean;
}