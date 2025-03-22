"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvatarProps {
  level: number
}

export function Avatar({ level }: AvatarProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  // Determine avatar appearance based on level
  const getAvatarSize = () => {
    return Math.min(40 + level * 10, 100) // Grows with level, max size 100
  }

  const getAvatarColor = () => {
    const colors = [
      "bg-green-200", // Level 1
      "bg-green-300", // Level 2
      "bg-green-400", // Level 3
      "bg-green-500", // Level 4
      "bg-green-600", // Level 5+
    ]

    return colors[Math.min(level - 1, colors.length - 1)]
  }

  const handleAvatarClick = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1000)
  }

  const avatarBenefits = [
    "Unlock new avatar features at each level",
    "Level 3: Custom avatar name",
    "Level 5: Special background effects",
    "Level 7: Animated avatar elements",
    "Level 10: Unique avatar badge",
  ]

  return (
    <Card className="eco-card eco-pattern overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Your Eco Avatar</CardTitle>
        <CardDescription>Grows as you level up</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <div
              className="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
              onClick={handleAvatarClick}
            >
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-xl opacity-70"></div>

              {/* Base - represents the earth/ground */}
              <div className="absolute bottom-0 w-32 h-8 bg-gradient-to-r from-brown-100 to-brown-900/70 dark:from-brown-900 dark:to-brown-100/30 rounded-full shadow-md"></div>

              {/* Tree trunk */}
              <motion.div
                className="absolute bottom-8 w-4 bg-gradient-to-b from-amber-700 to-amber-900 dark:from-amber-800 dark:to-amber-950 rounded-full shadow-md"
                style={{ height: `${getAvatarSize() * 0.4}px` }}
                animate={isAnimating ? { scaleY: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              ></motion.div>

              {/* Tree foliage */}
              <motion.div
                className={cn(
                  "rounded-full flex items-center justify-center shadow-lg",
                  level >= 5 ? "eco-gradient-primary" : getAvatarColor(),
                )}
                style={{
                  width: `${getAvatarSize()}px`,
                  height: `${getAvatarSize()}px`,
                  marginBottom: `${getAvatarSize() * 0.2 + 32}px`,
                }}
                animate={
                  isAnimating
                    ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                {level >= 3 && (
                  <div className="text-green-900 dark:text-green-100 font-bold flex items-center gap-1">
                    <span>Lvl {level}</span>
                    {level >= 5 && <Sparkles className="h-3 w-3 text-yellow-400" />}
                  </div>
                )}
              </motion.div>

              {/* Floating particles for higher levels */}
              {level >= 4 && (
                <>
                  <motion.div
                    className="absolute w-2 h-2 rounded-full bg-green-300 dark:bg-green-400"
                    style={{
                      left: `${getAvatarSize() * 0.7}px`,
                      bottom: `${getAvatarSize() * 0.6 + 32}px`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                  <motion.div
                    className="absolute w-1.5 h-1.5 rounded-full bg-green-400 dark:bg-green-300"
                    style={{
                      right: `${getAvatarSize() * 0.6}px`,
                      bottom: `${getAvatarSize() * 0.7 + 32}px`,
                    }}
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.5, 0.9, 0.5],
                    }}
                    transition={{
                      duration: 2.5,
                      delay: 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                </>
              )}
            </div>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your Eco Avatar - Level {level}</DialogTitle>
              <DialogDescription>Your avatar grows and evolves as you earn more eco-points</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative flex items-center justify-center">
                {/* Glow effect */}
                <div className="absolute -inset-8 bg-green-500/20 rounded-full blur-xl opacity-70"></div>

                {/* Base */}
                <div className="absolute bottom-0 w-40 h-10 bg-gradient-to-r from-brown-100 to-brown-900/70 dark:from-brown-900 dark:to-brown-100/30 rounded-full shadow-md"></div>

                {/* Tree trunk */}
                <div
                  className="absolute bottom-10 w-6 bg-gradient-to-b from-amber-700 to-amber-900 dark:from-amber-800 dark:to-amber-950 rounded-full shadow-md"
                  style={{ height: `${getAvatarSize() * 0.6}px` }}
                ></div>

                {/* Tree foliage */}
                <div
                  className={cn(
                    "rounded-full flex items-center justify-center shadow-lg",
                    level >= 5 ? "eco-gradient-primary" : getAvatarColor(),
                  )}
                  style={{
                    width: `${getAvatarSize() * 1.5}px`,
                    height: `${getAvatarSize() * 1.5}px`,
                    marginBottom: `${getAvatarSize() * 0.3 + 40}px`,
                  }}
                >
                  <div className="text-green-900 dark:text-green-100 font-bold text-xl flex items-center gap-1">
                    <span>Lvl {level}</span>
                    {level >= 5 && <Sparkles className="h-4 w-4 text-yellow-400" />}
                  </div>
                </div>

                {/* Floating particles for higher levels */}
                {level >= 4 && (
                  <>
                    <motion.div
                      className="absolute w-3 h-3 rounded-full bg-green-300 dark:bg-green-400"
                      style={{
                        left: `${getAvatarSize() * 1.1}px`,
                        bottom: `${getAvatarSize() * 0.9 + 40}px`,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                    <motion.div
                      className="absolute w-2 h-2 rounded-full bg-green-400 dark:bg-green-300"
                      style={{
                        right: `${getAvatarSize() * 0.9}px`,
                        bottom: `${getAvatarSize() * 1.1 + 40}px`,
                      }}
                      animate={{
                        y: [0, -12, 0],
                        opacity: [0.5, 0.9, 0.5],
                      }}
                      transition={{
                        duration: 2.5,
                        delay: 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                  </>
                )}
              </div>

              <div className="space-y-2 w-full">
                <h4 className="font-medium">Avatar Benefits</h4>
                <ul className="space-y-1">
                  {avatarBenefits.map((benefit, index) => (
                    <li
                      key={index}
                      className={cn(
                        "text-sm p-2 rounded-md",
                        index <= level - 1
                          ? "text-foreground bg-green-100 dark:bg-green-900/30"
                          : "text-muted-foreground line-through",
                      )}
                    >
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full pt-4">
                <h4 className="font-medium mb-2">Next Level: {level + 1}</h4>
                <p className="text-sm text-muted-foreground">
                  {level * 100 - (85 % 100)} more points needed to reach Level {level + 1}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

