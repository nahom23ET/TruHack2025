"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { addScore } from "@/utils/api" // or wherever you placed it

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bike, Recycle, Droplet, Utensils, LightbulbOff, ShoppingBag, Plus, Share2, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { useEcoStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useGeoLocation } from "@/hooks/use-geolocation"
import { Leaf } from "lucide-react"

interface ActionLoggerProps {
  onAction?: (action: string, points: number) => void
}

export function ActionLogger({ onAction }: ActionLoggerProps) {
  const { user, updateUser, addAction } = useEcoStore()

  const { toast } = useToast()
  const { location, isLoading: isLoadingLocation, error: locationError } = useGeoLocation()
  const [selectedAction, setSelectedAction] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<"daily" | "custom">("daily")
  const [showLocationBadge, setShowLocationBadge] = useState(false)

  const ecoActions = [
    {
      name: "Biked to class",
      icon: Bike,
      points: 10,
      category: "transportation",
      color:
        "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30",
      description: "Used a bicycle instead of a car or public transport",
      impact: "Reduces carbon emissions and promotes physical health",
      carbonSaved: 2.5,
    },
    {
      name: "Recycled plastic",
      icon: Recycle,
      points: 5,
      category: "waste",
      color:
        "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30",
      description: "Properly sorted and recycled plastic waste",
      impact: "Reduces landfill waste and conserves resources",
      wasteSaved: 0.5,
    },
    {
      name: "Used reusable bottle",
      icon: Droplet,
      points: 3,
      category: "waste",
      color:
        "bg-cyan-100 text-cyan-700 hover:bg-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:hover:bg-cyan-900/30",
      description: "Used a reusable water bottle instead of single-use plastic",
      impact: "Reduces plastic waste and saves money",
      wasteSaved: 0.2,
      waterSaved: 1.5,
    },
    {
      name: "Plant-based meal",
      icon: Utensils,
      points: 8,
      category: "food",
      color:
        "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30",
      description: "Chose a plant-based meal over animal products",
      impact: "Reduces carbon footprint and water usage",
      carbonSaved: 1.2,
      waterSaved: 2.5,
    },
    {
      name: "Saved electricity",
      icon: LightbulbOff,
      points: 4,
      category: "energy",
      color:
        "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:hover:bg-yellow-900/30",
      description: "Turned off lights and unplugged devices when not in use",
      impact: "Reduces energy consumption and carbon emissions",
      energySaved: 1.5,
      carbonSaved: 0.8,
    },
    {
      name: "Reusable shopping bag",
      icon: ShoppingBag,
      points: 3,
      category: "waste",
      color:
        "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30",
      description: "Used a reusable bag instead of plastic bags",
      impact: "Reduces plastic waste and pollution",
      wasteSaved: 0.3,
    },
  ]

  const customActions = [
    {
      name: "Composted food waste",
      icon: Recycle,
      points: 6,
      category: "waste",
      color:
        "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30",
      description: "Composted food scraps instead of throwing them away",
      impact: "Reduces methane emissions from landfills and creates nutrient-rich soil",
      wasteSaved: 1.0,
    },
    {
      name: "Used public transport",
      icon: Bike,
      points: 7,
      category: "transportation",
      color:
        "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30",
      description: "Used public transportation instead of a personal vehicle",
      impact: "Reduces carbon emissions and traffic congestion",
      carbonSaved: 1.8,
    },
    {
      name: "Picked up litter",
      icon: ShoppingBag,
      points: 8,
      category: "waste",
      color:
        "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30",
      description: "Collected and properly disposed of litter in public spaces",
      impact: "Prevents pollution and protects wildlife",
      wasteSaved: 0.8,
    },
  ]

  const handleActionClick = (action: any) => {
    setSelectedAction(action)
    setShowLocationBadge(!!location)
  }


  const confirmAction = async () => {
    if (selectedAction) {
      const actionData = {
        ...selectedAction,
        location:
          showLocationBadge && location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                name: location.name || "Unknown location",
              }
            : undefined,
      }
  
      const userId = useEcoStore.getState().user.id
  
      // 🔥 Add backend API call
      try {
        const res = await fetch("https://truhackbackend.onrender.com/add-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            points: selectedAction.points,
          }),
        })
  
        if (!res.ok) {
          throw new Error("Failed to sync score with backend")
        }
  
        const result = await res.json()
        console.log("Backend updated:", result)
      } catch (err) {
        console.error("Error updating backend:", err)
      }


    // debug 

    console.log("Payload to log-action:", {
      user_id: userId,
      name: actionData.name,
      icon: actionData.icon,
      points: actionData.points,
      category: actionData.category,
      description: actionData.description,
      impact: actionData.impact,
      carbon_saved: actionData.carbonSaved ?? 0,
      water_saved: actionData.waterSaved ?? 0,
      waste_saved: actionData.wasteSaved ?? 0,
      energy_saved: actionData.energySaved ?? 0,
      location: actionData.location ?? {},
    })

    
    // ✅ Log action to backend with real values
    try {
      const res = await fetch("https://truhackbackend.onrender.com/log-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name: actionData.name,
          points: actionData.points,
          category: actionData.category,
          description: actionData.description,
          impact: actionData.impact,
          carbon_saved: actionData.carbonSaved ?? 0,
          water_saved: actionData.waterSaved ?? 0,
          waste_saved: actionData.wasteSaved ?? 0,
          energy_saved: actionData.energySaved ?? 0,
        }),
      })
      

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Failed to log action:", errorData.detail || res.statusText)
      } else {
        const data = await res.json()
        console.log("Successfully logged action:", data)
      }
    } catch (err) {
      console.error("Error logging action:", err)
    }


      // ✅ Local store update
      addAction(actionData)
  
      if (onAction) {
        onAction(selectedAction.name, selectedAction.points)
      }
  
      toast({
        title: "Action Logged!",
        description: `+${selectedAction.points} points for ${selectedAction.name}`,
        className: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-50",
      })
  
      setSelectedAction(null)
    }
  }
  
  
  

  const shareAction = () => {
    if (selectedAction) {
      // Mock share functionality
      navigator
        .share?.({
          title: "EcoHabit Action",
          text: `I just ${selectedAction.name.toLowerCase()} and earned ${selectedAction.points} eco-points! #EcoHabit`,
        })
        .catch(() => {
          alert(
            `Shared: I just ${selectedAction.name.toLowerCase()} and earned ${selectedAction.points} eco-points! #EcoHabit`,
          )
        })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Action Logger</CardTitle>
        <CardDescription>Log your eco-friendly actions to earn points</CardDescription>
        <Tabs
          defaultValue="daily"
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "daily" | "custom")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="daily">Daily Actions</TabsTrigger>
            <TabsTrigger value="custom">Custom Actions</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {activeTab === "daily" ? (
            ecoActions.map((action) => (
              <motion.div key={action.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className={`h-auto py-4 w-full flex flex-col items-center justify-center gap-2 ${action.color}`}
                  onClick={() => handleActionClick(action)}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm text-center">{action.name}</span>
                </Button>
              </motion.div>
            ))
          ) : (
            <>
              {customActions.map((action) => (
                <motion.div key={action.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className={`h-auto py-4 w-full flex flex-col items-center justify-center gap-2 ${action.color}`}
                    onClick={() => handleActionClick(action)}
                  >
                    <action.icon className="h-6 w-6" />
                    <span className="text-sm text-center">{action.name}</span>
                  </Button>
                </motion.div>
              ))}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="h-auto py-4 w-full flex flex-col items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Plus className="h-6 w-6" />
                  <span className="text-sm text-center">Add Custom</span>
                </Button>
              </motion.div>
            </>
          )}
        </div>

        <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}>
          <DialogContent>
            {selectedAction && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <selectedAction.icon className="h-5 w-5" />
                    {selectedAction.name}
                  </DialogTitle>
                  <DialogDescription>{selectedAction.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Environmental Impact</h4>
                    <p className="text-sm text-muted-foreground">{selectedAction.impact}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Points Reward</h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      +{selectedAction.points} points
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Environmental Savings</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedAction.carbonSaved && (
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span>{selectedAction.carbonSaved} kg CO₂ saved</span>
                        </div>
                      )}
                      {selectedAction.waterSaved && (
                        <div className="flex items-center gap-2">
                          <Droplet className="h-4 w-4 text-blue-600" />
                          <span>{selectedAction.waterSaved} L water saved</span>
                        </div>
                      )}
                      {selectedAction.wasteSaved && (
                        <div className="flex items-center gap-2">
                          <Recycle className="h-4 w-4 text-amber-600" />
                          <span>{selectedAction.wasteSaved} kg waste reduced</span>
                        </div>
                      )}
                      {selectedAction.energySaved && (
                        <div className="flex items-center gap-2">
                          <LightbulbOff className="h-4 w-4 text-yellow-600" />
                          <span>{selectedAction.energySaved} kWh energy saved</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {location && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Add location to this action</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-8",
                          showLocationBadge && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
                        )}
                        onClick={() => setShowLocationBadge(!showLocationBadge)}
                      >
                        {showLocationBadge ? "Location Added" : "Add Location"}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={shareAction} className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button onClick={confirmAction}>Log Action</Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

