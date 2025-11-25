# Science ASimulation - Setup Instructions

## Prerequisites
- Supabase account (https://supabase.com)
- The Supabase URL and Anon Key are already configured as environment variables

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** tab
3. Copy the contents of `supabase-migration.sql`
4. Paste and run the SQL in the editor
5. This will create all necessary tables, indexes, RLS policies, and seed data

## What Gets Created

The migration creates the following tables:
- **profiles** - User profiles with skill level, XP, and progress tracking
- **simulations** - Catalog of virtual laboratory experiments
- **workspaces** - User workspaces for organizing experiments
- **workspace_items** - Saved experiments within workspaces
- **simulation_history** - Tracks user's simulation runs and progress

## Seed Data

The migration automatically populates 6 starter simulations:
- Acid-Base Neutralization (Chemistry, Beginner)
- Precipitation Reactions (Chemistry, Beginner)
- Redox Reactions (Chemistry, Intermediate)
- Cell Structure Explorer (Biology, Beginner)
- DNA Replication (Biochemistry, Intermediate)
- Enzyme Kinetics (Biochemistry, Advanced)

## Authentication

The app uses Supabase Authentication for user management. When users sign up:
1. Supabase creates an auth user
2. The app automatically creates a profile record linked to that user

## Security

Row Level Security (RLS) is enabled on all user-specific tables to ensure:
- Users can only view/modify their own data
- Public workspaces can be viewed by anyone
- Simulations are publicly accessible to all users

## Development Workflow

After running the migration:
1. Start the development server with `npm run dev`
2. The app will be accessible at the configured port
3. All frontend components will connect to your Supabase backend
4. Authentication, data persistence, and real-time features are ready to use

## Notes

- Environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are already configured
- The backend uses these credentials to connect to your Supabase project
- Frontend uses VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (already set)
