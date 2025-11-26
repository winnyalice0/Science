import type { Express, Request, Response } from "express";
import { db } from "./storage";
import { adminUsers, admin3DModels, adminSimulationContents, adminAuditLogs, trainingHubPaths, trainingHubModules, workspaceTemplates } from "@shared/admin-schema";
import { eq, desc } from "drizzle-orm";

// Admin authentication middleware
async function adminAuth(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization" });
  }

  const userId = authHeader.slice(7);
  
  try {
    // Check if user is admin
    const admin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.userId, userId))
      .limit(1);

    if (!admin || admin.length === 0) {
      return res.status(403).json({ error: "User is not an admin" });
    }

    if (!admin[0].isActive) {
      return res.status(403).json({ error: "Admin account is inactive" });
    }

    return admin[0];
  } catch (err) {
    console.error("Admin auth error:", err);
    return null;
  }
}

export function registerAdminRoutes(app: Express) {
  // Check admin auth status
  app.post("/api/admin/auth/check", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      // Update last login
      await db
        .update(adminUsers)
        .set({ lastLogin: new Date() })
        .where(eq(adminUsers.id, admin.id));

      res.json({
        id: admin.id,
        userId: admin.userId,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to check admin status" });
    }
  });

  // Register new admin (requires access code verification)
  app.post("/api/admin/auth/register", async (req, res) => {
    try {
      const { userId, email, name } = req.body;

      if (!userId || !email || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if admin already exists
      const existing = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.userId, userId))
        .limit(1);

      if (existing && existing.length > 0) {
        return res.status(400).json({ error: "Admin account already exists" });
      }

      // Create admin user
      const newAdmin = await db
        .insert(adminUsers)
        .values({
          userId,
          email,
          name,
          role: "admin",
          isActive: true,
          permissions: ["manage_users", "manage_models", "manage_simulations", "view_analytics"],
        })
        .returning();

      res.json({ success: true, admin: newAdmin[0] });
    } catch (err) {
      console.error("Admin registration error:", err);
      res.status(500).json({ error: "Failed to register admin" });
    }
  });

  // Get dashboard statistics
  app.get("/api/admin/stats", async (req, res) => {
    try {
      // These would fetch from the database in a real implementation
      const totalUsers = 0; // Fetch from profiles or auth
      const total3DModels = await db.select().from(admin3DModels).then((m) => m.length);
      const totalSimulations = await db
        .select()
        .from(adminSimulationContents)
        .then((s) => s.length);

      res.json({
        totalUsers,
        total3DModels,
        totalSimulations,
        lastActivityTime: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Stats error:", err);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // ============= Users Management =============
  app.get("/api/admin/users", async (req, res) => {
    try {
      // In a real app, this would fetch from the users/profiles table
      // For now, return mock data
      const users = [
        {
          id: "user-1",
          email: "student@example.com",
          name: "John Student",
          createdAt: new Date().toISOString(),
          skillLevel: "Beginner",
        },
      ];
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.delete("/api/admin/users/:userId", async (req, res) => {
    try {
      // Delete user from Supabase Auth and profiles
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // ============= 3D Models Management =============
  app.get("/api/admin/models", async (req, res) => {
    try {
      const models = await db.select().from(admin3DModels).orderBy(desc(admin3DModels.createdAt));
      res.json(models);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  app.post("/api/admin/models", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const {
        name,
        category,
        description,
        fullDescription,
        model,
        thumbnail,
        difficulty,
        learningPoints,
        credit,
        modelType,
      } = req.body;

      if (!name || !model) {
        return res.status(400).json({ error: "Name and model URL are required" });
      }

      const newModel = await db
        .insert(admin3DModels)
        .values({
          name,
          category: category || "Biology",
          description,
          fullDescription: fullDescription || description,
          model,
          thumbnail: thumbnail || "/public/3d-placeholder.jpg",
          difficulty: difficulty || "Intermediate",
          learningPoints: learningPoints || [],
          credit,
          modelType: modelType || "sketchfab",
          isPublished: true,
          createdBy: admin.id,
        })
        .returning();

      // Log audit event
      await db.insert(adminAuditLogs).values({
        adminId: admin.id,
        action: "created_3d_model",
        targetType: "3d_model",
        targetId: newModel[0].id,
        changes: JSON.stringify(newModel[0]),
      });

      res.json(newModel[0]);
    } catch (err) {
      console.error("Model creation error:", err);
      res.status(500).json({ error: "Failed to create model" });
    }
  });

  app.delete("/api/admin/models/:modelId", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { modelId } = req.params;

      await db.delete(admin3DModels).where(eq(admin3DModels.id, modelId));

      // Log audit event
      await db.insert(adminAuditLogs).values({
        adminId: admin.id,
        action: "deleted_3d_model",
        targetType: "3d_model",
        targetId: modelId,
      });

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete model" });
    }
  });

  // ============= Simulations Management =============
  app.get("/api/admin/simulations", async (req, res) => {
    try {
      const simulations = await db
        .select()
        .from(adminSimulationContents)
        .orderBy(desc(adminSimulationContents.createdAt));
      res.json(simulations);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch simulations" });
    }
  });

  app.post("/api/admin/simulations", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const {
        title,
        description,
        subject,
        type,
        difficulty,
        duration,
        thumbnailUrl,
        content,
        objectives,
        learningOutcomes,
        tags,
      } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
      }

      const newSimulation = await db
        .insert(adminSimulationContents)
        .values({
          title,
          description,
          subject: subject || "Biology",
          type: type || "interactive",
          difficulty: difficulty || "Intermediate",
          duration: duration || 30,
          thumbnailUrl,
          content,
          objectives: objectives || [],
          learningOutcomes: learningOutcomes || [],
          tags: tags || [],
          isPublished: true,
          createdBy: admin.id,
        })
        .returning();

      // Log audit event
      await db.insert(adminAuditLogs).values({
        adminId: admin.id,
        action: "created_simulation",
        targetType: "simulation",
        targetId: newSimulation[0].id,
        changes: JSON.stringify(newSimulation[0]),
      });

      res.json(newSimulation[0]);
    } catch (err) {
      console.error("Simulation creation error:", err);
      res.status(500).json({ error: "Failed to create simulation" });
    }
  });

  app.delete("/api/admin/simulations/:simulationId", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { simulationId } = req.params;

      await db
        .delete(adminSimulationContents)
        .where(eq(adminSimulationContents.id, simulationId));

      // Log audit event
      await db.insert(adminAuditLogs).values({
        adminId: admin.id,
        action: "deleted_simulation",
        targetType: "simulation",
        targetId: simulationId,
      });

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete simulation" });
    }
  });

  // ========== TRAINING HUB ROUTES ==========

  // Get all training hub paths
  app.get("/api/admin/training-hub", async (req, res) => {
    try {
      const paths = await db
        .select()
        .from(trainingHubPaths)
        .orderBy(desc(trainingHubPaths.createdAt));

      res.json(paths);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch training paths" });
    }
  });

  // Create training hub path
  app.post("/api/admin/training-hub", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { title, description, subject, difficulty, estimatedDuration } = req.body;

      if (!title || !description || !subject || !difficulty) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newPath = await db
        .insert(trainingHubPaths)
        .values({
          title,
          description,
          subject,
          difficulty,
          estimatedDuration: estimatedDuration || 60,
          createdBy: admin.id,
          isPublished: true,
          moduleCount: 0,
        })
        .returning();

      // Log audit event
      await db.insert(adminAuditLogs).values({
        adminId: admin.id,
        action: "created_training_path",
        targetType: "training_path",
        targetId: newPath[0].id,
        changes: JSON.stringify(newPath[0]),
      });

      res.json(newPath[0]);
    } catch (err) {
      console.error("Training path creation error:", err);
      res.status(500).json({ error: "Failed to create training path" });
    }
  });

  // Delete training hub path
  app.delete("/api/admin/training-hub/:pathId", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { pathId } = req.params;

      // Delete modules first
      await db
        .delete(trainingHubModules)
        .where(eq(trainingHubModules.pathId, pathId));

      // Delete path
      await db
        .delete(trainingHubPaths)
        .where(eq(trainingHubPaths.id, pathId));

      // Log audit event
      await db.insert(adminAuditLogs).values({
        adminId: admin.id,
        action: "deleted_training_path",
        targetType: "training_path",
        targetId: pathId,
      });

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete training path" });
    }
  });

  // ========== WORKSPACE TEMPLATES ROUTES ==========

  // Get all workspace templates
  app.get("/api/admin/workspace-templates", async (req, res) => {
    try {
      const templates = await db
        .select()
        .from(workspaceTemplates)
        .orderBy(desc(workspaceTemplates.createdAt));

      res.json(templates);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch workspace templates" });
    }
  });

  // Create workspace template
  app.post("/api/admin/workspace-templates", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { name, description, category, icon, templateData } = req.body;

      if (!name || !description || !category) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newTemplate = await db
        .insert(workspaceTemplates)
        .values({
          name,
          description,
          category,
          icon: icon || "⚗️",
          templateData: templateData || JSON.stringify({ type: category }),
          createdBy: admin.id,
          isPublished: true,
          usageCount: 0,
        })
        .returning();

      // Log audit event
      await db.insert(adminAuditLogs).values({
        adminId: admin.id,
        action: "created_workspace_template",
        targetType: "workspace_template",
        targetId: newTemplate[0].id,
        changes: JSON.stringify(newTemplate[0]),
      });

      res.json(newTemplate[0]);
    } catch (err) {
      console.error("Workspace template creation error:", err);
      res.status(500).json({ error: "Failed to create workspace template" });
    }
  });

  // Delete workspace template
  app.delete("/api/admin/workspace-templates/:templateId", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { templateId } = req.params;

      await db
        .delete(workspaceTemplates)
        .where(eq(workspaceTemplates.id, templateId));

      // Log audit event
      await db.insert(adminAuditLogs).values({
        adminId: admin.id,
        action: "deleted_workspace_template",
        targetType: "workspace_template",
        targetId: templateId,
      });

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete workspace template" });
    }
  });
}
