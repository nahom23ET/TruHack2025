"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Leaf, Mail, ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
// Remove Supabase imports
// import { resetPassword } from "@/lib/auth"

export function ForgotPasswordForm() {
  // Component state and functions remain the same, but we'll remove Supabase-specific code
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  // Modify the handleSubmit function to mock password reset
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Mock password reset instead of using Supabase
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link",
        className: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-50",
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to send reset link")
    } finally {
      setIsLoading(false)
    }
  }

  // Rest of the component remains the same...
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="eco-card-premium overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 bg-green-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 -mb-10 -ml-10 bg-blue-500/20 rounded-full blur-2xl"></div>

        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full eco-gradient-primary flex items-center justify-center shadow-lg">
              <Leaf className="h-6 w-6 text-white eco-leaf" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-6"
            >
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Email Sent</h3>
              <p className="text-center text-muted-foreground">
                We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your
                email.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full eco-button-primary" disabled={isLoading}>
                {isLoading ? (
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <span>Sending</span>
                    <span className="relative flex h-2 w-12">
                      <span className="animate-[ping_1.2s_ease-in-out_infinite] absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
                      <span className="animate-[ping_1.2s_ease-in-out_0.4s_infinite] absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75 left-4"></span>
                      <span className="animate-[ping_1.2s_ease-in-out_0.8s_infinite] absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75 left-8"></span>
                    </span>
                  </motion.div>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Reset Link <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

