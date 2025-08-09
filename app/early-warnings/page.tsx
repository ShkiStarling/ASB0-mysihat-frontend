"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  AlertTriangle,
  Bell,
  TrendingUp,
  MapPin,
  Clock,
  Settings,
  Zap,
  Brain,
  Target,
  Activity,
  MessageSquare,
  Eye,
  RefreshCw,
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

// Mock alert data focused on early detection
const mockAlertData = {
  activeAlerts: [
    {
      id: 1,
      type: "outbreak_risk",
      severity: "high",
      title: "Dengue Fever Outbreak Risk - Selangor",
      location: "Petaling District",
      description: "AI detected 245% spike in dengue-related mentions with geographic clustering pattern",
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
      description: "Unusual clustering of respiratory symptoms across 3 districts in 48-hour window",
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
      description: "Geographic clustering of gastrointestinal symptoms near commercial district",
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
      description: "Gradual increase in skin-related health mentions over 72 hours",
      threshold: "15%",
      current: "18%",
      timestamp: "6 hours ago",
      status: "monitoring",
      confidence: 65,
      aiGenerated: false,
    },
  ],
  thresholds: [
    { metric: "Mention Spike", current: 30, unit: "%" },
    { metric: "Geographic Clustering", current: 5, unit: "km radius" },
    { metric: "Time Window", current: 6, unit: "hours" },
    { metric: "AI Confidence", current: 75, unit: "%" },
  ],
  alertHistory: [
    { date: "Jan 1", alerts: 2, aiAlerts: 1 },
    { date: "Jan 2", alerts: 1, aiAlerts: 1 },
    { date: "Jan 3", alerts: 4, aiAlerts: 3 },
    { date: "Jan 4", alerts: 3, aiAlerts: 2 },
    { date: "Jan 5", alerts: 1, aiAlerts: 0 },
    { date: "Jan 6", alerts: 5, aiAlerts: 4 },
    { date: "Jan 7", alerts: 3, aiAlerts: 2 },
  ],
}

