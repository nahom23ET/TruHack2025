"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Target, Trophy, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEcoStore } from "@/lib/store"

export function DailyGoals() {
  const { user, actions } = useEcoStore()
  const [expanded, setExpanded] = useState(false)

  // Calculate today's actions
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayActions = actions.filter((action) => {
    const actionDate = new Date(action.timestamp)
    actionDate.setHours(0, 0, 0, 0)
    return actionDate.getTime() === today.getTime()
  })

  // Daily goals
  const goals = [
    {
      id: "goal-1",
      title: "Log 3 eco-actions",
      description: "Record at least 3 eco-friendly actions today",
      target: 3,
      current: todayActions.length,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: "goal-2",
      title: "Earn 20 points",
      description: "Collect 20 eco-points through your actions",
      target: 20,
      current: todayActions.reduce((sum, action) => sum + action.points, 0),
      icon: Trophy,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      id: "goal-3",
      title: "Try a new category",
      description: "Log an action from a category you haven't tried before",
      target: 1,
      current: new Set(todayActions.map((a) => a.category)).size > 0 ? 1 : 0,
      icon: Target,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
  ]

  // Calculate overall progress
  const totalTargets = goals.reduce((sum, goal) => sum + goal.target, 0)
  const totalCurrent = goals.reduce((sum, goal) => sum + Math.min(goal.current, goal.target), 0)
  const overallProgress = (totalCurrent / totalTargets) * 100

  return (
    <Card className="eco-card-premium eco-pattern overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Daily Goals
        </CardTitle>
        <CardDescription>Complete goals to earn bonus rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="space-y-3">
            {goals.slice(0, expanded ? goals.length : 2).map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  "p-3 rounded-lg border transition-all",
                  goal.current >= goal.target
                    ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                    : "border-gray-200 dark:border-gray-800",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-full", goal.bgColor)}>
                    <goal.icon className={cn("h-5 w-5", goal.color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{goal.title}</h4>
                      <span className="text-sm font-medium">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>

                    <div className="mt-2">
                      <Progress value={(goal.current / goal.target) * 100} className="h-1.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {goals.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show Less" : "Show More"}
              <ArrowRight className={cn("h-4 w-4 ml-1 transition-transform", expanded ? "rotate-90" : "")} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

