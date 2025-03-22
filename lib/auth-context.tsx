"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, isSupabaseAvailable, getTableSchema } from "./supabase-client"
import { supabaseAdmin } from "./supabase-admin"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  usingFallback: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Local storage keys
const USER_STORAGE_KEY = "ecohabit-user"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Check for user in localStorage and Supabase on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check if Supabase is available
        const supabaseAvailable = await isSupabaseAvailable()

        if (supabaseAvailable) {
          // Use Supabase auth
          const {
            data: { session },
          } = await supabase.auth.getSession()

          if (session) {
            try {
              const { data: userData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: userData?.username || session.user.email?.split("@")[0] || "User",
              })
            } catch (error) {
              console.error("Error fetching user profile:", error)
            }
          }
        } else {
          // Fallback to localStorage
          setUsingFallback(true)
          const storedUser = localStorage.getItem(USER_STORAGE_KEY)
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        // Fallback to localStorage
        setUsingFallback(true)
        const storedUser = localStorage.getItem(USER_STORAGE_KEY)
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Set up auth state listener if Supabase is available
    let subscription: { unsubscribe: () => void } | null = null

    const setupAuthListener = async () => {
      try {
        const supabaseAvailable = await isSupabaseAvailable()

        if (supabaseAvailable) {
          const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
              try {
                const { data: userData } = await supabase
                  .from("profiles")
                  .select("*")
                  .eq("id", session.user.id)
                  .single()

                setUser({
                  id: session.user.id,
                  email: session.user.email || "",
                  name: userData?.username || session.user.email?.split("@")[0] || "User",
                })
              } catch (error) {
                console.error("Error fetching user profile:", error)
              }
            } else {
              setUser(null)
            }
          })

          subscription = data.subscription
        }
      } catch (error) {
        console.error("Error setting up auth listener:", error)
      }
    }

    setupAuthListener()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  // Sign in function with fallback
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Check if Supabase is available
      const supabaseAvailable = await isSupabaseAvailable()

      if (supabaseAvailable) {
        // Use Supabase auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Fetch user profile data
        if (data.user) {
          try {
            const { data: userData } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

            const userObj = {
              id: data.user.id,
              email: data.user.email || "",
              name: userData?.username || data.user.email?.split("@")[0] || "User",
            }

            setUser(userObj)

            // Also store in localStorage as fallback
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj))
          } catch (profileError) {
            console.error("Error fetching user profile:", profileError)
          }
        }
      } else {
        // Fallback to localStorage
        setUsingFallback(true)

        // For demo purposes, just check if email contains "test" and password is "password"
        if (email.includes("test") && password === "password") {
          const userObj = {
            id: "local-" + Date.now(),
            email,
            name: email.split("@")[0],
          }

          setUser(userObj)
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj))
        } else {
          throw new Error("Invalid credentials")
        }
      }

      toast({
        title: "Login successful",
        description: "Welcome back to EcoHabit!",
        className: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-50",
      })

      router.push("/")
    } catch (error: any) {
      console.error("Error signing in:", error)
      toast({
        title: "Login failed",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign up function with fallback
  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true)
    try {
      // Check if Supabase is available
      const supabaseAvailable = await isSupabaseAvailable()

      if (supabaseAvailable) {
        // Use Supabase auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          try {
            // Get the schema of the profiles table to ensure we're using the right columns
            const profileColumns = await getTableSchema("profiles")
            console.log("Profile table columns:", profileColumns)

            // Create a profile object based on available columns
            const profileData: Record<string, any> = {
              id: data.user.id,
            }

            // Only add fields that exist in the schema
            if (profileColumns.includes("username")) profileData.username = username
            if (profileColumns.includes("email")) profileData.email = email
            if (profileColumns.includes("level")) profileData.level = 1
            if (profileColumns.includes("points")) profileData.points = 0
            if (profileColumns.includes("streak")) profileData.streak = 0

            // Add settings if the column exists
            if (profileColumns.includes("settings")) {
              profileData.settings = {
                notifications: true,
                darkMode: false,
                reminderTime: "18:00",
                shareProgress: true,
                goalPoints: 500,
                language: "en",
                units: "metric",
              }
            }

            console.log("Inserting profile data:", profileData)

            // Use the admin client to bypass RLS policies
            const { error: profileError } = await supabaseAdmin.from("profiles").insert([profileData])

            if (profileError) {
              console.error("Profile insertion error:", profileError)
              throw new Error(`Error creating user profile: ${profileError.message}`)
            }

            // Set user immediately
            const userObj = {
              id: data.user.id,
              email: data.user.email || "",
              name: username,
            }

            setUser(userObj)

            // Also store in localStorage as fallback
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj))
          } catch (profileError: any) {
            console.error("Error creating user profile:", profileError)
            throw new Error(`Error creating user profile: ${profileError.message}`)
          }
        }
      } else {
        // Fallback to localStorage
        setUsingFallback(true)

        const userObj = {
          id: "local-" + Date.now(),
          email,
          name: username,
        }

        setUser(userObj)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj))
      }

      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
        className: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-50",
      })

      // Redirect to dashboard
      router.push("/")
    } catch (error: any) {
      console.error("Error signing up:", error)
      toast({
        title: "Sign up failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Sign out function with fallback
  const signOut = async () => {
    setLoading(true)
    try {
      if (!usingFallback) {
        // Use Supabase auth
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      }

      // Always clear localStorage
      localStorage.removeItem(USER_STORAGE_KEY)
      setUser(null)
      router.push("/login")
    } catch (error: any) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (email: string) => {
    setLoading(true)
    try {
      // Check if Supabase is available
      const supabaseAvailable = await isSupabaseAvailable()

      if (supabaseAvailable) {
        // Use Supabase auth
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) throw error
      }

      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link",
        className: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-50",
      })
    } catch (error: any) {
      console.error("Error resetting password:", error)
      toast({
        title: "Password reset failed",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    usingFallback,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

