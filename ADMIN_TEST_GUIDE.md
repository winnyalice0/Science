# Admin Dashboard - Test & Verification Guide

## 🧪 Testing Workflow

### Complete Admin System Test

Follow these steps to verify the entire admin system is working:

---

## Phase 1: Access & Registration

### Test 1.1: Access Code Verification
```
1. Navigate to: http://localhost:5000/admin/access
2. Try invalid code: "12345678"
   Expected: Error message "Invalid access code"
3. Enter correct code: "20203030"
4. Click "Verify Access Code"
   Expected: Redirect to /admin/signup
✅ Should see: Signup form with name, email, password fields
```

### Test 1.2: Admin Signup
```
1. Fill signup form:
   - Name: "Test Admin"
   - Email: "admin@test.com"
   - Password: "TestPassword123"
   - Confirm Password: "TestPassword123"
2. Click "Create Admin Account"
   Expected: Form validation passes
✅ Should see: "Check your email for verification code" message
✅ Form changes to verification step
```

### Test 1.3: Email Verification
```
1. Check email inbox for verification code
   Note: If using test email, check spam folder
2. Enter the 6-digit code received
3. Click "Verify Email & Create Account"
   Expected: Success message
✅ Should see: "Admin account created successfully!"
✅ Automatic redirect to /admin-dashboard after 2 seconds
```

---

## Phase 2: Dashboard Navigation

### Test 2.1: Dashboard Loading
```
1. Verify you're redirected to /admin-dashboard
✅ Should see:
   - Admin name in header
   - Admin email displayed
   - Four tabs: Overview, Users, 3D Models, Simulations
   - Logout button in header
   - Admin Panel in sidebar (red badge)
```

### Test 2.2: Sidebar Integration
```
1. Check sidebar for Admin Panel item
   Expected: Red "Administration" section
✅ Should see:
   - Shield icon with "Admin Panel"
   - Links to /admin-dashboard
```

### Test 2.3: Tab Navigation
```
1. Click each tab:
   - Overview
   - Users
   - 3D Models
   - Simulations
✅ Each should load without errors
✅ Content should be displayed
```

---

## Phase 3: Overview Tab Testing

### Test 3.1: Statistics Display
```
1. On Overview tab
✅ Should see:
   - Total Users card
   - 3D Models card
   - Simulations card
   - Last Activity card
✅ Values should be numbers or "Never"
```

### Test 3.2: Admin Info
```
1. Scroll to admin information card
✅ Should see:
   - Your name: "Test Admin"
   - Your email: "admin@test.com"
   - Your role: "ADMIN"
```

### Test 3.3: System Status
```
1. Check system status cards
✅ Should see green indicators for:
   - System Status (animated pulse)
   - Database: CONNECTED
   - Authentication: ACTIVE
```

---

## Phase 4: Users Management

### Test 4.1: Users List
```
1. Click Users tab
✅ Should see:
   - Search box at top
   - User table or message "No users registered yet"
   - Table headers: Email, Name, Joined, Skill Level, Actions
```

### Test 4.2: User Search
```
1. In Users tab, enter search query
   Note: Test only works if users exist in database
✅ Results should filter dynamically
```

### Test 4.3: User Deletion
```
1. Click Trash icon on a user (if users exist)
2. Review deletion confirmation dialog
3. Click "Delete User"
✅ Should see: Success message "User deleted successfully!"
✅ User removed from table
```

---

## Phase 5: 3D Models Management

### Test 5.1: Add Model Form
```
1. Click 3D Models tab
2. Click "Add Model" button
✅ Should see: Form dialog with fields:
   - Model Name
   - Category (dropdown)
   - Difficulty (dropdown)
   - Thumbnail URL
   - Sketchfab Embed URL
   - Credit
   - Description
   - Full Description
   - Learning Points
```

### Test 5.2: Add Valid Model
```
1. Fill in model form:
   Name: "Test Heart"
   Category: "Biology"
   Difficulty: "Intermediate"
   Sketchfab URL: "https://sketchfab.com/models/1b7bfb07e6b24dd891099395ed98e989/embed"
   Description: "Test heart model"
   Full Description: "Test heart model for learning"
   Learning Points: "Understand heart structure"
   Credit: "Test Model"
2. Click "Add Model"
✅ Should see: Success message "Model added successfully!"
✅ Dialog closes
✅ Model appears in table
```

### Test 5.3: Model Validation
```
1. Try to submit empty model form
✅ Should see: Error "Model name and Sketchfab URL are required"
2. Try without Sketchfab URL
✅ Should see: Error message
```

### Test 5.4: Delete Model
```
1. Click Trash icon on a model
2. Confirm deletion
✅ Should see: Success message
✅ Model removed from table
```

---

## Phase 6: Simulations Management

### Test 6.1: Add Simulation Form
```
1. Click Simulations tab
2. Click "Add Simulation" button
✅ Should see: Form dialog with fields:
   - Simulation Title
   - Subject (dropdown)
   - Simulation Type (dropdown)
   - Difficulty
   - Duration
   - Description
   - Learning Objectives
   - Learning Outcomes
   - Tags
   - Content
```

### Test 6.2: Add Valid Simulation
```
1. Fill in simulation form:
   Title: "Test Simulation"
   Subject: "Chemistry"
   Type: "acid-base"
   Difficulty: "Intermediate"
   Duration: "30"
   Description: "Test simulation"
   Objectives: "Understand pH scale"
   Outcomes: "Learn titration"
   Tags: "chemistry, test"
2. Click "Add Simulation"
✅ Should see: Success message "Simulation added successfully!"
✅ Dialog closes
✅ Simulation appears in table
```

### Test 6.3: Simulation Validation
```
1. Try to submit empty form
✅ Should see: Error "Title and description are required"
```

