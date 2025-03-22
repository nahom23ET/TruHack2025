"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowRight, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function EcoTips() {
  const [currentTip, setCurrentTip] = useState(0)

  const tips = [
    {
      title: "Save Water",
      content:
        "Turn off the tap while brushing your teeth. This simple habit can save up to 8 gallons of water per day, which adds up to 2,920 gallons per year!",
    },
    {
      title: "Reduce Food Waste",
      content:
        "Plan your meals and make a shopping list to avoid buying more than you need. Composting food scraps can reduce methane emissions from landfills.",
    },
    {
      title: "Energy Efficiency",
      content:
        "Replace traditional light bulbs with LED bulbs. They use up to 90% less energy and last up to 25 times longer than incandescent bulbs.",
    },
    {
      title: "Sustainable Transportation",
      content:
        "Consider walking, cycling, or using public transport for short trips. If you drive, maintain proper tire pressure to improve fuel efficiency.",
    },
    {
      title: "Reduce Single-Use Plastics",
      content:
        "Carry a reusable water bottle, coffee cup, and shopping bags. Single-use plastics can take hundreds of years to decompose.",
    },
  ]

  useEffect(() => {
    // Auto-rotate tips every 10 seconds
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [tips.length])

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length)
  }

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length)
  }

  return (
    <Card className="eco-card eco-shine overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Eco Tips
        </CardTitle>
        <CardDescription>Simple ways to live more sustainably</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[120px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <h3 className="font-medium text-lg mb-1">{tips[currentTip].title}</h3>
              <p className="text-sm text-muted-foreground">{tips[currentTip].content}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" size="icon" onClick={prevTip} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous tip</span>
          </Button>

          <div className="flex gap-1">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentTip ? "w-6 bg-amber-500" : "w-1.5 bg-amber-200 dark:bg-amber-800"
                }`}
              />
            ))}
          </div>

          <Button variant="outline" size="icon" onClick={nextTip} className="h-8 w-8">
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next tip</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

