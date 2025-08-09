"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  AlertTriangle,
  Brain,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Filter,
  MessageSquare,
  Search,
  Share,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DateRange,
  FilterType,
  MediaType,
  MentionApiParams,
  MentionApiResponse,
  MentionStatus,
} from "../types/mentions";

// Define the possible value types for the filter
type FilterValue = MentionStatus | MediaType | DateRange | string | null;

const fetchMediaMentions = async (
  params: MentionApiParams
): Promise<MentionApiResponse> => {
  try {
    // Construct query string from params
    const queryParams = new URLSearchParams();
    if (params.keyword && params.keyword !== "all") {
      queryParams.append("keyword", params.keyword);
    }
    if (params.mediaType && params.mediaType !== "all") {
      queryParams.append("mediaType", params.mediaType);
    }
    if (params.status && params.status !== "all") {
      queryParams.append("status", params.status);
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    // Make API call
    const response = await fetch(`/api/mentions?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers, e.g., authorization tokens, if needed
      },
    });

    // Check if response is successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Parse and return response
    const data: MentionApiResponse = await response.json();

    // Ensure the response matches the expected shape
    if (
      !data.mentions ||
      !data.stats ||
      !data.keywords ||
      !data.total ||
      !data.page ||
      !data.totalPages
    ) {
      throw new Error("Invalid API response format");
    }

    return data;
  } catch (error) {
    console.error("Error fetching media mentions:", error);
    // Return a fallback response or rethrow the error based on your needs
    throw new Error("Failed to fetch media mentions");
  }
};

const keywords = [
  "demam tinggi",
  "sakit kepala",
  "muntah",
  "batuk kering",
  "demam",
  "sesak nafas",
  "batuk berdarah",
];

export default function MediaIntelligenceMonitor() {
  const [data, setData] = useState<MentionApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedKeyword, setSelectedKeyword] = useState("all");
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>("all");
  const [selectedStatus, setSelectedStatus] = useState<MentionStatus>("all");
  const [selectedDateRange, setSelectedDateRange] =
    useState<DateRange>("7days");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: MentionApiParams = {
        page: currentPage,
        limit: itemsPerPage,
        keyword: selectedKeyword,
        mediaType: selectedMediaType,
        status: selectedStatus,
        search: searchTerm,
        dateRange: selectedDateRange,
      };

      const result = await fetchMediaMentions(params);
      setData(result);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    currentPage,
    selectedKeyword,
    selectedMediaType,
    selectedStatus,
    selectedDateRange,
    searchTerm,
  ]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (filterType: FilterType, value: FilterValue) => {
    setCurrentPage(1); // Reset to first page when filters change
    if (value !== null) {
      switch (filterType) {
        case "keyword":
          setSelectedKeyword(value.toString()); // Convert value to string
          break;
        case "mediaType":
          setSelectedMediaType(value as MediaType);
          break;
        case "status":
          setSelectedStatus(value as MentionStatus); // Convert value to string
          break;
        case "dateRange":
          setSelectedDateRange(value as DateRange); // Convert value to string
          break;
      }
    }
  };

  const getStatusIcon = (status: MentionStatus) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
      case "unverified":
        return (
          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
        );
      default:
        return (
          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
        );
    }
  };

  const getStatusBadge = (status: MentionStatus) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "unverified":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMediaTypeBadge = (mediaType: MediaType) => {
    switch (mediaType) {
      case "mainstream":
        return "bg-blue-100 text-blue-800";
      case "social media":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderPagination = () => {
    if (!data || data.totalPages <= 1) return null;

    const { totalPages } = data;
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, data.total)} of {data.total}{" "}
          entries
        </div>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {startPage > 1 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                >
                  1
                </button>
                {startPage > 2 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
              </>
            )}

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                  currentPage === page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <div className="sm:hidden">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Eye className="w-6 h-6 text-nexus-cyan" />
          <h1 className="text-2xl font-bold text-nexus-text">
            Media Intelligence Monitor
          </h1>
        </div>
      </div>

      {/* Statistics Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="nexus-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-muted">
                Total Mentions
              </CardTitle>
              <Activity className="h-4 w-4 text-nexus-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text">
                {data.stats.totalMentions.toLocaleString()}
              </div>
              <p className="text-xs text-nexus-text-muted">All sources</p>
            </CardContent>
          </Card>

          <Card className="nexus-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-muted">
                Verified
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text">
                {data.stats.verifiedMentions.toLocaleString()}
              </div>
              <p className="text-xs text-green-500">Confirmed sources</p>
            </CardContent>
          </Card>

          <Card className="nexus-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-muted">
                Unverified
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text">
                {data.stats.unverifiedMentions.toLocaleString()}
              </div>
              <p className="text-xs text-orange-500">Needs verification</p>
            </CardContent>
          </Card>

          <Card className="nexus-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-muted">
                Mainstream Media
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text">
                {data.stats.mainStreamMedia.toLocaleString()}
              </div>
              <p className="text-xs text-blue-500">News outlets</p>
            </CardContent>
          </Card>

          <Card className="nexus-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-nexus-text-muted">
                Social Media
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nexus-text">
                {data.stats.socialMedia.toLocaleString()}
              </div>
              <p className="text-xs text-purple-500">Social platforms</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="nexus-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-nexus-text">
            <Filter className="w-5 h-5 text-nexus-cyan" />
            Media Intelligence Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-nexus-text mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nexus-text-muted w-4 h-4" />
                <Input
                  placeholder="Search headlines, summaries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="nexus-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-nexus-text mb-2 block">
                Keyword
              </label>
              <Select
                value={selectedKeyword}
                onValueChange={setSelectedKeyword}
              >
                <SelectTrigger className="nexus-input">
                  <SelectValue placeholder="All Keywords" />
                </SelectTrigger>
                <SelectContent className="bg-nexus-card border-nexus-border">
                  <SelectItem value="all">All Keywords</SelectItem>
                  {keywords.map((keyword) => (
                    <SelectItem key={keyword} value={keyword}>
                      {keyword}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-nexus-text mb-2 block">
                Media Type
              </label>
              <Select
                value={selectedMediaType}
                onValueChange={(value) =>
                  setSelectedMediaType(value as MediaType)
                }
              >
                <SelectTrigger className="nexus-input">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-nexus-card border-nexus-border">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="mainstream">Mainstream Media</SelectItem>
                  <SelectItem value="social media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-nexus-text mb-2 block">
                Status
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelectedStatus(value as MentionStatus)
                }
              >
                <SelectTrigger className="nexus-input">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-nexus-card border-nexus-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-nexus-text mb-2 block">
                Date Range
              </label>
              <Select
                value={selectedDateRange}
                onValueChange={(value) =>
                  setSelectedDateRange(value as DateRange)
                }
              >
                <SelectTrigger className="nexus-input">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent className="bg-nexus-card border-nexus-border">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Mentions List */}
      <Card className="nexus-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-nexus-text">
            <Brain className="w-5 h-5 text-nexus-cyan" />
            Media Mentions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.mentions.map((mention) => (
              <Card
                key={mention.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                      <img
                        src={mention.imageUrl}
                        alt="Media mention"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6">
                      {/* Header with badges */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`${getStatusBadge(
                              mention.status
                            )} font-medium`}
                          >
                            {getStatusIcon(mention.status)}
                            <span className="ml-1 capitalize">
                              {mention.status}
                            </span>
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`${getMediaTypeBadge(
                              mention.mediaType
                            )} font-medium`}
                          >
                            {mention.mediaType}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-700 font-medium"
                          >
                            {mention.mediaName}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                          <Calendar className="w-3 h-3" />
                          {mention.date}
                        </div>
                      </div>

                      {/* Title and Summary */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {mention.headline}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {mention.summary}
                      </p>

                      {/* Keywords */}
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">
                          Keywords:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {mention.keywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-default"
                            >
                              #{keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {mention.mediaType === "social media" ? (
                            <>
                              <Share className="w-4 h-4" />
                              <span className="font-medium">
                                {mention.engagement}
                              </span>
                              <span>interactions</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              <span className="font-medium">
                                {mention.engagement}
                              </span>
                              <span>views</span>
                            </>
                          )}
                        </div>
                        <Button
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                          size="sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Source
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data?.mentions.length === 0 && (
            <div className="text-center py-12">
              <div className="nexus-card p-8 max-w-md mx-auto">
                <Brain className="w-16 h-16 text-nexus-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-nexus-text mb-2">
                  No mentions found
                </h3>
                <p className="text-nexus-text-muted">
                  No matches found. Try adjusting your filters or search terms.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {renderPagination()}
    </div>
  );
}
