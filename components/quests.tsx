"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Clock, Award, Gift, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEcoStore } from "@/lib/store"
import { cn } from "@/lib/utils"

// Add an empty state component
const EmptyState = () => (
  <div className="text-center py-8">
    <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
    <p className="text-muted-foreground mb-2">No quests available yet.</p>
    <p className="text-sm text-muted-foreground">Check back soon for new eco-quests!</p>
  </div>
)

export function Quests() {
  const { quests } = useEcoStore()
  const [filter, setFilter] = useState<"active" | "completed">("active")
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null)

  const filteredQuests = quests.filter((quest) => {
    if (filter === "active") return !quest.completed
    if (filter === "completed") return quest.completed
    return true
  })

  const selectedQuestData = selectedQuest ? quests.find((q) => q.id === selectedQuest) : null

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return "No deadline"

    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Expired"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays < 7) return `${diffDays} days left`

    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Quests
          </CardTitle>
          <CardDescription>Complete quests to earn rewards and badges</CardDescription>
          <Tabs
            defaultValue="active"
            className="w-full"
            onValueChange={(value) => setFilter(value as "active" | "completed")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {filteredQuests.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredQuests.map((quest) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={cn(
                        "overflow-hidden transition-all hover:shadow-md cursor-pointer",
                        quest.completed ? "border-green-200 dark:border-green-800" : "",
                      )}
                      onClick={() => setSelectedQuest(quest.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{quest.title}</h3>
                              {quest.completed && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                                  Completed
                                </Badge>
                              )}
                              {!quest.completed && quest.deadline && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    formatDeadline(quest.deadline) === "Expired"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                                      : formatDeadline(quest.deadline) === "Today" ||
                                          formatDeadline(quest.deadline) === "Tomorrow"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
                                  )}
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDeadline(quest.deadline)}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{quest.description}</p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <Gift className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{quest.reward.points} points</span>
                              {quest.reward.badge && (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                                >
                                  +Badge
                                </Badge>
                              )}
                            </div>
                            <div className="w-full md:w-40">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{quest.progress}%</span>
                              </div>
                              <Progress value={quest.progress} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuest} onOpenChange={(open) => !open && setSelectedQuest(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedQuestData && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedQuestData.title}</DialogTitle>
                <DialogDescription>{selectedQuestData.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Quest Steps</h4>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      {selectedQuestData.steps.map((step, index) => (
                        <div key={step.id} className="flex items-start gap-3">
                          <Checkbox
                            id={step.id}
                            checked={step.completed}
                            disabled={selectedQuestData.completed}
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <label
                              htmlFor={step.id}
                              className={cn(
                                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                step.completed && "line-through text-muted-foreground",
                              )}
                            >
                              Step {index + 1}
                            </label>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Rewards</h4>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">{selectedQuestData.reward.points} points</p>
                      {selectedQuestData.reward.badge && (
                        <p className="text-sm text-muted-foreground">Badge: {selectedQuestData.reward.badge.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedQuestData.deadline && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Deadline</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        formatDeadline(selectedQuestData.deadline) === "Expired"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                          : formatDeadline(selectedQuestData.deadline) === "Today" ||
                              formatDeadline(selectedQuestData.deadline) === "Tomorrow"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
                      )}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDeadline(selectedQuestData.deadline)}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                {selectedQuestData.completed ? (
                  <Button variant="outline" className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Completed
                  </Button>
                ) : (
                  <Button disabled={selectedQuestData.steps.some((step) => !step.completed)}>Claim Reward</Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

