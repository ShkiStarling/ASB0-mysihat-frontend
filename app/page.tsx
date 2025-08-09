"use client";

import MySihatDashboard from "@/components/dahsboard";
import dynamic from "next/dynamic";

const EnhancedMalaysiaMap = dynamic(
  () => import("@/components/enhanced-malaysia-map"),
  { ssr: false }
);

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

export default function Page() {
  return <MySihatDashboard />;
}
