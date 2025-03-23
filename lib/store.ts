import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase, isSupabaseAvailable } from "./supabase-client"

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
  energySaved?: number
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
  syncStatus: "idle" | "syncing" | "error" | "success"
  lastSyncTime: string | null

  // User actions
  updateUser: (user: Partial<User>) => void
  addAction: (action: Omit<EcoAction, "id" | "timestamp">) => Promise<void>
  joinChallenge: (challengeId: string) => void
  updateChallengeProgress: (challengeId: string, progress: number) => void
  markNotificationAsRead: (notificationId: string) => void
  clearAllNotifications: () => void
  toggleDarkMode: () => void
  updateSettings: (settings: Partial<UserSettings>) => void
  likePost: (postId: string) => void
  syncWithSupabase: () => Promise<void>
  loadActionsFromSupabase: () => Promise<boolean>
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
  | "syncWithSupabase"
  | "loadActionsFromSupabase"
> => {
  return {
    user: {
      id: "user-1",
      name: "EcoUser",
      email: "user@example.com",
      avatar: "/placeholder.svg?height=96&width=96",
      level: 1,
      points: 0,
      streak: 0,
      joinedDate: new Date().toISOString(),
      badges: [],
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
    actions: [],
    challenges: [],
    achievements: [],
    quests: [],
    notifications: [],
    friends: [],
    communityPosts: [],
    impactStats: {
      carbonSaved: 0,
      waterSaved: 0,
      wasteSaved: 0,
      treesPlanted: 0,
      energySaved: 0,
    },
    isInitialized: true,
    isLoading: false,
    error: null,
    syncStatus: "idle",
    lastSyncTime: null,
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

      addAction: async (actionData) => {
        // Create the new action object
        const newAction: EcoAction = {
          id: generateId(),
          timestamp: getCurrentTimestamp(),
          ...actionData,
        }

        // Update local state first
        set((state) => {
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
          if (actionData.energySaved) newImpactStats.energySaved += actionData.energySaved

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
            syncStatus: "syncing",
          }
        })

        // Then try to sync with Supabase
        try {
          const supabaseAvailable = await isSupabaseAvailable()

          if (supabaseAvailable) {
            const { data: session } = await supabase.auth.getSession()

            if (session && session.session) {
              const userId = session.session.user.id

              // Prepare the action data for Supabase
              const supabaseAction = {
                user_id: userId,
                name: newAction.name,
                icon: typeof newAction.icon === "function" ? newAction.icon.name : "Action", // Convert icon to string
                points: newAction.points,
                category: newAction.category,
                description: newAction.description,
                impact: newAction.impact,
                timestamp: newAction.timestamp,
                location: newAction.location ? JSON.stringify(newAction.location) : null,
                carbon_saved: newAction.carbonSaved,
                water_saved: newAction.waterSaved,
                waste_saved: newAction.wasteSaved,
                energy_saved: newAction.energySaved,
              }

              // Insert the action into Supabase
              const { error } = await supabase.from("eco_actions").insert([supabaseAction])

              if (error) {
                console.error("Error saving action to Supabase:", error)
                set({ syncStatus: "error", error: error.message })
                return
              }

              // Update user profile in Supabase
              const state = get()
              const { error: profileError } = await supabase
                .from("profiles")
                .update({
                  points: state.user.points,
                  level: state.user.level,
                  streak: state.user.streak,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", userId)

              if (profileError) {
                console.error("Error updating profile in Supabase:", profileError)
                set({ syncStatus: "error", error: profileError.message })
                return
              }

              set({
                syncStatus: "success",
                lastSyncTime: new Date().toISOString(),
                error: null,
              })
            }
          }
        } catch (error) {
          console.error("Error syncing with Supabase:", error)
          set({
            syncStatus: "error",
            error: error instanceof Error ? error.message : "Unknown error syncing with Supabase",
          })
        }
      },

      syncWithSupabase: async () => {
        set({ syncStatus: "syncing" })

        try {
          const supabaseAvailable = await isSupabaseAvailable()

          if (!supabaseAvailable) {
            set({ syncStatus: "error", error: "Supabase is not available" })
            return
          }

          const { data: session } = await supabase.auth.getSession()

          if (!session || !session.session) {
            set({ syncStatus: "error", error: "No active session" })
            return
          }

          const userId = session.session.user.id
          const state = get()

          // Sync user profile
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              points: state.user.points,
              level: state.user.level,
              streak: state.user.streak,
              updated_at: new Date().toISOString(),
              settings: state.user.settings,
            })
            .eq("id", userId)

          if (profileError) {
            console.error("Error updating profile in Supabase:", profileError)
            set({ syncStatus: "error", error: profileError.message })
            return
          }

          // Get actions from Supabase
          const { data: supabaseActions, error: actionsError } = await supabase
            .from("eco_actions")
            .select("*")
            .eq("user_id", userId)
            .order("timestamp", { ascending: false })

          if (actionsError) {
            console.error("Error fetching actions from Supabase:", actionsError)
            set({ syncStatus: "error", error: actionsError.message })
            return
          }

          if (supabaseActions && supabaseActions.length > 0) {
            // Transform Supabase actions to match our store format
            const formattedActions = supabaseActions.map((action) => ({
              id: action.id || generateId(),
              name: action.name,
              icon: action.icon,
              points: action.points,
              category: action.category,
              description: action.description || "",
              impact: action.impact || "",
              timestamp: action.timestamp,
              location: action.location ? JSON.parse(action.location) : undefined,
              carbonSaved: action.carbon_saved,
              waterSaved: action.water_saved,
              wasteSaved: action.waste_saved,
              energySaved: action.energy_saved,
            }))

            // Update the store with the fetched actions
            set({ actions: formattedActions })

            // Recalculate impact stats
            const newImpactStats = {
              carbonSaved: 0,
              waterSaved: 0,
              wasteSaved: 0,
              treesPlanted: 0,
              energySaved: 0,
            }

            formattedActions.forEach((action) => {
              if (action.carbonSaved) newImpactStats.carbonSaved += action.carbonSaved
              if (action.waterSaved) newImpactStats.waterSaved += action.waterSaved
              if (action.wasteSaved) newImpactStats.wasteSaved += action.wasteSaved
              if (action.energySaved) newImpactStats.energySaved += action.energySaved
            })

            set({ impactStats: newImpactStats })
          }

          // Sync local actions that don't exist in Supabase
          const localOnlyActions = state.actions.filter(
            (localAction) =>
              !supabaseActions.some(
                (supabaseAction) =>
                  supabaseAction.id === localAction.id || supabaseAction.timestamp === localAction.timestamp,
              ),
          )

          for (const action of localOnlyActions) {
            const supabaseAction = {
              user_id: userId,
              name: action.name,
              icon: typeof action.icon === "function" ? action.icon.name : "Action",
              points: action.points,
              category: action.category,
              description: action.description,
              impact: action.impact,
              timestamp: action.timestamp,
              location: action.location ? JSON.stringify(action.location) : null,
              carbon_saved: action.carbonSaved,
              water_saved: action.waterSaved,
              waste_saved: action.wasteSaved,
              energy_saved: action.energySaved,
            }

            const { error } = await supabase.from("eco_actions").insert([supabaseAction])

            if (error) {
              console.error("Error syncing action to Supabase:", error)
              // Continue with other actions even if one fails
            }
          }

          set({
            syncStatus: "success",
            lastSyncTime: new Date().toISOString(),
            error: null,
          })
        } catch (error) {
          console.error("Error syncing with Supabase:", error)
          set({
            syncStatus: "error",
            error: error instanceof Error ? error.message : "Unknown error syncing with Supabase",
          })
        }
      },

      loadActionsFromSupabase: async () => {
        try {
          const supabaseAvailable = await isSupabaseAvailable()

          if (!supabaseAvailable) {
            return false
          }

          const { data: session } = await supabase.auth.getSession()

          if (!session || !session.session) {
            return false
          }

          const userId = session.session.user.id

          // Get actions from Supabase
          const { data: supabaseActions, error: actionsError } = await supabase
            .from("eco_actions")
            .select("*")
            .eq("user_id", userId)
            .order("timestamp", { ascending: false })

          if (actionsError) {
            console.error("Error fetching actions from Supabase:", actionsError)
            return false
          }

          if (supabaseActions && supabaseActions.length > 0) {
            // Transform Supabase actions to match our store format
            const formattedActions = supabaseActions.map((action) => ({
              id: action.id || generateId(),
              name: action.name,
              icon: action.icon,
              points: action.points,
              category: action.category,
              description: action.description || "",
              impact: action.impact || "",
              timestamp: action.timestamp,
              location: action.location ? JSON.parse(action.location) : undefined,
              carbonSaved: action.carbon_saved,
              waterSaved: action.water_saved,
              wasteSaved: action.waste_saved,
              energySaved: action.energy_saved,
            }))

            // Update the store with the fetched actions
            set({ actions: formattedActions })

            // Recalculate impact stats
            const newImpactStats = {
              carbonSaved: 0,
              waterSaved: 0,
              wasteSaved: 0,
              treesPlanted: 0,
              energySaved: 0,
            }

            formattedActions.forEach((action) => {
              if (action.carbonSaved) newImpactStats.carbonSaved += action.carbonSaved
              if (action.waterSaved) newImpactStats.waterSaved += action.waterSaved
              if (action.wasteSaved) newImpactStats.wasteSaved += action.wasteSaved
              if (action.energySaved) newImpactStats.energySaved += action.energySaved
            })

            set({
              impactStats: newImpactStats,
              syncStatus: "success",
              lastSyncTime: new Date().toISOString(),
            })

            return true
          }

          return false
        } catch (error) {
          console.error("Error loading actions from Supabase:", error)
          return false
        }
      },

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

