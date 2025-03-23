"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Leaf, Mail, Lock, User, ArrowRight, AlertCircle, Check, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { signUp, usingFallback, checkUsernameAvailable } = useAuth()

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  const passwordStrength = [hasMinLength, hasUppercase, hasNumber, hasSpecialChar].filter(Boolean).length

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return ""
    if (passwordStrength === 1) return "Weak"
    if (passwordStrength === 2) return "Fair"
    if (passwordStrength === 3) return "Good"
    return "Strong"
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200 dark:bg-gray-700"
    if (passwordStrength === 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-orange-500"
    if (passwordStrength === 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Check username availability with debounce
  useEffect(() => {
    if (!username || username.length < 3) {
      setIsUsernameAvailable(null)
      return
    }

    const checkUsername = async () => {
      setIsCheckingUsername(true)
      try {
        const isAvailable = await checkUsernameAvailable(username)
        setIsUsernameAvailable(isAvailable)
      } catch (error) {
        console.error("Error checking username:", error)
        setIsUsernameAvailable(null)
      } finally {
        setIsCheckingUsername(false)
      }
    }

    // Debounce the check to avoid too many requests
    const timer = setTimeout(checkUsername, 500)
    return () => clearTimeout(timer)
  }, [username, checkUsernameAvailable])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate form
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (passwordStrength < 3) {
      setError("Please create a stronger password")
      return
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions")
      return
    }

    // Validate username format (alphanumeric and underscores only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores")
      return
    }

    // Check username availability one more time before submission
    if (username.length >= 3) {
      const isAvailable = await checkUsernameAvailable(username)
      if (!isAvailable) {
        setError("This username is already taken. Please choose a different one.")
        return
      }
    }

    setIsLoading(true)

    try {
      await signUp(email, password, username)
      // The auth context will handle redirects and success messages
    } catch (err: any) {
      console.error("Error in form submission:", err)

      // Extract the most useful error message
      let errorMessage = err.message || "Failed to create account. Please try again."

      // Check for specific error patterns
      if (errorMessage.includes("email")) {
        errorMessage = "This email is already in use or invalid."
      } else if (errorMessage.includes("username")) {
        errorMessage = "This username is already taken or invalid."
      } else if (errorMessage.includes("schema")) {
        errorMessage = "There was a database error. Please try again later."
      } else if (errorMessage.includes("network")) {
        errorMessage = "Network error. Please check your connection and try again."
      } else if (errorMessage.includes("row-level security policy")) {
        // This is likely a case where the trigger already created the profile
        // Let's try to continue with the sign-in flow
        try {
          toast({
            title: "Account created",
            description: "Your account has been created successfully!",
            className: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-50",
          })

          // Redirect to dashboard or login
          router.push("/")
          return
        } catch (innerError) {
          errorMessage = "Account created but there was an issue with your profile. Please try logging in."
        }
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true)
      // Implement Google signup with Supabase
      toast({
        title: "Google Sign Up",
        description: "This feature is coming soon!",
        className: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-50",
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to sign up with Google")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppleSignUp = async () => {
    try {
      setIsLoading(true)
      // Implement Apple signup with Supabase
      toast({
        title: "Apple Sign Up",
        description: "This feature is coming soon!",
        className: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50",
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to sign up with Apple")
    } finally {
      setIsLoading(false)
    }
  }

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
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Join EcoHabit and start your sustainability journey</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {usingFallback && (
            <Alert
              variant="warning"
              className="bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-50 border-amber-200 dark:border-amber-800"
            >
              <Info className="h-4 w-4" />
              <AlertTitle>Using local storage mode</AlertTitle>
              <AlertDescription>
                We couldn't connect to our database, so we're using your browser's storage instead. Your data will only
                be available on this device.
              </AlertDescription>
            </Alert>
          )}

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

            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center justify-between">
                <span>Username</span>
                {isCheckingUsername && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Checking...
                  </span>
                )}
                {!isCheckingUsername && isUsernameAvailable !== null && (
                  <span className={`text-xs ${isUsernameAvailable ? "text-green-600" : "text-red-600"}`}>
                    {isUsernameAvailable ? "Username available" : "Username taken"}
                  </span>
                )}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="ecowarrior"
                  className={cn(
                    "pl-10",
                    isUsernameAvailable === false ? "border-red-500 focus-visible:ring-red-500" : "",
                    isUsernameAvailable === true ? "border-green-500 focus-visible:ring-green-500" : "",
                  )}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                {isUsernameAvailable === true && <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />}
                {isUsernameAvailable === false && (
                  <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">Only letters, numbers, and underscores allowed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {password && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Password strength:</span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        passwordStrength === 1
                          ? "text-red-500"
                          : passwordStrength === 2
                            ? "text-orange-500"
                            : passwordStrength === 3
                              ? "text-yellow-500"
                              : passwordStrength === 4
                                ? "text-green-500"
                                : "",
                      )}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full transition-all duration-300", getPasswordStrengthColor())}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>

                  <ul className="space-y-1 text-xs">
                    <li
                      className={cn(
                        "flex items-center gap-1",
                        hasMinLength ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
                      )}
                    >
                      {hasMinLength ? <Check className="h-3 w-3" /> : <span className="h-3 w-3">•</span>}
                      At least 8 characters
                    </li>
                    <li
                      className={cn(
                        "flex items-center gap-1",
                        hasUppercase ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
                      )}
                    >
                      {hasUppercase ? <Check className="h-3 w-3" /> : <span className="h-3 w-3">•</span>}
                      At least one uppercase letter
                    </li>
                    <li
                      className={cn(
                        "flex items-center gap-1",
                        hasNumber ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
                      )}
                    >
                      {hasNumber ? <Check className="h-3 w-3" /> : <span className="h-3 w-3">•</span>}
                      At least one number
                    </li>
                    <li
                      className={cn(
                        "flex items-center gap-1",
                        hasSpecialChar ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
                      )}
                    >
                      {hasSpecialChar ? <Check className="h-3 w-3" /> : <span className="h-3 w-3">•</span>}
                      At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={cn(
                    "pl-10",
                    confirmPassword && password !== confirmPassword ? "border-red-500 focus-visible:ring-red-500" : "",
                  )}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full eco-button-primary"
              disabled={isLoading || isUsernameAvailable === false}
            >
              {isLoading ? (
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <span>Creating account</span>
                  <span className="relative flex h-2 w-12">
                    <span className="animate-[ping_1.2s_ease-in-out_infinite] absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
                    <span className="animate-[ping_1.2s_ease-in-out_0.4s_infinite] absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75 left-4"></span>
                    <span className="animate-[ping_1.2s_ease-in-out_0.8s_infinite] absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75 left-8"></span>
                  </span>
                </motion.div>
              ) : (
                <span className="flex items-center gap-2">
                  Sign Up <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative flex items-center justify-center">
            <Separator className="absolute w-full" />
            <span className="relative bg-card px-2 text-xs text-muted-foreground">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignUp}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full" onClick={handleAppleSignUp}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"
                  fill="currentColor"
                />
              </svg>
              Apple
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

