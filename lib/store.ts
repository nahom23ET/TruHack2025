import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase } from "@/lib/supabase-client"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  level: number
  points: number
  streak: number
  joinedDate: string
  badges: Badge[]
  settings: UserSettings
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
}

export interface UserSettings {
  notifications: boolean
  darkMode: boolean
  reminderTime: string
  shareProgress: boolean
  goalPoints: number
  language: string
  units: "metric" | "imperial"
}

export interface EcoAction {
  id: string
  name: string
  icon: string
  points: number
  category: string
  description: string
  impact: string
  timestamp: string
  location?: {
    latitude: number
    longitude: number
    name: string
  }
  carbonSaved?: number
  waterSaved?: number
  wasteSaved?: number
}

export interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  points: number
  startDate: string
  endDate: string
  progress: number
  target: number
  unit: string
  joined: boolean
  completed: boolean
  participants: number
  tasks?: {
    id: string
    description: string
    completed: boolean
  }[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  progress: number
  target: number
  unlocked: boolean
  unlockedAt?: string
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
}

export interface Quest {
  id: string
  title: string
  description: string
  steps: {
    id: string
    description: string
    completed: boolean
  }[]
  reward: {
    points: number
    badge?: Badge
  }
  deadline?: string
  completed: boolean
  progress: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "challenge" | "reminder" | "achievement" | "quest" | "social" | "system"
  read: boolean
  timestamp: string
  action?: {
    label: string
    url: string
  }
}

export interface Friend {
  id: string
  name: string
  avatar: string
  level: number
  points: number
  streak: number
  lastActive: string
  status: "online" | "offline"
}

export interface CommunityPost {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  image?: string
  likes: number
  comments: number
  timestamp: string
  liked: boolean
}

export interface ImpactStats {
  carbonSaved: number
  waterSaved: number
  wasteSaved: number
  treesPlanted: number
  energySaved: number
}

interface EcoHabitState {
  user: User
  actions: EcoAction[]
  challenges: Challenge[]
  achievements: Achievement[]
  quests: Quest[]
  notifications: Notification[]
  friends: Friend[]
  communityPosts: CommunityPost[]
  impactStats: ImpactStats
  isInitialized: boolean
  isLoading: boolean
  error: string | null


  hydrateUserFromSupabase: () => Promise<void>

  // User actions
  updateUser: (user: Partial<User>) => void
  addAction: (action: Omit<EcoAction, "id" | "timestamp">) => void
  joinChallenge: (challengeId: string) => void
  updateChallengeProgress: (challengeId: string, progress: number) => void
  markNotificationAsRead: (notificationId: string) => void
  clearAllNotifications: () => void
  toggleDarkMode: () => void
  updateSettings: (settings: Partial<UserSettings>) => void
  likePost: (postId: string) => void
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15)

// Get current timestamp
const getCurrentTimestamp = () => new Date().toISOString()

