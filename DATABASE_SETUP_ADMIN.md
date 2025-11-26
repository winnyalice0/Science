# Database Setup - Admin System

## Drizzle Migration

Run this migration to create admin tables:

```bash
npm run db:migrate
```

## Manual Supabase Setup (if needed)

If migrations don't work, create tables manually in Supabase SQL editor:

### 1. Admin Users Table

```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions TEXT[] DEFAULT ARRAY['manage_users', 'manage_models', 'manage_simulations'],
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 2. Admin 3D Models Table

```sql
CREATE TABLE IF NOT EXISTS admin_3d_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  thumbnail TEXT,
  model TEXT NOT NULL,
  model_type TEXT NOT NULL DEFAULT 'sketchfab',
  credit TEXT,
  difficulty TEXT NOT NULL DEFAULT 'Intermediate',
  learning_points TEXT[],
  tags TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 3. Admin Simulation Contents Table

```sql
CREATE TABLE IF NOT EXISTS admin_simulation_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  duration INTEGER NOT NULL,
  thumbnail_url TEXT,
  content TEXT,
  objectives TEXT[],
  learning_outcomes TEXT[],
  tags TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  completion_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 4. Admin Audit Logs Table

```sql
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  changes TEXT,
  reason TEXT,
  ip_address TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5. Email Verification Tokens Table

```sql
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Create First Admin (Manual)

If you need to create the first admin account manually:

### Option 1: Via SQL (if you have direct DB access)

```sql
-- 1. Create user in Supabase Auth (do via dashboard)
-- Get the UUID from newly created user

-- 2. Insert admin record
INSERT INTO admin_users (
  user_id,
  email,
  name,
  role,
  permissions,
  is_active
) VALUES (
  '{USER_UUID}',
  'admin@example.com',
  'System Administrator',
  'admin',
  ARRAY['manage_users', 'manage_models', 'manage_simulations', 'view_analytics'],
  true
);
```

### Option 2: Via API (recommended)

1. Create regular Supabase user first
2. Get user UUID from Supabase dashboard
3. Call admin endpoint:

```bash
curl -X POST http://localhost:5000/api/admin/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {USER_UUID}" \
  -d '{
    "userId": "{USER_UUID}",
    "email": "admin@example.com",
    "name": "System Administrator"
  }'
```

## Verify Setup

### Check tables created:

```sql
-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check admin_users table
SELECT * FROM admin_users;

-- Check if any admins exist
SELECT COUNT(*) FROM admin_users;
```

### Test admin creation:

1. Navigate to `/admin/access`
2. Enter code: `20203030`
3. Fill signup form
4. Verify email
5. Check if admin created: `SELECT * FROM admin_users WHERE email = 'your-email@example.com';`

## Environment Variables

Add to `.env.local`:

```env
# Admin settings (optional)
VITE_ADMIN_ACCESS_CODE=20203030
VITE_ADMIN_ENABLED=true

# Supabase (already configured)
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

## Backup & Recovery

### Backup Admin Tables

```sql
-- Dump admin_users
pg_dump -h your-host -U your-user -d your-db -t admin_users > admin_users_backup.sql

-- Dump all admin tables
pg_dump -h your-host -U your-user -d your-db -t admin_* > admin_backup.sql
```

### Restore from Backup

```sql
-- Via psql
psql -h your-host -U your-user -d your-db < admin_backup.sql

-- Or copy/paste SQL in Supabase editor
```

## Indexes for Performance

Add these indexes to improve query performance:

```sql
-- Admin lookups
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);

-- Model searches
CREATE INDEX idx_admin_3d_models_category ON admin_3d_models(category);
CREATE INDEX idx_admin_3d_models_created_by ON admin_3d_models(created_by);
CREATE INDEX idx_admin_3d_models_is_published ON admin_3d_models(is_published);

-- Simulation searches
CREATE INDEX idx_admin_simulations_subject ON admin_simulation_contents(subject);
CREATE INDEX idx_admin_simulations_created_by ON admin_simulation_contents(created_by);
CREATE INDEX idx_admin_simulations_is_published ON admin_simulation_contents(is_published);

-- Audit trail
CREATE INDEX idx_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON admin_audit_logs(created_at DESC);

-- Email tokens
CREATE INDEX idx_email_tokens_email ON email_verification_tokens(email);
CREATE INDEX idx_email_tokens_is_used ON email_verification_tokens(is_used);
```

## Data Migration

### Migrating existing 3D models

If you have existing models, migrate to admin system:

```sql
-- Copy from organs3DData
INSERT INTO admin_3d_models (
  name,
  category,
  description,
  full_description,
  thumbnail,
  model,
  model_type,
  difficulty,
  created_by
) VALUES (
  'Model Name',
  'Biology',
  'Description',
  'Full Description',
  '/path/to/thumb.jpg',
  'https://sketchfab.com/models/{ID}/embed',
  'sketchfab',
  'Intermediate',
  (SELECT id FROM admin_users LIMIT 1) -- First admin
);
```

## Monitoring Queries

### Check admin activity:

```sql
-- Recent admin actions
SELECT admin_id, action, target_type, created_at 
FROM admin_audit_logs 
ORDER BY created_at DESC 
LIMIT 20;

-- Count actions by admin
SELECT admin_id, COUNT(*) as action_count 
FROM admin_audit_logs 
GROUP BY admin_id;

-- Most recently added models
SELECT name, category, created_at 
FROM admin_3d_models 
ORDER BY created_at DESC 
LIMIT 10;

-- Active admins
SELECT email, name, last_login 
FROM admin_users 
WHERE is_active = true 
ORDER BY last_login DESC;
```

## Cleanup & Maintenance

### Archive old audit logs:

```sql
-- Move logs older than 90 days to archive
-- First create archive table:
CREATE TABLE admin_audit_logs_archive AS 
SELECT * FROM admin_audit_logs 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Then delete from main table
DELETE FROM admin_audit_logs 
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Clean expired tokens:

```sql
-- Delete expired verification tokens
DELETE FROM email_verification_tokens 
WHERE expires_at < NOW();

-- Or use a cron job:
SELECT cron.schedule('delete_expired_tokens', '0 * * * *', 
  'DELETE FROM email_verification_tokens WHERE expires_at < NOW()');
```

## Troubleshooting

**Error: relation "admin_users" does not exist**
- Solution: Run migrations: `npm run db:migrate`
- Or: Manually create tables with SQL above

**Foreign key constraint violation**
- Solution: Ensure user_id exists in auth.users
- Check: `SELECT id FROM auth.users WHERE id = '{UUID}';`

**Admin account not found**
- Solution: Verify record in admin_users table
- Query: `SELECT * FROM admin_users WHERE email = 'your-email@example.com';`

**Permissions not working**
- Solution: Check permissions array in admin_users
- Query: `SELECT permissions FROM admin_users WHERE id = '{ADMIN_ID}';`

---

**Last Updated**: November 26, 2025
**Status**: ✅ Ready for Production
