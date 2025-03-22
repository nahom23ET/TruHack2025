"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Plus, Check, Users, Clock, Award } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { useEcoStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function Challenges() {
  const { challenges, joinChallenge, updateChallengeProgress } = useEcoStore()
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)
  const { toast } = useToast()

  const handleJoinChallenge = (id: string) => {
    joinChallenge(id)

    toast({
      title: "Challenge Joined!",
      description: "You've successfully joined the challenge.",
      className: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-50",
    })
  }

  const handleUpdateProgress = (id: string, increment: boolean) => {
    const challenge = challenges.find((c) => c.id === id)
    if (!challenge) return

    const newProgress = increment
      ? Math.min(challenge.progress + 1, challenge.target)
      : Math.max(challenge.progress - 1, 0)

    updateChallengeProgress(id, newProgress)

    // Check if challenge is completed
    if (newProgress === challenge.target && challenge.progress !== challenge.target) {
      toast({
        title: "Challenge Completed! 🎉",
        description: `You've earned ${challenge.points} points!`,
        className: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-50",
      })
    }
  }

  const selectedChallengeData = selectedChallenge ? challenges.find((c) => c.id === selectedChallenge) : null

  return (
    <Card className="eco-card-premium eco-pattern overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Weekly Eco Challenges
        </CardTitle>
        <CardDescription>Complete challenges to earn bonus points</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  challenge.completed
                    ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                    : challenge.joined
                      ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10"
                      : "border-gray-200 dark:border-gray-800",
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{challenge.title}</h4>
                    {challenge.completed && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                        Completed
                      </Badge>
                    )}
                    {!challenge.completed && challenge.joined && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                        In Progress
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {challenge.progress}/{challenge.target} {challenge.unit}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedChallenge(challenge.id)}
                    >
                      <span className="sr-only">View details</span>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{challenge.participants} participants</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(challenge.endDate).toLocaleDateString()}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span>{challenge.points} points</span>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                </div>

                {challenge.joined && (
                  <div className="flex justify-end gap-2 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleUpdateProgress(challenge.id, false)}
                      disabled={challenge.progress === 0}
                    >
                      -
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleUpdateProgress(challenge.id, true)}
                      disabled={challenge.progress === challenge.target}
                    >
                      +
                    </Button>
                  </div>
                )}

                {!challenge.joined && (
                  <div className="flex justify-end pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 eco-button-primary"
                      onClick={() => handleJoinChallenge(challenge.id)}
                    >
                      Join Challenge
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <Dialog open={!!selectedChallenge} onOpenChange={(open) => !open && setSelectedChallenge(null)}>
          <DialogContent className="sm:max-w-md">
            {selectedChallengeData && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedChallengeData.title}</DialogTitle>
                  <DialogDescription>{selectedChallengeData.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Progress</span>
                    <span>
                      {selectedChallengeData.progress}/{selectedChallengeData.target} {selectedChallengeData.unit}
                    </span>
                  </div>

                  <Progress
                    value={(selectedChallengeData.progress / selectedChallengeData.target) * 100}
                    className="h-2"
                  />

                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Reward</span>
                      <span className="font-medium">{selectedChallengeData.points} points</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Status</span>
                      <span>
                        {selectedChallengeData.joined
                          ? selectedChallengeData.progress === selectedChallengeData.target
                            ? "Completed"
                            : "In Progress"
                          : "Not Started"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Tips</span>
                      <span className="text-right text-sm text-muted-foreground">
                        {selectedChallengeData.id === "challenge-1"
                          ? "Bring your own containers and bags when shopping"
                          : selectedChallengeData.id === "challenge-2"
                            ? "Set a timer for your showers"
                            : "Try new plant-based recipes"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  {!selectedChallengeData.joined ? (
                    <Button
                      onClick={() => {
                        handleJoinChallenge(selectedChallengeData.id)
                        setSelectedChallenge(null)
                      }}
                      className="eco-button-primary"
                    >
                      Join Challenge
                    </Button>
                  ) : selectedChallengeData.progress < selectedChallengeData.target ? (
                    <Button
                      onClick={() => {
                        handleUpdateProgress(selectedChallengeData.id, true)
                        setSelectedChallenge(null)
                      }}
                    >
                      Update Progress
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedChallenge(null)}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Completed
                    </Button>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

