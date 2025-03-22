"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, X, Award, Calendar, Trophy, MessageSquare, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEcoStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface NotificationsProps {
  className?: string
}

export function Notifications({ className = "" }: NotificationsProps) {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useEcoStore()
  const [expanded, setExpanded] = useState(false)

  const dismissNotification = (id: string) => {
    markNotificationAsRead(id)
  }

  const dismissAll = () => {
    clearAllNotifications()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "challenge":
        return <Trophy className="h-5 w-5 text-amber-500" />
      case "reminder":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "achievement":
        return <Award className="h-5 w-5 text-green-500" />
      case "quest":
        return <Trophy className="h-5 w-5 text-purple-500" />
      case "social":
        return <MessageSquare className="h-5 w-5 text-pink-500" />
      case "system":
        return <Info className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "challenge":
        return "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
      case "reminder":
        return "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
      case "achievement":
        return "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
      case "quest":
        return "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800"
      case "social":
        return "bg-pink-50 dark:bg-pink-900/10 border-pink-200 dark:border-pink-800"
      case "system":
        return "bg-gray-50 dark:bg-gray-900/10 border-gray-200 dark:border-gray-800"
      default:
        return "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
    }
  }

  return (
    <Card className={cn("eco-card eco-shine overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Notifications</h3>
            {notifications.length > 0 && <span className="eco-badge eco-badge-blue">{notifications.length}</span>}
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={dismissAll} className="text-xs h-8">
                Clear all
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)} className="h-8">
              {expanded ? "Show less" : "Show all"}
            </Button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
            <p className="text-sm text-muted-foreground">No new notifications</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.slice(0, expanded ? undefined : 2).map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-start gap-3 p-3 my-2 rounded-lg border",
                  getNotificationBg(notification.type),
                )}
              >
                <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {new Date(notification.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>

                  {notification.action && (
                    <Button variant="link" size="sm" className="h-6 p-0 mt-1 text-xs" asChild>
                      <a href={notification.action.url}>{notification.action.label}</a>
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => dismissNotification(notification.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}

