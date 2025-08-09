import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function AlertsChart({ alertHistoryData }: any) {
  const [chartColors, setChartColors] = useState({
    alerts: "#00d4ff",
    aiAlerts: "#a855f7",
  });

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    setChartColors({
      alerts: rootStyles.getPropertyValue("--color-alerts").trim(),
      aiAlerts: rootStyles.getPropertyValue("--color-ai-alerts").trim(),
    });
  }, []);

  return (
    <ChartContainer
      config={{
        alerts: { label: "Total Alerts", color: chartColors.alerts },
        aiAlerts: { label: "AI Alerts", color: chartColors.aiAlerts },
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
            stroke={chartColors.alerts}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="aiAlerts"
            stroke={chartColors.aiAlerts}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