export default function EarlyWarningsPage() {
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [aiAlertsEnabled, setAiAlertsEnabled] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null)

  const currentTime = new Date()
  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <div className="min-h-screen bg-nexus-dark">
      {/* Header */}
      <header className="nexus-header border-b border-nexus-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src="/images/JataNegaraMOH.png"
                alt="Ministry of Health Malaysia"
                className="w-10 h-10 object-contain"
              />
              <div className="w-8 h-8 rounded-lg bg-nexus-cyan flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-nexus-dark" />
              </div>
              <div>
                <span className="text-xl font-bold text-nexus-cyan">EARLY WARNING SYSTEM</span>
                <div className="text-xs text-nexus-text-muted">AI-Powered Outbreak Detection</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-nexus-text-muted">AI Alerts</span>
              <Switch checked={aiAlertsEnabled} onCheckedChange={setAiAlertsEnabled} />
            </div>
            <Badge className="nexus-badge-live">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              {mockAlertData.activeAlerts.length} ACTIVE
            </Badge>
            <div className="text-sm text-nexus-text-muted">{timeString}</div>
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="text-nexus-text-muted hover:text-nexus-cyan">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 nexus-sidebar border-r border-nexus-border">
          <nav className="p-4 space-y-2">
            <Link href="/" className="nexus-nav-item">
              <Activity className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/social-heatmap" className="nexus-nav-item">
              <MessageSquare className="w-5 h-5" />
              <span>Social Monitor</span>
            </Link>
            <Link href="/early-warnings" className="nexus-nav-item nexus-nav-active">
              <AlertTriangle className="w-5 h-5" />
              <span>Early Warnings</span>
            </Link>
            <Link href="/keyword-manager" className="nexus-nav-item">
              <Target className="w-5 h-5" />
              <span>Keywords</span>
            </Link>
            <Link href="/media-mentions" className="nexus-nav-item">
              <Eye className="w-5 h-5" />
              <span>Media Monitor</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="w-6 h-6 text-nexus-cyan" />
              <h1 className="text-2xl font-bold text-nexus-text">Early Warning Intelligence</h1>
            </div>
          </div>

          {/* Alert Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">{mockAlertData.activeAlerts.length}</div>
                <p className="text-xs text-nexus-text-muted">
                  {mockAlertData.activeAlerts.filter((a) => a.aiGenerated).length} AI-generated
                </p>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">High Priority</CardTitle>
                <Zap className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">
                  {mockAlertData.activeAlerts.filter((a) => a.severity === "high").length}
                </div>
                <p className="text-xs text-green-500">-1 from yesterday</p>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">AI Confidence</CardTitle>
                <Brain className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">87%</div>
                <p className="text-xs text-purple-500">Average accuracy</p>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">Response Time</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">8m</div>
                <p className="text-xs text-green-500">-4m improvement</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Alerts */}
            <div className="lg:col-span-2">
              <Card className="nexus-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-nexus-text">
                    <AlertTriangle className="w-5 h-5 text-nexus-cyan" />
                    Active Early Warning Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAlertData.activeAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`nexus-card p-4 cursor-pointer transition-colors ${
                          selectedAlert === alert.id ? "border-nexus-cyan bg-nexus-cyan/5" : "hover:bg-nexus-hover"
                        }`}
                        onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
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
                            <Badge className="bg-purple-100 text-purple-800">{alert.type.replace("_", " ")}</Badge>
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

                        <h3 className="font-semibold text-nexus-text mb-1">{alert.title}</h3>
                        <div className="flex items-center gap-2 mb-2 text-sm text-nexus-text-muted">
                          <MapPin className="w-3 h-3" />
                          {alert.location}
                        </div>

                        <p className="text-sm text-nexus-text-muted mb-3">{alert.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-nexus-text-muted">
                              Threshold: <span className="font-medium text-nexus-text">{alert.threshold}</span>
                            </span>
                            <span className="text-nexus-text-muted">
                              Current: <span className="font-medium text-orange-500">{alert.current}</span>
                            </span>
                            {alert.aiGenerated && (
                              <span className="text-nexus-text-muted">
                                Confidence: <span className="font-medium text-purple-500">{alert.confidence}%</span>
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
                            <Button className="nexus-action-btn">Acknowledge</Button>
                            <Button className="nexus-action-btn">Escalate</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alert History Chart */}
              <Card className="nexus-card mt-6">
                <CardHeader>
                  <CardTitle className="text-nexus-text">Alert History (7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ChartContainer
                      config={{
                        alerts: { label: "Total Alerts", color: "#00d4ff" },
                        aiAlerts: { label: "AI Alerts", color: "#a855f7" },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockAlertData.alertHistory}>
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
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="alerts" stroke="#00d4ff" strokeWidth={2} />
                          <Line type="monotone" dataKey="aiAlerts" stroke="#a855f7" strokeWidth={2} />
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
                    {mockAlertData.thresholds.map((threshold, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-nexus-text">{threshold.metric}</span>
                          <span className="text-nexus-text-muted">{threshold.unit}</span>
                        </div>
                        <Input type="number" value={threshold.current} className="nexus-input h-8" readOnly />
                      </div>
                    ))}
                    <Button className="w-full nexus-action-btn bg-nexus-cyan text-nexus-dark hover:bg-nexus-cyan/80">
                      Update Thresholds
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
                      <span className="text-sm text-nexus-text">Pattern Detection</span>
                      <Badge className="nexus-badge-active">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-nexus-text">Outbreak Prediction</span>
                      <Badge className="nexus-badge-active">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-nexus-text">Anomaly Detection</span>
                      <Badge className="nexus-badge-active">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-nexus-text">Geographic Clustering</span>
                      <Badge className="nexus-badge-active">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="nexus-card">
                <CardHeader>
                  <CardTitle className="text-nexus-text">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/trend-analyzer">
                    <Button className="w-full nexus-action-btn justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Analyze Patterns
                    </Button>
                  </Link>
                  <Link href="/social-heatmap">
                    <Button className="w-full nexus-action-btn justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      View Heatmap
                    </Button>
                  </Link>
                  <Button className="w-full nexus-action-btn justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Test AI Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
