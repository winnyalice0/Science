-- Science ASimulation Database Migration
-- Run this SQL in your Supabase SQL Editor to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Note: Supabase Auth handles users, this is for additional user data)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  skill_level TEXT NOT NULL DEFAULT 'beginner',
  xp INTEGER NOT NULL DEFAULT 0,
  bio TEXT,
  completed_simulations INTEGER NOT NULL DEFAULT 0,
  total_hours_logged INTEGER NOT NULL DEFAULT 0,
  last_assessment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Simulations table
CREATE TABLE IF NOT EXISTS simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  duration INTEGER NOT NULL,
  thumbnail_url TEXT,
  type TEXT NOT NULL,
  tags TEXT[],
  completion_count INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  collaborators TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Workspace Items table
CREATE TABLE IF NOT EXISTS workspace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  simulation_id UUID REFERENCES simulations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  data JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Simulation History table
CREATE TABLE IF NOT EXISTS simulation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  simulation_id UUID NOT NULL REFERENCES simulations(id) ON DELETE CASCADE,
  score INTEGER,
  duration INTEGER,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  observations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_items_workspace_id ON workspace_items(workspace_id);
CREATE INDEX IF NOT EXISTS idx_simulation_history_user_id ON simulation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_history_simulation_id ON simulation_history(simulation_id);
CREATE INDEX IF NOT EXISTS idx_simulations_subject ON simulations(subject);
CREATE INDEX IF NOT EXISTS idx_simulations_difficulty ON simulations(difficulty);
CREATE INDEX IF NOT EXISTS idx_simulations_featured ON simulations(featured);

-- Function to increment simulation completion count
CREATE OR REPLACE FUNCTION increment_simulation_completion(sim_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE simulations
  SET completion_count = completion_count + 1
  WHERE id = sim_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for Workspaces
CREATE POLICY "Users can view their own workspaces"
  ON workspaces FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert their own workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspaces"
  ON workspaces FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workspaces"
  ON workspaces FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for Workspace Items
CREATE POLICY "Users can view workspace items if they own the workspace"
  ON workspace_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_items.workspace_id
      AND (workspaces.user_id = auth.uid() OR workspaces.is_public = TRUE)
    )
  );

CREATE POLICY "Users can insert workspace items if they own the workspace"
  ON workspace_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_items.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

-- RLS Policies for Simulation History
CREATE POLICY "Users can view their own simulation history"
  ON simulation_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own simulation history"
  ON simulation_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Simulations are public (no RLS needed - everyone can view)

-- Insert seed data for simulations
INSERT INTO simulations (title, description, subject, difficulty, duration, type, tags, featured) VALUES
  ('Acid-Base Neutralization', 'Explore the fundamentals of acid-base chemistry by mixing HCl and NaOH to observe neutralization reactions, pH changes, and heat release.', 'Chemistry', 'Beginner', 10, 'acid-base', ARRAY['acids', 'bases', 'pH', 'neutralization'], TRUE),
  ('Precipitation Reactions', 'Mix silver nitrate and sodium chloride to observe the formation of silver chloride precipitate and learn about solubility rules.', 'Chemistry', 'Beginner', 15, 'precipitation', ARRAY['precipitation', 'solubility', 'ionic'], TRUE),
  ('Redox Reactions', 'Study oxidation-reduction reactions by observing zinc metal reacting with hydrochloric acid to produce hydrogen gas.', 'Chemistry', 'Intermediate', 20, 'redox', ARRAY['oxidation', 'reduction', 'electrons'], FALSE),
  ('Cell Structure Explorer', 'Take a 3D tour inside a eukaryotic cell, identifying organelles like mitochondria, nucleus, and endoplasmic reticulum.', 'Biology', 'Beginner', 15, 'cell-structure', ARRAY['cells', 'organelles', 'biology basics'], TRUE),
  ('DNA Replication', 'Watch the DNA double helix unwind and see how new strands are synthesized through complementary base pairing.', 'Biochemistry', 'Intermediate', 20, 'dna-replication', ARRAY['DNA', 'replication', 'genetics'], TRUE),
  ('Enzyme Kinetics', 'Study Michaelis-Menten kinetics by varying substrate concentration and observing enzyme reaction rates.', 'Biochemistry', 'Advanced', 30, 'enzyme-kinetics', ARRAY['enzymes', 'kinetics', 'catalysis'], FALSE)
ON CONFLICT DO NOTHING;
