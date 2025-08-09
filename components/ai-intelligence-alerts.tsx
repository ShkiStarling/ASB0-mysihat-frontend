"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Brain } from "lucide-react";
import { useEffect, useState } from "react";

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

export default function AIIntelligenceAlerts() {
  const [insights] = useState(mockHealthData?.keyMetrics?.aiInsights ?? []);
  // Track index and direction for carousel slide
  const [[index, direction], setIndex] = useState<[number, 1 | -1]>([0, 1]);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!insights?.length) return;
    const interval = setInterval(() => {
      setIndex(([prev]) => {
        const next = (prev + 1) % insights.length;
        return [next, 1]; // always slide left-to-right (next)
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [insights?.length]);

  if (!insights?.length) return null;
  const currentInsight = insights[index];

  // Carousel variants with directional slide
  const variants = shouldReduceMotion
    ? {
        enter: { opacity: 0, position: "absolute" as const },
        center: { opacity: 1, position: "relative" as const },
        exit: { opacity: 0, position: "absolute" as const },
      }
    : {
        enter: (dir: 1 | -1) => ({
          x: dir > 0 ? "100%" : "-100%",
          opacity: 0.6,
          position: "absolute" as const,
        }),
        center: {
          x: "0%",
          opacity: 1,
          position: "relative" as const,
        },
        exit: (dir: 1 | -1) => ({
          x: dir > 0 ? "-100%" : "100%",
          opacity: 0.6,
          position: "absolute" as const,
        }),
      };

  const transition = shouldReduceMotion
    ? { duration: 0.2 }
    : { type: "spring", stiffness: 380, damping: 34, mass: 0.85 };

  const formatClassNameStatus = (status: string) => {
    switch (status) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="nexus-card overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-nexus-text flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500 flex-shrink-0" />
          {"AI Intelligence Alerts"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px] relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={`${index}-${currentInsight?.title}`}
              className="nexus-card p-4 absolute inset-0 flex flex-col"
              custom={direction}
              variants={variants as any}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition as any}
            >
              <div className="flex items-start justify-between mb-2 flex-shrink-0">
                <Badge
                  className={`flex-shrink-0 ${formatClassNameStatus(
                    currentInsight.urgency
                  )}`}
                >
                  {(currentInsight.urgency || "low").toUpperCase()}
                </Badge>
                <span className="text-xs text-nexus-text-muted flex-shrink-0 ml-2">
                  {currentInsight.confidence}% confidence
                </span>
              </div>

              <h4 className="font-semibold text-nexus-text text-sm mb-2 leading-tight flex-shrink-0 line-clamp-2">
                {currentInsight.title}
              </h4>

              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-nexus-text-muted leading-relaxed line-clamp-3">
                  {currentInsight.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots indicator */}
        <div className="flex justify-center mt-3 space-x-1">
          {insights.map((_, i) => {
            const active = i === index;
            return (
              <motion.div
                key={i}
                className="h-2 rounded-full"
                initial={false}
                animate={{
                  width: active ? 12 : 8,
                  backgroundColor: active
                    ? "rgb(168 85 247)" /* purple-500 */
                    : "rgb(209 213 219)" /* gray-300 */,
                  opacity: active ? 1 : 0.8,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ width: active ? 12 : 8 }}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
