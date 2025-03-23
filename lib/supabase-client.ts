import { createClient } from "@supabase/supabase-js"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://heuiiiakorawvvhmwqyb.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldWlpaWFrb3Jhd3Z2aG13cXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MTQ2NzksImV4cCI6MjA1ODE5MDY3OX0.2N59lI59vIArHblvsJdw3eT7QA-NxYKSOtJbDKI1t6Y"

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Function to check if Supabase is available
export async function isSupabaseAvailable(): Promise<boolean> {
  if (!isBrowser) return false

  try {
    // Try a simple request to check connectivity
    const { error } = await supabase.auth.getSession()
    return !error
  } catch (error) {
    console.error("Supabase connectivity check failed:", error)
    return false
  }
}

// Function to get table schema
export async function getTableSchema(tableName: string): Promise<string[]> {
  try {
    // This is a simplified approach - in a real app, you might want to use system tables
    const { data, error } = await supabase.from(tableName).select("*").limit(1)

    if (error) throw error

    // If we have data, return the column names
    if (data && data.length > 0) {
      return Object.keys(data[0])
    }

    // If no data, return empty array
    return []
  } catch (error) {
    console.error(`Error getting schema for ${tableName}:`, error)
    return []
  }
}

