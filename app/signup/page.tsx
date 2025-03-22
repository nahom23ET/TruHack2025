import { SignupForm } from "@/components/auth/signup-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up - EcoHabit",
  description: "Create your EcoHabit account",
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center eco-animated-bg bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 p-4">
      <SignupForm />
    </div>
  )
}

