import { createClient } from '@supabase/supabase-js';
import type {
  User,
  InsertUser,
  Profile,
  InsertProfile,
  Simulation,
  InsertSimulation,
  Workspace,
  InsertWorkspace,
  WorkspaceItem,
  InsertWorkspaceItem,
  SimulationHistory,
  InsertSimulationHistory,
} from "@shared/schema";

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile operations
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile>;

  // Simulation operations
  getAllSimulations(): Promise<Simulation[]>;
  getSimulation(id: string): Promise<Simulation | undefined>;
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  incrementSimulationCompletion(id: string): Promise<void>;

  // Workspace operations
  getUserWorkspaces(userId: string): Promise<Workspace[]>;
  getWorkspace(id: string): Promise<Workspace | undefined>;
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  deleteWorkspace(id: string): Promise<void>;

  // Workspace Item operations
  getWorkspaceItems(workspaceId: string): Promise<WorkspaceItem[]>;
  createWorkspaceItem(item: InsertWorkspaceItem): Promise<WorkspaceItem>;

  // Simulation History operations
  getUserSimulationHistory(userId: string, limit?: number): Promise<SimulationHistory[]>;
  createSimulationHistory(history: InsertSimulationHistory): Promise<SimulationHistory>;
}

export class SupabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return undefined;
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as User;
  }

  // Profile operations
  async getProfile(userId: string): Promise<Profile | undefined> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('userId', userId)
      .single();
    
    if (error) return undefined;
    return data as Profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Profile;
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('userId', userId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Profile;
  }

  // Simulation operations
  async getAllSimulations(): Promise<Simulation[]> {
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .order('title');
    
    if (error) throw new Error(error.message);
    return data as Simulation[];
  }

  async getSimulation(id: string): Promise<Simulation | undefined> {
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as Simulation;
  }

  async createSimulation(simulation: InsertSimulation): Promise<Simulation> {
    const { data, error } = await supabase
      .from('simulations')
      .insert(simulation)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Simulation;
  }

  async incrementSimulationCompletion(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_simulation_completion', { sim_id: id });
    if (error) console.error('Error incrementing completion:', error);
  }

  // Workspace operations
  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Workspace[];
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data as Workspace;
  }

  async createWorkspace(workspace: InsertWorkspace): Promise<Workspace> {
    const { data, error } = await supabase
      .from('workspaces')
      .insert(workspace)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Workspace;
  }

  async deleteWorkspace(id: string): Promise<void> {
    const { error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }

  // Workspace Item operations
  async getWorkspaceItems(workspaceId: string): Promise<WorkspaceItem[]> {
    const { data, error } = await supabase
      .from('workspace_items')
      .select('*')
      .eq('workspaceId', workspaceId)
      .order('createdAt', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as WorkspaceItem[];
  }

  async createWorkspaceItem(item: InsertWorkspaceItem): Promise<WorkspaceItem> {
    const { data, error } = await supabase
      .from('workspace_items')
      .insert(item)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as WorkspaceItem;
  }

  // Simulation History operations
  async getUserSimulationHistory(userId: string, limit: number = 10): Promise<SimulationHistory[]> {
    const { data, error } = await supabase
      .from('simulation_history')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(limit);
    
    if (error) throw new Error(error.message);
    return data as SimulationHistory[];
  }

  async createSimulationHistory(history: InsertSimulationHistory): Promise<SimulationHistory> {
    const { data, error } = await supabase
      .from('simulation_history')
      .insert(history)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as SimulationHistory;
  }
}

export const storage = new SupabaseStorage();
