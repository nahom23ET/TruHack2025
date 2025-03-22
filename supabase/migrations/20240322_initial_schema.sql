-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,  -- Make email optional in case it's already stored in auth.users
  full_name TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{
    "notifications": true,
    "darkMode": false,
    "reminderTime": "18:00",
    "shareProgress": true,
    "goalPoints": 500,
    "language": "en",
    "units": "metric"
  }'::JSONB
);

-- Create eco_actions table
CREATE TABLE IF NOT EXISTS eco_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  points INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  impact TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location JSONB,
  carbon_saved DECIMAL,
  water_saved DECIMAL,
  waste_saved DECIMAL,
  energy_saved DECIMAL
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  points INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  target INTEGER NOT NULL,
  unit TEXT NOT NULL,
  participants INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_challenges table
CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0,
  joined BOOLEAN DEFAULT TRUE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  target INTEGER NOT NULL,
  rarity TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE eco_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Add INSERT policy for profiles
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Eco actions policies
CREATE POLICY "Users can view their own actions"
ON eco_actions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own actions"
ON eco_actions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User challenges policies
CREATE POLICY "Users can view their own challenges"
ON user_challenges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges"
ON user_challenges FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenges"
ON user_challenges FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User achievements policies
CREATE POLICY "Users can view their own achievements"
ON user_achievements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
ON user_achievements FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

