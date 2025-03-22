import { ProgressCharts } from "@/components/progress-charts"

export default function ProgressPage() {
  return (
    <div className="md:ml-64 pt-16 md:pt-0">
      <h1 className="text-3xl font-bold mb-8">Your Progress</h1>
      <ProgressCharts />
    </div>
  )
}