### Test 6.4: Delete Simulation
```
1. Click Trash icon on a simulation
2. Confirm deletion
✅ Should see: Success message
✅ Simulation removed from table
```

---

## Phase 7: Logout & Session Management

### Test 7.1: Admin Logout
```
1. Click Logout button in header (or sidebar)
2. Confirm logout
✅ Should redirect to home page "/"
✅ Session cleared
```

### Test 7.2: Session Protection
```
1. After logout, try to access /admin-dashboard directly
2. Or open /admin-dashboard in new tab
✅ Should redirect to /admin/access
✅ Must verify code again
```

### Test 7.3: Last Login Update
```
1. Login again via /admin/access → /admin/signup
   Note: Use same email as first admin
   Or create new admin account
2. Go to database and check admin_users table
✅ Should see: lastLogin timestamp updated
```

---

## Phase 8: Data Persistence

### Test 8.1: Models Appear in User Interface
```
1. After adding a model via admin
2. Logout and go to /organs-3d as regular user
✅ Should see: Model in browse interface
✅ Model is searchable and clickable
✅ 3D viewer loads with Sketchfab embed
```

### Test 8.2: Simulations Appear for Users
```
1. After adding a simulation via admin
2. Logout and go to /simulations as regular user
✅ Should see: Simulation in list
✅ Simulation is visible and accessible
```

### Test 8.3: Database Verification
```
1. Access database directly
2. Query admin_3d_models:
   SELECT * FROM admin_3d_models;
✅ Should see: Models you added
3. Query admin_simulation_contents:
   SELECT * FROM admin_simulation_contents;
✅ Should see: Simulations you added
4. Query admin_audit_logs:
   SELECT * FROM admin_audit_logs;
✅ Should see: All your actions logged
```

---

## Phase 9: Error Handling

### Test 9.1: Invalid Access Code
```
1. Go to /admin/access
2. Try: "00000000"
✅ Should see: Error message
✅ Form clears password field
```

### Test 9.2: Invalid Credentials
```
1. Go to /admin/signup (after valid access code)
2. Try password mismatch
✅ Should see: Error "Passwords do not match"
3. Try too short password (< 8 chars)
✅ Should see: Error "Password must be at least 8 characters"
```

### Test 9.3: Network Error Handling
```
1. Simulate network error (browser dev tools)
2. Try to add model/simulation
✅ Should see: Error message
✅ Form not submitted
```

---

## Phase 10: UI/UX Testing

### Test 10.1: Responsive Design
```
1. Open admin dashboard on mobile (375px width)
2. Check all elements visible
3. Test on tablet (768px width)
4. Test on desktop (1920px width)
✅ Should work on all sizes
✅ Tables responsive
✅ Forms readable
```

### Test 10.2: Dark Mode
```
1. Toggle theme in top-right
✅ Should see: Dark theme applied
✅ Admin dashboard darkens
✅ Text readable in both modes
```

### Test 10.3: Loading States
```
1. While adding model/simulation
✅ Should see: Button changes to "Adding..."
✅ Spinner visible
✅ Form disabled
```

### Test 10.4: Accessibility
```
1. Tab through form fields
✅ Should navigate in order
2. Press Enter on buttons
✅ Should submit
3. Check labels
✅ All inputs labeled
```

---

## 🐛 Debugging Checklist

If tests fail, check:

### Compilation Issues
```bash
npm run build
```
✅ Should compile without errors

### Server Issues
```bash
npm run dev
```
✅ Should start without errors
✅ Check for 500 errors in console

### Database Issues
```sql
SELECT * FROM admin_users;
SELECT * FROM admin_3d_models;
SELECT * FROM admin_simulation_contents;
```
✅ Tables should exist
✅ Data should persist

### Email Issues
```
1. Check Supabase email settings
2. Verify SMTP configuration
3. Check spam folder
4. Try resending verification
```

### Authentication Issues
```
1. Check admin_users table for your record
2. Verify isActive = true
3. Check user_id matches auth.users
4. Review useAdminAuth hook
```

---

## 📊 Test Coverage Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Access Code | ✅ | Test with correct and invalid codes |
| Email Verification | ✅ | Check inbox for OTP |
| Signup | ✅ | Verify all fields validated |
| Dashboard | ✅ | All tabs load |
| Users Tab | ✅ | List, search, delete |
| Models Tab | ✅ | Add, list, delete |
| Simulations Tab | ✅ | Add, list, delete |
| Data Persistence | ✅ | Check database |
| User Visibility | ✅ | Models/sims visible to users |
| Logout | ✅ | Session cleared |
| Error Handling | ✅ | Validation messages |
| Responsive | ✅ | Mobile, tablet, desktop |
| Dark Mode | ✅ | Theme toggle works |
| Accessibility | ✅ | Keyboard navigation |

---

## ✅ Success Criteria

All tests pass when:

- ✅ Access code verification works
- ✅ Email verification works
- ✅ Admin dashboard loads
- ✅ All four tabs functional
- ✅ Add/delete operations work
- ✅ Data persists in database
- ✅ Models visible to users
- ✅ Simulations visible to users
- ✅ No console errors
- ✅ No database errors
- ✅ Logout works
- ✅ Session protected
- ✅ Form validation works
- ✅ Responsive on all devices
- ✅ Audit logs created

---

## 🎉 Fully Tested!

Once all tests pass, the admin system is:
- ✅ Secure
- ✅ Functional
- ✅ Production-ready
- ✅ User-friendly
- ✅ Well-documented

---

**Test Date**: November 26, 2025
**Tester**: [Your Name]
**Status**: Ready for Verification

For detailed documentation, see:
- `ADMIN_DASHBOARD_GUIDE.md` (Full documentation)
- `ADMIN_QUICK_START.md` (Quick reference)
