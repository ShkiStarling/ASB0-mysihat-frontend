import { useTheme } from "@/hooks/useTheme";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for the chart
const mockHealthData = {
  trendData: [
    { date: "Jan 15", mentions: 1200, outbreakRisk: 15 },
    { date: "Jan 22", mentions: 1850, outbreakRisk: 22 },
    { date: "Jan 29", mentions: 2400, outbreakRisk: 28 },
    { date: "Feb 05", mentions: 3200, outbreakRisk: 35 },
    { date: "Feb 12", mentions: 2800, outbreakRisk: 42 },
    { date: "Feb 19", mentions: 4100, outbreakRisk: 48 },
    { date: "Feb 26", mentions: 2847, outbreakRisk: 55 },
    { date: "Mar 05", mentions: 4800, outbreakRisk: 52 },
    { date: "Mar 12", mentions: 3600, outbreakRisk: 38 },
    { date: "Mar 19", mentions: 2900, outbreakRisk: 31 },
    { date: "Mar 26", mentions: 2200, outbreakRisk: 25 },
    { date: "Apr 02", mentions: 1800, outbreakRisk: 19 },
  ],
};

const OutbreakRiskChart = () => {
  const { theme, mounted } = useTheme();
  const isDarkMode = theme === "dark";

  console.log(
    "OutbreakRiskChart render - isDarkMode:",
    isDarkMode,
    "theme:",
    theme
  );

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`border rounded-lg p-3 shadow-lg bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-slate-100`}
        >
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-cyan-400">
              <span className="w-3 h-3 bg-cyan-400 rounded-full"></span>
              Mentions: {payload[0]?.value?.toLocaleString()}
            </p>
            <p className="flex items-center gap-2 text-orange-400">
              <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
              Risk Score: {payload[1]?.value}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chart Card */}
      <div className="border rounded-xl p-6 shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        {/* Header */}
        <div className="mb-6">
          <div className="text-xl font-bold flex items-center gap-3 mb-2 text-gray-900 dark:text-slate-100">
            <div className="p-2">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            Outbreak Risk Trend Analysis
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Real-time monitoring of health mentions and outbreak risk
            correlation
          </p>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              key={theme} // Force re-render on theme change
              data={mockHealthData.trendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                {/* Mentions gradient */}
                <linearGradient
                  id="mentionsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>

                {/* Risk gradient */}
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 12,
                  fill: isDarkMode ? "#64748b" : "#9ca3af",
                  fontWeight: 500,
                }}
                tickLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }}
                axisLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }}
                tickMargin={8}
              />

              <YAxis
                yAxisId="mentions"
                orientation="left"
                tick={{
                  fontSize: 12,
                  fill: isDarkMode ? "#64748b" : "#9ca3af",
                  fontWeight: 500,
                }}
                tickLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }}
                axisLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              />

              <YAxis
                yAxisId="risk"
                orientation="right"
                tick={{
                  fontSize: 12,
                  fill: isDarkMode ? "#64748b" : "#9ca3af",
                  fontWeight: 500,
                }}
                tickLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }}
                axisLine={{ stroke: isDarkMode ? "#374151" : "#e5e7eb" }}
                tickFormatter={(value) => `${value}%`}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                yAxisId="mentions"
                type="monotone"
                dataKey="mentions"
                stroke="#06b6d4"
                strokeWidth={3}
                fill="url(#mentionsGradient)"
                dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "#06b6d4",
                  strokeWidth: 2,
                  fill: "#06b6d4",
                }}
              />

              <Area
                yAxisId="risk"
                type="monotone"
                dataKey="outbreakRisk"
                stroke="#f97316"
                strokeWidth={3}
                fill="url(#riskGradient)"
                dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "#f97316",
                  strokeWidth: 2,
                  fill: "#f97316",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-8 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-cyan-500/40 to-cyan-500/10 border-t-2 border-cyan-500 rounded-sm"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
              Health Mentions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-orange-500/40 to-orange-500/10 border-t-2 border-orange-500 rounded-sm"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
              Outbreak Risk %
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="text-center text-gray-900 dark:text-slate-100">
            <div className="text-2xl font-bold text-cyan-400">5.2k</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">
              Peak Mentions
            </div>
          </div>
          <div className="text-center text-gray-900 dark:text-slate-100">
            <div className="text-2xl font-bold text-orange-400">55%</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">
              Max Risk Score
            </div>
          </div>
          <div className="text-center text-gray-900 dark:text-slate-100">
            <div className="text-2xl font-bold text-green-400">↓31%</div>
            <div className="text-sm text-gray-600 dark:text-slate-400">
              Risk Reduction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutbreakRiskChart;
