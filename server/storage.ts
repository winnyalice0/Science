import { createClient } from '@supabase/supabase-js';
import type {
  Profile,
  InsertProfile,
  UpdateProfile,
  Simulation,
  InsertSimulation,
  Workspace,
  InsertWorkspace,
  WorkspaceItem,
  InsertWorkspaceItem,
  SimulationHistory,
  InsertSimulationHistory,
} from "@shared/schema";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface IStorage {
  // Profile operations
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, updates: UpdateProfile): Promise<Profile>;

  // Simulation operations
  getAllSimulations(): Promise<Simulation[]>;
  getSimulation(id: string): Promise<Simulation | undefined>;
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  incrementSimulationCompletion(id: string): Promise<void>;

  // Workspace operations
  getUserWorkspaces(userId: string): Promise<Workspace[]>;
  getWorkspace(id: string): Promise<Workspace | undefined>;
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace>;
  deleteWorkspace(id: string): Promise<void>;

  // Workspace Item operations
  getWorkspaceItems(workspaceId: string): Promise<WorkspaceItem[]>;
  createWorkspaceItem(item: InsertWorkspaceItem): Promise<WorkspaceItem>;
  deleteWorkspaceItem(id: string): Promise<void>;

  // Simulation History operations
  getUserSimulationHistory(userId: string, limit?: number): Promise<SimulationHistory[]>;
  createSimulationHistory(history: InsertSimulationHistory): Promise<SimulationHistory>;
}

export class SupabaseStorage implements IStorage {
  // Profile operations
  async getProfile(userId: string): Promise<Profile | undefined> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
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

  async updateProfile(userId: string, updates: UpdateProfile): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
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
    // Fetch current simulation
    const { data: simulation, error: fetchError } = await supabase
      .from('simulations')
      .select('completion_count')
      .eq('id', id)
      .single();
    
    if (fetchError || !simulation) {
      console.error('Error fetching simulation for increment:', fetchError);
      return;
    }

    // Increment and update
    const { error: updateError } = await supabase
      .from('simulations')
      .update({ completion_count: (simulation.completion_count || 0) + 1 })
      .eq('id', id);
    
    if (updateError) console.error('Error incrementing completion:', updateError);
  }

  // Workspace operations
  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
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

  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace> {
    const { data, error } = await supabase
      .from('workspaces')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
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
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    
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

  async deleteWorkspaceItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('workspace_items')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }

  // Simulation History operations
  async getUserSimulationHistory(userId: string, limit: number = 10): Promise<SimulationHistory[]> {
    const { data, error } = await supabase
      .from('simulation_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
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