// Calculate streak based on actions
const calculateStreak = (actions: EcoAction[]) => {
  if (actions.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const actionDates = actions.map((action) => {
    const date = new Date(action.timestamp)
    date.setHours(0, 0, 0, 0)
    return date.getTime()
  })

  // Check if there's an action today
  const hasActionToday = actionDates.includes(today.getTime())

  if (!hasActionToday) return 0

  let currentStreak = 1
  const currentDate = yesterday

  while (true) {
    const currentDateTime = currentDate.getTime()
    if (actionDates.includes(currentDateTime)) {
      currentStreak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return currentStreak
}

// Calculate level based on points
const calculateLevel = (points: number) => {
  return Math.floor(points / 100) + 1
}

// Initialize with mock data
const createInitialState = (): Omit<
  EcoHabitState,
  | "updateUser"
  | "addAction"
  | "joinChallenge"
  | "updateChallengeProgress"
  | "markNotificationAsRead"
  | "clearAllNotifications"
  | "toggleDarkMode"
  | "updateSettings"
  | "likePost"
> => {
  return {
    user: {
      id: "user-1",
      name: "EcoUser111",
      email: "user@example.com",
      avatar: "/placeholder.svg?height=96&width=96",
      level: 2,
      points: 85,
      streak: 5,
      joinedDate: "2023-01-15T12:00:00Z",
      badges: [
        {
          id: "badge-1",
          name: "Early Adopter",
          description: "Joined EcoHabit in its early days",
          icon: "🌱",
          earnedAt: "2023-01-15T12:00:00Z",
        },
        {
          id: "badge-2",
          name: "Streak Master",
          description: "Maintained a 5-day streak",
          icon: "🔥",
          earnedAt: "2023-01-20T12:00:00Z",
        },
      ],
      settings: {
        notifications: true,
        darkMode: false,
        reminderTime: "18:00",
        shareProgress: true,
        goalPoints: 500,
        language: "en",
        units: "metric",
      },
    },
    actions: [
      {
        id: "action-1",
        name: "Biked to class",
        icon: "🚲",
        points: 10,
        category: "transportation",
        description: "Used a bicycle instead of a car or public transport",
        impact: "Reduces carbon emissions and promotes physical health",
        timestamp: "2023-03-20T08:30:00Z",
        carbonSaved: 2.5,
      },
      {
        id: "action-2",
        name: "Recycled plastic",
        icon: "♻️",
        points: 5,
        category: "waste",
        description: "Properly sorted and recycled plastic waste",
        impact: "Reduces landfill waste and conserves resources",
        timestamp: "2023-03-20T12:45:00Z",
        wasteSaved: 0.5,
      },
      {
        id: "action-3",
        name: "Used reusable bottle",
        icon: "💧",
        points: 3,
        category: "waste",
        description: "Used a reusable water bottle instead of single-use plastic",
        impact: "Reduces plastic waste and saves money",
        timestamp: "2023-03-19T10:15:00Z",
        wasteSaved: 0.2,
        waterSaved: 1.5,
      },
    ],
    challenges: [
      {
        id: "challenge-1",
        title: "Zero Plastic Day",
        description: "Use zero single-use plastic for 1 day",
        category: "waste",
        difficulty: "medium",
        points: 50,
        startDate: "2023-03-15T00:00:00Z",
        endDate: "2023-03-22T23:59:59Z",
        progress: 0,
        target: 1,
        unit: "day",
        joined: false,
        completed: false,
        participants: 128,
      },
      {
        id: "challenge-2",
        title: "Water Saver",
        description: "Reduce shower time by 2 minutes for a week",
        category: "water",
        difficulty: "easy",
        points: 100,
        startDate: "2023-03-10T00:00:00Z",
        endDate: "2023-03-24T23:59:59Z",
        progress: 3,
        target: 7,
        unit: "days",
        joined: true,
        completed: false,
        participants: 85,
      },
      {
        id: "challenge-3",
        title: "Plant Power",
        description: "Eat plant-based meals for 3 days",
        category: "food",
        difficulty: "medium",
        points: 75,
        startDate: "2023-03-12T00:00:00Z",
        endDate: "2023-03-26T23:59:59Z",
        progress: 2,
        target: 3,
        unit: "meals",
        joined: true,
        completed: false,
        participants: 64,
      },
    ],
    achievements: [
      {
        id: "achievement-1",
        name: "First Steps",
        description: "Log your first eco-action",
        icon: "👣",
        category: "general",
        progress: 1,
        target: 1,
        unlocked: true,
        unlockedAt: "2023-01-15T12:30:00Z",
        rarity: "common",
      },
      {
        id: "achievement-2",
        name: "Waste Warrior",
        description: "Recycle 10 times",
        icon: "♻️",
        category: "waste",
        progress: 4,
        target: 10,
        unlocked: false,
        rarity: "uncommon",
      },
      {
        id: "achievement-3",
        name: "Cycling Champion",
        description: "Bike instead of driving 20 times",
        icon: "🚲",
        category: "transportation",
        progress: 5,
        target: 20,
        unlocked: false,
        rarity: "rare",
      },
    ],
    quests: [
      {
        id: "quest-1",
        title: "Eco Explorer",
        description: "Complete your first set of eco-friendly actions",
        steps: [
          {
            id: "step-1",
            description: "Log a transportation action",
            completed: true,
          },
          {
            id: "step-2",
            description: "Log a waste reduction action",
            completed: true,
          },
          {
            id: "step-3",
            description: "Join a challenge",
            completed: true,
          },
          {
            id: "step-4",
            description: "Maintain a 3-day streak",
            completed: false,
          },
        ],
        reward: {
          points: 50,
          badge: {
            id: "badge-3",
            name: "Eco Explorer",
            description: "Completed the Eco Explorer quest",
            icon: "🧭",
            earnedAt: "",
          },
        },
        completed: false,
        progress: 75,
      },
      {
        id: "quest-2",
        title: "Water Guardian",
        description: "Become a protector of water resources",
        steps: [
          {
            id: "step-1",
            description: "Use a reusable water bottle 5 times",
            completed: false,
          },
          {
            id: "step-2",
            description: "Complete the Water Saver challenge",
            completed: false,
          },
          {
            id: "step-3",
            description: "Save 10 liters of water",
            completed: false,
          },
        ],
        reward: {
          points: 75,
        },
        deadline: "2023-04-01T23:59:59Z",
        completed: false,
        progress: 0,
      },
    ],
    notifications: [
      {
        id: "notification-1",
        title: "New Challenge Available",
        message: "Zero Waste Week challenge is now available!",
        type: "challenge",
        read: false,
        timestamp: "2023-03-20T09:00:00Z",
        action: {
          label: "View Challenge",
          url: "/challenges",
        },
      },
      {
        id: "notification-2",
        title: "Daily Reminder",
        message: "Don't forget to log your eco-actions today!",
        type: "reminder",
        read: false,
        timestamp: "2023-03-20T08:00:00Z",
      },
      {
        id: "notification-3",
        title: "Achievement Unlocked",
        message: "You've earned the 'Consistent Recycler' badge!",
        type: "achievement",
        read: false,
        timestamp: "2023-03-19T14:30:00Z",
        action: {
          label: "View Achievements",
          url: "/achievements",
        },
      },
    ],
    friends: [
      {
        id: "friend-1",
        name: "Alex",
        avatar: "/placeholder.svg?height=40&width=40",
        level: 4,
        points: 920,
        streak: 12,
        lastActive: "2023-03-20T10:15:00Z",
        status: "online",
      },
      {
        id: "friend-2",
        name: "Jamie",
        avatar: "/placeholder.svg?height=40&width=40",
        level: 3,
        points: 880,
        streak: 7,
        lastActive: "2023-03-19T18:30:00Z",
        status: "offline",
      },
      {
        id: "friend-3",
        name: "Taylor",
        avatar: "/placeholder.svg?height=40&width=40",
        level: 3,
        points: 780,
        streak: 4,
        lastActive: "2023-03-20T09:45:00Z",
        status: "online",
      },
    ],
    communityPosts: [
      {
        id: "post-1",
        userId: "user-2",
        userName: "GreenThumb",
        userAvatar: "/placeholder.svg?height=40&width=40",
        content:
          "Just planted my first vegetable garden! 🌱 Excited to grow my own food and reduce my carbon footprint.",
        image: "/placeholder.svg?height=300&width=500",
        likes: 24,
        comments: 5,
        timestamp: "2023-03-19T16:45:00Z",
        liked: false,
      },
      {
        id: "post-2",
        userId: "user-3",
        userName: "EarthSaver",
        userAvatar: "/placeholder.svg?height=40&width=40",
        content:
          "Completed the Zero Waste challenge! It was tough but so rewarding. Here are some tips that helped me...",
        likes: 18,
        comments: 7,
        timestamp: "2023-03-18T12:30:00Z",
        liked: true,
      },
    ],
    impactStats: {
      carbonSaved: 125.5,
      waterSaved: 750.2,
      wasteSaved: 45.8,
      treesPlanted: 3,
      energySaved: 85.3,
    },
    isInitialized: true,
    isLoading: false,
    error: null,
  }
}

// Use persist middleware with localStorage for data persistence
export const useEcoStore = create<EcoHabitState>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      addAction: (actionData) =>
        set((state) => {
          const newAction: EcoAction = {
            id: generateId(),
            timestamp: getCurrentTimestamp(),
            ...actionData,
          }

          const newActions = [newAction, ...state.actions]
          const newStreak = calculateStreak(newActions)
          const newPoints = state.user.points + actionData.points
          const newLevel = calculateLevel(newPoints)
          const leveledUp = newLevel > state.user.level

          // Update impact stats
          const newImpactStats = { ...state.impactStats }
          if (actionData.carbonSaved) newImpactStats.carbonSaved += actionData.carbonSaved
          if (actionData.waterSaved) newImpactStats.waterSaved += actionData.waterSaved
          if (actionData.wasteSaved) newImpactStats.wasteSaved += actionData.wasteSaved

          // Check achievements
          const updatedAchievements = state.achievements.map((achievement) => {
            if (achievement.unlocked) return achievement

            let newProgress = achievement.progress

            // Update achievement progress based on action
            if (achievement.category === "general" || achievement.category === actionData.category) {
              if (
                (achievement.name === "Waste Warrior" && actionData.name.includes("Recycl")) ||
                (achievement.name === "Cycling Champion" && actionData.name.includes("Bike"))
              ) {
                newProgress += 1
              }
            }

            const unlocked = newProgress >= achievement.target

            return {
              ...achievement,
              progress: newProgress,
              unlocked,
              unlockedAt: unlocked ? getCurrentTimestamp() : undefined,
            }
          })

          // Check for newly unlocked achievements
          const newlyUnlocked = updatedAchievements.filter((a, i) => a.unlocked && !state.achievements[i].unlocked)

          // Create notifications for new achievements
          const achievementNotifications = newlyUnlocked.map((achievement) => ({
            id: generateId(),
            title: "Achievement Unlocked",
            message: `You've earned the '${achievement.name}' achievement!`,
            type: "achievement" as const,
            read: false,
            timestamp: getCurrentTimestamp(),
            action: {
              label: "View Achievements",
              url: "/achievements",
            },
          }))

          // Create level up notification if applicable
          const levelUpNotification = leveledUp
            ? [
                {
                  id: generateId(),
                  title: "Level Up!",
                  message: `Congratulations! You've reached Level ${newLevel}!`,
                  type: "system" as const,
                  read: false,
                  timestamp: getCurrentTimestamp(),
                },
              ]
            : []

          return {
            actions: newActions,
            user: {
              ...state.user,
              points: newPoints,
              level: newLevel,
              streak: newStreak,
            },
            achievements: updatedAchievements,
            impactStats: newImpactStats,
            notifications: [...achievementNotifications, ...levelUpNotification, ...state.notifications],
          }
        }),

      joinChallenge: (challengeId) =>
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId ? { ...challenge, joined: true } : challenge,
          ),
        })),

      updateChallengeProgress: (challengeId, progress) =>
        set((state) => {
          const challenge = state.challenges.find((c) => c.id === challengeId)
          if (!challenge) return state

          const wasCompleted = challenge.completed
          const isNowCompleted = progress >= challenge.target
          const newlyCompleted = !wasCompleted && isNowCompleted

          // Create notification if newly completed
          const completionNotification = newlyCompleted
            ? [
                {
                  id: generateId(),
                  title: "Challenge Completed",
                  message: `You've completed the '${challenge.title}' challenge!`,
                  type: "challenge" as const,
                  read: false,
                  timestamp: getCurrentTimestamp(),
                  action: {
                    label: "View Challenges",
                    url: "/challenges",
                  },
                },
              ]
            : []

          return {
            challenges: state.challenges.map((c) =>
              c.id === challengeId
                ? {
                    ...c,
                    progress,
                    completed: isNowCompleted,
                  }
                : c,
            ),
            user: newlyCompleted ? { ...state.user, points: state.user.points + challenge.points } : state.user,
            notifications: [...completionNotification, ...state.notifications],
          }
        }),

      markNotificationAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, read: true } : notification,
          ),
        })),

      clearAllNotifications: () =>
        set((state) => ({
          notifications: [],
        })),

      toggleDarkMode: () =>
        set((state) => ({
          user: {
            ...state.user,
            settings: {
              ...state.user.settings,
              darkMode: !state.user.settings.darkMode,
            },
          },
        })),

      updateSettings: (settings) =>
        set((state) => ({
          user: {
            ...state.user,
            settings: {
              ...state.user.settings,
              ...settings,
            },
          },
        })),

      likePost: (postId) =>
        set((state) => ({
          communityPosts: state.communityPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  liked: !post.liked,
                  likes: post.liked ? post.likes - 1 : post.likes + 1,
                }
              : post,
          ),
        })),
        hydrateUserFromSupabase: async () => {
          const { data: { user }, error: userError } = await supabase.auth.getUser()
          if (userError || !user) {
            console.error("Supabase user error:", userError)
            return
          }
        
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()
        
          if (profileError || !profile) {
            console.error("Profile fetch error:", profileError)
            return
          }
        
          // Set user in Zustand store
          get().updateUser({
            id: user.id,
            name: profile.username,
            email: user.email ?? "",
            avatar: "/placeholder.svg?height=96&width=96",
            level: profile.level ?? 1,
            points: profile.points ?? 0,
            streak: profile.streak ?? 0,
            joinedDate: profile.created_at ?? new Date().toISOString(),
            badges: [],
            settings: profile.settings ?? {
              notifications: true,
              darkMode: false,
              reminderTime: "18:00",
              shareProgress: true,
              goalPoints: 500,
              language: "en",
              units: "metric",
            },
          })
        },
        
        
    }),
    {
      name: "ecohabit-storage",
      // Use localStorage for persistence
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null
          return localStorage.getItem(name)
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            localStorage.setItem(name, value)
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem(name)
          }
        },
      },
    },
  ),
  
)

