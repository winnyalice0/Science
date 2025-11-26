-- Science ASimulation Database Schema
-- This migration sets up all tables for the Science ASimulation platform
-- NOTE: User authentication is handled by Supabase Auth (auth.users table)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Supabase Auth Users Table (Reference)
-- ============================================
-- NOTE: The auth.users table is managed by Supabase Auth automatically
-- Users are created via Supabase Auth API and the following fields are available:
-- - id: UUID primary key (user identifier)
-- - email: TEXT - user's email address (unique)
-- - encrypted_password: TEXT - bcrypt hashed password
-- - email_confirmed_at: TIMESTAMP - email verification timestamp
-- - invited_at: TIMESTAMP - invitation timestamp
-- - confirmation_token: TEXT - email confirmation token
-- - confirmation_sent_at: TIMESTAMP - confirmation email sent time
-- - recovery_token: TEXT - password recovery token
-- - recovery_sent_at: TIMESTAMP - recovery email sent time
-- - created_at: TIMESTAMP - account creation time
-- - updated_at: TIMESTAMP - last update time
-- - is_sso_user: BOOLEAN - social sign-on flag
-- - role: TEXT - user role (authenticated, service_role)
-- - raw_app_meta_data: JSONB - application metadata
-- - raw_user_meta_data: JSONB - user metadata
-- - is_super_admin: BOOLEAN - super admin flag (Supabase internal)
-- - deleted_at: TIMESTAMP - soft delete timestamp

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
  ('Acid-Base Titration', 'Master the fundamentals of volumetric analysis by performing a precise titration experiment. Learn to calculate concentrations and identify equivalence points.', 'Chemistry', 'Beginner', 25, 'acid-base', ARRAY['titration', 'pH', 'neutralization'], true, 'https://i.pinimg.com/1200x/e9/2a/3c/e92a3cfcdbeeaaf435894f16bc3ea692.jpg'),
  ('Enzyme Kinetics Analysis', 'Investigate how enzymes catalyze biochemical reactions. Explore the effects of substrate concentration, temperature, and inhibitors on reaction rates.', 'Biochemistry', 'Advanced', 40, 'enzyme-kinetics', ARRAY['enzymes', 'catalysis', 'kinetics'], true, 'https://i.pinimg.com/1200x/08/61/2e/08612e13a791d3576536dc0e0a94d662.jpg'),
  ('DNA Gel Electrophoresis', 'Separate and analyze DNA fragments by size using gel electrophoresis. Learn the principles behind this essential molecular biology technique.', 'Biology', 'Intermediate', 30, 'gel-electrophoresis', ARRAY['DNA', 'molecular biology', 'electrophoresis'], false, 'https://i.pinimg.com/1200x/e1/97/4e/e1974ee8f3ae25d01766a74bb9e76124.jpg'),
  ('Polymerase Chain Reaction (PCR)', 'Amplify specific DNA sequences using PCR. Understand primer design, thermal cycling, and the applications of this revolutionary technique.', 'Biology', 'Advanced', 35, 'pcr', ARRAY['PCR', 'DNA amplification', 'molecular biology'], true, 'https://i.pinimg.com/1200x/55/25/df/5525dfb13d550f55e11efafe7c79181d.jpg'),
  ('Precipitation Reactions', 'Explore solubility principles by observing the formation of precipitates. Predict products and write balanced net ionic equations.', 'Chemistry', 'Beginner', 20, 'precipitation', ARRAY['solubility', 'ionic compounds', 'reactions'], false, 'https://i.pinimg.com/1200x/ee/65/df/ee65dfa3564886a2e2e6f0b89853c1a9.jpg')
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

-- ============================================
-- Admin Tables (Admin System Management)
-- ============================================

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions TEXT[] DEFAULT ARRAY['manage_users', 'manage_models', 'manage_simulations', 'view_analytics'],
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- 3D Models Table (Admin-managed)
CREATE TABLE IF NOT EXISTS admin_3d_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  thumbnail TEXT,
  model TEXT NOT NULL,
  model_type TEXT NOT NULL DEFAULT 'sketchfab' CHECK (model_type IN ('sketchfab', 'iframe', 'html')),
  credit TEXT,
  difficulty TEXT NOT NULL DEFAULT 'Intermediate' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  learning_points TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_3d_models_created_by ON admin_3d_models(created_by);
CREATE INDEX idx_admin_3d_models_category ON admin_3d_models(category);
CREATE INDEX idx_admin_3d_models_is_published ON admin_3d_models(is_published);

-- Simulation Contents Table (Admin-managed)
CREATE TABLE IF NOT EXISTS admin_simulation_contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  duration INTEGER NOT NULL,
  thumbnail_url TEXT,
  content TEXT,
  objectives TEXT[] DEFAULT ARRAY[]::TEXT[],
  learning_outcomes TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  completion_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_simulations_created_by ON admin_simulation_contents(created_by);
CREATE INDEX idx_admin_simulations_subject ON admin_simulation_contents(subject);
CREATE INDEX idx_admin_simulations_is_published ON admin_simulation_contents(is_published);

-- Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  changes TEXT,
  reason TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC);

-- Email Verification Tokens Table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX idx_email_verification_tokens_token ON email_verification_tokens(token);

-- Training Hub Paths Table
CREATE TABLE IF NOT EXISTS training_hub_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  estimated_duration INTEGER NOT NULL,
  thumbnail_url TEXT,
  prerequisites TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  module_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_training_hub_paths_created_by ON training_hub_paths(created_by);
CREATE INDEX idx_training_hub_paths_subject ON training_hub_paths(subject);
CREATE INDEX idx_training_hub_paths_is_published ON training_hub_paths(is_published);

-- Training Hub Modules Table
CREATE TABLE IF NOT EXISTS training_hub_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID NOT NULL REFERENCES training_hub_paths(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  duration INTEGER NOT NULL,
  objectives TEXT[] DEFAULT ARRAY[]::TEXT[],
  learning_outcomes TEXT[] DEFAULT ARRAY[]::TEXT[],
  resources TEXT[] DEFAULT ARRAY[]::TEXT[],
  quiz TEXT,
  order_num INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_training_hub_modules_path_id ON training_hub_modules(path_id);
CREATE INDEX idx_training_hub_modules_created_by ON training_hub_modules(created_by);

-- Workspace Templates Table
CREATE TABLE IF NOT EXISTS workspace_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  template_data TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workspace_templates_created_by ON workspace_templates(created_by);
CREATE INDEX idx_workspace_templates_category ON workspace_templates(category);
CREATE INDEX idx_workspace_templates_is_published ON workspace_templates(is_published);

-- Triggers to auto-update updated_at for admin tables
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_3d_models_updated_at
  BEFORE UPDATE ON admin_3d_models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_simulation_contents_updated_at
  BEFORE UPDATE ON admin_simulation_contents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_hub_paths_updated_at
  BEFORE UPDATE ON training_hub_paths
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_hub_modules_updated_at
  BEFORE UPDATE ON training_hub_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_templates_updated_at
  BEFORE UPDATE ON workspace_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
