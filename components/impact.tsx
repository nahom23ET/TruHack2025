"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { BarChartIcon, LineChartIcon, PieChartIcon, Leaf, Droplet, Trash2, Zap, TreesIcon as Tree } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEcoStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Globe } from "@/components/globe"

// Add an empty state component
const EmptyState = () => (
  <div className="text-center py-8">
    <Leaf className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
    <p className="text-muted-foreground mb-2">No impact data available yet.</p>
    <p className="text-sm text-muted-foreground">Start logging eco-actions to see your environmental impact!</p>
  </div>
)

export function Impact() {
  const { impactStats, actions } = useEcoStore()
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year" | "all">("month")
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")
  const [view, setView] = useState<"charts" | "stats" | "globe">("stats")

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
  const hasImpact =
    impactStats.carbonSaved > 0 ||
    impactStats.waterSaved > 0 ||
    impactStats.wasteSaved > 0 ||
    impactStats.energySaved > 0 ||
    impactStats.treesPlanted > 0

  // Format impact stats for display
  const formatImpactStat = (value: number, unit: string) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k ${unit}`
    }
    return `${value.toFixed(1)} ${unit}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" />
            Your Environmental Impact
          </CardTitle>
          <CardDescription>See the positive difference you're making for the planet</CardDescription>
          <Tabs
            defaultValue="stats"
            className="w-full"
            onValueChange={(value) => setView(value as "charts" | "stats" | "globe")}
          >
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="stats">Impact Stats</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="globe">Global View</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {view === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {!hasImpact ? (
                  <EmptyState />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Carbon Saved</p>
                            <h3 className="text-2xl font-bold">{formatImpactStat(impactStats.carbonSaved, "kg")}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Equivalent to {(impactStats.carbonSaved / 100).toFixed(1)} trees planted
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Water Saved</p>
                            <h3 className="text-2xl font-bold">{formatImpactStat(impactStats.waterSaved, "L")}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Equivalent to {Math.round(impactStats.waterSaved / 150)} showers
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Droplet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Waste Reduced</p>
                            <h3 className="text-2xl font-bold">{formatImpactStat(impactStats.wasteSaved, "kg")}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Equivalent to {Math.round(impactStats.wasteSaved * 10)} plastic bottles
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Trash2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Energy Saved</p>
                            <h3 className="text-2xl font-bold">{formatImpactStat(impactStats.energySaved, "kWh")}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Equivalent to {Math.round(impactStats.energySaved / 5)} days of electricity
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Trees Planted</p>
                            <h3 className="text-2xl font-bold">{impactStats.treesPlanted}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Will absorb ~{(impactStats.treesPlanted * 22).toFixed(0)} kg CO₂ annually
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Tree className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {impactStats.carbonSaved > 0 && (
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <Badge className="mb-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                              Total Impact
                            </Badge>
                            <h3 className="text-xl font-bold mb-1">Making a difference</h3>
                            <p className="text-sm text-muted-foreground">Keep up the good work!</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {view === "charts" && (
              <motion.div
                key="charts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
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

                <div className="h-[400px]">
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
                </div>
              </motion.div>
            )}

            {view === "globe" && (
              <motion.div
                key="globe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="h-[400px] w-full relative">
                  <Globe />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium mb-2">Your Global Impact</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Your eco-friendly actions contribute to global sustainability efforts. Start logging actions to see
                    your impact visualized on the globe.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

