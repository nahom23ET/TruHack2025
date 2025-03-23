"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Award, Lock, Share2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEcoStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Add an empty state component
const EmptyState = () => (
  <div className="text-center py-8">
    <Award className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
    <p className="text-muted-foreground mb-2">No achievements available yet.</p>
    <p className="text-sm text-muted-foreground">Start your eco-friendly journey to unlock achievements!</p>
  </div>
)

export default function Achievements() {
  const { achievements } = useEcoStore()
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all")
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null)

  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === "all") return true
    if (filter === "unlocked") return achievement.unlocked
    if (filter === "locked") return !achievement.unlocked
    return true
  })

  const categories = ["general", "waste", "transportation", "energy", "water", "food"]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "uncommon":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
      case "rare":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
      case "epic":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const selectedAchievementData = selectedAchievement ? achievements.find((a) => a.id === selectedAchievement) : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <CardDescription>Track your progress and unlock rewards</CardDescription>
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={(value) => setFilter(value as "all" | "unlocked" | "locked")}
          >
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              {categories.map((category) => {
                const categoryAchievements = filteredAchievements.filter((a) => a.category === category)
                if (categoryAchievements.length === 0) return null

                return (
                  <div key={category} className="space-y-4">
                    <h3 className="font-medium capitalize">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {categoryAchievements.map((achievement) => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="cursor-pointer"
                            onClick={() => setSelectedAchievement(achievement.id)}
                          >
                            <Card
                              className={cn(
                                "overflow-hidden transition-all hover:shadow-md",
                                achievement.unlocked ? "border-green-200 dark:border-green-800" : "opacity-75",
                              )}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-2xl">
                                    {achievement.unlocked ? (
                                      achievement.icon
                                    ) : (
                                      <Lock className="h-5 w-5 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{achievement.name}</h4>
                                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                  </div>
                                </div>
                                <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                              </div>
                              <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Progress</span>
                                  <span>
                                    {achievement.progress}/{achievement.target}
                                  </span>
                                </div>
                                <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                              </div>
                            </CardContent>
                            </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedAchievement} onOpenChange={(open) => !open && setSelectedAchievement(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedAchievementData && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">
                    {selectedAchievementData.unlocked ? selectedAchievementData.icon : "🔒"}
                  </span>
                  {selectedAchievementData.name}
                </DialogTitle>
                <DialogDescription>{selectedAchievementData.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Rarity</span>
                  <Badge className={getRarityColor(selectedAchievementData.rarity)}>
                    {selectedAchievementData.rarity}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Progress</span>
                    <span>
                      {selectedAchievementData.progress}/{selectedAchievementData.target}
                    </span>
                  </div>
                  <Progress
                    value={(selectedAchievementData.progress / selectedAchievementData.target) * 100}
                    className="h-2"
                  />
                </div>

                {selectedAchievementData.unlocked && selectedAchievementData.unlockedAt && (
                  <div className="flex justify-between">
                    <span className="font-medium">Unlocked</span>
                    <span>{new Date(selectedAchievementData.unlockedAt).toLocaleDateString()}</span>
                  </div>
                )}

                {!selectedAchievementData.unlocked && (
                  <div className="bg-muted p-3 rounded-md">
                    <h4 className="font-medium mb-1">How to unlock</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedAchievementData.category === "waste" && "Continue recycling and reducing waste."}
                      {selectedAchievementData.category === "transportation" &&
                        "Use eco-friendly transportation options."}
                      {selectedAchievementData.category === "energy" && "Reduce your energy consumption."}
                      {selectedAchievementData.category === "water" && "Conserve water in your daily activities."}
                      {selectedAchievementData.category === "food" && "Choose sustainable food options."}
                      {selectedAchievementData.category === "general" && "Continue your eco-friendly habits."}
                    </p>
                  </div>
                )}
              </div>

              {selectedAchievementData.unlocked && (
                <div className="flex justify-end">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Achievement
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

