"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal } from "lucide-react"
import { motion } from "framer-motion"

interface LeaderboardUser {
  id: number
  name: string
  avatar: string
  points: number
  level: number
  rank: number
  isCurrentUser: boolean
  badge?: string
}

export function Leaderboard() {
  const [leaderboardType, setLeaderboardType] = useState<"global" | "friends">("global")

  const globalUsers: LeaderboardUser[] = [
    {
      id: 1,
      name: "EcoWarrior",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 1250,
      level: 5,
      rank: 1,
      isCurrentUser: false,
      badge: "Top Contributor",
    },
    {
      id: 2,
      name: "GreenThumb",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 980,
      level: 4,
      rank: 2,
      isCurrentUser: false,
    },
    {
      id: 3,
      name: "EarthSaver",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 920,
      level: 4,
      rank: 3,
      isCurrentUser: false,
    },
    {
      id: 4,
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 850,
      level: 3,
      rank: 4,
      isCurrentUser: true,
    },
    {
      id: 5,
      name: "RecycleKing",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 780,
      level: 3,
      rank: 5,
      isCurrentUser: false,
    },
    {
      id: 6,
      name: "BikeCommuter",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 720,
      level: 3,
      rank: 6,
      isCurrentUser: false,
    },
    {
      id: 7,
      name: "ZeroWaster",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 650,
      level: 3,
      rank: 7,
      isCurrentUser: false,
    },
    {
      id: 8,
      name: "PlantPower",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 600,
      level: 2,
      rank: 8,
      isCurrentUser: false,
    },
    {
      id: 9,
      name: "SolarFan",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 550,
      level: 2,
      rank: 9,
      isCurrentUser: false,
    },
    {
      id: 10,
      name: "WaterSaver",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 500,
      level: 2,
      rank: 10,
      isCurrentUser: false,
    },
  ]

  const friendUsers: LeaderboardUser[] = [
    {
      id: 1,
      name: "Alex",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 920,
      level: 4,
      rank: 1,
      isCurrentUser: false,
    },
    {
      id: 2,
      name: "Jamie",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 880,
      level: 3,
      rank: 2,
      isCurrentUser: false,
    },
    {
      id: 3,
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 850,
      level: 3,
      rank: 3,
      isCurrentUser: true,
    },
    {
      id: 4,
      name: "Taylor",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 780,
      level: 3,
      rank: 4,
      isCurrentUser: false,
    },
    {
      id: 5,
      name: "Jordan",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 650,
      level: 3,
      rank: 5,
      isCurrentUser: false,
    },
  ]

  const users = leaderboardType === "global" ? globalUsers : friendUsers

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />
    return <span className="text-sm font-medium">{rank}</span>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
        <CardDescription>See how you rank against other eco-warriors</CardDescription>
        <Tabs
          defaultValue="global"
          className="w-full"
          onValueChange={(value) => setLeaderboardType(value as "global" | "friends")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.isCurrentUser
                  ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                  : "hover:bg-muted/50 transition-colors"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8">{getRankIcon(user.rank)}</div>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {user.name}
                    {user.badge && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                      >
                        {user.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Level {user.level}</div>
                </div>
              </div>
              <div className="font-bold">{user.points} pts</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

