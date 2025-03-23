"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "@/components/sidebar"
import { useEcoStore } from "@/lib/store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toggleDarkMode } = useEcoStore()

  // Check if user is authenticated and load actions
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else {
        // User is authenticated, load actions from Supabase
        const loadActions = async () => {
          const { loadActionsFromSupabase } = useEcoStore.getState()
          await loadActionsFromSupabase()
        }

        loadActions()
      }
    }
  }, [user, loading, router])

  // Apply dark mode from store
  useEffect(() => {
    const { settings } = useEcoStore.getState().user
    if (settings.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // Show loading state or redirect if not authenticated
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null // Router will handle redirect
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pt-16 md:pt-0">{children}</main>
    </div>
  )
}

