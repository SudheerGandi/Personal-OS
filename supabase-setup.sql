-- EXECUTION OS SUPABASE SETUP
-- RUN THESE IN YOUR SUPABASE SQL EDITOR

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  display_name text,
  role text CHECK (role IN ('MASTER', 'USER')) DEFAULT 'USER',
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. User Settings
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  start_date date DEFAULT CURRENT_DATE,
  test_date_override date
);

-- 3. Completed Commands
CREATE TABLE IF NOT EXISTS completed_commands (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  command_id text NOT NULL,
  source text,
  time_spent_minutes integer DEFAULT 0,
  completed_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Missed Commands
CREATE TABLE IF NOT EXISTS missed_commands (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  command_id text NOT NULL,
  missed_date date DEFAULT CURRENT_DATE,
  carried_to_date date
);

-- 5. Focus Sessions
CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  command_id text,
  started_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ended_at timestamp WITH TIME ZONE,
  planned_minutes integer,
  actual_minutes integer,
  completed boolean DEFAULT false
);

-- 6. Rule Logs
CREATE TABLE IF NOT EXISTS rule_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  log_date date NOT NULL,
  problems_written integer DEFAULT 0,
  outreaches_sent integer DEFAULT 0,
  deep_work_done boolean DEFAULT false,
  phone_away boolean DEFAULT false,
  typed_all_code boolean DEFAULT false,
  intelligence_scan_done boolean DEFAULT false,
  slept_on_time boolean DEFAULT false,
  one_small_thing_done boolean DEFAULT false,
  execution_score integer,
  UNIQUE(user_id, log_date)
);

-- 7. Reading Progress
CREATE TABLE IF NOT EXISTS reading_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  reading_id text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamp WITH TIME ZONE,
  notes text,
  UNIQUE(user_id, reading_id)
);

-- 8. Podcast Logs
CREATE TABLE IF NOT EXISTS podcast_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  podcast_id text NOT NULL,
  listened_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  minutes integer DEFAULT 0,
  notes text
);

-- 9. Information Logs
CREATE TABLE IF NOT EXISTS information_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  bucket_id text NOT NULL,
  resource_id text,
  scanned_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  notes text
);

-- 10. Signal Logs
CREATE TABLE IF NOT EXISTS signal_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  bucket_id text NOT NULL,
  signal text NOT NULL,
  insight text,
  action text,
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Business Decode Entries
CREATE TABLE IF NOT EXISTS business_decode_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  business_id text NOT NULL,
  archetype text,
  customer text,
  problem_solved text,
  revenue_model text,
  distribution text,
  cost_structure text,
  moat text,
  weakness text,
  lesson text,
  notes text,
  decoded_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. Skill Reps
CREATE TABLE IF NOT EXISTS skill_reps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  skill_id text NOT NULL,
  rep_date date DEFAULT CURRENT_DATE,
  notes text
);

-- 13. History Events
CREATE TABLE IF NOT EXISTS history_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  title text NOT NULL,
  source text,
  metadata jsonb,
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. User Week Progress
CREATE TABLE IF NOT EXISTS user_week_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  week_id text NOT NULL,
  unlocked boolean DEFAULT false,
  completed boolean DEFAULT false,
  completed_at timestamp WITH TIME ZONE,
  UNIQUE(user_id, week_id)
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE missed_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE information_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_decode_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_reps ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_week_progress ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Helper: Check if master
CREATE OR REPLACE FUNCTION is_master()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'MASTER'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Master can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Enable public read for display names (optional, but helps UI)
-- CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Master can view all profiles" ON profiles FOR SELECT USING (is_master());
CREATE POLICY "Master can update any profile" ON profiles FOR UPDATE USING (is_master());

-- Generic Row Level Access (Owner or Master)
DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'user_settings', 'completed_commands', 'missed_commands', 
        'focus_sessions', 'rule_logs', 'reading_progress', 
        'podcast_logs', 'information_logs', 'signal_logs', 
        'business_decode_entries', 'skill_reps', 'history_events', 
        'user_week_progress'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Users manage own %I" ON %I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Master view all %I" ON %I', t, t);
        EXECUTE format('CREATE POLICY "Users manage own %I" ON %I FOR ALL USING (auth.uid() = user_id)', t, t);
        EXECUTE format('CREATE POLICY "Master view all %I" ON %I FOR SELECT USING (is_master())', t, t);
    END LOOP;
END;
$$;

