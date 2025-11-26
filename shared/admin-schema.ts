import { pgTable, text, varchar, uuid, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users table - separate from regular users
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(), // References Supabase auth.users(id)
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"), // admin, super_admin
  permissions: text("permissions").array().default([]), // Fine-grained permissions
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// 3D Models managed by admins
export const admin3DModels = pgTable("admin_3d_models", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(), // Biology, Chemistry, Laboratory Materials
  description: text("description").notNull(),
  fullDescription: text("full_description"),
  thumbnail: text("thumbnail"),
  model: text("model").notNull(), // Sketchfab embed URL
  modelType: text("model_type").notNull().default("sketchfab"), // sketchfab, iframe, html
  credit: text("credit"),
  difficulty: text("difficulty").notNull().default("Intermediate"), // Beginner, Intermediate, Advanced
  learningPoints: text("learning_points").array().default([]),
  tags: text("tags").array().default([]),
  isPublished: boolean("is_published").notNull().default(true),
  createdBy: uuid("created_by").notNull(), // Admin ID who created it
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAdmin3DModelSchema = createInsertSchema(admin3DModels).omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAdmin3DModel = z.infer<typeof insertAdmin3DModelSchema>;
export type Admin3DModel = typeof admin3DModels.$inferSelect;

// Simulation contents managed by admins
export const adminSimulationContents = pgTable("admin_simulation_contents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(), // Biology, Chemistry, Biochemistry, Physics, etc.
  type: text("type").notNull(), // acid-base, precipitation, redox, enzyme-kinetics, pcr, etc.
  difficulty: text("difficulty").notNull(), // Beginner, Intermediate, Advanced
  duration: integer("duration").notNull(), // in minutes
  thumbnailUrl: text("thumbnail_url"),
  content: text("content"), // HTML/markdown content or JSON structure
  objectives: text("objectives").array().default([]),
  learningOutcomes: text("learning_outcomes").array().default([]),
  tags: text("tags").array().default([]),
  isPublished: boolean("is_published").notNull().default(true),
  createdBy: uuid("created_by").notNull(), // Admin ID
  completionCount: integer("completion_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAdminSimulationContentSchema = createInsertSchema(
  adminSimulationContents
).omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  completionCount: true,
});

export type InsertAdminSimulationContent = z.infer<typeof insertAdminSimulationContentSchema>;
export type AdminSimulationContent = typeof adminSimulationContents.$inferSelect;

// User management logs for admin audit trail
export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id").notNull(), // Admin who performed action
  action: text("action").notNull(), // created_3d_model, deleted_user, edited_simulation, etc.
  targetType: text("target_type").notNull(), // user, 3d_model, simulation, admin
  targetId: text("target_id"),
  changes: text("changes"), // JSON of what changed
  reason: text("reason"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminAuditLogSchema = createInsertSchema(adminAuditLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertAdminAuditLog = z.infer<typeof insertAdminAuditLogSchema>;
export type AdminAuditLog = typeof adminAuditLogs.$inferSelect;

// Email verification tokens
export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  isUsed: boolean("is_used").notNull().default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmailVerificationTokenSchema = createInsertSchema(
  emailVerificationTokens
).omit({
  id: true,
  createdAt: true,
});

export type InsertEmailVerificationToken = z.infer<typeof insertEmailVerificationTokenSchema>;
export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;
