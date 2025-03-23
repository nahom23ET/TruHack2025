import { createClient } from "@supabase/supabase-js"

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://heuiiiakorawvvhmwqyb.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhldWlpaWFrb3Jhd3Z2aG13cXliIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjYxNDY3OSwiZXhwIjoyMDU4MTkwNjc5fQ.tElDSF9PkJ7goT3EDgKo6nR-B9DQyaAwg3cMz60KmPg"

// Create a supabase client with the service role key for admin operations
// This client bypasses RLS policies
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

