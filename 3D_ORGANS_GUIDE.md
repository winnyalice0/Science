# 3D Organs & Materials Browser - Implementation Guide

## Overview
A comprehensive system for browsing and viewing interactive 3D models of biological organs, chemical structures, and laboratory equipment. The system is organized by category and provides both thumbnail cards and detailed viewers.

## Features

### 1. **Three Main Categories**
- **Biology**: Human organs and cellular structures (Heart, Brain, Lungs, Liver, Kidney, DNA)
- **Chemistry**: Molecular structures and compounds (Water, Glucose, Protein, Salt, ATP)
- **Laboratory Materials**: Scientific equipment (Microscope, Beaker, Centrifuge, Spectrophotometer, Pipette, Petri Dish)

### 2. **Card Grid View**
- Compact thumbnail cards with:
  - Preview image
  - Organ/material name and description
  - Category badge (color-coded)
  - Difficulty level badge
  - Quick preview of learning topics
- Hover effects and smooth transitions
- Click to open detailed 3D viewer

### 3. **Detailed 3D Viewer Modal**
- Full-screen modal with split layout:
  - **Left (2/3)**: 3D model display (iframe or WebGL)
  - **Right (1/3)**: Information panel with:
    - Full description
    - All learning points
    - Category and difficulty badges
    - Download and Share buttons
- Loading indicator while model loads
- Close button for easy navigation

### 4. **Search & Filter**
- Real-time search across organ names and descriptions
- Category tabs for easy switching
- Statistics showing model counts per category

## File Structure

```
client/src/
├── lib/
│   └── organs-3d-data.ts          # Data definitions and utilities
├── components/
│   ├── organ-3d-card.tsx          # Card component for grid view
│   └── organ-3d-viewer.tsx        # Modal viewer for detailed 3D display
├── pages/
│   └── organs-3d-browser.tsx      # Main page with tabs and grid
└── App.tsx                         # Updated with new route
```

## Usage

### Accessing the Feature
1. Navigate to "3D Organs & Materials" in the sidebar menu
2. Or visit `/organs-3d` URL directly

### Browsing Models
1. Use category tabs to filter by type
2. Use search bar to find specific organs/materials
3. Click any card to open the detailed viewer

### Viewing 3D Models
1. 3D model displays in iframe (if model is HTML file)
2. Read description and learning points on the right
3. Use Download/Share buttons for additional actions
4. Click X to close and return to grid view

## Data Structure (Organ3D Interface)

```typescript
interface Organ3D {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  category: string;              // "Biology" | "Chemistry" | "Laboratory Materials"
  description: string;           // Short description (shown on card)
  thumbnail: string;             // URL to preview image
  model: string;                 // URL to 3D model (HTML iframe)
  fullDescription: string;       // Detailed description (shown in viewer)
  learningPoints: string[];      // Array of key topics
  difficulty: string;            // "Beginner" | "Intermediate" | "Advanced"
}
```

## Adding New 3D Models

To add a new organ or material:

1. Add entry to `organs3DData` array in `lib/organs-3d-data.ts`:
```typescript
{
  id: "unique-id",
  name: "Model Name",
  category: "Biology" | "Chemistry" | "Laboratory Materials",
  description: "Short description",
  thumbnail: "/3d-models/category/model-thumb.png",
  model: "/3d-models/category/model.html",
  fullDescription: "Detailed description...",
  learningPoints: ["Point 1", "Point 2", "Point 3", "Point 4"],
  difficulty: "Beginner" | "Intermediate" | "Advanced",
}
```

2. Place 3D model files in appropriate directory:
   - `/public/3d-models/biology/`
   - `/public/3d-models/chemistry/`
   - `/public/3d-models/lab/`

3. Models should be HTML files that can be embedded as iframes

## Styling & Colors

### Category Colors
- **Biology**: Green (`bg-green-500`)
- **Chemistry**: Blue (`bg-blue-500`)
- **Laboratory Materials**: Purple (`bg-purple-500`)

### Difficulty Colors
- **Beginner**: Green badge
- **Intermediate**: Yellow badge
- **Advanced**: Red badge

## Components Reference

### Organ3DCard
- **Props**: `organ: Organ3D`, `onClick: (organ: Organ3D) => void`
- **Features**: Thumbnail, badges, learning points preview
- **Used in**: Grid display

### Organ3DViewer
- **Props**: `organ: Organ3D`, `onClose: () => void`
- **Features**: Modal display, 3D viewer, info panel, actions
- **Used in**: Detailed view

### Organ3DBrowser (Page)
- **Route**: `/organs-3d`
- **Features**: Tabs, search, grid, stats
- **Layout**: Full-page browsing experience

## Navigation Integration

The new page is integrated into:
- **Sidebar Menu**: "3D Organs & Materials" with microscope icon
- **Routes**: `/organs-3d` public route
- **App.tsx**: Imported and registered

## Future Enhancements

1. **Backend Integration**: Fetch 3D models from API instead of static data
2. **User Annotations**: Add ability to annotate 3D models
3. **Interactive Controls**: Custom 3D controls (rotation, zoom, etc.)
4. **Model Upload**: Admin panel for uploading new models
5. **Learning Path**: Link models to structured learning modules
6. **AR Preview**: Augmented reality preview of models
7. **Favorites**: Save favorite models to user profile
8. **Export**: Download model data in various formats

## Technical Notes

- Models are loaded as iframes from HTML files
- Fallback placeholder shown if image fails to load
- SVG placeholder generated for missing thumbnails
- ScrollArea component used for long description lists
- Modal overlay with z-index 50 for proper stacking
- Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
