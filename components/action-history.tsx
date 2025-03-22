"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { History, CalendarIcon, List } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ActionRecord {
  id: number
  action: string
  points: number
  date: Date
  icon: string
}

export function ActionHistory() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<"list" | "calendar">("list")

  // Generate some mock action history data
  const generateActionHistory = (): ActionRecord[] => {
    const actions = [
      { action: "Biked to class", points: 10, icon: "🚲" },
      { action: "Recycled plastic", points: 5, icon: "♻️" },
      { action: "Used reusable bottle", points: 3, icon: "💧" },
      { action: "Plant-based meal", points: 8, icon: "🥗" },
      { action: "Saved electricity", points: 4, icon: "💡" },
      { action: "Reusable shopping bag", points: 3, icon: "🛍️" },
    ]

    const history: ActionRecord[] = []
    const today = new Date()

    // Generate actions for the past 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(today.getDate() - i)

      // Add 0-3 actions per day
      const actionsPerDay = Math.floor(Math.random() * 4)
      for (let j = 0; j < actionsPerDay; j++) {
        const randomAction = actions[Math.floor(Math.random() * actions.length)]
        history.push({
          id: history.length + 1,
          ...randomAction,
          date: new Date(date),
        })
      }
    }

    return history.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  const actionHistory = generateActionHistory()

  // Filter actions for the selected date
  const getActionsForDate = (date: Date | undefined) => {
    if (!date) return []

    return actionHistory.filter((action) => {
      const actionDate = new Date(action.date)
      return (
        actionDate.getDate() === date.getDate() &&
        actionDate.getMonth() === date.getMonth() &&
        actionDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Group actions by date for list view
  const groupActionsByDate = () => {
    const grouped: Record<string, ActionRecord[]> = {}

    actionHistory.forEach((action) => {
      const dateStr = action.date.toDateString()
      if (!grouped[dateStr]) {
        grouped[dateStr] = []
      }
      grouped[dateStr].push(action)
    })

    return Object.entries(grouped).map(([dateStr, actions]) => ({
      date: new Date(dateStr),
      actions,
    }))
  }

  // Get dates with actions for calendar highlighting
  const getDatesWithActions = () => {
    const dates = new Set<string>()

    actionHistory.forEach((action) => {
      dates.add(action.date.toDateString())
    })

    return Array.from(dates).map((dateStr) => new Date(dateStr))
  }

  const selectedDateActions = getActionsForDate(date)
  const groupedActions = groupActionsByDate()
  const datesWithActions = getDatesWithActions()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-500" />
          Action History
        </CardTitle>
        <CardDescription>Track your eco-friendly actions over time</CardDescription>
        <Tabs defaultValue="list" className="w-full" onValueChange={(value) => setView(value as "list" | "calendar")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {view === "calendar" ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  hasAction: datesWithActions,
                }}
                modifiersStyles={{
                  hasAction: {
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    fontWeight: "bold",
                  },
                }}
              />

              <div className="mt-6">
                <h3 className="font-medium mb-2">
                  {date
                    ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                    : "Select a date"}
                </h3>

                {selectedDateActions.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateActions.map((action) => (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{action.icon}</span>
                          <span>{action.action}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        >
                          +{action.points} pts
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No actions recorded for this date.</p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {groupedActions.map((group, index) => (
                <div key={group.date.toISOString()} className="space-y-2">
                  <h3 className="font-medium sticky top-0 bg-card z-10 py-1">
                    {group.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </h3>

                  {group.actions.map((action, actionIndex) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: actionIndex * 0.05 }}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{action.icon}</span>
                        <span>{action.action}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {action.date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        >
                          +{action.points} pts
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

