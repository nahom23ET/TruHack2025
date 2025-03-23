"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Star } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PointsDisplayProps {
  points: number
}

export function PointsDisplay({ points }: PointsDisplayProps) {
  const level = Math.floor(points / 100) + 1
  const progress = points % 100
  const progressPercent = (progress / 100) * 100
  const pointsToNext = 100 - progress

  const levelTitles = [
    "Eco Novice",
    "Eco Explorer",
    "Eco Enthusiast",
    "Eco Warrior",
    "Eco Champion",
    "Eco Master",
    "Eco Legend",
  ]
  const currentTitle = levelTitles[level - 1] || "Eco Legend"

  const stars = Math.min(level, 5)

  return (
    <Card className="eco-card-premium overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 eco-gradient-primary rounded-full opacity-20 blur-2xl"></div>
      <CardHeader className="pb-2 relative">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Level {level} – {currentTitle}
        </CardTitle>
        <CardDescription>Your eco-impact progress</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <motion.span
              className="text-3xl font-bold"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {points}
            </motion.span>
            <span className="text-sm text-muted-foreground">eco-points</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="absolute inset-y-0 left-0 eco-gradient-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-right">
              {pointsToNext} points to next level
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 400, damping: 10 }}
              >
                <Star
                  className={cn(
                    "h-6 w-6",
                    i < stars ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-700",
                  )}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
