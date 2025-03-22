import { Suspense } from "react"
import { VerifyForm } from "@/components/auth/verify-form"
import type { Metadata } from "next"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Verify Account - EcoHabit",
  description: "Verify your EcoHabit account",
}

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center eco-animated-bg bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 p-4">
      <Suspense fallback={<VerifyFormSkeleton />}>
        <VerifyForm />
      </Suspense>
    </div>
  )
}

function VerifyFormSkeleton() {
  return (
    <div className="w-full max-w-md">
      <Skeleton className="h-[500px] w-full rounded-xl" />
    </div>
  )
}

