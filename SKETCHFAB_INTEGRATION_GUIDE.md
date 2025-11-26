# 🎯 Sketchfab Integration Guide

## How to Get Sketchfab Model Embed URLs

### Step 1: Find Your Model
1. Go to [Sketchfab.com](https://sketchfab.com)
2. Search for a 3D model (e.g., "Heart Anatomy", "Brain", "DNA")
3. Click on the model to open it

### Step 2: Get the Embed URL
1. Click the "Share" button (usually top right)
2. Look for "Embed" option
3. Copy the embed code or URL

**Example Embed Code:**
```html
<div class="sketchfab-embed-wrapper">
  <iframe title="Human Heart Anatomy Labeled"
    frameborder="0"
    allowfullscreen mozallowfullscreen="true"
    webkitallowfullscreen="true"
    allow="autoplay; fullscreen; xr-spatial-tracking"
    xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share
    src="https://sketchfab.com/models/1b7bfb07e6b24dd891099395ed98e989/embed">
  </iframe>
</div>
```

### Step 3: Extract the Model ID
From the URL above: `https://sketchfab.com/models/**1b7bfb07e6b24dd891099395ed98e989**/embed`

The model ID is: `1b7bfb07e6b24dd891099395ed98e989`

## How to Add Models to the System

### Update the Data File

Edit `client/src/lib/organs-3d-data.ts` and update the model entries:

**Example - Heart Model:**

```typescript
{
  id: "bio-heart",
  name: "Human Heart",
  category: "Biology",
  description: "The pumping organ of the circulatory system",
  thumbnail: "/3d-models/biology/heart-thumb.png",
  model: "https://sketchfab.com/models/1b7bfb07e6b24dd891099395ed98e989/embed",
  modelType: "sketchfab",
  fullDescription:
    "The heart is a muscular organ about the size of a closed fist...",
  learningPoints: [
    "Cardiac chambers and valves",
    "Blood flow through the heart",
    "Electrical conduction system",
    "Heart sounds and pulses",
  ],
  difficulty: "Intermediate",
  credit: "Human Heart Anatomy Labeled by srikanthsamba on Sketchfab",
}
```

## Recommended Sketchfab Models

### Biology Models
| Organ | Search Term | Typical Model ID Pattern |
|-------|------------|------------------------|
| Heart | "Human Heart Anatomy" | Usually 1b7bfb... |
| Brain | "Human Brain 3D" | Various lengths |
| Lungs | "Respiratory System" | Usually detailed |
| Liver | "Liver Anatomy" | Medium complexity |
| Kidney | "Kidney 3D Model" | Often detailed |
| DNA | "DNA Double Helix" | Simple geometric |

### Chemistry Models
| Molecule | Search Term | Notes |
|----------|------------|-------|
| Water | "H2O Molecule 3D" | Simple structure |
| Glucose | "Glucose Molecule" | Ring structure |
| Protein | "Protein Structure" | Complex folding |
| Salt | "NaCl Crystal" | Lattice structure |
| ATP | "ATP Molecule" | Nucleotide form |

### Lab Equipment
| Equipment | Search Term | Notes |
|-----------|------------|-------|
| Microscope | "Microscope 3D" | Detailed model |
| Beaker | "Laboratory Beaker" | Simple cylinder |
| Centrifuge | "Laboratory Centrifuge" | Mechanical |
| Spectrophotometer | "Spectrophotometer" | Instrument |
| Pipette | "Micropipette" | Small scale |
| Petri Dish | "Petri Dish Plate" | Simple disk |

## Popular Sketchfab Artists

These artists have great scientific models:

- **srikanthsamba** - Medical and anatomical models
- **Khairul Amri** - Laboratory equipment
- **Valerio Ferretti** - Scientific instruments
- **LightUpCube** - Molecular structures
- **SciArt Studio** - Educational scientific models

## URL Format

**Sketchfab Embed URL Pattern:**
```
https://sketchfab.com/models/{MODEL_ID}/embed
```

**Where:**
- `{MODEL_ID}` = The unique identifier from the model page

**Example:**
```
https://sketchfab.com/models/1b7bfb07e6b24dd891099395ed98e989/embed
```

## Model Type Options

The system now supports three model types:

### 1. Sketchfab (Recommended)
```typescript
modelType: "sketchfab",
model: "https://sketchfab.com/models/{ID}/embed"
```
✅ Interactive 3D with mouse controls
✅ Easy to embed
✅ Good selection of models

### 2. HTML/IFrame
```typescript
modelType: "iframe",
model: "/path/to/your/model.html"
```
✅ Custom Three.js or Babylon.js models
⚠️ Requires hosting

### 3. Direct HTML Files
```typescript
modelType: "html",
model: "/public/3d-models/biology/custom.html"
```
✅ Full control over viewer
⚠️ More setup required

## Step-by-Step: Adding a Heart Model

### 1. Search Sketchfab
Visit: https://sketchfab.com
Search: "Human Heart Anatomy"

### 2. Find a Good Model
- Look for models with good ratings
- Check if it's downloadable (not required but nice)
- Read the description for accuracy

### 3. Get Embed Link
- Click on model
- Click "Share" button
- Copy the embed URL

### 4. Update Data File
Edit `client/src/lib/organs-3d-data.ts`:

```typescript
{
  id: "bio-heart",
  name: "Human Heart",
  category: "Biology",
  description: "The pumping organ of the circulatory system",
  thumbnail: "/3d-models/biology/heart-thumb.png",
  model: "https://sketchfab.com/models/YOUR_MODEL_ID/embed",  // ← Paste your URL here
  modelType: "sketchfab",
  fullDescription: "The heart is a muscular organ...",
  learningPoints: [
    "Cardiac chambers and valves",
    "Blood flow through the heart",
    "Electrical conduction system",
    "Heart sounds and pulses",
  ],
  difficulty: "Intermediate",
  credit: "Model Name by Artist on Sketchfab",  // ← Update credit
}
```

### 5. Add Thumbnail (Optional)
- Take a screenshot of the model
- Save as `/public/3d-models/biology/heart-thumb.png`
- Or use a placeholder image

### 6. Test!
1. Save the file
2. App hot-reloads automatically
3. Navigate to "3D Organs & Materials"
4. Click on your model to see it displayed

## Troubleshooting

### Model Doesn't Load
- ✅ Check URL is correct
- ✅ Verify model is public (not private)
- ✅ Ensure `modelType: "sketchfab"` is set
- ✅ Check browser console for errors

### Embed Permissions Error
- The model creator may have disabled embedding
- Try a different model
- Or download and host your own

### Thumbnail Not Showing
- Make sure image file exists
- Check file path is correct
- Verify image format (PNG, JPG, WebP)

### Model Loads Slowly
- Sketchfab models are usually optimized
- May be network speed issue
- Loading indicator shows while loading

## Bulk Update Example

Here's how to quickly update multiple models:

```typescript
// Find these models on Sketchfab and get their IDs:
const modelMapping = {
  "bio-heart": "1b7bfb07e6b24dd891099395ed98e989",      // Real ID - Heart
  "bio-brain": "YOUR_BRAIN_MODEL_ID",                    // Replace with real ID
  "bio-lungs": "YOUR_LUNGS_MODEL_ID",                    // Replace with real ID
  "chem-water": "YOUR_WATER_MODEL_ID",                   // Replace with real ID
  // ... etc
};

// Then update each model URL:
// model: `https://sketchfab.com/models/${modelMapping[id]}/embed`
```

## Best Practices

✅ **Do:**
- Choose models with good quality
- Verify anatomical/chemical accuracy
- Credit the original artist
- Test model loading
- Use variety of difficulty levels

❌ **Don't:**
- Use copyrighted models without permission
- Embed private/unlisted models
- Use low-quality placeholder models
- Forget to update credit information

## Finding High-Quality Models

### Search Tips
1. Sort by "Newest" for latest models
2. Filter by "Downloadable" for well-maintained models
3. Check ratings and download count
4. Read reviews from educators

### Collection Links
- Educational Models: https://sketchfab.com/collections/education
- Anatomical Models: https://sketchfab.com/search?q=anatomy
- Molecular Structures: https://sketchfab.com/search?q=molecule

## Future: Backend Integration

Once backend is ready, models can be stored in database:

```typescript
// Future implementation
interface Model3D {
  id: string;
  modelType: "sketchfab" | "custom";
  embedUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Then fetch from API
const models = await fetch("/api/models/3d");
```

---

**Last Updated**: November 2025
**Status**: Ready for Sketchfab Integration
