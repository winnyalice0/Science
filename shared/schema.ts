import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (authentication)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User profiles (with skill level assessment)
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  skillLevel: text("skill_level").notNull().default("beginner"), // beginner, intermediate, advanced
  xp: integer("xp").notNull().default(0),
  bio: text("bio"),
  completedSimulations: integer("completed_simulations").notNull().default(0),
  totalHoursLogged: integer("total_hours_logged").notNull().default(0),
  lastAssessmentDate: timestamp("last_assessment_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

// Simulations catalog
export const simulations = pgTable("simulations", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(), // Biology, Chemistry, Biochemistry
  difficulty: text("difficulty").notNull(), // Beginner, Intermediate, Advanced
  duration: integer("duration").notNull(), // in minutes
  thumbnailUrl: text("thumbnail_url"),
  type: text("type").notNull(), // acid-base, precipitation, redox, enzyme-kinetics, pcr, etc.
  tags: text("tags").array(),
  completionCount: integer("completion_count").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({
  id: true,
  createdAt: true,
  completionCount: true,
});

export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type Simulation = typeof simulations.$inferSelect;

// Workspaces (user's custom project areas)
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(false),
  collaborators: text("collaborators").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type Workspace = typeof workspaces.$inferSelect;

// Workspace items (saved experiments/simulations)
export const workspaceItems = pgTable("workspace_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  simulationId: uuid("simulation_id").references(() => simulations.id, { onDelete: 'set null' }),
  title: text("title").notNull(),
  data: jsonb("data"), // Stores simulation state, observations, parameters
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWorkspaceItemSchema = createInsertSchema(workspaceItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWorkspaceItem = z.infer<typeof insertWorkspaceItemSchema>;
export type WorkspaceItem = typeof workspaceItems.$inferSelect;

// Simulation history (tracks user's simulation runs)
export const simulationHistory = pgTable("simulation_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  simulationId: uuid("simulation_id").notNull().references(() => simulations.id, { onDelete: 'cascade' }),
  score: integer("score"),
  duration: integer("duration"), // actual time spent in seconds
  completed: boolean("completed").notNull().default(false),
  observations: jsonb("observations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSimulationHistorySchema = createInsertSchema(simulationHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertSimulationHistory = z.infer<typeof insertSimulationHistorySchema>;
export type SimulationHistory = typeof simulationHistory.$inferSelect;
