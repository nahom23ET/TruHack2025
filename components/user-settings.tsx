"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Settings, User, Bell, Moon, Share2, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function UserSettings() {
  const { user } = useAuth()
  const [username, setUsername] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [reminderTime, setReminderTime] = useState("18:00")
  const [shareProgress, setShareProgress] = useState(true)
  const [goalPoints, setGoalPoints] = useState([500])
  const { toast } = useToast()
  const { signOut } = useAuth()

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    // Toggle dark mode class on document
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    toast({
      title: `${newDarkMode ? "Dark" : "Light"} mode enabled`,
      description: `You've switched to ${newDarkMode ? "dark" : "light"} mode.`,
    })
  }

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-500" />
          User Settings
        </CardTitle>
        <CardDescription>Customize your EcoHabit experience</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={username} />
                <AvatarFallback>{username.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="space-y-4 flex-1">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <Button onClick={saveSettings}>Save Profile</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Daily Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive daily reminders to log your eco-actions</p>
                </div>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>

              {notifications && (
                <div className="grid gap-2">
                  <Label htmlFor="reminderTime">Reminder Time</Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="challengeNotifications">Challenge Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new challenges and achievements</p>
                </div>
                <Switch id="challengeNotifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="friendActivity">Friend Activity</Label>
                  <p className="text-sm text-muted-foreground">Receive updates when friends complete actions</p>
                </div>
                <Switch id="friendActivity" defaultChecked />
              </div>

              <Button onClick={saveSettings}>Save Notification Settings</Button>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <Label htmlFor="darkMode">Dark Mode</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                </div>
                <Switch id="darkMode" checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    <Label htmlFor="shareProgress">Share Progress</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">Allow your progress to be visible on leaderboards</p>
                </div>
                <Switch id="shareProgress" checked={shareProgress} onCheckedChange={setShareProgress} />
              </div>

              <div className="space-y-2">
                <Label>Daily Point Goal</Label>
                <div className="flex items-center gap-4">
                  <Slider value={goalPoints} min={100} max={1000} step={50} onValueChange={setGoalPoints} />
                  <span className="w-12 text-center font-medium">{goalPoints}</span>
                </div>
                <p className="text-sm text-muted-foreground">Set your daily eco-points target</p>
              </div>

              <Button onClick={saveSettings}>Save Preferences</Button>

              <div className="pt-6 border-t mt-6">
                <Button variant="destructive" onClick={signOut} className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

