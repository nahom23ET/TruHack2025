"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { BarChartIcon, LineChartIcon, PieChartIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useEcoStore } from "@/lib/store"

// Add an empty state component
const EmptyState = () => (
  <div className="text-center py-8">
    <BarChartIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
    <p className="text-muted-foreground mb-2">No chart data available yet.</p>
    <p className="text-sm text-muted-foreground">Start logging eco-actions to see your progress charts!</p>
  </div>
)

export function ProgressCharts() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year" | "all">("month")
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")
  const { actions } = useEcoStore()

  // Generate chart data based on actions and time range
  const generateChartData = () => {
    if (actions.length === 0) {
      return {
        labels: [],
        datasets: [],
      }
    }

    const now = new Date()
    let filteredActions = [...actions]

    // Filter actions based on time range
    if (timeRange !== "all") {
      const cutoffDate = new Date()
      if (timeRange === "week") cutoffDate.setDate(now.getDate() - 7)
      if (timeRange === "month") cutoffDate.setMonth(now.getMonth() - 1)
      if (timeRange === "year") cutoffDate.setFullYear(now.getFullYear() - 1)

      filteredActions = filteredActions.filter((action) => new Date(action.timestamp) >= cutoffDate)
    }

    // Group actions by category
    const categories: Record<string, number> = {}
    filteredActions.forEach((action) => {
      categories[action.category] = (categories[action.category] || 0) + 1
    })

    // Group actions by date for line/bar charts
    const dateGroups: Record<string, number> = {}
    filteredActions.forEach((action) => {
      let dateKey
      const date = new Date(action.timestamp)

      if (timeRange === "week") {
        // Group by day of week
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        dateKey = days[date.getDay()]
      } else if (timeRange === "month") {
        // Group by day of month
        dateKey = date.getDate().toString()
      } else {
        // Group by month
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        dateKey = months[date.getMonth()]
      }

      dateGroups[dateKey] = (dateGroups[dateKey] || 0) + 1
    })

    // Sort date keys
    let sortedDateKeys: string[] = []
    if (timeRange === "week") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      sortedDateKeys = days.filter((day) => dateGroups[day])
    } else if (timeRange === "month") {
      sortedDateKeys = Object.keys(dateGroups).sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
    } else {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      sortedDateKeys = months.filter((month) => dateGroups[month])
    }

    // If no data after filtering, return empty data
    if (Object.keys(categories).length === 0 && sortedDateKeys.length === 0) {
      return {
        labels: [],
        datasets: [],
      }
    }

    // Create chart data
    if (chartType === "pie") {
      return {
        labels: Object.keys(categories),
        datasets: [
          {
            label: "Actions by Category",
            data: Object.values(categories),
            backgroundColor: [
              "rgba(34, 197, 94, 0.7)",
              "rgba(59, 130, 246, 0.7)",
              "rgba(249, 115, 22, 0.7)",
              "rgba(139, 92, 246, 0.7)",
              "rgba(236, 72, 153, 0.7)",
            ],
            borderColor: [
              "rgb(34, 197, 94)",
              "rgb(59, 130, 246)",
              "rgb(249, 115, 22)",
              "rgb(139, 92, 246)",
              "rgb(236, 72, 153)",
            ],
            borderWidth: 1,
          },
        ],
      }
    } else {
      return {
        labels: sortedDateKeys,
        datasets: [
          {
            label: "Number of Actions",
            data: sortedDateKeys.map((key) => dateGroups[key] || 0),
            backgroundColor: "rgba(34, 197, 94, 0.7)",
            borderColor: "rgb(34, 197, 94)",
            borderWidth: 2,
          },
        ],
      }
    }
  }

  const chartData = generateChartData()
  const hasData = chartData.labels.length > 0 && chartData.datasets.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChartIcon className="h-5 w-5 text-blue-500" />
          Progress Charts
        </CardTitle>
        <CardDescription>Visualize your eco-impact over time</CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Tabs
            defaultValue="bar"
            className="w-full sm:w-auto"
            onValueChange={(value) => setChartType(value as "bar" | "line" | "pie")}
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="bar" className="flex items-center gap-2">
                <BarChartIcon className="h-4 w-4" />
                Bar
              </TabsTrigger>
              <TabsTrigger value="line" className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                Line
              </TabsTrigger>
              <TabsTrigger value="pie" className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" />
                Pie
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
            defaultValue="month"
            onValueChange={(value) => setTimeRange(value as "week" | "month" | "year" | "all")}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
        {!hasData ? (
          <EmptyState />
        ) : (
          <motion.div
            key={`${chartType}-${timeRange}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {chartType === "bar" && (
              <BarChart
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top" as const,
                    },
                    title: {
                      display: true,
                      text: `Actions (${timeRange === "week" ? "Past Week" : timeRange === "month" ? "Past Month" : timeRange === "year" ? "Past Year" : "All Time"})`,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Number of Actions",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: timeRange === "week" ? "Day" : timeRange === "month" ? "Date" : "Month",
                      },
                    },
                  },
                }}
              />
            )}

            {chartType === "line" && (
              <LineChart
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top" as const,
                    },
                    title: {
                      display: true,
                      text: `Actions Trend (${timeRange === "week" ? "Past Week" : timeRange === "month" ? "Past Month" : timeRange === "year" ? "Past Year" : "All Time"})`,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Number of Actions",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: timeRange === "week" ? "Day" : timeRange === "month" ? "Date" : "Month",
                      },
                    },
                  },
                }}
              />
            )}

            {chartType === "pie" && (
              <PieChart
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right" as const,
                    },
                    title: {
                      display: true,
                      text: "Actions by Category",
                    },
                  },
                }}
              />
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

