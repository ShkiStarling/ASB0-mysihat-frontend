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
  AlertTriangle,
  Bell,
  Brain,
  CheckCircle,
  Edit,
  Loader2,
  Plus,
  Target,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";

// Initial alert data
const initialAlerts = [
  {
    id: 1,
    keyword: "denggi + Klang Valley",
    threshold: 50,
    current: 127,
    status: "triggered",
    district: "Petaling",
    timestamp: "2024-01-15 14:30",
    priority: "high",
    enabled: true,
  },
  {
    id: 2,
    keyword: "batuk berdarah + Johor",
    threshold: 30,
    current: 45,
    status: "triggered",
    district: "Johor Bahru",
    timestamp: "2024-01-15 13:15",
    priority: "medium",
    enabled: true,
  },
  {
    id: 3,
    keyword: "demam campak + Sabah",
    threshold: 20,
    current: 18,
    status: "monitoring",
    district: "Kota Kinabalu",
    timestamp: "2024-01-15 12:00",
    priority: "low",
    enabled: true,
  },
  {
    id: 4,
    keyword: "sakit perut + Penang",
    threshold: 25,
    current: 12,
    status: "normal",
    district: "George Town",
    timestamp: "2024-01-15 11:30",
    priority: "medium",
    enabled: false,
  },
];

const keywordSuggestions = [
  "demam denggi",
  "batuk kering",
  "sakit kepala teruk",
  "muntah-muntah",
  "cirit-birit",
  "ruam kulit",
  "sesak nafas",
  "demam tinggi",
  "sakit tekak",
  "gatal-gatal",
];

const locationSuggestions = [
  "Klang Valley",
  "Johor Bahru",
  "Penang",
  "Sabah",
  "Sarawak",
  "Kedah",
  "Kelantan",
  "Terengganu",
  "Pahang",
  "Perak",
];

