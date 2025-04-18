"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEcoStore } from "@/lib/store"


interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface AiTipsProps {
  actions: string[]
}

export function AiTips({ actions }: AiTipsProps) {
  const [showChatbot, setShowChatbot] = useState(false)
const [input, setInput] = useState("")
const [messages, setMessages] = useState<
  { role: "user" | "assistant"; content: string }[]
>([])
const { user } = useEcoStore()

const handleSend = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!input.trim()) return

  const userMessage: ChatMessage = { role: "user", content: input }
  setMessages((prev) => [...prev, userMessage])
  setInput("")

  try {
    const res = await fetch("https://truhackbackend.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        message: input,
      }),
    })
    

    const data = await res.json()
    const aiMessage: ChatMessage = { role: "assistant", content: data.reply }

    setMessages((prev) => [...prev, aiMessage])
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Oops! Something went wrong." },
    ])
  }
}


  const getTip = () => {
    if (actions.length === 0) {
      return "Start logging your eco-actions to get personalized tips!"
    }

    const actionCounts: Record<string, number> = {}
    actions.forEach((action) => {
      actionCounts[action] = (actionCounts[action] || 0) + 1
    })

    let mostFrequentAction = ""
    let maxCount = 0
    for (const action in actionCounts) {
      if (actionCounts[action] > maxCount) {
        maxCount = actionCounts[action]
        mostFrequentAction = action
      }
    }

    switch (mostFrequentAction) {
      case "Biked to class":
        return "Since you bike a lot, try reducing your shower time to save even more resources."
      case "Recycled plastic":
        return "Great job recycling! Consider buying products with less packaging to reduce waste further."
      case "Used reusable bottle":
        return "You're doing great with your reusable bottle! Try bringing your own utensils when eating out."
      case "Plant-based meal":
        return "Love your plant-based meals! Try growing some herbs at home to reduce your carbon footprint."
      case "Saved electricity":
        return "You're saving electricity! Consider unplugging devices when not in use to save even more."
      case "Reusable shopping bag":
        return "Great job with reusable bags! Try shopping at local farmers markets to reduce food miles."
      default:
        return "Keep up the good work! Small actions add up to big environmental impacts."
    }
  }

  const tip = getTip()

  return (
    <Card className="eco-card-premium overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 bg-amber-500/20 rounded-full blur-2xl"></div>
      <CardHeader className="pb-2 relative">
        <CardTitle className="flex items-center gap-2">
          <div className="relative">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
            </motion.div>
          </div>
          <span>AI-Powered Tip</span>
          <div className="absolute -top-1 -right-3">
          <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 z-10"
          onClick={() => setShowChatbot((prev) => !prev)}
        >
          Ask AI
        </Button>
        </div>
        </CardTitle>

        <CardDescription>Personalized suggestions for your eco-journey</CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-4">


        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800/50">
          <motion.p
            className="text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {tip}
          </motion.p>
        </div>


        <div className="mt-3 flex items-center justify-end">

          <div className="text-xs text-muted-foreground italic">Based on your recent activities



          </div>

        </div>

        {showChatbot && (
  <Card className="mt-4 border border-amber-300 dark:border-amber-700">
    <CardHeader>
      <CardTitle>Eco AI Assistant</CardTitle>
      <CardDescription>Ask questions or get eco tips!</CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "text-sm p-2 rounded-md",
              msg.role === "user" ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"
            )}
          >
            <div
  className={cn(
    "text-sm p-2 rounded-md",
    msg.role === "user" ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"
  )}
>
  <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
  <span
    dangerouslySetInnerHTML={{
      __html: msg.content.replace(/\n/g, "<br />"),
    }}
  />
</div>

          </div>
        ))}
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 border px-3 py-2 rounded-md text-sm dark:bg-black dark:text-white"
        />
        <Button type="submit" size="sm">Send</Button>
      </form>
    </CardContent>
  </Card>
)}

      </CardContent>
    </Card>
  )
}