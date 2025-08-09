"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  TrendingUp,
  MessageSquare,
  Users,
  Clock,
  Filter,
  Activity,
  Bell,
  Settings,
  RefreshCw,
  Shield,
} from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

const SocialHeatmap = dynamic(() => import("@/components/social-heatmap"), { ssr: false })

// Mock social media data
const mockSocialData = {
  regions: [
    { name: "Kuala Lumpur", lat: 3.139, lng: 101.6869, mentions: 1245, sentiment: "negative", trending: true },
    { name: "Selangor", lat: 3.0738, lng: 101.5183, mentions: 892, sentiment: "neutral", trending: false },
    { name: "Penang", lat: 5.4164, lng: 100.3327, mentions: 567, sentiment: "negative", trending: true },
    { name: "Johor", lat: 1.4927, lng: 103.7414, mentions: 445, sentiment: "neutral", trending: false },
    { name: "Perak", lat: 4.5921, lng: 101.0901, mentions: 334, sentiment: "positive", trending: false },
    { name: "Sabah", lat: 5.9804, lng: 116.0735, mentions: 289, sentiment: "negative", trending: true },
  ],
  trendingTopics: [
    { topic: "dengue fever", mentions: 2341, change: "+23%" },
    { topic: "flu symptoms", mentions: 1876, change: "+15%" },
    { topic: "hospital wait times", mentions: 1234, change: "+45%" },
    { topic: "vaccine side effects", mentions: 987, change: "-8%" },
    { topic: "food poisoning", mentions: 756, change: "+12%" },
  ],
  timeData: [
    { hour: "00:00", mentions: 45 },
    { hour: "04:00", mentions: 23 },
    { hour: "08:00", mentions: 156 },
    { hour: "12:00", mentions: 234 },
    { hour: "16:00", mentions: 189 },
    { hour: "20:00", mentions: 267 },
  ],
}

export default function SocialHeatmapPage() {
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

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
                <MessageSquare className="w-5 h-5 text-nexus-dark" />
              </div>
              <div>
                <span className="text-xl font-bold text-nexus-cyan">SOCIAL MONITOR</span>
                <div className="text-xs text-nexus-text-muted">Ministry of Health Malaysia</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="nexus-badge-live">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              REAL-TIME
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
            <Link href="/social-heatmap" className="nexus-nav-item nexus-nav-active">
              <MessageSquare className="w-5 h-5" />
              <span>Social Monitor</span>
            </Link>
            <Link href="/early-warnings" className="nexus-nav-item">
              <Bell className="w-5 h-5" />
              <span>Early Warnings</span>
            </Link>
            <Link href="/misinformation" className="nexus-nav-item">
              <Shield className="w-5 h-5" />
              <span>Misinformation</span>
            </Link>
            <div className="nexus-nav-item">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <MessageSquare className="w-6 h-6 text-nexus-cyan" />
              <h1 className="text-2xl font-bold text-nexus-text">Social Media Intelligence Monitor</h1>
            </div>
          </div>

          {/* Controls */}
          <Card className="nexus-card mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="nexus-input w-full md:w-48">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-nexus-card border-nexus-border">
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="nexus-input w-full md:w-48">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent className="bg-nexus-card border-nexus-border">
                    <SelectItem value="1h">Last Hour</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="nexus-action-btn md:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">Total Mentions</CardTitle>
                <MessageSquare className="h-4 w-4 text-nexus-cyan" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">8,743</div>
                <p className="text-xs text-green-500">+18% from yesterday</p>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">Trending Regions</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">3</div>
                <p className="text-xs text-nexus-text-muted">KL, Penang, Sabah</p>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">Peak Activity</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">8:00 PM</div>
                <p className="text-xs text-nexus-text-muted">267 mentions/hour</p>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">Sentiment Score</CardTitle>
                <Users className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">-0.2</div>
                <p className="text-xs text-nexus-text-muted">Slightly negative</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Heatmap */}
            <div className="lg:col-span-2">
              <Card className="nexus-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-nexus-text">
                    <MapPin className="w-5 h-5 text-nexus-cyan" />
                    Health Chatter Heatmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 w-full">
                    <SocialHeatmap
                      data={mockSocialData.regions}
                      selectedRegion={selectedRegion}
                      onRegionSelect={setSelectedRegion}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4 text-sm text-nexus-text-muted">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>High Activity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>Medium Activity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Low Activity</span>
                      </div>
                    </div>
                    <span>Updated 2 minutes ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card className="nexus-card">
                <CardHeader>
                  <CardTitle className="text-nexus-text">Trending Health Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockSocialData.trendingTopics.map((topic, index) => (
                      <div key={topic.topic} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-nexus-border flex items-center justify-center text-xs font-medium text-nexus-text">
                            {index + 1}
                          </div>
                          <span className="font-medium capitalize text-nexus-text">{topic.topic}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-nexus-text">{topic.mentions.toLocaleString()}</div>
                          <div
                            className={`text-xs ${topic.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                          >
                            {topic.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Regional Activity */}
              <Card className="nexus-card">
                <CardHeader>
                  <CardTitle className="text-nexus-text">Regional Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockSocialData.regions.slice(0, 6).map((region) => (
                      <div key={region.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              region.sentiment === "negative"
                                ? "bg-red-500"
                                : region.sentiment === "neutral"
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                            }`}
                          ></div>
                          <span className="font-medium text-nexus-text">{region.name}</span>
                          {region.trending && <Badge className="text-xs nexus-badge-live">Trending</Badge>}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-nexus-text">{region.mentions}</div>
                          <div className="text-xs text-nexus-text-muted">mentions</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
