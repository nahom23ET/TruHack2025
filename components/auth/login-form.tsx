"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Leaf, Mail, Lock, ArrowRight, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AnimatedGradient } from "@/components/animated-gradient"
import { DecorativeShapes } from "@/components/decorative-shapes"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { signIn, usingFallback } = useAuth()

  // Reset form state when component mounts
  useEffect(() => {
    setEmail("")
    setPassword("")
    setRememberMe(false)
    setIsLoading(false)
    setError(null)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await signIn(email, password)
      // Auth context handles success toast and redirect
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      // Implement Google sign in with Supabase
      toast({
        title: "Google Sign In",
        description: "This feature is coming soon!",
        className: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-50",
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to sign in with Google")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true)
      // Implement Apple sign in with Supabase
      toast({
        title: "Apple Sign In",
        description: "This feature is coming soon!",
        className: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50",
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to sign in with Apple")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md relative"
    >
      <DecorativeShapes variant="circles" count={10} className="opacity-30" />

      <Card className="eco-card-premium overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 bg-green-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 -mb-10 -ml-10 bg-blue-500/20 rounded-full blur-2xl"></div>

        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <AnimatedGradient
              className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
              colors={["#22c55e", "#16a34a", "#15803d"]}
              interactive={true}
            >
              <Leaf className="h-6 w-6 text-white eco-leaf" />
            </AnimatedGradient>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
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
                {usingFallback && (
                  <div className="mt-2 text-xs">
                    <strong>Demo credentials:</strong> test@example.com / password
                  </div>
                )}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
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
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>
            </div>

            <Button type="submit" className="w-full eco-button-primary" disabled={isLoading}>
              {isLoading ? (
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <span>Logging in</span>
                  <span className="relative flex h-2 w-12">
                    <span className="animate-[ping_1.2s_ease-in-out_infinite] absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75"></span>
                    <span className="animate-[ping_1.2s_ease-in-out_0.4s_infinite] absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75 left-4"></span>
                    <span className="animate-[ping_1.2s_ease-in-out_0.8s_infinite] absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75 left-8"></span>
                  </span>
                </motion.div>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative flex items-center justify-center">
            <Separator className="absolute w-full" />
            <span className="relative bg-card px-2 text-xs text-muted-foreground">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
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
            <Button variant="outline" className="w-full" onClick={handleAppleSignIn}>
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
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

