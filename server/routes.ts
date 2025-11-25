import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage, supabase } from "./storage";
import { 
  insertProfileSchema,
  updateProfileSchema,
  insertSimulationSchema,
  insertWorkspaceSchema,
  insertWorkspaceItemSchema,
  insertSimulationHistorySchema,
} from "@shared/schema";
import { z } from "zod";

// Simple auth middleware - in production this would verify JWT tokens
async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  // For MVP, we'll use a query parameter or header for user ID
  // In production, this would decode a JWT token from Authorization header
  const userId = req.query.userId as string || req.headers['x-user-id'] as string || "demo-user";
  (req as any).userId = userId;
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ============= Authentication Routes (Supabase Auth) =============
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, skillLevel } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Create auth user in Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      if (!authData.user) {
        return res.status(400).json({ error: "Failed to create user" });
      }

      // Create profile with Zod validation
      const profileData = insertProfileSchema.parse({
        userId: authData.user.id,
        skillLevel: skillLevel || "beginner",
      });

      const profile = await storage.createProfile(profileData);

      res.json({ user: authData.user, profile, session: authData.session });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ user: data.user, session: data.session });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= Profile Routes =============
  app.get("/api/profile", optionalAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      
      let profile = await storage.getProfile(userId);
      
      // Create a default profile if it doesn't exist
      if (!profile) {
        const profileData = insertProfileSchema.parse({
          userId,
          skillLevel: "beginner",
        });
        profile = await storage.createProfile(profileData);
      }

      res.json(profile);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/profile", optionalAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const updates = updateProfileSchema.parse(req.body);
      
      const profile = await storage.updateProfile(userId, updates);
      res.json(profile);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // ============= Simulation Routes =============
  app.get("/api/simulations", async (req, res) => {
    try {
      const simulations = await storage.getAllSimulations();
      res.json(simulations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/simulations/:id", async (req, res) => {
    try {
      const simulation = await storage.getSimulation(req.params.id);
      if (!simulation) {
        return res.status(404).json({ error: "Simulation not found" });
      }
      res.json(simulation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/simulations", async (req, res) => {
    try {
      const validatedData = insertSimulationSchema.parse(req.body);
      const simulation = await storage.createSimulation(validatedData);
      res.json(simulation);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // ============= Workspace Routes =============
  app.get("/api/workspaces", optionalAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const workspaces = await storage.getUserWorkspaces(userId);
      res.json(workspaces);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/workspaces", optionalAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const validatedData = insertWorkspaceSchema.parse({
        ...req.body,
        userId,
      });
      const workspace = await storage.createWorkspace(validatedData);
      res.json(workspace);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/workspaces/:id", optionalAuth, async (req, res) => {
    try {
      await storage.deleteWorkspace(req.params.id);
      res.json({ message: "Workspace deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= Workspace Item Routes =============
  app.get("/api/workspaces/:id/items", async (req, res) => {
    try {
      const items = await storage.getWorkspaceItems(req.params.id);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/workspace-items", optionalAuth, async (req, res) => {
    try {
      const validatedData = insertWorkspaceItemSchema.parse(req.body);
      const item = await storage.createWorkspaceItem(validatedData);
      res.json(item);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/workspace-items/:id", optionalAuth, async (req, res) => {
    try {
      await storage.deleteWorkspaceItem(req.params.id);
      res.json({ message: "Workspace item deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= Simulation History Routes =============
  app.get("/api/simulation-history/recent", optionalAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const limit = parseInt(req.query.limit as string) || 10;
      const history = await storage.getUserSimulationHistory(userId, limit);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/simulation-history", optionalAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const validatedData = insertSimulationHistorySchema.parse({
        ...req.body,
        userId,
      });
      const history = await storage.createSimulationHistory(validatedData);
      
      // Increment simulation completion count if completed
      if (history.completed && history.simulationId) {
        await storage.incrementSimulationCompletion(history.simulationId);
      }

      res.json(history);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