export default function KeywordManagerPage() {
  const [newKeyword, setNewKeyword] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newThreshold, setNewThreshold] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [editingAlert, setEditingAlert] = useState<number | null>(null);
  const [editThreshold, setEditThreshold] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [alerts, setAlerts] = useState(initialAlerts);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddAlert = async () => {
    if (newKeyword && newThreshold) {
      setIsAdding(true);

      // Simulate API call with 3-second delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const maxId =
        alerts.length > 0 ? Math.max(...alerts.map((alert) => alert.id)) : 0;
      const parsedThreshold = Number.parseInt(newThreshold);

      if (isNaN(parsedThreshold) || parsedThreshold <= 0) {
        setIsAdding(false);
        return;
      }

      const currentTimestamp = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const mockCurrentMentions = Math.floor(
        Math.random() * (parsedThreshold * 1.5)
      );
      const status =
        mockCurrentMentions >= parsedThreshold
          ? "triggered"
          : mockCurrentMentions >= parsedThreshold * 0.8
          ? "monitoring"
          : "normal";

      const district =
        newLocation && newLocation !== "allMalaysia"
          ? newLocation
          : "All Malaysia";

      const newAlert = {
        id: maxId + 1,
        keyword:
          newKeyword +
          (newLocation && newLocation !== "allMalaysia"
            ? ` + ${newLocation}`
            : ""),
        current: mockCurrentMentions,
        status: status,
        district: district,
        timestamp: currentTimestamp,
        priority: newPriority,
        enabled: true,
        threshold: parsedThreshold,
      };

      setAlerts((prev) => [...prev, newAlert]);

      // Clear form fields
      setNewKeyword("");
      setNewLocation("");
      setNewThreshold("");
      setNewPriority("medium");
      setIsAdding(false);
    }
  };

  const handleDeleteAlert = (alertId: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const handleToggleAlert = (alertId: number) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
      )
    );
  };

  const handleEditAlert = (alertId: number) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      setEditThreshold(alert.threshold.toString());
      setEditPriority(alert.priority);
      setEditingAlert(alertId);
    }
  };

  const handleSaveAlert = (alertId: number) => {
    const parsedThreshold = Number.parseInt(editThreshold);
    if (isNaN(parsedThreshold) || parsedThreshold <= 0) {
      return;
    }

    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              threshold: parsedThreshold,
              priority: editPriority,
              timestamp: new Date().toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
            }
          : alert
      )
    );
    setEditingAlert(null);
    setEditThreshold("");
    setEditPriority("");
  };

  const handleCancelEdit = () => {
    setEditingAlert(null);
    setEditThreshold("");
    setEditPriority("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "triggered":
        return "bg-red-100 text-red-800";
      case "monitoring":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Target className="w-6 h-6 text-nexus-cyan" />
          <h1 className="text-2xl font-bold text-nexus-text">
            AI Keyword Management
          </h1>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="nexus-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-muted">
              Total Keywords
            </CardTitle>
            <Target className="h-4 w-4 text-nexus-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text">
              {alerts.length}
            </div>
            <p className="text-xs text-nexus-text-muted">Configured keywords</p>
          </CardContent>
        </Card>

        <Card className="nexus-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-muted">
              Currently Triggered
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text">
              {alerts.filter((a) => a.status === "triggered").length}
            </div>
            <p className="text-xs text-red-500">Requiring attention</p>
          </CardContent>
        </Card>

        <Card className="nexus-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-muted">
              Monitoring
            </CardTitle>
            <Bell className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text">
              {alerts.filter((a) => a.status === "monitoring").length}
            </div>
            <p className="text-xs text-orange-500">Below threshold</p>
          </CardContent>
        </Card>

        <Card className="nexus-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-muted">
              Disabled
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text">
              {alerts.filter((a) => !a.enabled).length}
            </div>
            <p className="text-xs text-red-500">Disabled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Alert */}
        <div className="lg:col-span-1">
          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-nexus-text">
                <Plus className="w-5 h-5 text-nexus-cyan" />
                Add New Keyword
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-nexus-text mb-2 block">
                    Health Keywords (Malay/English)
                  </label>
                  <Input
                    placeholder="e.g., demam denggi, fever"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className="nexus-input"
                    disabled={isAdding}
                  />
                  <div className="mt-3">
                    <p className="text-xs text-nexus-text-muted mb-2 flex items-center gap-2">
                      <Brain className="w-3 h-3" />
                      AI Suggestions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {keywordSuggestions.slice(0, 6).map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setNewKeyword(suggestion)}
                          disabled={isAdding}
                          className="text-xs bg-nexus-card hover:bg-nexus-hover px-2 py-1 rounded border border-nexus-border text-nexus-text transition-colors disabled:opacity-50"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-nexus-text mb-2 block">
                    Location (Optional)
                  </label>
                  <Select
                    value={newLocation}
                    onValueChange={setNewLocation}
                    disabled={isAdding}
                  >
                    <SelectTrigger className="nexus-input">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-nexus-card border-nexus-border">
                      <SelectItem
                        className="text-black dark:text-white"
                        value="allMalaysia"
                      >
                        All Malaysia
                      </SelectItem>
                      {locationSuggestions.map((location) => (
                        <SelectItem
                          className="text-black dark:text-white"
                          key={location}
                          value={location}
                        >
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-nexus-text mb-2 block">
                    Alert Threshold
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 50 mentions"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(e.target.value)}
                    className="nexus-input"
                    disabled={isAdding}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-nexus-text mb-2 block">
                    Priority Level
                  </label>
                  <Select
                    value={newPriority}
                    onValueChange={setNewPriority}
                    disabled={isAdding}
                  >
                    <SelectTrigger className="nexus-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-nexus-card border-nexus-border text-black dark:text-white">
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAddAlert}
                  className="w-full rounded-full shadow-md bg-blue-800 dark:bg-blue-900 hover:bg-blue-700 dark:hover:bg-blue-800 text-white"
                  disabled={isAdding || !newKeyword || !newThreshold}
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-white" />
                    </>
                  )}
                </Button>
              </div>

              {/* AI Translation Note */}
              <div className="mt-6 nexus-card p-4">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-nexus-text mb-1">
                      AI Translation Engine
                    </p>
                    <p className="text-xs text-nexus-text-muted">
                      Advanced neural networks automatically translate and match
                      local slang, dialects, and medical terminology across
                      Malaysian languages.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts List */}
        <div className="lg:col-span-2">
          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-nexus-text">
                <Bell className="w-5 h-5 text-nexus-cyan" />
                Active Keyword Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts
                  .sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp))
                  .map((alert) => (
                    <div key={alert.id} className="nexus-card p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                          {!alert.enabled && (
                            <Badge className="bg-gray-100 text-gray-800">
                              Disabled
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            className={`h-8 px-2 ${
                              alert.enabled
                                ? "dark:bg-orange-600 bg-orange-700 dark:text-white text-white dark:hover:bg-orange-500 hover:bg-orange-600"
                                : "dark:bg-green-600 bg-green-700 dark:text-white text-white dark:hover:bg-green-500 hover:bg-green-600"
                            } shadow-sm hover:shadow-md transition-all rounded-full`}
                            onClick={() => handleToggleAlert(alert.id)}
                          >
                            {alert.enabled ? (
                              <XCircle className="w-3 h-3" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-8 px-2 dark:text-gray-200 text-gray-900 shadow-sm hover:shadow-md dark:hover:bg-slate-700 hover:bg-gray-100 transition-all rounded-full"
                            onClick={() => handleEditAlert(alert.id)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-8 px-2 dark:text-red-400 text-red-600 shadow-sm hover:shadow-md dark:hover:bg-red-900/20 hover:bg-red-50 transition-all rounded-full"
                            onClick={() => handleDeleteAlert(alert.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                          </Button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h3 className="font-semibold text-lg text-nexus-text">
                          {alert.keyword}
                        </h3>
                        <p className="text-sm text-nexus-text-muted">
                          {alert.district} • Threshold: {alert.threshold}{" "}
                          mentions
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-nexus-text-muted">
                            Current:{" "}
                            <span className="font-medium text-red-500">
                              {alert.current}
                            </span>
                          </span>
                          <span className="text-nexus-text-muted">
                            Threshold:{" "}
                            <span className="font-medium text-nexus-text">
                              {alert.threshold}
                            </span>
                          </span>
                          <span className="text-nexus-text-muted">
                            Last updated: {alert.timestamp}
                          </span>
                        </div>
                        <div className="w-24 bg-nexus-border rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              alert.current >= alert.threshold
                                ? "bg-red-500"
                                : "bg-orange-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (alert.current / alert.threshold) * 100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {editingAlert === alert.id && (
                        <div className="mt-4 pt-4 border-t border-nexus-border space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-nexus-text-muted">
                                Threshold
                              </label>
                              <Input
                                type="number"
                                value={editThreshold}
                                onChange={(e) =>
                                  setEditThreshold(e.target.value)
                                }
                                className="nexus-input h-8"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-nexus-text-muted">
                                Priority
                              </label>
                              <Select
                                value={editPriority}
                                onValueChange={setEditPriority}
                              >
                                <SelectTrigger className="nexus-input h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-nexus-card border-nexus-border text-black dark:text-white">
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSaveAlert(alert.id)}
                              className="bg-green-500 h-8 px-2 dark:text-white text-white shadow-sm hover:shadow-md dark:hover:bg-green-500 hover:bg-green-600 transition-all rounded-md"
                            >
                              Save
                            </Button>
                            <Button
                              variant={"ghost"}
                              className="h-8 px-2 dark:text-gray-200 text-gray-900 hover:bg-gray-100 dark:hover:bg-slate-700 shadow-sm transition-all rounded-full"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
