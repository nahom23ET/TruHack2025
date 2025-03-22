"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { BarChartIcon, LineChartIcon, PieChartIcon } from "lucide-react"
import { motion } from "framer-motion"

export function ProgressCharts() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")

  // Generate mock data for charts
  const generateChartData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const actionTypes = ["Biking", "Recycling", "Reusable Items", "Plant-based Meals", "Energy Saving"]

    let labels: string[] = []
    let datasets: any[] = []

    // Set labels based on time range
    if (timeRange === "week") {
      labels = days
    } else if (timeRange === "month") {
      labels = Array.from({ length: 30 }, (_, i) => (i + 1).toString())
    } else {
      labels = months
    }

    // Generate data for bar and line charts
    if (chartType === "bar" || chartType === "line") {
      datasets = [
        {
          label: "Points Earned",
          data: labels.map(() => Math.floor(Math.random() * 50) + 10),
          backgroundColor: "rgba(34, 197, 94, 0.7)",
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 2,
        },
      ]
    }
    // Generate data for pie chart
    else if (chartType === "pie") {
      return {
        labels: actionTypes,
        datasets: [
          {
            label: "Action Distribution",
            data: actionTypes.map(() => Math.floor(Math.random() * 100) + 20),
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
    }

    return {
      labels,
      datasets,
    }
  }

  const chartData = generateChartData()

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

          <Select defaultValue="week" onValueChange={(value) => setTimeRange(value as "week" | "month" | "year")}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[400px]">
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
                    text: `Points Earned (${timeRange === "week" ? "Past Week" : timeRange === "month" ? "Past Month" : "Past Year"})`,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Points",
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
                    text: `Points Trend (${timeRange === "week" ? "Past Week" : timeRange === "month" ? "Past Month" : "Past Year"})`,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Points",
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
                    text: "Action Distribution",
                  },
                },
              }}
            />
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}

