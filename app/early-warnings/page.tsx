"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Brain,
  Clock,
  Loader2,
  MapPin,
  Settings,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Helper functions for generating realistic mock data
const generateRealisticAlertValue = (alertType: string) => {
  switch (alertType) {
    case "outbreak_risk":
      return `${Math.floor(Math.random() * 300) + 150}%`; // 150-449%
    case "pattern_anomaly":
      return `${Math.floor(Math.random() * 20) + 10} cases/hour`; // 10-29 cases/hour
    case "early_warning":
      return `${Math.floor(Math.random() * 40) + 20}%`; // 20-59%
    case "keyword_spike":
      return `${Math.floor(Math.random() * 25) + 15}%`; // 15-39%
    default:
      return `${Math.floor(Math.random() * 50) + 10}%`; // 10-59%
  }
};

const generateRandomTimestamp = () => {
  const timeOptions = [
    "5 minutes ago",
    "12 minutes ago",
    "28 minutes ago",
    "45 minutes ago",
    "1 hour ago",
    "2 hours ago",
    "3 hours ago",
    "4 hours ago",
    "6 hours ago",
  ];
  return timeOptions[Math.floor(Math.random() * timeOptions.length)];
};

const generateNewAlertHistory = () => {
  const dates = ["Jan 1", "Jan 2", "Jan 3", "Jan 4", "Jan 5", "Jan 6", "Jan 7"];
  return dates.map((date) => {
    const totalAlerts = Math.floor(Math.random() * 6) + 1; // 1-6 alerts
    const aiAlerts =
      Math.floor(Math.random() * totalAlerts) + Math.floor(totalAlerts * 0.3); // At least 30% AI alerts
    return {
      date,
      alerts: totalAlerts,
      aiAlerts: Math.min(aiAlerts, totalAlerts), // Ensure AI alerts don't exceed total
    };
  });
};

const randomizeThresholds = (currentThresholds: typeof initialThresholds) => {
  return currentThresholds.map((threshold) => {
    let newValue;
    switch (threshold.metric) {
      case "Mention Spike":
        newValue = Math.floor(Math.random() * 30) + 20; // 20-49%
        break;
      case "Geographic Clustering":
        newValue = Math.floor(Math.random() * 8) + 3; // 3-10 km
        break;
      case "Time Window":
        newValue = Math.floor(Math.random() * 8) + 4; // 4-11 hours
        break;
      case "AI Confidence":
        newValue = Math.floor(Math.random() * 20) + 65; // 65-84%
        break;
      default:
        newValue = threshold.current;
    }
    return { ...threshold, current: newValue };
  });
};

const generateRandomDashboardMetrics = () => {
  const changeOptions = [-3, -2, -1, 0, 1, 2, 3];
  const improvementOptions = [-6, -5, -4, -3, -2, -1, 0, 1];

  return {
    aiConfidence: Math.floor(Math.random() * 25) + 75, // 75-99%
    responseTime: Math.floor(Math.random() * 10) + 5, // 5-14 minutes
    yesterdayChange:
      changeOptions[Math.floor(Math.random() * changeOptions.length)],
    responseImprovement:
      improvementOptions[Math.floor(Math.random() * improvementOptions.length)],
  };
};

// Mock alert data focused on early detection
const mockAlertData = [
  {
    id: 1,
    type: "outbreak_risk",
    severity: "high",
    title: "Dengue Fever Outbreak Risk - Selangor",
    location: "Petaling District",
    description:
      "AI detected 245% spike in dengue-related mentions with geographic clustering pattern",
    threshold: "30%",
    current: "245%",
    timestamp: "15 minutes ago",
    status: "active",
    confidence: 87,
    aiGenerated: true,
  },
  {
    id: 2,
    type: "pattern_anomaly",
    severity: "medium",
    title: "Respiratory Symptoms Pattern Detected",
    location: "Johor Bahru",
    description:
      "Unusual clustering of respiratory symptoms across 3 districts in 48-hour window",
    threshold: "10 cases/hour",
    current: "15 cases/hour",
    timestamp: "1 hour ago",
    status: "investigating",
    confidence: 92,
    aiGenerated: true,
  },
  {
    id: 3,
    type: "early_warning",
    severity: "medium",
    title: "Food Poisoning Cluster Alert",
    location: "George Town",
    description:
      "Geographic clustering of gastrointestinal symptoms near commercial district",
    threshold: "20%",
    current: "34%",
    timestamp: "3 hours ago",
    status: "monitoring",
    confidence: 78,
    aiGenerated: true,
  },
  {
    id: 4,
    type: "keyword_spike",
    severity: "low",
    title: "Skin Condition Mentions Trending",
    location: "Kota Kinabalu",
    description:
      "Gradual increase in skin-related health mentions over 72 hours",
    threshold: "15%",
    current: "18%",
    timestamp: "6 hours ago",
    status: "monitoring",
    confidence: 65,
    aiGenerated: false,
  },
];

