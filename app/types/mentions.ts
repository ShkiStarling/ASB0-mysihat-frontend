// types/mentions.ts

/**
 * Core mention interface based on your mock data structure
 */
export interface Mention {
  id: number;
  date: string; // Format: "YYYY-MM-DD"
  dataSource: string;
  headline: string;
  summary: string;
  imageUrl: string;
  link: string;
  media_type: MediaType;
  mediaOutlet: string;
  media_name: string;
  status: MentionStatus;
  keywords: string[];
  engagement: number;
}

/**
 * Media type enum - matches your mock data values
 */
export type MediaType = "social media" | "mainstream" | "all";

// types/mentions.ts
export type MediaName =
  | "all"
  | "The Star"
  | "Malay Mail"
  | "New Straits Times"
  | "Bernama"
  | "Free Malaysia Today"
  | "The Edge Malaysia"
  | "The Borneo Post"
  | "Daily Express"
  | "Malaysiakini"
  | "The Straits Times"
  | "X"
  | "Reddit"
  | "Instagram"
  | "TikTok"
  | "Facebook"
  | "YouTube";

/**
 * Mention verification status
 */
export type MentionStatus = "verified" | "unverified" | "all";

/**
 * Date range filter options
 */
export type DateRange = "today" | "7days" | "30days" | "custom" | "all";

/**
 * Statistics interface - matches your mock stats structure
 */
export interface MentionStats {
  totalMentions: number;
  verifiedMentions: number;
  unverifiedMentions: number;
  mainStreamMedia: number;
  socialMedia: number;
}

/**
 * Complete API response structure matching your mock data
 */
export interface MentionApiResponse {
  mentions: Mention[];
  stats: MentionStats;
  keywords: string[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

/**
 * API request parameters for filtering and pagination
 */
export interface MentionApiParams {
  page?: number;
  limit?: number;
  keyword?: string | "all";
  mediaName?: MediaName | "all";
  status?: MentionStatus | "all";
  search?: string;
  dateRange?: DateRange;
}

/**
 * Filter state interface for the UI components
 */
export interface MentionFilters {
  selectedKeyword: string;
  selectedMediaType: string;
  selectedStatus: string;
  selectedDateRange: DateRange;
  searchTerm: string;
}

/**
 * Component state interface
 */
export interface MediaMonitorState {
  data: MentionApiResponse | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  filters: MentionFilters;
}

/**
 * Props interface for MentionCard component
 */
export interface MentionCardProps {
  mention: Mention;
  onStatusChange?: (id: number, newStatus: MentionStatus) => void;
  onEdit?: (mention: Mention) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

/**
 * Props interface for Filter component
 */
export interface MentionFiltersProps {
  filters: MentionFilters;
  keywords: string[];
  onFilterChange: (filterType: FilterType, value: string) => void;
  onReset?: () => void;
}

/**
 * Filter types for handling different filter changes
 */
export type FilterType =
  | "keyword"
  | "mediaName"
  | "status"
  | "dateRange"
  | "search";

/**
 * Pagination props interface
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

/**
 * Statistics card props interface
 */
export interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ComponentType<any>;
  iconColor?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
}

/**
 * Form data interface for creating/editing mentions
 */
export interface MentionFormData {
  date: string;
  dataSource: string;
  headline: string;
  summary: string;
  imageUrl?: string;
  link: string;
  mediaType: MediaType;
  mediaOutlet: string;
  mediaName: string;
  status: MentionStatus;
  keywords: string[]; // Array for form handling
  keywordsInput?: string; // Comma-separated string for input field
  engagement: number | string; // Can be string during form input
}

/**
 * API error response interface
 */
export interface ApiError {
  error: string;
  message?: string;
  status?: number;
}

/**
 * Mock data structure interface (for development/testing)
 */
export interface MockDataResponse {
  mentions: Mention[];
  stats: MentionStats;
  keywords: string[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Enhanced mention with computed properties
 */
export interface EnhancedMention extends Mention {
  timeAgo?: string; // e.g., "2 hours ago"
  engagementLevel?: "low" | "medium" | "high";
  trustScore?: number; // 0-100 based on source reliability
  isRecent?: boolean; // true if within last 24 hours
}

/**
 * Bulk operations interface
 */
export interface BulkOperation {
  action: "verify" | "unverify" | "delete" | "archive";
  mentionIds: number[];
  data?: Partial<Mention>;
}

export interface BulkOperationResult {
  success: boolean;
  processedCount: number;
  failedCount: number;
  errors?: Array<{
    mentionId: number;
    error: string;
  }>;
}

/**
 * Search and sorting options
 */
export type SortField =
  | "date"
  | "engagement"
  | "headline"
  | "mediaType"
  | "status";
export type SortOrder = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

/**
 * Filter option for dropdowns
 */
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

/**
 * Media outlet information
 */
export interface MediaOutletInfo {
  name: string;
  type: MediaType;
  verified: boolean;
  trustScore?: number;
  baseUrl?: string;
  description?: string;
  followerCount?: number;
}

/**
 * Analytics data interface
 */
export interface AnalyticsData {
  trendsData: Array<{
    date: string;
    mentions: number;
    verified: number;
    unverified: number;
  }>;
  topKeywords: Array<{
    keyword: string;
    count: number;
    trend: "up" | "down" | "stable";
  }>;
  sourceDistribution: {
    mainstream: number;
    socialMedia: number;
  };
  engagementMetrics: {
    averageEngagement: number;
    topEngaged: Mention[];
    totalEngagement: number;
  };
}

/**
 * Export options interface
 */
export interface ExportOptions {
  format: "csv" | "xlsx" | "json";
  includeFields: (keyof Mention)[];
  filters?: MentionApiParams;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  defaultPageSize: number;
  defaultFilters: Partial<MentionFilters>;
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  notifications: {
    newMentions: boolean;
    highEngagement: boolean;
    unverifiedSpike: boolean;
  };
  displayOptions: {
    showImages: boolean;
    compactView: boolean;
    showEngagement: boolean;
  };
}

/**
 * Real-time update interface
 */
export interface MentionUpdate {
  type: "create" | "update" | "delete";
  mention: Mention;
  timestamp: string;
  userId?: string;
}

/**
 * Type guards for runtime type checking
 */
export const isMediaType = (value: any): value is MediaType => {
  return (
    typeof value === "string" && ["social media", "mainstream"].includes(value)
  );
};

export const isMentionStatus = (value: any): value is MentionStatus => {
  return (
    typeof value === "string" && ["verified", "unverified"].includes(value)
  );
};

export const isDateRange = (value: any): value is DateRange => {
  return (
    typeof value === "string" &&
    ["today", "7days", "30days", "custom", "all"].includes(value)
  );
};

export const isMention = (value: any): value is Mention => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.id === "number" &&
    typeof value.headline === "string" &&
    typeof value.summary === "string" &&
    isMediaType(value.mediaType) &&
    isMentionStatus(value.status) &&
    Array.isArray(value.keywords)
  );
};

/**
 * Utility type for partial mention updates
 */
export type MentionUpdate_Type = Partial<Omit<Mention, "id">> & { id: number };

/**
 * API response wrapper type
 */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

/**
 * Component event handlers
 */
export interface MentionEventHandlers {
  onStatusChange: (id: number, status: MentionStatus) => Promise<void>;
  onEdit: (mention: Mention) => void;
  onDelete: (id: number) => Promise<void>;
  onBulkAction: (operation: BulkOperation) => Promise<void>;
  onExport: (options: ExportOptions) => Promise<void>;
  onRefresh: () => Promise<void>;
}

/**
 * Theme and styling types
 */
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}
