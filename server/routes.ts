import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, supabase } from "./storage";
import { 
  insertUserSchema, 
  insertProfileSchema,
  insertSimulationSchema,
  insertWorkspaceSchema,
  insertWorkspaceItemSchema,
  insertSimulationHistorySchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // ============= Authentication Routes =============
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password } = req.body;
      
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

      // Create profile
      const profile = await storage.createProfile({
        userId: authData.user.id,
        skillLevel: req.body.skillLevel || "beginner",
        xp: 0,
        completedSimulations: 0,
        totalHoursLogged: 0,
      });

      res.json({ user: authData.user, profile });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
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

  app.get("/api/auth/user", async (req, res) => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        return res.status(401).json({ error: error.message });
      }
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= Profile Routes =============
  app.get("/api/profile", async (req, res) => {
    try {
      // For now, we'll mock the user ID. In production, this would come from auth session
      const userId = req.query.userId as string || "mock-user-id";
      
      let profile = await storage.getProfile(userId);
      
      // Create a default profile if it doesn't exist
      if (!profile) {
        profile = await storage.createProfile({
          userId,
          skillLevel: "beginner",
          xp: 0,
          completedSimulations: 0,
          totalHoursLogged: 0,
        });
      }

      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/profile", async (req, res) => {
    try {
      const userId = req.query.userId as string || "mock-user-id";
      const updates = req.body;
      
      const profile = await storage.updateProfile(userId, updates);
      res.json(profile);
    } catch (error: any) {
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
      res.status(400).json({ error: error.message });
    }
  });

  // ============= Workspace Routes =============
  app.get("/api/workspaces", async (req, res) => {
    try {
      const userId = req.query.userId as string || "mock-user-id";
      const workspaces = await storage.getUserWorkspaces(userId);
      res.json(workspaces);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/workspaces", async (req, res) => {
    try {
      const userId = req.query.userId as string || "mock-user-id";
      const validatedData = insertWorkspaceSchema.parse({
        ...req.body,
        userId,
      });
      const workspace = await storage.createWorkspace(validatedData);
      res.json(workspace);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/workspaces/:id", async (req, res) => {
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

  app.post("/api/workspace-items", async (req, res) => {
    try {
      const validatedData = insertWorkspaceItemSchema.parse(req.body);
      const item = await storage.createWorkspaceItem(validatedData);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============= Simulation History Routes =============
  app.get("/api/simulation-history/recent", async (req, res) => {
    try {
      const userId = req.query.userId as string || "mock-user-id";
      const limit = parseInt(req.query.limit as string) || 10;
      const history = await storage.getUserSimulationHistory(userId, limit);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/simulation-history", async (req, res) => {
    try {
      const userId = req.query.userId as string || "mock-user-id";
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
      res.status(400).json({ error: error.message });
    }
  });

  // ============= Seed Data Route (for development) =============
  app.post("/api/seed", async (req, res) => {
    try {
      const seedSimulations = [
        {
          title: "Acid-Base Neutralization",
          description: "Explore the fundamentals of acid-base chemistry by mixing HCl and NaOH to observe neutralization reactions, pH changes, and heat release.",
          subject: "Chemistry",
          difficulty: "Beginner",
          duration: 10,
          type: "acid-base",
          tags: ["acids", "bases", "pH", "neutralization"],
          featured: true,
        },
        {
          title: "Precipitation Reactions",
          description: "Mix silver nitrate and sodium chloride to observe the formation of silver chloride precipitate and learn about solubility rules.",
          subject: "Chemistry",
          difficulty: "Beginner",
          duration: 15,
          type: "precipitation",
          tags: ["precipitation", "solubility", "ionic"],
          featured: true,
        },
        {
          title: "Redox Reactions",
          description: "Study oxidation-reduction reactions by observing zinc metal reacting with hydrochloric acid to produce hydrogen gas.",
          subject: "Chemistry",
          difficulty: "Intermediate",
          duration: 20,
          type: "redox",
          tags: ["oxidation", "reduction", "electrons"],
          featured: false,
        },
        {
          title: "Cell Structure Explorer",
          description: "Take a 3D tour inside a eukaryotic cell, identifying organelles like mitochondria, nucleus, and endoplasmic reticulum.",
          subject: "Biology",
          difficulty: "Beginner",
          duration: 15,
          type: "cell-structure",
          tags: ["cells", "organelles", "biology basics"],
          featured: true,
        },
        {
          title: "DNA Replication",
          description: "Watch the DNA double helix unwind and see how new strands are synthesized through complementary base pairing.",
          subject: "Biochemistry",
          difficulty: "Intermediate",
          duration: 20,
          type: "dna-replication",
          tags: ["DNA", "replication", "genetics"],
          featured: true,
        },
        {
          title: "Enzyme Kinetics",
          description: "Study Michaelis-Menten kinetics by varying substrate concentration and observing enzyme reaction rates.",
          subject: "Biochemistry",
          difficulty: "Advanced",
          duration: 30,
          type: "enzyme-kinetics",
          tags: ["enzymes", "kinetics", "catalysis"],
          featured: false,
        },
      ];

      for (const sim of seedSimulations) {
        await storage.createSimulation(sim);
      }

      res.json({ message: "Seed data created successfully", count: seedSimulations.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
