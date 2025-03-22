import { ActionHistory } from "@/components/action-history"

export default function HistoryPage() {
  return (
    <div className="md:ml-64 pt-16 md:pt-0">
      <h1 className="text-3xl font-bold mb-8">Action History</h1>
      <ActionHistory />
    </div>
  )
}

