# Admin Dashboard - Quick Start

## 🔒 Security

### Access Code
```
20203030
```
This code is required to access the admin signup page.

### How It Works
1. Navigate to `/admin/access`
2. Enter the access code
3. Create admin account with email verification
4. Access admin dashboard at `/admin-dashboard`

---

## 🚀 Getting Started

### Step 1: Go to Admin Portal
```
http://localhost:5000/admin/access
```

### Step 2: Verify Access Code
- Enter: `20203030`
- Click "Verify Access Code"

### Step 3: Create Admin Account
- Name: Your name
- Email: Your email address
- Password: Strong password (8+ characters)
- Confirm password

### Step 4: Verify Email
- Check your email for verification code
- Enter 6-digit code
- Click "Verify Email & Create Account"

### Step 5: Access Admin Dashboard
- You're now an admin!
- Navigate to Admin Panel from sidebar
- Or go to `/admin-dashboard`

---

## 📋 Admin Features

### Overview Tab
- View system statistics
- Check admin account info
- Monitor system health
- See what you can manage

### Users Management
- **View Users**: See all registered users
- **Search**: Find users by name/email
- **Delete User**: Remove user accounts
- Bulk actions (coming soon)

### 3D Models Management
- **Add Models**: Create from Sketchfab embeds
- **Fill Fields**:
  - Model name
  - Category (Biology, Chemistry, Lab Materials)
  - Difficulty (Beginner, Intermediate, Advanced)
  - Sketchfab embed URL
  - Thumbnail image
  - Detailed description
  - Learning points
  - Artist credit
- **View Models**: See all added models
- **Delete Models**: Remove models

### Simulations Management
- **Add Simulations**: Create learning content
- **Configure**:
  - Title and description
  - Subject area
  - Type (acid-base, precipitation, etc.)
  - Difficulty level
  - Duration (minutes)
  - Learning objectives
  - Learning outcomes
  - Tags
  - Content (HTML/JSON)
- **View Simulations**: See all created simulations
- **Delete Simulations**: Remove simulations

---

## 📚 Adding Content

### Add a 3D Model

1. Click **Admin Panel** in sidebar
2. Click **3D Models** tab
3. Click **Add Model** button
4. Fill out the form:
   ```
   Model Name: Human Heart
   Category: Biology
   Difficulty: Intermediate
   Sketchfab URL: https://sketchfab.com/models/{ID}/embed
   Thumbnail: /public/3d-models/heart-thumb.jpg
   Description: The human circulatory system...
   Full Description: [Longer description]
   Learning Points:
     - Understand heart structure
     - Learn blood flow
   Credit: Human Heart by Artist Name on Sketchfab
   ```
5. Click **Add Model**
6. ✅ Model now visible to users!

### Add a Simulation

1. Click **Simulations** tab
2. Click **Add Simulation** button
3. Fill out the form:
   ```
   Title: pH Titration Experiment
   Subject: Chemistry
   Type: acid-base
   Difficulty: Intermediate
   Duration: 30 (minutes)
   Description: Learn acid-base titration...
   Objectives:
     - Understand pH scale
     - Master titration technique
   Outcomes:
     - Calculate concentration
     - Perform lab procedures
   Tags: titration, chemistry, acid-base, lab
   Content: [HTML or JSON structure]
   ```
4. Click **Add Simulation**
5. ✅ Simulation now available to users!

---

## 🎯 Common Tasks

### Check System Status
1. Go to Admin Dashboard
2. Overview tab shows:
   - Total users
   - Total 3D models
   - Total simulations
   - Database status
   - Auth status

### Find a User
1. Click Users tab
2. Use search box
3. Enter name or email
4. Click user row for details

### Delete a User
1. Click Users tab
2. Find user with search
3. Click trash icon
4. Confirm deletion
5. User account removed

### Update Model List
1. Models from Sketchfab embed
2. Once added, publicly visible
3. Users can view in `/organs-3d`
4. Click to see full 3D view

### Monitor Activities
1. All actions logged
2. View in audit trail (future feature)
3. See timestamps
4. Track who changed what

---

## ⚠️ Important Notes

### Before Deployment
- [ ] Change access code in production
- [ ] Configure Supabase email templates
- [ ] Set up email domain authentication
- [ ] Enable 2FA for admin accounts
- [ ] Configure HTTPS
- [ ] Set up database backups

### Best Practices
- ✅ Use strong, unique passwords
- ✅ Never share access code
- ✅ Verify email addresses
- ✅ Keep admin accounts secure
- ✅ Regular password changes
- ✅ Monitor audit logs

### Security Reminders
- Access code should be changed periodically
- Only trusted people get admin access
- All actions are logged
- Email verification required
- Session expires on logout

---

## 🔧 Troubleshooting

**Access Code Error**
- Code is: `20203030`
- No spaces
- Exact match required

**Email Not Received**
- Check spam folder
- Verify email address
- Check email settings
- Try requesting new code

**Can't Access Dashboard**
- Verify admin account created
- Check email was verified
- Ensure account is active
- Clear browser cache

**Model/Simulation Not Showing**
- Ensure form submitted successfully
- Check database connection
- Verify admin authentication
- Reload page

---

## 📞 Support

For issues or questions:
1. Check the full guide: `ADMIN_DASHBOARD_GUIDE.md`
2. Review error messages
3. Check browser console
4. Contact system administrator

---

**Quick Links**
- Admin Access: `/admin/access`
- Admin Signup: `/admin/signup`
- Admin Dashboard: `/admin-dashboard`
- User Dashboard: `/dashboard`
- 3D Models: `/organs-3d`
- Simulations: `/simulations`

---

**Access Code**: `20203030`

**Status**: ✅ Ready to Use