const initialThresholds = [
  { id: 1, metric: "Mention Spike", current: 30, unit: "%" },
  { id: 2, metric: "Geographic Clustering", current: 5, unit: "km radius" },
  { id: 3, metric: "Time Window", current: 6, unit: "hours" },
  { id: 4, metric: "AI Confidence", current: 75, unit: "%" },
];

const alertHistory = [
  { date: "Jan 1", alerts: 2, aiAlerts: 1 },
  { date: "Jan 2", alerts: 1, aiAlerts: 1 },
  { date: "Jan 3", alerts: 4, aiAlerts: 3 },
  { date: "Jan 4", alerts: 3, aiAlerts: 2 },
  { date: "Jan 5", alerts: 1, aiAlerts: 0 },
  { date: "Jan 6", alerts: 5, aiAlerts: 4 },
  { date: "Jan 7", alerts: 3, aiAlerts: 2 },
];

export default function EarlyWarningsPage() {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [aiAlertsEnabled, setAiAlertsEnabled] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
  const [thresholds, setThresholds] = useState(initialThresholds);
  const [alerts, setAlerts] = useState(mockAlertData);
  const [alertHistoryData, setAlertHistoryData] = useState(alertHistory);
  const [isUpdatingThresholds, setIsUpdatingThresholds] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Dashboard metrics state
  const [dashboardMetrics, setDashboardMetrics] = useState({
    aiConfidence: 87,
    responseTime: 8,
    yesterdayChange: -1,
    responseImprovement: -4,
  });

  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // fetch data from api/early-warnings
  useEffect(() => {
    fetch("/api/early-warnings")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  const handleThresholdChange = (id: number, newValue: string) => {
    const numericValue = parseFloat(newValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setThresholds((prevThresholds) =>
        prevThresholds.map((threshold) =>
          threshold.id === id
            ? { ...threshold, current: numericValue }
            : threshold
        )
      );
    }
  };

  const handleUpdateThresholds = async () => {
    try {
      setIsUpdatingThresholds(true);
      setIsSearching(true);
      console.log("Updating thresholds:", thresholds);

      // Validate thresholds before sending
      const validThresholds = thresholds.every(
        (threshold) => threshold.current > 0 && !isNaN(threshold.current)
      );

      if (!validThresholds) {
        // Use a more user-friendly notification instead of alert
        console.error("Invalid threshold values");
        return;
      }

      // Simulate AI searching and processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the updated thresholds to your API
      // Example API call:
      // const response = await fetch('/api/update-thresholds', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ thresholds }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to update thresholds');
      // }

      // Reshuffle alerts and update numbers to simulate real-time changes
      const shuffledAlerts = [...alerts].sort(() => Math.random() - 0.5);

      // Update alert numbers to make them look more realistic
      const updatedAlerts = shuffledAlerts.map((alert) => ({
        ...alert,
        current: generateRealisticAlertValue(alert.type),
        confidence: alert.aiGenerated
          ? Math.floor(Math.random() * 20) + 70
          : alert.confidence, // 70-89% for AI alerts
        timestamp: generateRandomTimestamp(),
      }));

      setAlerts(updatedAlerts);

      // Randomize thresholds to simulate dynamic adjustments
      // const newRandomThresholds = randomizeThresholds(thresholds);
      // setThresholds(newRandomThresholds);

      // Generate new alert history data
      const newAlertHistory = generateNewAlertHistory();
      setAlertHistoryData(newAlertHistory);

      // Update dashboard metrics
      const newDashboardMetrics = generateRandomDashboardMetrics();
      setDashboardMetrics(newDashboardMetrics);

      // Simulate finding new alerts based on updated thresholds
      setIsSearching(false);
      console.log("Thresholds updated successfully!");

      // Optional: You could trigger a re-evaluation of existing alerts based on new thresholds
      // This would typically be handled on the backend, but for demonstration:
      // refetchAlertsWithNewThresholds();
    } catch (error) {
      console.error("Error updating thresholds:", error);
      setIsSearching(false);
    } finally {
      setIsUpdatingThresholds(false);
    }
  };

  const handleReshuffleAlerts = () => {
    setIsSearching(true);

    // Simulate AI re-analyzing and reshuffling alerts
    setTimeout(() => {
      const shuffledAlerts = [...alerts].sort(() => Math.random() - 0.5);
      setAlerts(shuffledAlerts);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <AlertTriangle className="w-6 h-6 text-nexus-cyan" />
          <h1 className="text-2xl font-bold text-nexus-text">
            Early Warning Intelligence
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="nexus-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-muted">
              Active Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text">
              {alerts.length}
            </div>
            <p className="text-xs text-nexus-text-muted">
              {alerts.filter((a) => a.aiGenerated).length} AI-generated
            </p>
          </CardContent>
        </Card>

        <Card className="nexus-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-muted">
              High Priority
            </CardTitle>
            <Zap className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text">
              {alerts.filter((a) => a.severity === "high").length}
            </div>
            <p
              className={`text-xs ${
                dashboardMetrics.yesterdayChange <= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {dashboardMetrics.yesterdayChange > 0 ? "+" : ""}
              {dashboardMetrics.yesterdayChange} from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="nexus-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-muted">
              AI Confidence
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text">
              {dashboardMetrics.aiConfidence}%
            </div>
            <p className="text-xs text-purple-500">Average accuracy</p>
          </CardContent>
        </Card>

        <Card className="nexus-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-nexus-text-muted">
              Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nexus-text">
              {dashboardMetrics.responseTime}m
            </div>
            <p
              className={`text-xs ${
                dashboardMetrics.responseImprovement <= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {dashboardMetrics.responseImprovement > 0 ? "+" : ""}
              {dashboardMetrics.responseImprovement}m improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts */}
        <div className="lg:col-span-2">
          <Card className="nexus-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-nexus-text">
                  <AlertTriangle className="w-5 h-5 text-nexus-cyan" />
                  Active Early Warning Alerts
                </CardTitle>
                {/* <Button
                  onClick={handleReshuffleAlerts}
                  disabled={isSearching}
                  className="nexus-action-btn h-8 px-3"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Reshuffle
                </Button> */}
              </div>
            </CardHeader>
            <CardContent>
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-nexus-cyan animate-spin" />
                    <Brain className="w-6 h-6 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-nexus-text">
                      AI Intelligence Processing
                    </h3>
                    <p className="text-sm text-nexus-text-muted max-w-md">
                      Neural networks are analyzing health patterns, social
                      media mentions, and geographical data to identify emerging
                      threats...
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`nexus-card p-4 cursor-pointer transition-colors ${
                        selectedAlert === alert.id
                          ? "border-nexus-cyan bg-nexus-cyan/5"
                          : "hover:bg-nexus-hover"
                      }`}
                      onClick={() =>
                        setSelectedAlert(
                          selectedAlert === alert.id ? null : alert.id
                        )
                      }
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              alert.severity === "high"
                                ? "bg-red-100 text-red-800"
                                : alert.severity === "medium"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {alert.severity}
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800">
                            {alert.type.replace("_", " ")}
                          </Badge>
                          {alert.aiGenerated && (
                            <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                              <Brain className="w-3 h-3" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-nexus-text-muted">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp}
                        </div>
                      </div>

                      <h3 className="font-semibold text-nexus-text mb-1">
                        {alert.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2 text-sm text-nexus-text-muted">
                        <MapPin className="w-3 h-3" />
                        {alert.location}
                      </div>

                      <p className="text-sm text-nexus-text-muted mb-3">
                        {alert.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-nexus-text-muted">
                            Threshold:{" "}
                            <span className="font-medium text-nexus-text">
                              {alert.threshold}
                            </span>
                          </span>
                          <span className="text-nexus-text-muted">
                            Current:{" "}
                            <span className="font-medium text-orange-500">
                              {alert.current}
                            </span>
                          </span>
                          {alert.aiGenerated && (
                            <span className="text-nexus-text-muted">
                              Confidence:{" "}
                              <span className="font-medium text-purple-500">
                                {alert.confidence}%
                              </span>
                            </span>
                          )}
                        </div>
                        <Badge
                          className={
                            alert.status === "active"
                              ? "bg-red-100 text-red-800"
                              : alert.status === "investigating"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {alert.status}
                        </Badge>
                      </div>

                      {selectedAlert === alert.id && (
                        <div className="mt-4 pt-4 border-t border-nexus-border flex gap-2">
                          <Button className="nexus-action-btn bg-nexus-cyan text-nexus-dark hover:bg-nexus-cyan/80">
                            Investigate
                          </Button>
                          <Button className="nexus-action-btn">
                            Acknowledge
                          </Button>
                          <Button className="nexus-action-btn">Escalate</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Alert History Chart */}
          <Card className="mt-4 nexus-card">
            <CardHeader>
              <CardTitle className="dark:text-gray-100 text-gray-900">
                Alert History (7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] sm:h-[300px] w-full">
                <ChartContainer
                  config={{
                    alerts: { label: "Total Alerts", color: "#00d4ff" },
                    aiAlerts: { label: "AI Alerts", color: "#a855f7" },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={alertHistoryData}
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="date"
                        tick={{
                          fontSize: 12,
                          className: "dark:fill-white fill-gray-600",
                        }}
                        tickLine={{
                          className: "dark:stroke-gray-400 stroke-gray-500",
                        }}
                        axisLine={{
                          className: "dark:stroke-gray-400 stroke-gray-500",
                        }}
                      />
                      <YAxis
                        tick={{
                          fontSize: 12,
                          className: "dark:fill-white fill-gray-600",
                        }}
                        tickLine={{
                          className: "dark:stroke-gray-400 stroke-gray-500",
                        }}
                        axisLine={{
                          className: "dark:stroke-gray-400 stroke-gray-500",
                        }}
                        label={{
                          value: "Alerts",
                          angle: -90,
                          position: "insideLeft",
                          className: "dark:fill-white fill-gray-600",
                        }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="alerts"
                        stroke="#00d4ff"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="aiAlerts"
                        stroke="#a855f7"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Alert Thresholds */}
          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-nexus-text">
                <Settings className="w-4 h-4 text-nexus-cyan" />
                Detection Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {thresholds.map((threshold) => (
                  <div key={threshold.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-nexus-text">
                        {threshold.metric}
                      </span>
                      <span className="text-nexus-text-muted">
                        {threshold.unit}
                      </span>
                    </div>
                    <Input
                      type="number"
                      value={threshold.current}
                      onChange={(e) =>
                        handleThresholdChange(threshold.id, e.target.value)
                      }
                      className="nexus-input h-8"
                      min="0"
                      step={threshold.unit === "%" ? "1" : "0.1"}
                      placeholder={`Enter ${threshold.metric.toLowerCase()}`}
                    />
                  </div>
                ))}
                <Button
                  onClick={handleUpdateThresholds}
                  disabled={isUpdatingThresholds || isSearching}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isUpdatingThresholds ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isSearching ? "AI Searching..." : "Updating..."}
                    </div>
                  ) : (
                    "Update Thresholds"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Status */}
          <Card className="nexus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-nexus-text">
                <Brain className="w-4 h-4 text-purple-500" />
                AI Detection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-nexus-text">
                    Pattern Detection
                  </span>
                  <Badge className="nexus-badge-active">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-nexus-text">
                    Outbreak Prediction
                  </span>
                  <Badge className="nexus-badge-active">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-nexus-text">
                    Anomaly Detection
                  </span>
                  <Badge className="nexus-badge-active">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-nexus-text">
                    Geographic Clustering
                  </span>
                  <Badge className="nexus-badge-active">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
