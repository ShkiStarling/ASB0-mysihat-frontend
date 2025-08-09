"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Brain,
  Activity,
  TrendingUp,
  Eye,
  Share,
  Target,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

// Mock media mentions data
const mockMediaData = {
  mentions: [
    {
      id: 1,
      date: "2024-01-15",
      dataSource: "Twitter",
      headline: "Ramai penduduk Petaling Jaya mengadu demam denggi meningkat",
      summary:
        "Beberapa penduduk melaporkan kes demam denggi yang meningkat di kawasan Petaling Jaya dengan gejala demam tinggi dan sakit kepala.",
      imageUrl: "/placeholder.svg?height=100&width=150",
      link: "https://twitter.com/user123/status/1234567890",
      mediaType: "social media",
      mediaOutlet: "Twitter",
      mediaName: "X (Twitter)",
      status: "verified",
      keywords: ["demam denggi", "Petaling Jaya"],
      engagement: 245,
    },
    {
      id: 2,
      date: "2024-01-15",
      dataSource: "Sinar Harian",
      headline: "KKM Pantau Peningkatan Kes Batuk Berdarah di Johor Bahru",
      summary:
        "Kementerian Kesihatan Malaysia memantau peningkatan kes batuk berdarah di beberapa kawasan di Johor Bahru dan menggalakkan penduduk mendapatkan rawatan segera.",
      imageUrl: "/placeholder.svg?height=100&width=150",
      link: "https://sinarharian.com.my/article/health-johor-2024",
      mediaType: "mainstream",
      mediaOutlet: "Sinar Harian",
      mediaName: "Sinar Harian",
      status: "verified",
      keywords: ["batuk berdarah", "Johor Bahru", "KKM"],
      engagement: 1234,
    },
    {
      id: 3,
      date: "2024-01-15",
      dataSource: "Facebook",
      headline: "Wabak sakit perut di George Town - Adakah ini benar?",
      summary:
        "Post viral mengenai dakwaan wabak sakit perut di George Town. Maklumat masih belum disahkan oleh pihak berkuasa kesihatan.",
      imageUrl: "/placeholder.svg?height=100&width=150",
      link: "https://facebook.com/post/456789123",
      mediaType: "social media",
      mediaOutlet: "Facebook",
      mediaName: "Facebook",
      status: "unverified",
      keywords: ["sakit perut", "George Town", "wabak"],
      engagement: 567,
    },
    {
      id: 4,
      date: "2024-01-14",
      dataSource: "The Star",
      headline: "Health Ministry Issues Advisory on Respiratory Symptoms in Sabah",
      summary:
        "The Ministry of Health has issued an advisory following reports of increased respiratory symptoms in several districts in Sabah, urging residents to seek medical attention.",
      imageUrl: "/placeholder.svg?height=100&width=150",
      link: "https://thestar.com.my/news/health-advisory-sabah-2024",
      mediaType: "mainstream",
      mediaOutlet: "The Star",
      mediaName: "The Star",
      status: "verified",
      keywords: ["respiratory symptoms", "Sabah", "health advisory"],
      engagement: 892,
    },
    {
      id: 5,
      date: "2024-01-14",
      dataSource: "Reddit",
      headline: "Anyone else experiencing skin rashes in KL area?",
      summary:
        "Reddit user reports skin rashes and asks if others in Kuala Lumpur area are experiencing similar symptoms. Multiple users confirm similar experiences.",
      imageUrl: "/placeholder.svg?height=100&width=150",
      link: "https://reddit.com/r/malaysia/comments/abc123",
      mediaType: "social media",
      mediaOutlet: "Reddit",
      mediaName: "Reddit",
      status: "unverified",
      keywords: ["skin rash", "Kuala Lumpur"],
      engagement: 156,
    },
    {
      id: 6,
      date: "2024-01-14",
      dataSource: "Berita Harian",
      headline: "Pesakit Muntah Hijau Dirawat di Hospital Kuching",
      summary:
        "Beberapa pesakit dengan gejala muntah hijau telah dirawat di Hospital Kuching. Pihak hospital sedang menjalankan siasatan lanjut.",
      imageUrl: "/placeholder.svg?height=100&width=150",
      link: "https://bharian.com.my/berita/kesihatan/kuching-hospital-2024",
      mediaType: "mainstream",
      mediaOutlet: "Berita Harian",
      mediaName: "Berita Harian",
      status: "verified",
      keywords: ["muntah hijau", "Hospital Kuching"],
      engagement: 678,
    },
  ],
  keywords: ["demam denggi", "batuk berdarah", "sakit perut", "respiratory symptoms", "skin rash", "muntah hijau"],
  stats: {
    totalMentions: 2847,
    verifiedMentions: 1698,
    unverifiedMentions: 1149,
    mainStreamMedia: 1234,
    socialMedia: 1613,
  },
}

