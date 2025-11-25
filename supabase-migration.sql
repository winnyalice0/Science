-- Science ASimulation Database Schema
-- This migration sets up all tables for the Science ASimulation platform
-- NOTE: User authentication is handled by Supabase Auth (auth.users table)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Profiles Table (User profile data)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  skill_level TEXT NOT NULL DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  xp INTEGER NOT NULL DEFAULT 0,
  bio TEXT,
  completed_simulations INTEGER NOT NULL DEFAULT 0,
  total_hours_logged INTEGER NOT NULL DEFAULT 0,
  last_assessment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- ============================================
-- Simulations Table (Catalog of simulations)
-- ============================================
CREATE TABLE IF NOT EXISTS simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  duration INTEGER NOT NULL,
  thumbnail_url TEXT,
  type TEXT NOT NULL,
  tags TEXT[],
  completion_count INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_simulations_subject ON simulations(subject);
CREATE INDEX idx_simulations_difficulty ON simulations(difficulty);
CREATE INDEX idx_simulations_featured ON simulations(featured);

-- ============================================
-- Workspaces Table (User project areas)
-- ============================================
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  collaborators TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_workspaces_user_id ON workspaces(user_id);

-- ============================================
-- Workspace Items Table (Saved experiments)
-- ============================================
CREATE TABLE IF NOT EXISTS workspace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  simulation_id UUID REFERENCES simulations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  data JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on workspace_id for faster lookups
CREATE INDEX idx_workspace_items_workspace_id ON workspace_items(workspace_id);
CREATE INDEX idx_workspace_items_simulation_id ON workspace_items(simulation_id);

-- ============================================
-- Simulation History Table (User activity tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS simulation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  simulation_id UUID NOT NULL REFERENCES simulations(id) ON DELETE CASCADE,
  score INTEGER,
  duration INTEGER,
  completed BOOLEAN NOT NULL DEFAULT false,
  observations JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_simulation_history_user_id ON simulation_history(user_id);
CREATE INDEX idx_simulation_history_simulation_id ON simulation_history(simulation_id);
CREATE INDEX idx_simulation_history_created_at ON simulation_history(created_at DESC);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Workspaces: Users can manage their own workspaces
CREATE POLICY "Users can view own workspaces"
  ON workspaces FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workspaces"
  ON workspaces FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workspaces"
  ON workspaces FOR DELETE
  USING (auth.uid() = user_id);

-- Workspace Items: Users can manage items in their workspaces
CREATE POLICY "Users can view items in own workspaces"
  ON workspace_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_items.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert items in own workspaces"
  ON workspace_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_items.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in own workspaces"
  ON workspace_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_items.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items in own workspaces"
  ON workspace_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_items.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

-- Simulation History: Users can view and create their own history
CREATE POLICY "Users can view own simulation history"
  ON simulation_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulation history"
  ON simulation_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Simulations: Public read access
CREATE POLICY "Anyone can view simulations"
  ON simulations FOR SELECT
  TO authenticated, anon
  USING (true);

-- ============================================
-- Seed Data (Sample Simulations)
-- ============================================
INSERT INTO simulations (title, description, subject, difficulty, duration, type, tags, featured, thumbnail_url) VALUES
  ('Acid-Base Titration', 'Master the fundamentals of volumetric analysis by performing a precise titration experiment. Learn to calculate concentrations and identify equivalence points.', 'Chemistry', 'Beginner', 25, 'acid-base', ARRAY['titration', 'pH', 'neutralization'], true, '/attached_assets/generated_images/titration_lab_01.png'),
  ('Enzyme Kinetics Analysis', 'Investigate how enzymes catalyze biochemical reactions. Explore the effects of substrate concentration, temperature, and inhibitors on reaction rates.', 'Biochemistry', 'Advanced', 40, 'enzyme-kinetics', ARRAY['enzymes', 'catalysis', 'kinetics'], true, '/attached_assets/generated_images/enzyme_kinetics_02.png'),
  ('DNA Gel Electrophoresis', 'Separate and analyze DNA fragments by size using gel electrophoresis. Learn the principles behind this essential molecular biology technique.', 'Biology', 'Intermediate', 30, 'gel-electrophoresis', ARRAY['DNA', 'molecular biology', 'electrophoresis'], false, '/attached_assets/generated_images/dna_gel_03.png'),
  ('Polymerase Chain Reaction (PCR)', 'Amplify specific DNA sequences using PCR. Understand primer design, thermal cycling, and the applications of this revolutionary technique.', 'Biology', 'Advanced', 35, 'pcr', ARRAY['PCR', 'DNA amplification', 'molecular biology'], true, '/attached_assets/generated_images/pcr_lab_04.png'),
  ('Precipitation Reactions', 'Explore solubility principles by observing the formation of precipitates. Predict products and write balanced net ionic equations.', 'Chemistry', 'Beginner', 20, 'precipitation', ARRAY['solubility', 'ionic compounds', 'reactions'], false, '/attached_assets/generated_images/precipitation_05.png')
ON CONFLICT DO NOTHING;

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_items_updated_at
  BEFORE UPDATE ON workspace_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
