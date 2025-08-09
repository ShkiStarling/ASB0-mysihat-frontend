"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Cpu,
  MapPin,
  MessageSquare,
  RefreshCw,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import AIIntelligenceAlerts from "./ai-intelligence-alerts";
import EnhancedMalaysiaMap from "./enhanced-malaysia-map";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

// Malaysian health data focused on early detection and outbreak identification
const mockHealthData = {
  districts: [
    {
      name: "Petaling",
      state: "Selangor",
      alertLevel: "high",
      keywordCount: 127,
      verifiedCases: 8,
      unverifiedPosts: 45,
      topSymptoms: ["demam tinggi", "sakit kepala", "muntah"],
      coordinates: [3.1073, 101.5951],
      keywords: ["demam denggi", "sakit kepala", "muntah"],
    },
    {
      name: "Johor Bahru",
      state: "Johor",
      alertLevel: "medium",
      keywordCount: 89,
      verifiedCases: 3,
      unverifiedPosts: 23,
      topSymptoms: ["batuk kering", "demam", "sesak nafas"],
      coordinates: [1.4655, 103.7578],
      keywords: ["batuk berdarah", "demam", "sesak nafas"],
    },
    {
      name: "Kota Kinabalu",
      state: "Sabah",
      alertLevel: "low",
      keywordCount: 34,
      verifiedCases: 1,
      unverifiedPosts: 12,
      topSymptoms: ["sakit perut", "cirit-birit"],
      coordinates: [5.9804, 116.0735],
      keywords: ["sakit perut", "cirit-birit"],
    },
    {
      name: "George Town",
      state: "Pulau Pinang",
      alertLevel: "medium",
      keywordCount: 67,
      verifiedCases: 4,
      unverifiedPosts: 18,
      topSymptoms: ["ruam kulit", "gatal-gatal", "demam"],
      coordinates: [5.4164, 100.3327],
      keywords: ["ruam kulit", "gatal-gatal", "demam"],
    },
    {
      name: "Kuching",
      state: "Sarawak",
      alertLevel: "low",
      keywordCount: 28,
      verifiedCases: 2,
      unverifiedPosts: 8,
      topSymptoms: ["demam", "batuk"],
      coordinates: [1.5533, 110.3592],
      keywords: ["demam", "batuk kering"],
    },
    {
      name: "Kuala Lumpur",
      state: "Kuala Lumpur",
      alertLevel: "high",
      keywordCount: 156,
      verifiedCases: 12,
      unverifiedPosts: 67,
      topSymptoms: ["demam denggi", "sakit kepala", "ruam"],
      coordinates: [3.139, 101.6869],
      keywords: ["demam denggi", "sakit kepala", "ruam merah"],
    },
  ],
  keyMetrics: {
    totalMentionsToday: 2847,
    totalMentionsChange24h: "+18%",
    totalMentionsChange7d: "+34%",
    emergingKeywords: [
      { keyword: "demam denggi", spike: "+245%", mentions: 456, risk: "high" },
      {
        keyword: "batuk berdarah",
        spike: "+189%",
        mentions: 234,
        risk: "high",
      },
      {
        keyword: "sakit perut teruk",
        spike: "+156%",
        mentions: 189,
        risk: "medium",
      },
      { keyword: "ruam merah", spike: "+134%", mentions: 167, risk: "medium" },
      { keyword: "muntah hijau", spike: "+98%", mentions: 123, risk: "low" },
    ],
    outbreakLikelihood: {
      score: 73,
      trend: "increasing",
      factors: [
        "Geographic clustering",
        "Symptom correlation",
        "Temporal patterns",
      ],
    },
    aiInsights: [
      {
        type: "outbreak_risk",
        title: "Potential Dengue Outbreak - Selangor",
        confidence: 87,
        urgency: "high",
        description:
          "AI detected clustering of dengue symptoms in Petaling district with 245% spike in mentions",
      },
      {
        type: "pattern_detection",
        title: "Respiratory Symptoms Pattern",
        confidence: 92,
        urgency: "medium",
        description:
          "Unusual respiratory symptom pattern detected across 3 districts in past 48 hours",
      },
      {
        type: "early_warning",
        title: "Food Poisoning Cluster Alert",
        confidence: 78,
        urgency: "medium",
        description:
          "Geographic clustering of gastrointestinal symptoms detected in Johor Bahru area",
      },
    ],
  },
  trendData: [
    { date: "Jan 10", mentions: 1245, alerts: 12, outbreakRisk: 45 },
    { date: "Jan 11", mentions: 1456, alerts: 18, outbreakRisk: 52 },
    { date: "Jan 12", mentions: 1678, alerts: 15, outbreakRisk: 48 },
    { date: "Jan 13", mentions: 1923, alerts: 23, outbreakRisk: 61 },
    { date: "Jan 14", mentions: 2234, alerts: 31, outbreakRisk: 68 },
    { date: "Jan 15", mentions: 2847, alerts: 45, outbreakRisk: 73 },
  ],
};

