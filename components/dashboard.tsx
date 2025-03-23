"use client"

import { useState, useEffect } from "react"
import { ActionLogger } from "@/components/action-logger"
import { PointsDisplay } from "@/components/points-display"
import { StreakTracker } from "@/components/streak-tracker"
import { AiTips } from "@/components/ai-tips"
import Challenges from "@/components/challenges"
import { Avatar } from "@/components/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"
import { Notifications } from "@/components/notifications"
import confetti from "canvas-confetti"
import { useEcoStore } from "@/lib/store"
import { motion } from "framer-motion"
import { Leaf, Award, TrendingUp, Zap } from "lucide-react"
import { DailyGoals } from "@/components/daily-goals"
import { EcoTips } from "@/components/eco-tips"
// Add useAuth to imports
import { useAuth } from "@/lib/auth-context"

// Update the Dashboard component to use the auth context
export function Dashboard() {
  const { user: storeUser, actions, addAction } = useEcoStore()
  const { user: authUser } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Get username from auth context
  const username = authUser?.name || storeUser.name

  const handleAction = (action: string, pointValue: number) => {
    // This is now handled by the store, but keeping for backward compatibility
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#22c55e", "#16a34a", "#15803d"],
    })
  }

  useEffect(() => {
    // Show notifications after a delay
    const timer = setTimeout(() => {
      setShowNotifications(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isMobile) {
    return (
      <div className="md:ml-64 pt-16 md:pt-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full eco-gradient-primary flex items-center justify-center">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">EcoHabit Dashboard</h1>
            <p className="text-sm text-muted-foreground">Track your eco-friendly actions</p>
          </div>
        </div>

        {showNotifications && <Notifications />}

        <Tabs defaultValue="actions">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="actions">
            <ActionLogger />
          </TabsContent>

          <TabsContent value="progress">
            <div className="space-y-4">
              <PointsDisplay points={storeUser.points} level={storeUser.level} />
              <StreakTracker streak={storeUser.streak} />
              <Avatar level={storeUser.level} />
            </div>
          </TabsContent>

          <TabsContent value="challenges">
            <Challenges />
          </TabsContent>

          <TabsContent value="tips">
            <AiTips actions={actions.map((a) => a.name)} />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="md:ml-64">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full eco-gradient-primary flex items-center justify-center shadow-lg">
            <Leaf className="h-6 w-6 text-white eco-leaf" />
          </div>
          {/* Update the welcome message to use the auth username */}
          <div>
            <h1 className="text-3xl font-bold">EcoHabit Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {username}! Continue your eco-friendly journey.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-green-100 dark:bg-green-900/30">
            <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="font-medium">Level {storeUser.level}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-medium">{storeUser.points} points</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30">
            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="font-medium">{storeUser.streak} day streak</span>
          </div>
        </div>
      </motion.div>

      {showNotifications && <Notifications className="mb-6" />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <ActionLogger />
          <DailyGoals />
          <Challenges />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <PointsDisplay points={storeUser.points} level={storeUser.level} />
          <StreakTracker streak={storeUser.streak} />
          <AiTips actions={actions.map((a) => a.name)} />
          <EcoTips />
          <Avatar level={storeUser.level} />
        </motion.div>
      </div>
    </div>
  )
}

