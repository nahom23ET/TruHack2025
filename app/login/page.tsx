import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - EcoHabit",
  description: "Login to your EcoHabit account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center eco-animated-bg bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 p-4">
      <LoginForm />
    </div>
  )
}

