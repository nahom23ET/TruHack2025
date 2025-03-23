"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import {
  Home,
  BarChart3,
  Trophy,
  History,
  Settings,
  Menu,
  Leaf,
  Users,
  Award,
  MapPin,
  Globe,
  LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEcoStore } from "@/lib/store"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user: storeUser, notifications } = useEcoStore()
  const { user: authUser, signOut } = useAuth()

  // Get username from auth context
  const username = authUser?.name || storeUser.name

  const unreadNotifications = notifications.filter((n) => !n.read).length

  const routes = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      name: "Progress",
      href: "/progress",
      icon: BarChart3,
    },
    {
      name: "Challenges",
      href: "/challenges",
      icon: Trophy,
    },
    {
      name: "Quests",
      href: "/quests",
      icon: MapPin,
    },
    {
      name: "Achievements",
      href: "/achievements",
      icon: Award,
    },
    {
      name: "History",
      href: "/history",
      icon: History,
    },
    {
      name: "Community",
      href: "/community",
      icon: Users,
    },
    {
      name: "Impact",
      href: "/impact",
      icon: Globe,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  // Calculate level progress
  const levelProgress = ((storeUser.points % 100) / 100) * 100

  const SidebarContent = (
    <div className={cn("pb-12 h-full flex flex-col", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold tracking-tight">EcoHabit</h2>
          </div>

          <div className="mb-6 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarImage src={storeUser.avatar} alt={username} />
                <AvatarFallback>{username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{username}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Level {storeUser.level}</span>
                  <span>•</span>
                  <span>{storeUser.points} points</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Level {storeUser.level}</span>
                <span>Level {storeUser.level + 1}</span>
              </div>
              <Progress value={levelProgress} className="h-1.5" />
            </div>
          </div>

          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === route.href
                    ? "bg-green-100 text-green-900 hover:bg-green-200 hover:text-green-900 dark:bg-green-900/20 dark:text-green-50 dark:hover:bg-green-900/30"
                    : "",
                )}
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={route.href} className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.name}
                  </div>
                  {route.name === "Dashboard" && unreadNotifications > 0 && (
                    <Badge className="ml-auto bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <Separator className="mb-4" />
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <ScrollArea className="h-full">{SidebarContent}</ScrollArea>
        </SheetContent>
      </Sheet>
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <ScrollArea className="flex flex-col h-full bg-white dark:bg-gray-950 border-r">{SidebarContent}</ScrollArea>
      </aside>
    </>
  )
}

