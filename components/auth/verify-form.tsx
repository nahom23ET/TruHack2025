"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Leaf, ArrowRight, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
// Remove Supabase imports
// import { verifyOtp } from "@/lib/auth"
// import { supabase } from "@/lib/supabase/client"

export function VerifyForm() {
  const searchParams = useSearchParams()
  const email = searchParams?.get("email") || ""
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  // Handle input change for verification code
  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  // Handle key down for verification code
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  // Handle paste for verification code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    // Only allow numbers
    if (!/^\d+$/.test(pastedData)) return

    const pastedArray = pastedData.slice(0, 6).split("")
    const newCode = [...verificationCode]

    pastedArray.forEach((value, index) => {
      if (index < 6) {
        newCode[index] = value
      }
    })

    setVerificationCode(newCode)

    // Focus the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex((val) => !val)
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    const nextInput = document.getElementById(`code-${focusIndex}`)
    if (nextInput) {
      nextInput.focus()
    }
  }

  // Modify the handleSubmit function to mock verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const code = verificationCode.join("")

    // Validate code
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setIsLoading(true)

    try {
      // Mock verification instead of using Supabase
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, let's say "123456" is a valid code
      if (code !== "123456") {
        throw new Error("Invalid verification code")
      }

      setIsVerified(true)
      toast({
        title: "Account verified",
        description: "Your account has been successfully verified",
        className: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-50",
      })

      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 2000)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Invalid verification code")
    } finally {
      setIsLoading(false)
    }
  }

  // Modify the handleResendCode function to mock resending code
  const handleResendCode = async () => {
    setResendDisabled(true)
    setResendCountdown(60)

    try {
      // Mock resending code instead of using Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Verification code sent",
        description: `A new verification code has been sent to ${email}`,
        className: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-50",
      })
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Error",
        description: err.message || "Failed to resend verification code",
        variant: "destructive",
      })
    }
  }

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (resendCountdown === 0 && resendDisabled) {
      setResendDisabled(false)
    }
  }, [resendCountdown, resendDisabled])

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
          <CardTitle className="text-2xl font-bold">Verify your account</CardTitle>
          <CardDescription>
            {isVerified
              ? "Your account has been successfully verified"
              : `We've sent a verification code to ${email || "your email"}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isVerified ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-6"
            >
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Verification Complete</h3>
              <p className="text-center text-muted-foreground">You will be redirected to the dashboard shortly</p>
            </motion.div>
          ) : (
            <>
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your email</p>
                  </div>

                  <div className="flex justify-center gap-2">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className={cn(
                          "w-12 h-14 text-center text-lg font-medium rounded-md border focus:outline-none focus:ring-2 focus:ring-primary",
                          "transition-all duration-200",
                          digit ? "border-primary bg-primary/5" : "border-input",
                        )}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full eco-button-primary"
                  disabled={isLoading || verificationCode.join("").length !== 6}
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center gap-2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <span>Verifying</span>
                      <span className="relative flex h-2 w-12">
                        <span className="animate-[ping_1.2s_ease-in-out_infinite] absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
                        <span className="animate-[ping_1.2s_ease-in-out_0.4s_infinite] absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75 left-4"></span>
                        <span className="animate-[ping_1.2s_ease-in-out_0.8s_infinite] absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75 left-8"></span>
                      </span>
                    </motion.div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Verify Account <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Didn't receive a code?</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendCode}
                  disabled={resendDisabled}
                  className="h-8"
                >
                  {resendDisabled ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Resend in {resendCountdown}s
                    </span>
                  ) : (
                    <span>Resend Code</span>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

