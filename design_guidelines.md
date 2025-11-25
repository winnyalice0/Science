# Science ASimulation Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern educational and productivity platforms with emphasis on clarity, professionalism, and scientific credibility.

**Primary References**:
- **Notion** - Workspace organization, clean hierarchy
- **Linear** - Modern typography, precise spacing, professional aesthetics  
- **Coursera/Khan Academy** - Educational UI patterns, progress visualization
- **Stripe** - Trust through restraint and polish

**Core Principles**:
1. Scientific credibility through clean, professional presentation
2. Clarity over decoration - information-dense but organized
3. Subtle depth through layering (cards, panels) without shadows
4. Purposeful visual hierarchy for complex technical content

---

## Typography

**Font Stack**: Google Fonts
- **Primary**: Inter (headings, UI elements) - Clean, modern, highly legible
- **Secondary**: JetBrains Mono (code, chemical formulas, data) - Monospace for technical content
- **Body**: Inter (paragraph text)

**Hierarchy**:
- Hero Headings: text-5xl lg:text-6xl font-bold tracking-tight
- Page Titles: text-3xl lg:text-4xl font-semibold  
- Section Headings: text-2xl font-semibold
- Card Titles: text-lg font-medium
- Body Text: text-base leading-relaxed
- Small/Meta Text: text-sm
- Chemical Formulas/Code: font-mono text-sm

---

## Layout & Spacing System

**Tailwind Spacing Units**: Consistent use of 4, 6, 8, 12, 16, 20, 24 for most layouts
- Component padding: p-6 or p-8
- Section spacing: py-16 lg:py-24
- Card gaps: gap-6 or gap-8
- Container max-width: max-w-7xl

**Grid Patterns**:
- Simulation cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Feature showcases: grid-cols-1 lg:grid-cols-2 gap-12
- Dashboard widgets: grid-cols-1 lg:grid-cols-3 gap-6

---

## Core Components

### Navigation
**Desktop Sidebar** (when authenticated):
- Fixed left, w-64, full height
- Logo at top
- Collapsible sections: Simulations, Training, Workspaces, Community
- User profile at bottom
- Active state: subtle background treatment

**Mobile**: Hamburger menu, slide-over drawer

**Top Navigation** (public pages):
- Horizontal bar, sticky
- Logo left, primary navigation center, CTA button right
- Search bar integrated for /simulations page

### Cards
**Simulation Cards**:
- Aspect ratio 16:9 preview image/thumbnail
- Title (text-lg font-medium)
- Subject badge, difficulty badge (pill-shaped)
- Brief description (text-sm)
- Metadata: duration, completion count
- Hover: subtle lift effect (transform translate)

**Feature Cards** (for landing):
- Icon at top (large, 48px-64px)
- Heading + description
- "Learn more" link

### Forms & Inputs
**Style**: 
- Border-based inputs (not filled)
- Focus rings
- Labels above inputs (text-sm font-medium)
- Helper text below (text-sm)
- Validation states with inline messages

### Buttons
**Primary**: Solid background, medium weight font, px-6 py-3, rounded-lg
**Secondary**: Border style, same padding
**Icon buttons**: Square aspect, rounded-lg, p-3

### Data Visualization
**Progress Indicators**:
- Linear progress bars (rounded, gradient fill option)
- Circular progress for skill trees
- XP bars with level milestones

**Charts**: Plotly.js integration with clean, scientific styling

### Badges & Pills
- Subject tags: rounded-full, px-3 py-1, text-xs font-medium
- Level indicators: Beginner (green tint), Intermediate (blue tint), Advanced (purple tint)
- Achievement badges: Circular with icons

---

## Page-Specific Layouts

### Landing Page (/)
**Hero Section** (80vh):
- Split layout: Left 50% - Headline, subheadline, 2 CTAs, trust indicator ("50,000+ students")
- Right 50% - Large hero image/video demo of 3D simulation in action
- Background: subtle gradient or grid pattern

**Sections** (5-7 total):
1. **Platform Showcase**: 3-column feature grid with icons
2. **Simulations Preview**: Horizontal scrolling carousel of simulation cards
3. **Training Paths**: 2-column split - Image + pathway description
4. **Stats/Trust**: 4-column metrics (users, simulations, hours, institutions)
5. **Testimonials**: 2-column testimonial cards with educator photos
6. **Pricing Tiers**: 3-column comparison table
7. **CTA Footer**: Centered, "Start Learning Free Today" with email signup

### Browse Simulations (/simulations)
**Layout**:
- Sidebar filters (left, 20%): Subject checkboxes, Level select, Search input
- Main grid (right, 80%): Simulation cards in 3-column grid
- Top bar: View toggle (grid/list), Sort dropdown, results count
- Pagination at bottom

### Virtual Lab (/lab/[id])
**Full-Screen Interface**:
- Top toolbar: Simulation name, save/share buttons, help icon
- Main area split:
  - Left panel (30%): Controls (sliders, inputs, apparatus selector)
  - Center (50%): 3D canvas with React Three Fiber rendering
  - Right panel (20%): Observation log (scrollable feed), AI chat toggle
- Bottom: Timeline/step indicator for multi-step reactions

### Dashboard (/dashboard)
**Grid Layout**:
- Welcome banner (full width): Greeting, level badge, XP progress
- 3-column widget grid:
  - Recent Activity (list of completed sims)
  - Recommended Simulations (3 cards)
  - Progress Chart (line graph)
  - Quick Actions (grid of buttons)
  - Achievements (badge gallery)

### Training Hub (/training)
**Vertical Flow**:
- Hero: "Your Learning Journey" heading + progress overview
- Learning paths: Accordion-style expandable sections
- Each module: Card with preview image, title, duration, completion checkbox
- Skill tree visualization at bottom (node-based diagram)

### Workspaces (/workspaces)
**File Manager Style**:
- Top: Breadcrumb navigation, "New Workspace" button
- Sidebar: Workspace list with icons
- Main area: Grid of folders/files with preview thumbnails
- Right sidebar: Details panel (selected item info, collaborators, version history)

---

## Images

**Required Images**:
1. **Hero Image** (Landing): High-quality 3D render of molecular structure or laboratory simulation interface - positioned right side of hero split layout
2. **Simulation Thumbnails**: Preview images for each simulation card - 16:9 aspect ratio, showing key visual from the simulation
3. **Training Path Images**: Illustrative images for biology/chemistry learning paths  
4. **Testimonial Photos**: Educator/student headshots - circular crop, 80px-100px
5. **About Page Team**: Optional team photos
6. **Feature Section Graphics**: Abstract scientific illustrations (DNA helix, beakers, molecular bonds)

**Image Treatment**: 
- Rounded corners (rounded-lg or rounded-xl)
- Subtle border on cards
- Lazy loading for performance

---

## Accessibility & Polish

- High contrast ratios for all text
- Focus indicators on all interactive elements
- ARIA labels for 3D controls and complex interactions
- Keyboard navigation for entire lab interface
- Screen reader announcements for simulation state changes
- Consistent 8px baseline grid throughout

---

## Special Considerations

**3D Lab Interface**: Distinct from rest of site - darker treatment acceptable for canvas area to make molecules stand out, but maintain consistent controls/panels

**Scientific Notation**: Use KaTeX rendering for chemical equations, consistent monospace for formulas

**Gamification**: Subtle celebration animations for achievements (confetti, badge reveals) - but sparingly

**Multi-column Usage**: Strategic application - not overused. Hero sections stay focused, content sections use grids where showing multiple items adds value.