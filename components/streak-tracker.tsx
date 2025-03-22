"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StreakTrackerProps {
  streak: number
}

export function StreakTracker({ streak }: StreakTrackerProps) {
  const days = ["M", "T", "W", "T", "F", "S", "S"]
  const today = new Date().getDay() // 0 is Sunday, 1 is Monday, etc.
  const adjustedToday = today === 0 ? 6 : today - 1 // Adjust to make Monday index 0

  // Create an array of the last 7 days, with completed days based on streak
  const weekDays = days.map((day, index) => {
    // Days before today that are part of the streak
    const isCompleted = index <= adjustedToday && index > adjustedToday - streak
    // Today
    const isToday = index === adjustedToday

    return { day, isCompleted, isToday }
  })

  return (
    <Card className="eco-card eco-pattern overflow-hidden">
      <div className="absolute top-0 left-0 w-24 h-24 -mt-8 -ml-8 bg-orange-500/20 rounded-full blur-2xl"></div>
      <CardHeader className="pb-2 relative">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Streak Tracker
        </CardTitle>
        <CardDescription>
          {streak > 0 ? `🔥 ${streak}-day streak – Keep going!` : "Start your eco-streak today!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex justify-between">
          {weekDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-xs relative",
                  day.isToday ? "ring-2 ring-offset-2 ring-orange-500" : "",
                  day.isCompleted ? "eco-gradient-tertiary text-white shadow-md" : "bg-muted text-muted-foreground",
                )}
              >
                {day.isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.2, type: "spring", stiffness: 400, damping: 10 }}
                  >
                    ✓
                  </motion.div>
                ) : (
                  <Calendar className="h-4 w-4 opacity-50" />
                )}

                {day.isCompleted && (
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.3, type: "spring", stiffness: 400, damping: 10 }}
                  >
                    +1
                  </motion.div>
                )}
              </motion.div>
            </div>
          ))}
        </div>

        {streak >= 5 && (
          <motion.div
            className="mt-4 p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-sm text-center text-orange-800 dark:text-orange-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="font-medium">Streak Bonus!</span> You've earned a 10% point boost on all actions!
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

