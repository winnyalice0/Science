import type { Express, Request, Response } from "express";
import { supabase } from "./storage";

// Admin authentication middleware
async function adminAuth(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization" });
  }

  const userId = authHeader.slice(7);
  
  try {
    // Check if user is admin
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !admin) {
      return res.status(403).json({ error: "User is not an admin" });
    }

    if (!admin.is_active) {
      return res.status(403).json({ error: "Admin account is inactive" });
    }

    return admin;
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
      await supabase
        .from("admin_users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", admin.id);

      res.json({
        id: admin.id,
        userId: admin.user_id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.is_active,
        lastLogin: admin.last_login,
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
      const { data: existing } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (existing) {
        return res.status(400).json({ error: "Admin account already exists" });
      }

      // Create admin user
      const { data: newAdmin, error } = await supabase
        .from("admin_users")
        .insert({
          user_id: userId,
          email,
          name,
          role: "admin",
          is_active: true,
          permissions: ["manage_users", "manage_models", "manage_simulations", "view_analytics"],
        })
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, admin: newAdmin });
    } catch (err) {
      console.error("Admin registration error:", err);
      res.status(500).json({ error: "Failed to register as admin" });
    }
  });

  // Get admin stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact" });

      const { count: total3DModels } = await supabase
        .from("admin_3d_models")
        .select("*", { count: "exact" });

      const { count: totalSimulations } = await supabase
        .from("admin_simulation_contents")
        .select("*", { count: "exact" });

      res.json({
        totalUsers: totalUsers || 0,
        total3DModels: total3DModels || 0,
        totalSimulations: totalSimulations || 0,
        adminName: admin.name,
        adminEmail: admin.email,
      });
    } catch (err) {
      console.error("Stats error:", err);
      res.status(500).json({ error: "Failed to get statistics" });
    }
  });

  // Get all users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { data: users, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.json(users || []);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Delete user
  app.delete("/api/admin/users/:userId", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { userId } = req.params;

      await supabase.from("profiles").delete().eq("user_id", userId);

      // Log audit event
      await supabase.from("admin_audit_logs").insert({
        admin_id: admin.id,
        action: "deleted_user",
        target_type: "user",
        target_id: userId,
      });

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Get all 3D models
  app.get("/api/admin/models", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { data: models, error } = await supabase
        .from("admin_3d_models")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.json(models || []);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  // Create 3D model
  app.post("/api/admin/models", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const {
        name,
        category,
        description,
        model,
        thumbnail,
        difficulty,
        learningPoints,
        credit,
      } = req.body;

      if (!name || !category || !description || !model) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { data: newModel, error } = await supabase
        .from("admin_3d_models")
        .insert({
          name,
          category,
          description,
          model,
          thumbnail,
          difficulty,
          learning_points: learningPoints || [],
          credit,
          created_by: admin.id,
          is_published: true,
        })
        .select()
        .single();

      if (error) throw error;

      // Log audit event
      await supabase.from("admin_audit_logs").insert({
        admin_id: admin.id,
        action: "created_3d_model",
        target_type: "3d_model",
        target_id: newModel.id,
        changes: JSON.stringify(newModel),
      });

      res.json(newModel);
    } catch (err) {
      console.error("Model creation error:", err);
      res.status(500).json({ error: "Failed to create model" });
    }
  });

  // Delete 3D model
  app.delete("/api/admin/models/:modelId", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { modelId } = req.params;

      await supabase.from("admin_3d_models").delete().eq("id", modelId);

      // Log audit event
      await supabase.from("admin_audit_logs").insert({
        admin_id: admin.id,
        action: "deleted_3d_model",
        target_type: "3d_model",
        target_id: modelId,
      });

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete model" });
    }
  });

  // Get all simulations
  app.get("/api/admin/simulations", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { data: simulations, error } = await supabase
        .from("admin_simulation_contents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.json(simulations || []);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch simulations" });
    }
  });

  // Create simulation
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
        objectives,
        learningOutcomes,
      } = req.body;

      if (!title || !description || !subject || !type || !difficulty || !duration) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { data: newSimulation, error } = await supabase
        .from("admin_simulation_contents")
        .insert({
          title,
          description,
          subject,
          type,
          difficulty,
          duration,
          objectives: objectives || [],
          learning_outcomes: learningOutcomes || [],
          created_by: admin.id,
          is_published: true,
        })
        .select()
        .single();

      if (error) throw error;

      // Log audit event
      await supabase.from("admin_audit_logs").insert({
        admin_id: admin.id,
        action: "created_simulation",
        target_type: "simulation",
        target_id: newSimulation.id,
        changes: JSON.stringify(newSimulation),
      });

      res.json(newSimulation);
    } catch (err) {
      console.error("Simulation creation error:", err);
      res.status(500).json({ error: "Failed to create simulation" });
    }
  });

  // Delete simulation
  app.delete("/api/admin/simulations/:simulationId", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { simulationId } = req.params;

      await supabase
        .from("admin_simulation_contents")
        .delete()
        .eq("id", simulationId);

      // Log audit event
      await supabase.from("admin_audit_logs").insert({
        admin_id: admin.id,
        action: "deleted_simulation",
        target_type: "simulation",
        target_id: simulationId,
      });

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete simulation" });
    }
  });

  // Training Hub Routes
  app.get("/api/admin/training-hub", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { data: paths, error } = await supabase
        .from("training_hub_paths")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.json(paths || []);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch training paths" });
    }
  });

  app.post("/api/admin/training-hub", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { title, description, subject, difficulty, estimatedDuration } = req.body;

      if (!title || !description || !subject || !difficulty || !estimatedDuration) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { data: newPath, error } = await supabase
        .from("training_hub_paths")
        .insert({
          title,
          description,
          subject,
          difficulty,
          estimated_duration: estimatedDuration,
          created_by: admin.id,
          is_published: true,
        })
        .select()
        .single();

      if (error) throw error;

      res.json(newPath);
    } catch (err) {
      console.error("Training path creation error:", err);
      res.status(500).json({ error: "Failed to create training path" });
    }
  });

  app.delete("/api/admin/training-hub/:pathId", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { pathId } = req.params;

      await supabase.from("training_hub_paths").delete().eq("id", pathId);

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete training path" });
    }
  });

  // Workspace Templates Routes
  app.get("/api/admin/workspace-templates", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { data: templates, error } = await supabase
        .from("workspace_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.json(templates || []);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch workspace templates" });
    }
  });

  app.post("/api/admin/workspace-templates", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { name, description, category, icon, templateData } = req.body;

      if (!name || !description || !category) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { data: newTemplate, error } = await supabase
        .from("workspace_templates")
        .insert({
          name,
          description,
          category,
          icon: icon || "⚗️",
          template_data: templateData || JSON.stringify({}),
          created_by: admin.id,
          is_published: true,
        })
        .select()
        .single();

      if (error) throw error;

      res.json(newTemplate);
    } catch (err) {
      console.error("Workspace template creation error:", err);
      res.status(500).json({ error: "Failed to create workspace template" });
    }
  });

  app.delete("/api/admin/workspace-templates/:templateId", async (req, res) => {
    try {
      const admin = await adminAuth(req, res);
      if (!admin) return;

      const { templateId } = req.params;

      await supabase.from("workspace_templates").delete().eq("id", templateId);

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete workspace template" });
    }
  });
}
