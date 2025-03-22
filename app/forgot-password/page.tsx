import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forgot Password - EcoHabit",
  description: "Reset your EcoHabit password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center eco-animated-bg bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 p-4">
      <ForgotPasswordForm />
    </div>
  )
}