export default function MediaMentionsPage() {
  const [selectedKeyword, setSelectedKeyword] = useState("all")
  const [selectedMediaType, setSelectedMediaType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("7days")
  const [searchTerm, setSearchTerm] = useState("")

  const currentTime = new Date()
  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const filteredMentions = mockMediaData.mentions.filter((mention) => {
    const matchesKeyword = selectedKeyword === "all" || mention.keywords.some((k) => k.includes(selectedKeyword))
    const matchesMediaType = selectedMediaType === "all" || mention.mediaType === selectedMediaType
    const matchesStatus = selectedStatus === "all" || mention.status === selectedStatus
    const matchesSearch =
      searchTerm === "" ||
      mention.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mention.summary.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesKeyword && matchesMediaType && matchesStatus && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "unverified":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "unverified":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMediaTypeBadge = (mediaType: string) => {
    switch (mediaType) {
      case "mainstream":
        return "bg-blue-100 text-blue-800"
      case "social media":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
                <Eye className="w-5 h-5 text-nexus-dark" />
              </div>
              <div>
                <span className="text-xl font-bold text-nexus-cyan">MEDIA MONITOR</span>
                <div className="text-xs text-nexus-text-muted">Advanced Media Intelligence System</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="nexus-badge-active">{filteredMentions.length} Mentions Found</Badge>
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
            <Link href="/early-warnings" className="nexus-nav-item">
              <AlertTriangle className="w-5 h-5" />
              <span>Early Warnings</span>
            </Link>
            <Link href="/keyword-manager" className="nexus-nav-item">
              <Target className="w-5 h-5" />
              <span>Keywords</span>
            </Link>
            <Link href="/media-mentions" className="nexus-nav-item nexus-nav-active">
              <Eye className="w-5 h-5" />
              <span>Media Monitor</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Eye className="w-6 h-6 text-nexus-cyan" />
              <h1 className="text-2xl font-bold text-nexus-text">Media Intelligence Monitor</h1>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">Total Mentions</CardTitle>
                <Activity className="h-4 w-4 text-nexus-cyan" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">
                  {mockMediaData.stats.totalMentions.toLocaleString()}
                </div>
                <p className="text-xs text-nexus-text-muted">All sources</p>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">Verified</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">
                  {mockMediaData.stats.verifiedMentions.toLocaleString()}
                </div>
                <p className="text-xs text-green-500">Confirmed sources</p>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">Unverified</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">
                  {mockMediaData.stats.unverifiedMentions.toLocaleString()}
                </div>
                <p className="text-xs text-orange-500">Needs verification</p>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">Mainstream Media</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">
                  {mockMediaData.stats.mainStreamMedia.toLocaleString()}
                </div>
                <p className="text-xs text-blue-500">News outlets</p>
              </CardContent>
            </Card>

            <Card className="nexus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-nexus-text-muted">Social Media</CardTitle>
                <MessageSquare className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-nexus-text">
                  {mockMediaData.stats.socialMedia.toLocaleString()}
                </div>
                <p className="text-xs text-purple-500">Social platforms</p>
              </CardContent>
            </Card>
          </div>

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
                  <label className="text-sm font-medium text-nexus-text mb-2 block">Search</label>
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
                  <label className="text-sm font-medium text-nexus-text mb-2 block">Keyword</label>
                  <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                    <SelectTrigger className="nexus-input">
                      <SelectValue placeholder="All Keywords" />
                    </SelectTrigger>
                    <SelectContent className="bg-nexus-card border-nexus-border">
                      <SelectItem value="all">All Keywords</SelectItem>
                      {mockMediaData.keywords.map((keyword) => (
                        <SelectItem key={keyword} value={keyword}>
                          {keyword}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-nexus-text mb-2 block">Media Type</label>
                  <Select value={selectedMediaType} onValueChange={setSelectedMediaType}>
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
                  <label className="text-sm font-medium text-nexus-text mb-2 block">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
                  <label className="text-sm font-medium text-nexus-text mb-2 block">Date Range</label>
                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
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
                Media Mentions ({filteredMentions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMentions.map((mention) => (
                  <div key={mention.id} className="nexus-card p-4">
                    <div className="flex items-start gap-4">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-16 rounded-lg overflow-hidden bg-nexus-border">
                          <img
                            src={mention.imageUrl || "/placeholder.svg"}
                            alt="Media mention"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusBadge(mention.status)}`}
                            >
                              {getStatusIcon(mention.status)}
                              <span className="capitalize">{mention.status}</span>
                            </span>
                            <Badge className={getMediaTypeBadge(mention.mediaType)}>{mention.mediaType}</Badge>
                            <Badge className="bg-gray-100 text-gray-800">{mention.mediaName}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-nexus-text-muted">
                            <Calendar className="w-3 h-3" />
                            {mention.date}
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-nexus-text mb-2 line-clamp-2">{mention.headline}</h3>
                        <p className="text-sm text-nexus-text-muted mb-3 line-clamp-2">{mention.summary}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-nexus-text-muted">Keywords:</span>
                            <div className="flex flex-wrap gap-1">
                              {mention.keywords.map((keyword) => (
                                <Badge key={keyword} className="text-xs bg-nexus-border text-nexus-text">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-nexus-text-muted">
                              {mention.mediaType === "social media" ? (
                                <>
                                  <Share className="w-3 h-3" />
                                  <span>{mention.engagement} interactions</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3 h-3" />
                                  <span>{mention.engagement} views</span>
                                </>
                              )}
                            </div>
                            <Link href={mention.link} target="_blank" rel="noopener noreferrer">
                              <Button className="nexus-action-btn bg-nexus-cyan text-nexus-dark hover:bg-nexus-cyan/80 px-3 py-1">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Source
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMentions.length === 0 && (
                <div className="text-center py-12">
                  <div className="nexus-card p-8 max-w-md mx-auto">
                    <Brain className="w-16 h-16 text-nexus-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-nexus-text mb-2">No mentions found</h3>
                    <p className="text-nexus-text-muted">
                      No matches found. Try adjusting your filters or search terms.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
