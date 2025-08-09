"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Plus, Edit, Trash2, ArrowLeft, Bell, Settings } from "lucide-react"
import Link from "next/link"

// Mock alert data
const mockAlertData = {
  activeAlerts: [
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
  ],
  keywordSuggestions: [
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
  ],
  locationSuggestions: [
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
  ],
}

export default function AlertsPage() {
  const [newKeyword, setNewKeyword] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [newThreshold, setNewThreshold] = useState("")
  const [newPriority, setNewPriority] = useState("medium")
  const [editingAlert, setEditingAlert] = useState<number | null>(null)

  const handleAddAlert = () => {
    if (newKeyword && newThreshold) {
      console.log("Adding new alert:", {
        keyword: newKeyword + (newLocation ? ` + ${newLocation}` : ""),
        threshold: Number.parseInt(newThreshold),
        priority: newPriority,
      })
      // Reset form
      setNewKeyword("")
      setNewLocation("")
      setNewThreshold("")
      setNewPriority("medium")
    }
  }

  const handleDeleteAlert = (alertId: number) => {
    console.log("Deleting alert:", alertId)
  }

  const handleToggleAlert = (alertId: number) => {
    console.log("Toggling alert:", alertId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "triggered":
        return "destructive"
      case "monitoring":
        return "default"
      case "normal":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Keyword Alert Management</h1>
                  <p className="text-sm text-gray-600">Configure and manage health keyword alerts</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {mockAlertData.activeAlerts.filter((a) => a.enabled).length} Active Alerts
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{mockAlertData.activeAlerts.length}</div>
              <p className="text-xs text-gray-500">Configured keywords</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Currently Triggered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {mockAlertData.activeAlerts.filter((a) => a.status === "triggered").length}
              </div>
              <p className="text-xs text-gray-500">Requiring attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {mockAlertData.activeAlerts.filter((a) => a.status === "monitoring").length}
              </div>
              <p className="text-xs text-gray-500">Below threshold</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Disabled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {mockAlertData.activeAlerts.filter((a) => !a.enabled).length}
              </div>
              <p className="text-xs text-gray-500">Inactive alerts</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add New Alert */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Health Keywords (Malay/English)</label>
                    <Input
                      placeholder="e.g., demam denggi, fever"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      className="mt-1"
                    />
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Suggestions:</p>
                      <div className="flex flex-wrap gap-1">
                        {mockAlertData.keywordSuggestions.slice(0, 6).map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setNewKeyword(suggestion)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Location (Optional)</label>
                    <Select value={newLocation} onValueChange={setNewLocation}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allMalaysia">All Malaysia</SelectItem>
                        {mockAlertData.locationSuggestions.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Alert Threshold</label>
                    <Input
                      type="number"
                      placeholder="e.g., 50 mentions"
                      value={newThreshold}
                      onChange={(e) => setNewThreshold(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority Level</label>
                    <Select value={newPriority} onValueChange={setNewPriority}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleAddAlert} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Alert
                  </Button>
                </div>

                {/* AI Translation Note */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Settings className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">AI Translation</p>
                      <p className="text-xs text-blue-700">
                        System automatically translates and matches local slang (e.g., "demam campak" → "measles fever")
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Alerts List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Active Alert Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAlertData.activeAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                          <Badge variant={getStatusColor(alert.status)}>{alert.status}</Badge>
                          {!alert.enabled && <Badge variant="outline">Disabled</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingAlert(editingAlert === alert.id ? null : alert.id)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleAlert(alert.id)}
                            className={alert.enabled ? "text-orange-600" : "text-green-600"}
                          >
                            {alert.enabled ? "Disable" : "Enable"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h3 className="font-semibold text-lg">{alert.keyword}</h3>
                        <p className="text-sm text-gray-600">
                          {alert.district} • Threshold: {alert.threshold} mentions
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span>
                            Current: <span className="font-medium text-red-600">{alert.current}</span>
                          </span>
                          <span>
                            Threshold: <span className="font-medium">{alert.threshold}</span>
                          </span>
                          <span className="text-gray-500">Last updated: {alert.timestamp}</span>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              alert.current >= alert.threshold ? "bg-red-500" : "bg-orange-500"
                            }`}
                            style={{ width: `${Math.min(100, (alert.current / alert.threshold) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {editingAlert === alert.id && (
                        <div className="mt-4 pt-4 border-t space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-700">Threshold</label>
                              <Input type="number" defaultValue={alert.threshold} className="h-8" />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-700">Priority</label>
                              <Select defaultValue={alert.priority}>
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Save Changes
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingAlert(null)}>
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
    </div>
  )
}
