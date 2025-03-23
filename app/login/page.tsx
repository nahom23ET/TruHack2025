import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"
import { EcoIllustration } from "@/components/eco-illustrations"
import { AnimatedBackground } from "@/components/animated-background"

export const metadata: Metadata = {
  title: "Login - EcoHabit",
  description: "Login to your EcoHabit account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 p-4 relative overflow-hidden">
      <AnimatedBackground variant="leaves" intensity="medium" className="opacity-50" />

      <div className="absolute top-10 left-10 opacity-70 hidden md:block">
        <EcoIllustration type="tree" size="lg" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-70 hidden md:block">
        <EcoIllustration type="plant" size="lg" />
      </div>

      <LoginForm />
    </div>
  )
}