export default function MySihatDashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedKeywordFilter, setSelectedKeywordFilter] =
    useState<string>("all");
  const [aiMonitoring, setAiMonitoring] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get current time
  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateString = currentTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogThreat, setDialogThreat] = useState<any>(null);

  const handleThreatClick = (districtName: string) => {
    const districtData = mockHealthData.districts.find(
      (d) => d.name === districtName
    );
    if (districtData) {
      setDialogThreat(districtData);
      setDialogOpen(true);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          {dialogThreat && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {dialogThreat.name} ({dialogThreat.state})
                </DialogTitle>
                <DialogDescription>
                  Alert Level:{" "}
                  <span className="font-bold">{dialogThreat.alertLevel}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <strong>Verified Cases:</strong> {dialogThreat.verifiedCases}
                </p>
                <p>
                  <strong>Unverified Posts:</strong>{" "}
                  {dialogThreat.unverifiedPosts}
                </p>
                <p>
                  <strong>Top Symptoms:</strong>{" "}
                  {dialogThreat.topSymptoms.join(", ")}
                </p>
                <p>
                  <strong>Keywords:</strong> {dialogThreat.keywords.join(", ")}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Brain className="w-6 h-6 text-nexus-cyan" />
              <h1 className="text-2xl font-bold text-nexus-text">
                Early Detection Intelligence
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-nexus-text-muted hover:text-nexus-cyan"
                onClick={handleRefresh}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">
                  Health Mentions
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-nexus-cyan" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-nexus-text mb-1">
                  {mockHealthData.keyMetrics.totalMentionsToday.toLocaleString()}
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-xs text-green-500">
                    +18% from yesterday
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">
                  Active Alerts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-nexus-text mb-1">
                  45
                </div>
                <div className="flex items-center mt-2">
                  <Zap className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-xs text-orange-500">
                    12 high priority
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">
                  Outbreak Risk
                </CardTitle>
                <Brain className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-nexus-text mb-1">
                  73%
                </div>
                <div className="flex items-center mt-2">
                  <Cpu className="w-4 h-4 text-purple-500 mr-2" />
                  <span className="text-xs text-purple-500">AI assessment</span>
                </div>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">
                  Trending Keywords
                </CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-nexus-text mb-1">5</div>
                <div className="flex items-center mt-2">
                  <BarChart3 className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-xs text-green-500">
                    High spike detected
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Map Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map Card */}
              <Card className="nexus-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-nexus-text flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-nexus-cyan" />
                    Malaysia Outbreak Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 w-full mb-4">
                    <EnhancedMalaysiaMap
                      selectedDistrict={selectedDistrict}
                      districts={mockHealthData.districts.map((district) => ({
                        ...district,
                        alertLevel: district.alertLevel as
                          | "low"
                          | "medium"
                          | "high",
                        coordinates: [
                          district.coordinates[0],
                          district.coordinates[1],
                        ],
                      }))}
                      onThreatClick={(name) => handleThreatClick(name)}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-nexus-text-muted">High Risk</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-nexus-text-muted">
                          Medium Risk
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-nexus-text-muted">Low Risk</span>
                      </div>
                    </div>
                    <span className="text-nexus-text-muted">
                      Updated 2 minutes ago
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Trend Chart */}
              <Card className="nexus-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-nexus-text flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-nexus-cyan" />
                    Outbreak Risk Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartContainer
                      config={{
                        mentions: { label: "Mentions", color: "#00d4ff" },
                        outbreakRisk: {
                          label: "Outbreak Risk",
                          color: "#f97316",
                        },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockHealthData.trendData}>
                          <defs>
                            <linearGradient
                              id="mentionsGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#00d4ff"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#00d4ff"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                            <linearGradient
                              id="riskGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#f97316"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#f97316"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: "#64748b" }}
                            tickLine={{ stroke: "#334155" }}
                            axisLine={{ stroke: "#334155" }}
                          />
                          <YAxis
                            tick={{ fontSize: 12, fill: "#64748b" }}
                            tickLine={{ stroke: "#334155" }}
                            axisLine={{ stroke: "#334155" }}
                          />
                          <ChartTooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="nexus-tooltip">
                                    <p className="font-semibold text-nexus-text">
                                      {label}
                                    </p>
                                    <p className="text-nexus-cyan">
                                      Mentions:{" "}
                                      {payload[0].value?.toLocaleString()}
                                    </p>
                                    <p className="text-orange-500">
                                      Risk Score: {payload[1]?.value}%
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="mentions"
                            stroke="#00d4ff"
                            strokeWidth={2}
                            fill="url(#mentionsGradient)"
                          />
                          <Area
                            type="monotone"
                            dataKey="outbreakRisk"
                            stroke="#f97316"
                            strokeWidth={2}
                            fill="url(#riskGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* AI Insights */}
              <AIIntelligenceAlerts />

              {/* Trending Keywords */}
              <Card className="nexus-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-nexus-text flex items-center gap-2">
                    <Target className="w-5 h-5 text-nexus-cyan" />
                    Trending Health Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockHealthData.keyMetrics.emergingKeywords.map(
                      (keyword, index) => (
                        <div
                          key={keyword.keyword}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-nexus-border flex items-center justify-center text-xs font-medium text-nexus-text">
                              {index + 1}
                            </div>
                            <div>
                              <span className="font-medium text-nexus-text text-sm">
                                {keyword.keyword}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  className={
                                    keyword.risk === "high"
                                      ? "bg-red-100 text-red-800 text-xs"
                                      : keyword.risk === "medium"
                                      ? "bg-orange-100 text-orange-800 text-xs"
                                      : "bg-green-100 text-green-800 text-xs"
                                  }
                                >
                                  {keyword.risk}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-nexus-text text-sm">
                              {keyword.mentions}
                            </div>
                            <div className="text-xs text-green-500">
                              {keyword.spike}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
