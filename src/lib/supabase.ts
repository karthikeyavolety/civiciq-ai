import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type Department = {
  id: string;
  name: string;
  icon: string;
  color: string;
  head_officer: string;
  performance_score: number;
  active_complaints: number;
  resolved_complaints: number;
};

export type Ward = {
  id: string;
  name: string;
  number: number;
  health_score: number;
  roads_score: number;
  water_score: number;
  electricity_score: number;
  garbage_score: number;
  traffic_score: number;
  satisfaction_score: number;
  population: number;
  lat: number;
  lng: number;
};

export type Complaint = {
  id: string;
  title: string;
  description: string;
  photo_url: string | null;
  department: string | null;
  category: string | null;
  priority: string;
  status: string;
  ward_id: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  ai_confidence: number;
  ai_analysis: Record<string, unknown> | null;
  estimated_resolution: string | null;
  created_at: string;
};

export type RootCause = {
  id: string;
  title: string;
  description: string | null;
  confidence: number;
  affected_citizens: number;
  affected_wards: string[];
  recommended_action: string | null;
  estimated_budget: string | null;
  estimated_resolution_hours: number;
  department: string | null;
  severity: string;
  complaint_count: number;
  status: string;
  created_at: string;
};

export type ActionPlan = {
  id: string;
  date: string;
  critical_issue: string;
  affected_population: number;
  recommended_department: string | null;
  estimated_budget: string | null;
  suggested_team: string | null;
  completion_time: string | null;
  priority_score: number;
  confidence_score: number;
  status: string;
  created_at: string;
};

export type Report = {
  id: string;
  title: string;
  type: string;
  summary: string | null;
  content: Record<string, unknown> | null;
  created_at: string;
};
