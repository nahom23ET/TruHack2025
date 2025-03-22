"use client"

import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LineController,
  ArcElement,
  PieController,
} from "chart.js"
import { useMemo } from "react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LineController,
  ArcElement,
  PieController,
)

interface ChartOptions {
  responsive: boolean
  maintainAspectRatio: boolean
  plugins: {
    legend: {
      position: "top" | "bottom" | "left" | "right"
    }
    title: {
      display: boolean
      text: string
    }
  }
  scales: {
    y: {
      beginAtZero: boolean
      title: {
        display: boolean
        text: string
      }
    }
    x: {
      title: {
        display: boolean
        text: string
      }
    }
  }
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string | string[]
    borderColor: string | string[]
    borderWidth: number
  }[]
}

interface BarChartProps {
  data: ChartData
  options: ChartOptions
}

interface LineChartProps {
  data: ChartData
  options: ChartOptions
}

interface PieChartProps {
  data: ChartData
  options: ChartOptions
}

export function BarChart({ data, options }: BarChartProps) {
  const chartData = useMemo(() => data, [data])
  const chartOptions = useMemo(() => options, [options])

  return <Bar data={chartData} options={chartOptions} />
}

export function LineChart({ data, options }: LineChartProps) {
  const chartData = useMemo(() => data, [data])
  const chartOptions = useMemo(() => options, [options])

  return <Line data={chartData} options={chartOptions} />
}

export function PieChart({ data, options }: PieChartProps) {
  const chartData = useMemo(() => data, [data])
  const chartOptions = useMemo(() => options, [options])

  return <Pie data={chartData} options={chartOptions} />
}

